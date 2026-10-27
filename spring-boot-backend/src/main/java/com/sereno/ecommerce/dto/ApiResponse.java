package com.sereno.ecommerce.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private Integer count;
    private List<String> errors;
    private LocalDateTime timestamp = LocalDateTime.now();

    public ApiResponse() {
    }

    public static <T> ApiResponse<T> ok(T data, String message) {
        ApiResponse<T> resp = new ApiResponse<>();
        resp.setSuccess(true);
        resp.setData(data);
        resp.setMessage(message);
        if (data instanceof List) {
            resp.setCount(((List<?>) data).size());
        }
        return resp;
    }

    public static <T> ApiResponse<T> ok(T data) {
        return ok(data, "Request processed successfully");
    }

    public static <T> ApiResponse<T> error(String message, List<String> errors) {
        ApiResponse<T> resp = new ApiResponse<>();
        resp.setSuccess(false);
        resp.setMessage(message);
        resp.setErrors(errors != null ? errors : List.of(message));
        return resp;
    }

    public static <T> ApiResponse<T> error(String message) {
        return error(message, List.of(message));
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
