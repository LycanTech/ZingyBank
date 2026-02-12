package com.zingybank.account.repository;

import com.zingybank.account.model.Account;
import com.zingybank.account.model.AccountStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, String> {
    List<Account> findByUserId(String userId);
    Optional<Account> findByAccountNumber(String accountNumber);
    List<Account> findByUserIdAndStatus(String userId, AccountStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Account a WHERE a.accountNumber = :accountNumber")
    Optional<Account> findByAccountNumberForUpdate(String accountNumber);
}
