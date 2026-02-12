package com.zingybank.loan.repository;

import com.zingybank.loan.model.LoanPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoanPaymentRepository extends JpaRepository<LoanPayment, String> {
    List<LoanPayment> findByLoanIdOrderByPaymentNumber(String loanId);
}
