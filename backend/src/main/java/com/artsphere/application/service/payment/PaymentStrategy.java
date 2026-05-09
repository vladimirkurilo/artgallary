package com.artsphere.application.service.payment;

import java.math.BigDecimal;

public interface PaymentStrategy {
    String processPayment(BigDecimal amount, String currency, String artworkId);
}
