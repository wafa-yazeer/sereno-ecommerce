package com.sereno.ecommerce.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI serenoOpenAPI() {
        Server localServer = new Server()
                .url("http://localhost:8080")
                .description("Local Development Server");

        Contact contact = new Contact()
                .name("SERENO Horlogerie Engineering Team")
                .email("api-support@sereno-watches.com")
                .url("https://sereno-watches.com");

        License license = new License()
                .name("Apache 2.0")
                .url("https://www.apache.org/licenses/LICENSE-2.0.html");

        Info info = new Info()
                .title("SERENO Genève - Luxury E-Commerce RESTful API")
                .version("1.0.0")
                .description("Enterprise RESTful API implementation for SERENO luxury timepieces e-commerce platform. " +
                        "Supports full CRUD operations for Products, Categories, Orders, and Client Reviews following strict REST constraints.")
                .contact(contact)
                .license(license);

        return new OpenAPI()
                .info(info)
                .servers(List.of(localServer));
    }
}
