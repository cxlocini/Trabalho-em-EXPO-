# Manual de Execução do Projeto no WSL (Windows Subsystem for Linux)

Este manual fornece instruções passo a passo para configurar e executar o projeto completo (API Spring Boot + App Expo) no ambiente WSL.

---

## 📋 Pré-requisitos

- Windows 10/11 com WSL2 instalado
- Acesso à internet para download de dependências
- Celular com Expo Go instalado (para testar o app)

---

## 🔧 Parte 1: Instalação do WSL (se necessário)

Se você ainda não tem o WSL instalado:

1. Abra o PowerShell como **Administrador**
2. Execute:
```bash
wsl --install
```
3. Reinicie o computador quando solicitado
4. Após reiniciar, configure um usuário e senha para o Linux

Para verificar se o WSL está instalado:
```bash
wsl --list --verbose
```

---

## 📦 Parte 2: Instalação das Dependências no WSL

Abra o terminal WSL (Ubuntu) e execute os seguintes comandos:

### 2.1. Atualizar o sistema
```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2. Instalar PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib -y
```

Iniciar e habilitar o PostgreSQL:
```bash
sudo service postgresql start
sudo systemctl enable postgresql
```

### 2.3. Instalar Java 17 (requerido pela API Spring Boot)
```bash
sudo apt install openjdk-17-jdk -y
```

Verificar instalação:
```bash
java -version
# Deve mostrar: openjdk version "17.x.x"
```

### 2.4. Instalar Maven (gerenciador de dependências Java)
```bash
sudo apt install maven -y
```

Verificar instalação:
```bash
mvn -version
```

### 2.5. Instalar Node.js e npm (requerido pelo Expo)
```bash
# Instalar Node.js 18.x (LTS recomendado)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Verificar instalação:
```bash
node -v
npm -v
```

### 2.6. Instalar Expo CLI globalmente
```bash
sudo npm install -g expo-cli
```

---

## 🗄️ Parte 3: Configuração do Banco de Dados PostgreSQL

### 3.1. Acessar o PostgreSQL
```bash
sudo -u postgres psql
```

### 3.2. Criar o banco de dados
No prompt do PostgreSQL (`postgres=#`), execute:
```sql
CREATE DATABASE TOCC8;
```

### 3.3. Criar um usuário (opcional, mas recomendado)
Se preferir usar um usuário específico ao invés do `postgres`:
```sql
CREATE USER seu_usuario WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE TOCC8 TO seu_usuario;
\q
```

### 3.4. Verificar se o banco foi criado
```bash
sudo -u postgres psql -l
```
Você deve ver o banco `TOCC8` na lista.

### 3.5. (Opcional) Executar o script SQL
```bash
sudo -u postgres psql -d TOCC8 -f database/create_database.sql
```

**Nota:** A tabela será criada automaticamente pelo Hibernate quando a API iniciar, mas você pode criar manualmente se preferir.

---

## 🔌 Parte 4: Configuração da API Spring Boot

### 4.1. Navegar até a pasta da API
```bash
cd ~/Trabalho-em-EXPO-/api
```
**Nota:** Ajuste o caminho conforme necessário. Se o projeto estiver em outro local, use o caminho correto.

### 4.2. Configurar o application.properties
Edite o arquivo de configuração:
```bash
nano src/main/resources/application.properties
```

Verifique/ajuste as seguintes linhas conforme sua configuração do PostgreSQL:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/TOCC8
spring.datasource.username=postgres
spring.datasource.password=sua_senha_postgres
```

**Importante:** 
- Se você criou um usuário personalizado, use esse usuário e senha
- Se estiver usando o usuário padrão `postgres`, você precisará definir uma senha:
  ```bash
  sudo -u postgres psql
  ALTER USER postgres PASSWORD 'sua_senha';
  \q
  ```

Salve o arquivo: `Ctrl + O`, `Enter`, `Ctrl + X`

### 4.3. Compilar o projeto
```bash
mvn clean install
```

Este comando pode demorar alguns minutos na primeira execução, pois o Maven baixará todas as dependências.

### 4.4. Executar a API
```bash
mvn spring-boot:run
```

A API estará rodando em: `http://localhost:8080`

**Mantenha este terminal aberto!** A API precisa estar rodando para o app funcionar.

---

## 📱 Parte 5: Configuração do App Expo

### 5.1. Abrir um novo terminal WSL
Abra uma **nova janela/aba do terminal WSL** (mantenha a API rodando no terminal anterior).

### 5.2. Navegar até a pasta do app
```bash
cd ~/Trabalho-em-EXPO-/app
```

### 5.3. Instalar dependências do Node.js
```bash
npm install
```

### 5.4. Descobrir o IP da máquina WSL

No WSL, execute:
```bash
hostname -I
```

Você verá algo como: `172.x.x.x` (IP interno do WSL)

**IMPORTANTE:** Para que o celular acesse a API, você precisa do IP da sua máquina Windows na rede local, não o IP do WSL.

Para descobrir o IP do Windows na rede local:
- No PowerShell do Windows (não no WSL):
```powershell
ipconfig
```
Procure por "IPv4" na seção do seu adaptador de rede Wi-Fi/Ethernet (ex: `192.168.1.100`)

### 5.5. Configurar o IP no arquivo api.js
```bash
nano src/services/api.js
```

