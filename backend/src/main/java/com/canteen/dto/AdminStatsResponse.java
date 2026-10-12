package com.canteen.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsResponse {
    private long totalUsers;
    private long totalStudents;
    private long totalStaff;
    private long totalMenuItems;
    private long availableMenuItems;
    private long totalOrders;
    private long placedOrders;
    private long preparingOrders;
    private long readyOrders;
    private long collectedOrders;
    private BigDecimal totalRevenue;
}
