package com.zingybank.transaction.service;

import com.zingybank.transaction.dto.*;
import com.zingybank.transaction.model.*;
import com.zingybank.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Transactional
    public TransactionResponse initiateTransfer(TransferRequest request) {
        Transaction transaction = Transaction.builder()
                .referenceNumber("TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase())
                .type(TransactionType.TRANSFER)
                .status(TransactionStatus.PENDING)
                .sourceAccountNumber(request.getSourceAccountNumber())
                .destinationAccountNumber(request.getDestinationAccountNumber())
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .description(request.getDescription())
                .initiatedBy(request.getInitiatedBy())
                .build();

        transaction = transactionRepository.save(transaction);
        log.info("Transaction initiated: {} from {} to {} amount {}",
                transaction.getReferenceNumber(),
                request.getSourceAccountNumber(),
                request.getDestinationAccountNumber(),
                request.getAmount());

        // Publish event for async processing
        kafkaTemplate.send("transaction-events", transaction.getId(),
                Map.of("event", "TRANSFER_INITIATED",
                       "transactionId", transaction.getId(),
                       "referenceNumber", transaction.getReferenceNumber(),
                       "sourceAccount", request.getSourceAccountNumber(),
                       "destAccount", request.getDestinationAccountNumber(),
                       "amount", request.getAmount().toString()));

        return toResponse(transaction);
    }

    public TransactionResponse getByReference(String referenceNumber) {
        Transaction txn = transactionRepository.findByReferenceNumber(referenceNumber)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));
        return toResponse(txn);
    }

    public Page<TransactionResponse> getAccountTransactions(String accountNumber, Pageable pageable) {
        return transactionRepository
                .findBySourceAccountNumberOrDestinationAccountNumber(accountNumber, accountNumber, pageable)
                .map(this::toResponse);
    }

    public Page<TransactionResponse> getAccountTransactionsByDateRange(
            String accountNumber, LocalDateTime from, LocalDateTime to, Pageable pageable) {
        return transactionRepository
                .findByAccountAndDateRange(accountNumber, from, to, pageable)
                .map(this::toResponse);
    }

    private TransactionResponse toResponse(Transaction txn) {
        return TransactionResponse.builder()
                .id(txn.getId())
                .referenceNumber(txn.getReferenceNumber())
                .type(txn.getType())
                .status(txn.getStatus())
                .sourceAccountNumber(txn.getSourceAccountNumber())
                .destinationAccountNumber(txn.getDestinationAccountNumber())
                .amount(txn.getAmount())
                .currency(txn.getCurrency())
                .description(txn.getDescription())
                .createdAt(txn.getCreatedAt())
                .completedAt(txn.getCompletedAt())
                .build();
    }
}