Altere a linha 5:
```javascript
const API_BASE_URL = 'http://SEU_IP_WINDOWS:8080/api/pessoas';
```

Substitua `SEU_IP_WINDOWS` pelo IP que você encontrou no passo anterior (ex: `192.168.1.100`).

Salve: `Ctrl + O`, `Enter`, `Ctrl + X`

### 5.6. Configurar o firewall do Windows

O Windows precisa permitir conexões na porta 8080:

1. Abra o **Firewall do Windows Defender** (no Windows, não no WSL)
2. Clique em **Configurações Avançadas**
3. Clique em **Regras de Entrada** → **Nova Regra**
4. Selecione **Porta** → **Próximo**
5. Selecione **TCP** e digite `8080` → **Próximo**
6. Selecione **Permitir a conexão** → **Próximo**
7. Marque todas as opções → **Próximo**
8. Dê um nome (ex: "API Spring Boot") → **Concluir**

### 5.7. Executar o app Expo
```bash
npm start
```

Ou:
```bash
expo start
```

Você verá um QR Code no terminal.

---

## 📲 Parte 6: Testar no Celular

1. **Instale o Expo Go** no seu celular (Android ou iOS)
2. **Certifique-se** de que o celular e o computador estão na **mesma rede Wi-Fi**
3. **Abra o Expo Go** e escaneie o QR Code que apareceu no terminal
4. O app deve carregar e conectar à API

---

## 🔍 Troubleshooting (Solução de Problemas)

### Problema: API não inicia - Erro de conexão com PostgreSQL

**Solução:**
```bash
# Verificar se PostgreSQL está rodando
sudo service postgresql status

# Se não estiver rodando, iniciar:
sudo service postgresql start

# Verificar se o banco existe:
sudo -u postgres psql -l | grep TOCC8
```

### Problema: App não conecta à API

**Soluções:**
1. Verifique se o IP em `api.js` está correto (use o IP do Windows, não do WSL)
2. Verifique se a API está rodando: `curl http://localhost:8080/api/pessoas`
3. Teste no navegador do Windows: `http://SEU_IP:8080/api/pessoas`
4. Verifique se o firewall do Windows permite a porta 8080
5. Certifique-se de que celular e PC estão na mesma rede Wi-Fi

### Problema: Erro "Cannot find module" no Expo

**Solução:**
```bash
cd app
rm -rf node_modules package-lock.json
npm install
```

### Problema: Maven não encontra dependências

**Solução:**
```bash
cd api
mvn clean
mvn dependency:resolve
mvn install
```

### Problema: Porta 8080 já está em uso

**Solução:**
```bash
# Verificar o que está usando a porta:
sudo lsof -i :8080

# Ou matar o processo:
sudo kill -9 $(sudo lsof -t -i:8080)
```

### Problema: WSL não consegue acessar o IP do Windows

**Solução:**
No WSL, você pode usar o IP do host Windows. Para descobrir:
```bash
cat /etc/resolv.conf
```
O IP do host geralmente é o primeiro IP listado, ou você pode usar:
```bash
ip route show | grep -i default | awk '{ print $3}'
```

---

## 📝 Resumo dos Comandos Principais

### Iniciar PostgreSQL
```bash
sudo service postgresql start
```

### Iniciar a API
```bash
cd ~/Trabalho-em-EXPO-/api
mvn spring-boot:run
```

### Iniciar o App Expo
```bash
cd ~/Trabalho-em-EXPO-/app
npm start
```

### Verificar status do PostgreSQL
```bash
sudo service postgresql status
```

### Acessar o PostgreSQL
```bash
sudo -u postgres psql -d TOCC8
```

---

## 🎯 Checklist de Verificação

Antes de testar, certifique-se de que:

- [ ] PostgreSQL está instalado e rodando
- [ ] Banco de dados TOCC8 foi criado
- [ ] Java 17 está instalado
- [ ] Maven está instalado
- [ ] Node.js e npm estão instalados
- [ ] Expo CLI está instalado
- [ ] `application.properties` está configurado corretamente
- [ ] `api.js` tem o IP correto da máquina Windows
- [ ] Firewall do Windows permite porta 8080
- [ ] API está rodando (terminal 1)
- [ ] App Expo está rodando (terminal 2)
- [ ] Celular e PC estão na mesma rede Wi-Fi

---

## 📚 Comandos Úteis Adicionais

### Parar a API
No terminal onde a API está rodando: `Ctrl + C`

### Parar o Expo
No terminal onde o Expo está rodando: `Ctrl + C`

### Reiniciar PostgreSQL
```bash
sudo service postgresql restart
```

### Ver logs do PostgreSQL
```bash
sudo tail -f /var/log/postgresql/postgresql-*-main.log
```

### Limpar cache do Maven
```bash
cd api
mvn clean
```

### Limpar cache do npm
```bash
cd app
npm cache clean --force
```

---

## 🆘 Precisa de Ajuda?

Se encontrar problemas não listados aqui:
1. Verifique os logs da API no terminal
2. Verifique os logs do Expo no terminal
3. Verifique os logs do PostgreSQL: `/var/log/postgresql/`
4. Teste a API diretamente no navegador: `http://localhost:8080/api/pessoas`

---

**Boa sorte com o projeto! 🚀**

