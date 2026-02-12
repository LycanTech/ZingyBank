package com.zingybank.notification.repository;

import com.zingybank.notification.model.Notification;
import com.zingybank.notification.model.NotificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, String> {
    Page<Notification> findByUserId(String userId, Pageable pageable);
    List<Notification> findByStatus(NotificationStatus status);
}
