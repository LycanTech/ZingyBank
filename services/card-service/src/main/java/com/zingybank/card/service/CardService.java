package com.zingybank.card.service;

import com.zingybank.card.dto.*;
import com.zingybank.card.model.*;
import com.zingybank.card.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CardService {

    private final CardRepository cardRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final SecureRandom RANDOM = new SecureRandom();

    @Transactional
    public CardResponse issueCard(IssueCardRequest request) {
        String cardNumber = generateCardNumber();
        String masked = "**** **** **** " + cardNumber.substring(cardNumber.length() - 4);

        Card card = Card.builder()
                .userId(request.getUserId())
                .linkedAccountNumber(request.getLinkedAccountNumber())
                .encryptedCardNumber(cardNumber) // TODO: encrypt with Vault
                .maskedCardNumber(masked)
                .cardType(request.getCardType())
                .status(CardStatus.PENDING_ACTIVATION)
                .expiryDate(LocalDate.now().plusYears(5))
                .dailyLimit(request.getDailyLimit() != null ? request.getDailyLimit() : new BigDecimal("5000"))
                .monthlyLimit(request.getMonthlyLimit() != null ? request.getMonthlyLimit() : new BigDecimal("50000"))
                .contactlessEnabled(request.isContactlessEnabled())
                .internationalEnabled(request.isInternationalEnabled())
                .onlineTransactionsEnabled(request.isOnlineTransactionsEnabled())
                .build();

        card = cardRepository.save(card);
        log.info("Card issued: {} type: {} for user: {}", masked, request.getCardType(), request.getUserId());

        kafkaTemplate.send("card-events", card.getId(),
                Map.of("event", "CARD_ISSUED", "cardId", card.getId(), "userId", request.getUserId()));

        return toResponse(card);
    }

    @Transactional
    public CardResponse activateCard(String cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new IllegalArgumentException("Card not found"));
        if (card.getStatus() != CardStatus.PENDING_ACTIVATION) {
            throw new IllegalStateException("Card cannot be activated in current state: " + card.getStatus());
        }
        card.setStatus(CardStatus.ACTIVE);
        card.setActivatedAt(java.time.LocalDateTime.now());
        card = cardRepository.save(card);
        log.info("Card activated: {}", card.getMaskedCardNumber());
        return toResponse(card);
    }

    @Transactional
    public CardResponse blockCard(String cardId, String reason) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new IllegalArgumentException("Card not found"));
        card.setStatus(reason.equalsIgnoreCase("lost") ? CardStatus.LOST :
                       reason.equalsIgnoreCase("stolen") ? CardStatus.STOLEN : CardStatus.BLOCKED);
        card = cardRepository.save(card);
        log.warn("Card blocked: {} reason: {}", card.getMaskedCardNumber(), reason);

        kafkaTemplate.send("card-events", card.getId(),
                Map.of("event", "CARD_BLOCKED", "cardId", card.getId(), "reason", reason));

        return toResponse(card);
    }

    public List<CardResponse> getUserCards(String userId) {
        return cardRepository.findByUserId(userId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    private String generateCardNumber() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 16; i++) sb.append(RANDOM.nextInt(10));
        return sb.toString();
    }

    private CardResponse toResponse(Card card) {
        return CardResponse.builder()
                .id(card.getId()).userId(card.getUserId())
                .linkedAccountNumber(card.getLinkedAccountNumber())
                .maskedCardNumber(card.getMaskedCardNumber())
                .cardType(card.getCardType()).status(card.getStatus())
                .expiryDate(card.getExpiryDate())
                .dailyLimit(card.getDailyLimit()).monthlyLimit(card.getMonthlyLimit())
                .contactlessEnabled(card.isContactlessEnabled())
                .internationalEnabled(card.isInternationalEnabled())
                .onlineTransactionsEnabled(card.isOnlineTransactionsEnabled())
                .createdAt(card.getCreatedAt()).activatedAt(card.getActivatedAt())
                .build();
    }
}
