package com.zingybank.statement.repository;

import com.zingybank.statement.model.Statement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StatementRepository extends JpaRepository<Statement, String> {
    Page<Statement> findByAccountNumber(String accountNumber, Pageable pageable);
    List<Statement> findByUserId(String userId);
}
