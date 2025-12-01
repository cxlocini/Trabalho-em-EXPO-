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

### 4.5. Testar a API

Após iniciar a API, você pode testá-la de várias formas:

**No navegador (WSL ou Windows):**
- Acesse: `http://localhost:8080/` - Verá informações sobre a API
- Acesse: `http://localhost:8080/api/pessoas` - Lista todas as pessoas (pode estar vazio inicialmente)

**No terminal WSL (usando curl):**
```bash
# Testar rota raiz
curl http://localhost:8080/

# Listar todas as pessoas
curl http://localhost:8080/api/pessoas

# Criar uma pessoa de teste
curl -X POST http://localhost:8080/api/pessoas \
  -H "Content-Type: application/json" \
  -d '{"cpf":"123.456.789-00","nome":"João Silva","peso":75.5}'
```

**Importante:** 
- A rota `/api/pessoas` é o endpoint principal da API
- Se você acessar apenas `http://localhost:8080/` sem o `/api/pessoas`, verá uma página de informações, não um erro
- O erro 404 só aparece se você tentar acessar uma rota que não existe

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

O Windows precisa permitir conexões nas portas usadas pelo projeto:

**Porta 8080 (API Spring Boot):**
1. Abra o **Firewall do Windows Defender** (no Windows, não no WSL)
2. Clique em **Configurações Avançadas**
3. Clique em **Regras de Entrada** → **Nova Regra**
4. Selecione **Porta** → **Próximo**
5. Selecione **TCP** e digite `8080` → **Próximo**
6. Selecione **Permitir a conexão** → **Próximo**
7. Marque todas as opções → **Próximo**
8. Dê um nome (ex: "API Spring Boot") → **Concluir**

**Porta 8081 (Expo/Metro Bundler):**
Repita o processo acima, mas use a porta `8081` e dê o nome "Expo Metro Bundler".

**Dica:** Se preferir, você pode criar uma regra para um intervalo de portas (8080-8090) para cobrir ambas.

### 5.7. Executar o app Expo

**Opção 1: Modo Normal (LAN)**
```bash
npm start
```

Ou:
```bash
expo start
```

**Opção 2: Modo Túnel (Recomendado se tiver problemas de rede)**
```bash
npx expo start --tunnel
```

**Opção 3: Com limpeza de cache**
```bash
npx expo start -c
```

**O que você verá:**
- Um QR Code no terminal
- Informações sobre como conectar (ex: `exp://192.168.0.104:8081`)
- Opções para pressionar (ex: `s` para enviar link, `w` para web, etc.)

**Se o QR Code não funcionar:**
- Pressione `s` no terminal e escolha enviar por email/SMS
- Ou use o modo túnel: `npx expo start --tunnel`
- Ou digite manualmente no Expo Go: `exp://SEU_IP:8081`

---

## 📲 Parte 6: Testar no Celular

1. **Instale o Expo Go** no seu celular (Android ou iOS)
2. **Certifique-se** de que o celular e o computador estão na **mesma rede local** (conectados ao mesmo roteador)
3. **Abra o Expo Go** e escaneie o QR Code que apareceu no terminal
4. O app deve carregar e conectar à API

### ⚠️ Importante: PC via Cabo e Celular via Wi-Fi

**Não há problema se:**
- ✅ Seu PC está conectado via **cabo Ethernet** ao roteador
- ✅ Seu celular está conectado via **Wi-Fi** ao mesmo roteador
- ✅ Ambos estão na **mesma rede local** (mesma sub-rede)

**O que importa:**
- Ambos devem estar conectados ao **mesmo roteador/rede**
- Ambos devem ter IPs na mesma faixa (ex: `192.168.1.x`)
- O meio físico (cabo ou Wi-Fi) **não importa**

**Como verificar se estão na mesma rede:**
1. No Windows (PowerShell):
   ```powershell
   ipconfig
   ```
   Anote o IP do adaptador Ethernet (ex: `192.168.1.100`)

2. No celular:
   - Android: Configurações → Sobre o telefone → Status → Endereço IP
   - iOS: Configurações → Wi-Fi → (i) ao lado da rede → Endereço IP
   - Deve começar com os mesmos 3 números (ex: `192.168.1.xxx`)

**Se não estiverem na mesma rede:**
- Conecte ambos ao mesmo roteador
- Ou use um hotspot do celular e conecte o PC a ele (menos recomendado)

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

### Problema: Erro 404 "Whitelabel Error Page" ao acessar a API

