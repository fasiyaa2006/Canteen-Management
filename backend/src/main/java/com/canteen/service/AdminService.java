package com.canteen.service;

import com.canteen.dto.AdminStatsResponse;
import com.canteen.entity.OrderStatus;
import com.canteen.entity.Role;
import com.canteen.repository.MenuItemRepository;
import com.canteen.repository.OrderRepository;
import com.canteen.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;
    private final OrderRepository orderRepository;

    public AdminStatsResponse getSystemStats() {
        long totalUsers = userRepository.count();
        long totalStudents = userRepository.findByRole(Role.STUDENT).size();
        long totalStaff = userRepository.findByRole(Role.CANTEEN_STAFF).size();

        long totalMenuItems = menuItemRepository.count();
        long availableMenuItems = menuItemRepository.findByAvailable(true).size();

        long totalOrders = orderRepository.count();
        long placedOrders = orderRepository.findByOrderStatusOrderByCreatedAtAsc(OrderStatus.PLACED).size();
        long preparingOrders = orderRepository.findByOrderStatusOrderByCreatedAtAsc(OrderStatus.PREPARING).size();
        long readyOrders = orderRepository.findByOrderStatusOrderByCreatedAtAsc(OrderStatus.READY).size();
        long collectedOrders = orderRepository.findByOrderStatusOrderByCreatedAtAsc(OrderStatus.COLLECTED).size();

        BigDecimal totalRevenue = orderRepository.findAll().stream()
                .filter(o -> o.getOrderStatus() != OrderStatus.CANCELLED)
                .map(o -> o.getTotalAmount() != null ? o.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalStudents(totalStudents)
                .totalStaff(totalStaff)
                .totalMenuItems(totalMenuItems)
                .availableMenuItems(availableMenuItems)
                .totalOrders(totalOrders)
                .placedOrders(placedOrders)
                .preparingOrders(preparingOrders)
                .readyOrders(readyOrders)
                .collectedOrders(collectedOrders)
                .totalRevenue(totalRevenue)
                .build();
    }
}
