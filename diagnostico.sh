#!/bin/bash

echo "=========================================="
echo "  DIAGNÓSTICO DO PROJETO - TOCC8"
echo "=========================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar PostgreSQL
echo "1. Verificando PostgreSQL..."
if sudo service postgresql status > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PostgreSQL está rodando${NC}"
else
    echo -e "${RED}✗ PostgreSQL NÃO está rodando${NC}"
    echo "   Execute: sudo service postgresql start"
fi
echo ""

# 2. Verificar banco de dados
echo "2. Verificando banco de dados TOCC8..."
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw TOCC8; then
    echo -e "${GREEN}✓ Banco TOCC8 existe${NC}"
else
    echo -e "${RED}✗ Banco TOCC8 NÃO existe${NC}"
    echo "   Execute: sudo -u postgres psql -c 'CREATE DATABASE TOCC8;'"
fi
echo ""

# 3. Verificar Java
echo "3. Verificando Java..."
if java -version > /dev/null 2>&1; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    echo -e "${GREEN}✓ Java instalado: $JAVA_VERSION${NC}"
else
    echo -e "${RED}✗ Java NÃO está instalado${NC}"
    echo "   Execute: sudo apt install openjdk-17-jdk -y"
fi
echo ""

# 4. Verificar Maven
echo "4. Verificando Maven..."
if mvn -version > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Maven instalado${NC}"
else
    echo -e "${RED}✗ Maven NÃO está instalado${NC}"
    echo "   Execute: sudo apt install maven -y"
fi
echo ""

# 5. Verificar Node.js
echo "5. Verificando Node.js..."
if node -v > /dev/null 2>&1; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js instalado: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js NÃO está instalado${NC}"
    echo "   Execute: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt install -y nodejs"
fi
echo ""

# 6. Verificar npm
echo "6. Verificando npm..."
if npm -v > /dev/null 2>&1; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ npm instalado: $NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm NÃO está instalado${NC}"
fi
echo ""

# 7. Verificar se API está rodando
echo "7. Verificando se API está rodando..."
if curl -s http://localhost:8080/api/pessoas > /dev/null 2>&1; then
    echo -e "${GREEN}✓ API está respondendo na porta 8080${NC}"
else
    echo -e "${YELLOW}⚠ API NÃO está respondendo${NC}"
    echo "   Execute: cd api && mvn spring-boot:run"
fi
echo ""

# 8. Verificar IP do Windows
echo "8. IP do Windows (host):"
WINDOWS_IP=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}' | head -n 1)
if [ ! -z "$WINDOWS_IP" ]; then
    echo -e "${GREEN}✓ IP do Windows: $WINDOWS_IP${NC}"
    echo "   Use este IP no arquivo api.js se necessário"
else
    echo -e "${YELLOW}⚠ Não foi possível detectar o IP do Windows${NC}"
    echo "   Execute no PowerShell: ipconfig"
fi
echo ""

# 9. Verificar dependências do app
echo "9. Verificando dependências do app..."
if [ -d "app/node_modules" ]; then
    echo -e "${GREEN}✓ node_modules existe${NC}"
else
    echo -e "${YELLOW}⚠ node_modules NÃO existe${NC}"
    echo "   Execute: cd app && npm install"
fi
echo ""

# 10. Verificar arquivo api.js
echo "10. Verificando configuração do api.js..."
if [ -f "app/src/services/api.js" ]; then
    API_IP=$(grep -oP "http://\K[0-9.]+" app/src/services/api.js | head -n 1)
    if [ ! -z "$API_IP" ]; then
        echo -e "${GREEN}✓ api.js encontrado${NC}"
        echo "   IP configurado: $API_IP"
        echo "   Verifique se este IP está correto (deve ser o IP do Windows na rede local)"
    else
        echo -e "${YELLOW}⚠ api.js encontrado mas IP não detectado${NC}"
    fi
else
    echo -e "${RED}✗ api.js NÃO encontrado${NC}"
fi
echo ""

echo "=========================================="
echo "  FIM DO DIAGNÓSTICO"
echo "=========================================="
echo ""
echo "Dica: Se algum item estiver com ✗ ou ⚠, corrija antes de continuar."
echo ""

