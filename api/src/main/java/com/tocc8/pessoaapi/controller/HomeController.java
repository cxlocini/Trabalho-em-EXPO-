package com.tocc8.pessoaapi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {
    
    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "API Pessoa - TOCC8");
        response.put("status", "online");
        response.put("endpoints", Map.of(
            "GET /api/pessoas", "Listar todas as pessoas",
            "GET /api/pessoas/{cpf}", "Buscar pessoa por CPF",
            "POST /api/pessoas", "Criar nova pessoa",
            "PUT /api/pessoas/{cpf}", "Atualizar pessoa",
            "DELETE /api/pessoas/{cpf}", "Deletar pessoa"
        ));
        return response;
    }
    
    @GetMapping("/api")
    public Map<String, String> api() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "API Endpoints disponíveis em /api/pessoas");
        response.put("documentation", "Acesse /api/pessoas para listar todas as pessoas");
        return response;
    }
}

