package com.zingybank.payment.repository;

import com.zingybank.payment.model.Payment;
import com.zingybank.payment.model.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, String> {
    Optional<Payment> findByPaymentReference(String paymentReference);
    Page<Payment> findBySourceAccountNumber(String accountNumber, Pageable pageable);
    List<Payment> findByScheduledDateAndStatus(LocalDate date, PaymentStatus status);
    Page<Payment> findByInitiatedBy(String userId, Pageable pageable);
}
