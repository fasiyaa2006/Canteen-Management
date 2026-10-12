package com.canteen.dto;

import com.canteen.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderStatusUpdateRequest {

    @NotNull(message = "Order status is required")
    private OrderStatus status;
}
