package com.canteen.service;

import com.canteen.dto.*;
import com.canteen.entity.*;
import com.canteen.exception.BadRequestException;
import com.canteen.exception.ResourceNotFoundException;
import com.canteen.repository.MenuItemRepository;
import com.canteen.repository.OrderRepository;
import com.canteen.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserService userService;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Order must contain at least one menu item");
        }

        Order order = Order.builder()
                .user(user)
                .orderStatus(OrderStatus.PLACED)
                .pickupTime(request.getPickupTime())
                .specialInstructions(request.getSpecialInstructions())
                .build();

        BigDecimal calculatedTotal = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + itemRequest.getMenuItemId()));

            if (!Boolean.TRUE.equals(menuItem.getAvailable())) {
                throw new BadRequestException("Cannot order unavailable item: " + menuItem.getName());
            }

            int qty = itemRequest.getQuantity() != null && itemRequest.getQuantity() > 0 ? itemRequest.getQuantity() : 1;
            BigDecimal itemSubtotal = menuItem.getPrice().multiply(BigDecimal.valueOf(qty));
            calculatedTotal = calculatedTotal.add(itemSubtotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .menuItem(menuItem)
                    .quantity(qty)
                    .priceAtOrder(menuItem.getPrice())
                    .build();

            order.addOrderItem(orderItem);
        }

        order.setTotalAmount(calculatedTotal);
        Order savedOrder = orderRepository.save(order);

        return toOrderResponse(savedOrder);
    }

    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        return toOrderResponse(order);
    }

    public List<OrderResponse> getUserOrders(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getAllOrders(OrderStatus status) {
        List<Order> orders;
        if (status != null) {
            orders = orderRepository.findByOrderStatusOrderByCreatedAtAsc(status);
        } else {
            orders = orderRepository.findAllByOrderByCreatedAtDesc();
        }
        return orders.stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        order.setOrderStatus(status);
        Order updated = orderRepository.save(order);
        return toOrderResponse(updated);
    }

    public OrderResponse toOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .menuItemId(item.getMenuItem().getId())
                        .menuItemName(item.getMenuItem().getName())
                        .category(item.getMenuItem().getCategory())
                        .quantity(item.getQuantity())
                        .priceAtOrder(item.getPriceAtOrder())
                        .subtotal(item.getPriceAtOrder().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .user(userService.toUserSummaryDto(order.getUser()))
                .orderStatus(order.getOrderStatus())
                .totalAmount(order.getTotalAmount())
                .pickupTime(order.getPickupTime())
                .specialInstructions(order.getSpecialInstructions())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(itemResponses)
                .build();
    }
}
