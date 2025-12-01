package com.tocc8.pessoaapi.controller;

import com.tocc8.pessoaapi.model.Pessoa;
import com.tocc8.pessoaapi.repository.PessoaRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pessoas")
@CrossOrigin(origins = "*")
public class PessoaController {
    
    @Autowired
    private PessoaRepository pessoaRepository;
    
    @GetMapping
    public ResponseEntity<List<Pessoa>> listarTodas() {
        List<Pessoa> pessoas = pessoaRepository.findAll();
        return ResponseEntity.ok(pessoas);
    }
    
    @GetMapping("/{cpf}")
    public ResponseEntity<Pessoa> buscarPorCpf(@PathVariable String cpf) {
        Optional<Pessoa> pessoa = pessoaRepository.findById(cpf);
        return pessoa.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody Pessoa pessoa) {
        if (pessoaRepository.existsById(pessoa.getCpf())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body("CPF já cadastrado");
        }
        Pessoa pessoaSalva = pessoaRepository.save(pessoa);
        return ResponseEntity.status(HttpStatus.CREATED).body(pessoaSalva);
    }
    
    @PutMapping("/{cpf}")
    public ResponseEntity<?> atualizar(@PathVariable String cpf, 
                                       @Valid @RequestBody Pessoa pessoa) {
        if (!pessoaRepository.existsById(cpf)) {
            return ResponseEntity.notFound().build();
        }
        pessoa.setCpf(cpf);
        Pessoa pessoaAtualizada = pessoaRepository.save(pessoa);
        return ResponseEntity.ok(pessoaAtualizada);
    }
    
    @DeleteMapping("/{cpf}")
    public ResponseEntity<Void> deletar(@PathVariable String cpf) {
        if (!pessoaRepository.existsById(cpf)) {
            return ResponseEntity.notFound().build();
        }
        pessoaRepository.deleteById(cpf);
        return ResponseEntity.noContent().build();
    }
}




