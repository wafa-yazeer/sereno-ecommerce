package com.sereno.ecommerce.controller;

import com.sereno.ecommerce.dto.ApiResponse;
import com.sereno.ecommerce.dto.OrderRequest;
import com.sereno.ecommerce.model.Order;
import com.sereno.ecommerce.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Order Resource", description = "RESTful CRUD endpoints for Customer Order Placement and Live Shipment Tracking")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    @Operation(summary = "Get all orders", description = "Retrieve all customer orders sorted by creation date descending")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.ok(orders, "Orders retrieved successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID", description = "Lookup order details by its internal identifier")
    public ResponseEntity<ApiResponse<Order>> getOrderById(@PathVariable String id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.ok(order, "Order details retrieved"));
    }

    @GetMapping("/track/{orderNumber}")
    @Operation(summary = "Track order by number", description = "Lookup live shipment status and dispatch details using public order number (e.g. SRN-82910)")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Order found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Order number does not exist")
    })
    public ResponseEntity<ApiResponse<Order>> trackOrder(@PathVariable String orderNumber) {
        Order order = orderService.getOrderByOrderNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.ok(order, "Order status retrieved"));
    }

    @PostMapping
    @Operation(summary = "Place a new order (POST)", description = "Create an order with customer shipping information and cart items. Automatically validates and decrements timepiece stock.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Order successfully confirmed and placed"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error or insufficient inventory")
    })
    public ResponseEntity<ApiResponse<Order>> placeOrder(@Valid @RequestBody OrderRequest request) {
        Order placed = orderService.placeOrder(request);
        return new ResponseEntity<>(ApiResponse.ok(placed, "Order placed successfully! Order Number: " + placed.getOrderNumber()), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update order fulfillment status (PATCH)", description = "Transition status between 'Processing', 'Shipped', 'Delivered', or 'Cancelled'")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> statusBody) {
        String newStatus = statusBody.get("status");
        if (newStatus == null || newStatus.isBlank()) {
            throw new IllegalArgumentException("Field 'status' is required");
        }
        Order updated = orderService.updateOrderStatus(id, newStatus);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Order status updated to " + newStatus));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel an order (DELETE)", description = "Cancel an order and return reserved items to catalog stock")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(@PathVariable String id) {
        orderService.cancelOrder(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Order cancelled successfully and inventory replenished"));
    }
}
