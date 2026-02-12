package com.zingybank.card.controller;

import com.zingybank.card.dto.*;
import com.zingybank.card.service.CardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @PostMapping
    public ResponseEntity<CardResponse> issueCard(@Valid @RequestBody IssueCardRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cardService.issueCard(request));
    }

    @PostMapping("/{cardId}/activate")
    public ResponseEntity<CardResponse> activateCard(@PathVariable String cardId) {
        return ResponseEntity.ok(cardService.activateCard(cardId));
    }

    @PostMapping("/{cardId}/block")
    public ResponseEntity<CardResponse> blockCard(@PathVariable String cardId, @RequestParam String reason) {
        return ResponseEntity.ok(cardService.blockCard(cardId, reason));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CardResponse>> getUserCards(@PathVariable String userId) {
        return ResponseEntity.ok(cardService.getUserCards(userId));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Card Service is running");
    }
}
