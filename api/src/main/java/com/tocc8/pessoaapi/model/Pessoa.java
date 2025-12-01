package com.tocc8.pessoaapi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "pessoa")
public class Pessoa {
    
    @Id
    @Column(name = "CPF", length = 15)
    @NotBlank(message = "CPF é obrigatório")
    private String cpf;
    
    @Column(name = "nome", length = 100)
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    
    @Column(name = "peso")
    @NotNull(message = "Peso é obrigatório")
    @Positive(message = "Peso deve ser positivo")
    private Float peso;
    
    public Pessoa() {
    }
    
    public Pessoa(String cpf, String nome, Float peso) {
        this.cpf = cpf;
        this.nome = nome;
        this.peso = peso;
    }
    
    public String getCpf() {
        return cpf;
    }
    
    public void setCpf(String cpf) {
        this.cpf = cpf;
    }
    
    public String getNome() {
        return nome;
    }
    
    public void setNome(String nome) {
        this.nome = nome;
    }
    
    public Float getPeso() {
        return peso;
    }
    
    public void setPeso(Float peso) {
        this.peso = peso;
    }
}




