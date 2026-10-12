package com.canteen.repository;

import com.canteen.entity.Order;
import com.canteen.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Order> findByOrderStatusOrderByCreatedAtAsc(OrderStatus status);
    List<Order> findAllByOrderByCreatedAtDesc();
}
