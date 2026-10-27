package com.sereno.ecommerce.service;

import com.sereno.ecommerce.dto.OrderRequest;
import com.sereno.ecommerce.model.Order;
import java.util.List;

public interface OrderService {
    List<Order> getAllOrders();
    Order getOrderById(String id);
    Order getOrderByOrderNumber(String orderNumber);
    Order placeOrder(OrderRequest request);
    Order updateOrderStatus(String id, String status);
    void cancelOrder(String id);
}
