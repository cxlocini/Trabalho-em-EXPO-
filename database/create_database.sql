-- Script para criar o banco de dados TOCC8
-- Execute este script no PostgreSQL antes de rodar a API

-- Criar banco de dados
CREATE DATABASE TOCC8;

-- Conectar ao banco TOCC8
\c TOCC8;

-- Criar tabela pessoa (opcional - será criada automaticamente pelo Hibernate)
CREATE TABLE IF NOT EXISTS pessoa (
    CPF char(15) PRIMARY KEY,
    nome varchar(100),
    peso float
);

-- Verificar se a tabela foi criada
SELECT * FROM pessoa;




