package com.sereno.ecommerce.service;

import com.sereno.ecommerce.dto.OrderRequest;
import com.sereno.ecommerce.exception.ResourceNotFoundException;
import com.sereno.ecommerce.model.Order;
import com.sereno.ecommerce.model.OrderItem;
import com.sereno.ecommerce.model.Product;
import com.sereno.ecommerce.repository.OrderRepository;
import com.sereno.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderServiceImpl(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public Order getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
    }

    @Override
    @Transactional(readOnly = true)
    public Order getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));
    }

    @Override
    public Order placeOrder(OrderRequest request) {
        Order order = new Order();
        order.setId("ord-" + UUID.randomUUID().toString().substring(0, 8));
        order.setOrderNumber("SRN-" + (int)(10000 + Math.random() * 90000));
        order.setCreatedAt(LocalDateTime.now());
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setCity(request.getCity());
        order.setPostalCode(request.getPostalCode());
        order.setCountry(request.getCountry() != null ? request.getCountry() : "Switzerland");
        order.setPaymentMethod(request.getPaymentMethod());
        order.setNotes(request.getNotes());
        order.setStatus("Processing");

        double subtotal = 0.0;

        for (OrderRequest.OrderItemDto itemDto : request.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", itemDto.getProductId()));

            if (product.getStock() < itemDto.getQuantity()) {
                throw new IllegalArgumentException("Insufficient inventory for: " + product.getName());
            }

            // Deduct stock
            product.setStock(product.getStock() - itemDto.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem(
                    product.getId(),
                    product.getName(),
                    product.getPrice(),
                    itemDto.getQuantity(),
                    product.getImageUrl()
            );
            order.addItem(orderItem);
            subtotal += product.getPrice() * itemDto.getQuantity();
        }

        // Apply discount if coupon is SERENO10
        double discount = 0.0;
        if ("SERENO10".equalsIgnoreCase(request.getCouponCode())) {
            discount = Math.round(subtotal * 0.10 * 100.0) / 100.0;
        }

        double taxable = Math.max(0, subtotal - discount);
        double tax = Math.round(taxable * 0.08 * 100.0) / 100.0;
        double shipping = subtotal >= 300.0 ? 0.0 : 15.0;
        double total = Math.round((taxable + tax + shipping) * 100.0) / 100.0;

        order.setSubtotal(subtotal);
        order.setDiscount(discount);
        order.setTax(tax);
        order.setShipping(shipping);
        order.setTotal(total);

        return orderRepository.save(order);
    }

    @Override
    public Order updateOrderStatus(String id, String status) {
        Order existing = getOrderById(id);
        existing.setStatus(status);
        return orderRepository.save(existing);
    }

    @Override
    public void cancelOrder(String id) {
        Order existing = getOrderById(id);
        
        // Restore stock
        for (OrderItem item : existing.getItems()) {
            productRepository.findById(item.getProductId()).ifPresent(prod -> {
                prod.setStock(prod.getStock() + item.getQuantity());
                productRepository.save(prod);
            });
        }

        existing.setStatus("Cancelled");
        orderRepository.save(existing);
    }
}
