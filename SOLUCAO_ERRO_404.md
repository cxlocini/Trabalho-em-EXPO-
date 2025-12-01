# 🔧 Solução Rápida: Erro 404 no App

## Problema
O app está mostrando erro 404 ao tentar listar/criar pessoas, mesmo após a correção do código.

## ✅ Soluções (teste nesta ordem)

### 1. Forçar Recarregamento do App

**No celular:**
- Agite o celular vigorosamente
- Ou pressione `Ctrl + M` (Android) / `Cmd + D` (iOS) se estiver usando emulador
- Escolha **"Reload"** no menu que aparecer

**No terminal do Expo:**
- Pressione `r` para recarregar
- Ou pressione `Shift + R` para recarregar e limpar cache

### 2. Verificar se a API está Rodando

**No WSL, teste a API:**
```bash
curl http://localhost:8080/api/pessoas
```

**Deve retornar:** `[]` (lista vazia) ou uma lista JSON de pessoas.

**Se não funcionar:**
```bash
cd api
mvn spring-boot:run
```

### 3. Verificar se o IP está Correto

**No Windows (PowerShell):**
```powershell
ipconfig
```

Procure o IPv4 do adaptador de rede (Ethernet ou Wi-Fi). Exemplo: `192.168.0.104`

**Verifique no arquivo `app/src/services/api.js`:**
```javascript
const API_BASE_URL = 'http://192.168.0.104:8080';
```

O IP deve ser o **mesmo** que você encontrou no `ipconfig`.

### 4. Testar API no Navegador

Abra no navegador do Windows:
```
http://192.168.0.104:8080/api/pessoas
```

**Deve mostrar:** Uma lista JSON (pode estar vazia `[]`)

**Se não funcionar:**
- A API não está rodando
- O IP está errado
- O firewall está bloqueando

### 5. Verificar Firewall do Windows

O firewall precisa permitir conexões na porta **8080**.

**Como adicionar regra:**
1. Abra "Firewall do Windows Defender"
2. Configurações Avançadas
3. Regras de Entrada → Nova Regra
4. Porta → TCP → 8080
5. Permitir conexão
6. Aplicar a todas as redes

### 6. Verificar Conexão do Metro (Expo)

O erro "Cannot connect to Metro" indica problema de conexão.

**Soluções:**

**a) Usar modo túnel:**
```bash
cd app
npx expo start --tunnel
```

**b) Verificar se Expo está rodando:**
```bash
cd app
npm start
```

Você deve ver um QR Code no terminal.

**c) Verificar firewall para porta 8081:**
- Adicione regra para porta 8081 (mesmo processo da porta 8080)

### 7. Limpar Cache e Reiniciar

**No terminal do Expo:**
```bash
cd app
# Pare o Expo (Ctrl + C)
npx expo start -c
```

O flag `-c` limpa o cache.

### 8. Verificar se Estão na Mesma Rede

**PC e celular devem estar no mesmo roteador:**
- PC via cabo + Celular via Wi-Fi = ✅ OK (se no mesmo roteador)
- Verifique se os IPs começam com os mesmos 3 números
  - PC: `192.168.0.104`
  - Celular: `192.168.0.xxx` (deve começar com `192.168.0`)

## 🔍 Checklist de Diagnóstico

Execute estes comandos para verificar tudo:

```bash
# 1. Verificar se API está rodando
curl http://localhost:8080/api/pessoas

# 2. Verificar IP do Windows (no WSL)
cat /etc/resolv.conf | grep nameserver | awk '{print $2}'

# 3. Testar API com IP do Windows (substitua pelo IP real)
curl http://192.168.0.104:8080/api/pessoas
```

## 📝 Passo a Passo Completo

1. ✅ **API rodando?** → `curl http://localhost:8080/api/pessoas`
2. ✅ **IP correto?** → Verifique com `ipconfig` no Windows
3. ✅ **API acessível?** → Teste no navegador: `http://SEU_IP:8080/api/pessoas`
4. ✅ **Firewall OK?** → Portas 8080 e 8081 abertas
5. ✅ **Mesma rede?** → PC e celular no mesmo roteador
6. ✅ **App recarregado?** → Agite o celular e escolha "Reload"
7. ✅ **Expo rodando?** → `npm start` na pasta `app`

## 🆘 Se Nada Funcionar

1. **Pare tudo:**
   - Pare o Expo (Ctrl + C)
   - Pare a API (Ctrl + C)

2. **Reinicie tudo:**
   ```bash
   # Terminal 1 - API
   cd api
   mvn spring-boot:run
   
   # Terminal 2 - Expo (aguarde a API iniciar primeiro)
   cd app
   npx expo start --tunnel
   ```

3. **Teste no navegador primeiro:**
   - Se funcionar no navegador, o problema é de conexão do celular
   - Se não funcionar no navegador, o problema é na API

4. **Use o modo túnel do Expo:**
   - É mais lento, mas funciona mesmo com problemas de rede local

## 📞 Informações para Debug

Se precisar de ajuda, forneça:
- Resultado de `curl http://localhost:8080/api/pessoas`
- IP do Windows (do `ipconfig`)
- IP configurado no `api.js`
- Se a API funciona no navegador
- Se o Expo está mostrando o QR Code

