package com.zingybank.card.repository;

import com.zingybank.card.model.Card;
import com.zingybank.card.model.CardStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CardRepository extends JpaRepository<Card, String> {
    List<Card> findByUserId(String userId);
    List<Card> findByUserIdAndStatus(String userId, CardStatus status);
    List<Card> findByLinkedAccountNumber(String accountNumber);
}