**Causa:** Você está tentando acessar uma rota que não existe.

**Soluções:**
1. **Use as rotas corretas:**
   - ✅ `http://localhost:8080/` - Página de informações da API
   - ✅ `http://localhost:8080/api/pessoas` - Listar todas as pessoas
   - ❌ `http://localhost:8080/qualquer-outra-coisa` - Retornará 404

2. **Verifique se a API está rodando:**
   ```bash
   curl http://localhost:8080/api/pessoas
   ```
   Deve retornar `[]` (lista vazia) ou uma lista de pessoas em JSON.

3. **Recompile a API após adicionar novos controllers:**
   ```bash
   cd api
   mvn clean install
   mvn spring-boot:run
   ```

### Problema: App não carrega ao escanear o QR Code do Expo

**Sintomas:**
- QR Code aparece no terminal, mas o app não carrega no celular
- Expo Go mostra "Unable to connect" ou fica carregando infinitamente
- Erro de conexão no Expo Go

**Soluções (teste uma por vez):**

1. **Verificar se o Expo está rodando corretamente:**
   ```bash
   cd app
   npm start
   ```
   - Você deve ver um QR Code no terminal
   - Anote o IP e porta que aparecem (ex: `exp://192.168.0.104:8081`)

2. **Usar modo túnel (mais confiável no WSL):**
   ```bash
   cd app
   npx expo start --tunnel
   ```
   - Isso cria um túnel através dos servidores do Expo
   - Pode ser mais lento, mas funciona mesmo com problemas de rede local

3. **Verificar firewall do Windows:**
   - O Expo usa a porta **8081** (Metro Bundler)
   - Adicione regra no firewall para porta 8081 (mesmo processo da porta 8080)
   - Ou desative temporariamente o firewall para testar

4. **Verificar se está na mesma rede:**
   ```bash
   # No WSL, descubra o IP do Windows:
   cat /etc/resolv.conf | grep nameserver | awk '{print $2}'
   ```
   - Compare com o IP do celular
   - Devem estar na mesma faixa (ex: `192.168.1.x`)

5. **Limpar cache do Expo:**
   ```bash
   cd app
   npx expo start -c
   ```
   O flag `-c` limpa o cache

6. **Usar o IP manualmente no Expo Go:**
   - No terminal do Expo, pressione `s` para ver opções
   - Escolha "Send link with email/SMS"
   - Ou digite manualmente no Expo Go: `exp://SEU_IP:8081`

7. **Verificar se há erros no terminal:**
   - Olhe o terminal onde o Expo está rodando
   - Procure por erros em vermelho
   - Erros comuns: "Cannot find module", problemas de permissão

8. **Testar no navegador primeiro:**
   ```bash
   cd app
   npm start
   # Pressione 'w' para abrir no navegador
   ```
   - Se funcionar no navegador, o problema é de rede/conexão com o celular

9. **Alternativa: Usar Expo Dev Client (mais avançado):**
   Se nada funcionar, você pode tentar usar o modo de desenvolvimento:
   ```bash
   cd app
   npx expo start --dev-client
   ```

### Problema: Erro 404 ao Listar/Criar Pessoas

**Sintomas:**
- App carrega no celular, mas mostra erro 404 ao tentar buscar/criar pessoas
- Mensagem: "Request failed with status code 404"
- Erro aparece no console do Expo

**Soluções (teste nesta ordem):**

1. **Forçar recarregamento do app:**
   - Agite o celular vigorosamente
   - Escolha **"Reload"** no menu
   - Ou no terminal do Expo: pressione `r` para recarregar
   - Ou: `Shift + R` para recarregar e limpar cache

2. **Verificar se a API está rodando:**
   ```bash
   curl http://localhost:8080/api/pessoas
   ```
   Deve retornar `[]` ou uma lista JSON.

3. **Verificar IP no api.js:**
   - Abra `app/src/services/api.js`
   - Verifique se o IP está correto (use o IP do Windows, não do WSL)
   - Deve ser: `const API_BASE_URL = 'http://SEU_IP:8080';`
   - **NÃO** deve incluir `/api/pessoas` na baseURL

4. **Testar API no navegador:**
   - Abra: `http://SEU_IP:8080/api/pessoas`
   - Deve mostrar JSON (pode estar vazio `[]`)
   - Se não funcionar, a API não está acessível

5. **Verificar firewall:**
   - Porta 8080 deve estar aberta
   - Teste desativando temporariamente o firewall

