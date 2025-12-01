# Trabalho EXPO - TOCC8 - Prof. Prampero

Sistema completo de gerenciamento de pessoas com API Spring Boot e aplicativo mobile Expo.

## Estrutura do Projeto

```
Trabalho-em-EXPO-/
├── api/                    # API Spring Boot
│   ├── src/
│   │   └── main/
│   │       ├── java/com/tocc8/pessoaapi/
│   │       │   ├── PessoaApiApplication.java
│   │       │   ├── model/Pessoa.java
│   │       │   ├── repository/PessoaRepository.java
│   │       │   └── controller/PessoaController.java
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
└── app/                    # Aplicativo Expo
    ├── src/
    │   ├── screens/
    │   │   ├── ListaPessoasScreen.js
    │   │   └── CadastroPessoaScreen.js
    │   └── services/
    │       └── api.js
    ├── App.js
    ├── package.json
    └── app.json
```

## Pré-requisitos

### Para a API Spring Boot:
- Java 17 ou superior
- Maven 3.6+
- PostgreSQL instalado e rodando
- Banco de dados `TOCC8` criado

### Para o App Expo:
- Node.js 16+ e npm
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app instalado no celular (Android/iOS)

## Configuração do Banco de Dados PostgreSQL

1. Crie o banco de dados:
```sql
CREATE DATABASE TOCC8;
```

2. A tabela será criada automaticamente pelo Hibernate quando a API iniciar.

Ou crie manualmente:
```sql
CREATE TABLE pessoa (
    CPF char(15) PRIMARY KEY,
    nome varchar(100),
    peso float
);
```

## Configuração e Execução da API Spring Boot

1. Navegue até a pasta da API:
```bash
cd api
```

2. Configure as credenciais do PostgreSQL no arquivo `src/main/resources/application.properties`:
```properties
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
```

3. Compile e execute a API:
```bash
mvn clean install
mvn spring-boot:run
```

A API estará disponível em: `http://localhost:8080`

### Endpoints da API:
- `GET /api/pessoas` - Lista todas as pessoas
- `GET /api/pessoas/{cpf}` - Busca pessoa por CPF
- `POST /api/pessoas` - Cria nova pessoa
- `PUT /api/pessoas/{cpf}` - Atualiza pessoa
- `DELETE /api/pessoas/{cpf}` - Deleta pessoa

## Configuração e Execução do App Expo

1. Navegue até a pasta do app:
```bash
cd app
```

2. Instale as dependências:
```bash
npm install
```

3. **IMPORTANTE**: Configure o IP da API no arquivo `src/services/api.js`:
   - Abra o arquivo `app/src/services/api.js`
   - Substitua `192.168.1.100` pelo IP da máquina onde a API está rodando
   - Para descobrir o IP:
     - Windows: `ipconfig` (procure por IPv4)
     - Linux/Mac: `ifconfig` ou `ip addr`
   - Exemplo: `const API_BASE_URL = 'http://192.168.1.100:8080/api/pessoas';`

4. Inicie o servidor Expo:
```bash
npm start
```

5. No celular:
   - Abra o app Expo Go
   - Escaneie o QR Code exibido no terminal
   - Certifique-se de que o celular e o computador estão na mesma rede Wi-Fi

## Funcionalidades do App

- ✅ Listar todas as pessoas cadastradas
- ✅ Cadastrar nova pessoa (CPF, Nome, Peso)
- ✅ Deletar pessoa
- ✅ Atualizar pessoa
- ✅ Pull-to-refresh para atualizar a lista
- ✅ Validação de campos
- ✅ Mensagens de erro e sucesso

## Observações Importantes

1. **Rede**: O celular e o computador devem estar na mesma rede Wi-Fi para o app acessar a API.

2. **Firewall**: Certifique-se de que a porta 8080 está liberada no firewall do Windows.

3. **IP da API**: Sempre use o IP local da rede (ex: 192.168.x.x) e não `localhost` ou `127.0.0.1` no app mobile.

4. **CORS**: A API está configurada para aceitar requisições de qualquer origem (`@CrossOrigin(origins = "*")`).

## Testando a API

Você pode testar a API usando curl ou Postman:

```bash
# Listar pessoas
curl http://localhost:8080/api/pessoas

# Criar pessoa
curl -X POST http://localhost:8080/api/pessoas \
  -H "Content-Type: application/json" \
  -d '{"cpf":"12345678901","nome":"João Silva","peso":75.5}'
```

## Tecnologias Utilizadas

- **Backend**: Spring Boot 3.2.0, Spring Data JPA, PostgreSQL
- **Frontend**: React Native, Expo, React Navigation, React Native Paper
- **HTTP Client**: Axios

## Autor

Trabalho desenvolvido para TOCC8 - Prof. Prampero


