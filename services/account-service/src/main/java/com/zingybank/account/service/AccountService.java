package com.zingybank.account.service;

import com.zingybank.account.dto.*;
import com.zingybank.account.model.*;
import com.zingybank.account.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountService {

    private final AccountRepository accountRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final SecureRandom RANDOM = new SecureRandom();

    @Transactional
    public AccountResponse createAccount(CreateAccountRequest request) {
        Account account = Account.builder()
                .accountNumber(generateAccountNumber())
                .userId(request.getUserId())
                .accountType(request.getAccountType())
                .status(AccountStatus.ACTIVE)
                .balance(request.getInitialDeposit() != null ? request.getInitialDeposit() : BigDecimal.ZERO)
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .dailyTransferLimit(new BigDecimal("10000"))
                .dailyWithdrawalLimit(new BigDecimal("5000"))
                .build();

        account = accountRepository.save(account);
        log.info("Account created: {} for user: {}", account.getAccountNumber(), request.getUserId());

        kafkaTemplate.send("account-events", account.getId(),
                java.util.Map.of("event", "ACCOUNT_CREATED", "accountId", account.getId(), "userId", request.getUserId()));

        return toResponse(account);
    }

    public AccountResponse getAccount(String accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        return toResponse(account);
    }

    public List<AccountResponse> getAccountsByUserId(String userId) {
        return accountRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AccountResponse updateBalance(String accountNumber, BigDecimal amount) {
        Account account = accountRepository.findByAccountNumberForUpdate(accountNumber)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new IllegalStateException("Account is not active");
        }

        BigDecimal newBalance = account.getBalance().add(amount);
        if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalStateException("Insufficient funds");
        }

        account.setBalance(newBalance);
        account = accountRepository.save(account);
        return toResponse(account);
    }

    private String generateAccountNumber() {
        StringBuilder sb = new StringBuilder("ZB");
        for (int i = 0; i < 10; i++) {
            sb.append(RANDOM.nextInt(10));
        }
        String number = sb.toString();
        if (accountRepository.findByAccountNumber(number).isPresent()) {
            return generateAccountNumber();
        }
        return number;
    }

    private AccountResponse toResponse(Account account) {
        return AccountResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .userId(account.getUserId())
                .accountType(account.getAccountType())
                .status(account.getStatus())
                .balance(account.getBalance())
                .currency(account.getCurrency())
                .interestRate(account.getInterestRate())
                .createdAt(account.getCreatedAt())
                .build();
    }
}