6. **Verificar se estão na mesma rede:**
   - PC e celular no mesmo roteador
   - IPs devem começar com os mesmos 3 números

### Problema: "Cannot connect to Metro"

**Sintomas:**
- Aviso amarelo no app: "Cannot connect to Metro"
- App não carrega ou não atualiza

**Soluções:**

1. **Usar modo túnel (mais confiável):**
   ```bash
   cd app
   npx expo start --tunnel
   ```

2. **Verificar se Expo está rodando:**
   ```bash
   cd app
   npm start
   ```
   Deve aparecer um QR Code.

3. **Verificar firewall para porta 8081:**
   - Adicione regra para porta 8081 (Metro Bundler)
   - Ou desative temporariamente para testar

4. **Limpar cache:**
   ```bash
   cd app
   npx expo start -c
   ```

5. **Verificar conexão de rede:**
   - Certifique-se de que PC e celular estão na mesma rede
   - Tente usar o modo túnel que funciona mesmo com problemas de rede local

### Problema: App não conecta à API (depois de carregar)

**Sintomas:**
- App carrega no celular, mas não consegue buscar/criar pessoas
- Erro de conexão ao tentar usar o app

**Soluções:**
1. Verifique se o IP em `api.js` está correto (use o IP do Windows, não do WSL)
2. Verifique se a API está rodando: `curl http://localhost:8080/api/pessoas`
3. Teste no navegador do Windows: `http://SEU_IP:8080/api/pessoas`
4. Verifique se o firewall do Windows permite a porta 8080
5. **Certifique-se de que celular e PC estão na mesma rede local (mesmo roteador)**
   - PC via cabo + Celular via Wi-Fi = ✅ Funciona (se no mesmo roteador)
   - PC via Wi-Fi + Celular via Wi-Fi = ✅ Funciona (se no mesmo roteador)
   - Verifique se os IPs começam com os mesmos 3 números (ex: `192.168.1.x`)

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
- [ ] Celular e PC estão na mesma rede local (mesmo roteador)

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

## 🔍 Guia Rápido de Diagnóstico: App Não Carrega

**Script Automático de Diagnóstico:**
Execute o script de diagnóstico para verificar tudo automaticamente:
```bash
# No WSL (não no PowerShell):
chmod +x diagnostico.sh
./diagnostico.sh
```

O script verifica:
- Status do PostgreSQL
- Existência do banco de dados
- Instalação de Java, Maven, Node.js
- Se a API está rodando
- IP do Windows
- Configuração do api.js

Ou siga estes passos manuais na ordem para identificar o problema:

### Passo 1: Verificar se o Expo está rodando
```bash
cd app
npm start
```
✅ **Sucesso:** QR Code aparece no terminal  
❌ **Falha:** Instale dependências: `npm install`

### Passo 2: Verificar se a API está rodando
```bash
# Em outro terminal:
curl http://localhost:8080/api/pessoas
```
✅ **Sucesso:** Retorna `[]` ou lista de pessoas  
❌ **Falha:** Inicie a API: `cd api && mvn spring-boot:run`

### Passo 3: Verificar IPs na mesma rede
```bash
# No Windows (PowerShell):
ipconfig
# Anote o IPv4 (ex: 192.168.1.100)
```
- No celular: Configurações → Wi-Fi → (i) → Endereço IP
- ✅ **Sucesso:** IPs começam com os mesmos 3 números  
- ❌ **Falha:** Conecte ambos ao mesmo roteador

### Passo 4: Testar API no navegador
Abra no navegador do Windows: `http://SEU_IP:8080/api/pessoas`
- ✅ **Sucesso:** Vê JSON ou lista vazia  
- ❌ **Falha:** Verifique firewall e se API está rodando

### Passo 5: Tentar modo túnel do Expo
```bash
cd app
npx expo start --tunnel
```
- ✅ **Sucesso:** App carrega no celular  
- ❌ **Falha:** Verifique conexão com internet e firewall

### Passo 6: Verificar firewall
- Porta 8080 (API) deve estar aberta
- Porta 8081 (Expo) deve estar aberta
- Ou desative temporariamente para testar

### Passo 7: Verificar IP no api.js
Abra `app/src/services/api.js` e verifique se o IP está correto:
```javascript
const API_BASE_URL = 'http://SEU_IP:8080/api/pessoas';
```
Deve ser o IP do Windows (não do WSL, não localhost)

---

**Boa sorte com o projeto! 🚀**


