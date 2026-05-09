package com.artsphere.infrastructure.external.stripe;

import com.artsphere.application.service.payment.PaymentStrategy;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;

@Service
public class StripePaymentStrategy implements PaymentStrategy {
    @Override
    public String processPayment(BigDecimal amount, String currency, String artworkId) {
        // Real implementation using Stripe SDK would go here
        return "stripe_session_id_placeholder";
    }
}
