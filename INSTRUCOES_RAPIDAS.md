# Instruções Rápidas de Execução

## 1. Configurar Banco de Dados PostgreSQL

```sql
CREATE DATABASE TOCC8;
```

## 2. Configurar e Rodar a API Spring Boot

```bash
cd api
```

Edite `src/main/resources/application.properties` e ajuste usuário/senha do PostgreSQL.

```bash
mvn clean install
mvn spring-boot:run
```

A API estará em: `http://localhost:8080`

## 3. Descobrir o IP da Máquina

**Windows:**
```bash
ipconfig
```
Procure por "IPv4" (ex: 192.168.1.100)

**Linux/Mac:**
```bash
ifconfig
# ou
ip addr
```

## 4. Configurar o App Expo

1. Edite `app/src/services/api.js`
2. Substitua `192.168.1.100` pelo IP da sua máquina
3. Salve o arquivo

## 5. Rodar o App no Celular

```bash
cd app
npm install
npm start
```

1. Abra o Expo Go no celular
2. Escaneie o QR Code
3. Certifique-se de que celular e computador estão na mesma rede Wi-Fi

## 6. Testar

- Toque no botão **+** para cadastrar uma pessoa
- A lista será atualizada automaticamente
- Use pull-to-refresh para atualizar manualmente

## Troubleshooting

**App não conecta à API:**
- Verifique se o IP está correto em `api.js`
- Verifique se celular e PC estão na mesma rede
- Verifique se o firewall permite conexões na porta 8080
- Teste a API no navegador: `http://SEU_IP:8080/api/pessoas`

**Erro ao iniciar API:**
- Verifique se PostgreSQL está rodando
- Verifique se o banco TOCC8 existe
- Verifique usuário/senha no `application.properties`


