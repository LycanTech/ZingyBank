package com.zingybank.loan.repository;

import com.zingybank.loan.model.Loan;
import com.zingybank.loan.model.LoanStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LoanRepository extends JpaRepository<Loan, String> {
    Optional<Loan> findByLoanNumber(String loanNumber);
    List<Loan> findByUserId(String userId);
    Page<Loan> findByStatus(LoanStatus status, Pageable pageable);
    List<Loan> findByUserIdAndStatusIn(String userId, List<LoanStatus> statuses);
}
