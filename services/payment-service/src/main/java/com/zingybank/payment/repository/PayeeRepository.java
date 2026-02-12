package com.zingybank.payment.repository;

import com.zingybank.payment.model.Payee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PayeeRepository extends JpaRepository<Payee, String> {
    List<Payee> findByUserId(String userId);
}
