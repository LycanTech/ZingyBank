package com.zingybank.payment.service;

import com.zingybank.payment.dto.*;
import com.zingybank.payment.model.*;
import com.zingybank.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Transactional
    public PaymentResponse createPayment(CreatePaymentRequest request) {
        PaymentStatus initialStatus = request.getScheduledDate() != null && request.getScheduledDate().isAfter(LocalDate.now())
                ? PaymentStatus.SCHEDULED : PaymentStatus.PENDING;

        Payment payment = Payment.builder()
                .paymentReference("PAY-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase())
                .sourceAccountNumber(request.getSourceAccountNumber())
                .payeeId(request.getPayeeId())
                .paymentType(request.getPaymentType())
                .status(initialStatus)
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .description(request.getDescription())
                .scheduledDate(request.getScheduledDate())
                .recurring(request.isRecurring())
                .recurringFrequency(request.getRecurringFrequency())
                .initiatedBy(request.getInitiatedBy())
                .build();

        payment = paymentRepository.save(payment);
        log.info("Payment created: {} status: {}", payment.getPaymentReference(), initialStatus);

        kafkaTemplate.send("payment-events", payment.getId(),
                Map.of("event", "PAYMENT_CREATED", "paymentId", payment.getId(), "status", initialStatus.name()));

        return toResponse(payment);
    }

    public PaymentResponse getByReference(String reference) {
        Payment payment = paymentRepository.findByPaymentReference(reference)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));
        return toResponse(payment);
    }

    public Page<PaymentResponse> getPaymentsByAccount(String accountNumber, Pageable pageable) {
        return paymentRepository.findBySourceAccountNumber(accountNumber, pageable).map(this::toResponse);
    }

    private PaymentResponse toResponse(Payment p) {
        return PaymentResponse.builder()
                .id(p.getId()).paymentReference(p.getPaymentReference())
                .sourceAccountNumber(p.getSourceAccountNumber()).payeeId(p.getPayeeId())
                .paymentType(p.getPaymentType()).status(p.getStatus())
                .amount(p.getAmount()).currency(p.getCurrency())
                .description(p.getDescription()).scheduledDate(p.getScheduledDate())
                .recurring(p.isRecurring()).createdAt(p.getCreatedAt()).processedAt(p.getProcessedAt())
                .build();
    }
}
