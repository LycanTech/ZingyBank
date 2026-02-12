package com.zingybank.transaction.repository;

import com.zingybank.transaction.model.Transaction;
import com.zingybank.transaction.model.TransactionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, String> {
    Optional<Transaction> findByReferenceNumber(String referenceNumber);

    Page<Transaction> findBySourceAccountNumberOrDestinationAccountNumber(
            String sourceAccount, String destAccount, Pageable pageable);

    @Query("SELECT t FROM Transaction t WHERE " +
           "(t.sourceAccountNumber = :accountNumber OR t.destinationAccountNumber = :accountNumber) " +
           "AND t.createdAt BETWEEN :from AND :to")
    Page<Transaction> findByAccountAndDateRange(String accountNumber, LocalDateTime from, LocalDateTime to, Pageable pageable);

    long countBySourceAccountNumberAndStatusAndCreatedAtAfter(
            String accountNumber, TransactionStatus status, LocalDateTime after);
}
