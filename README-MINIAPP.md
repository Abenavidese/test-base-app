# Merch MVP - Base MiniApp

Una aplicación descentralizada para reclamar SBTs de eventos y mintear NFTs premium companion en Base Sepolia.

## 🚀 Características de la MiniApp

- **Conexión automática**: Conecta automáticamente con Base Accounts dentro del ecosistema Farcaster
- **Gasless transactions**: Soporte para transacciones patrocinadas cuando está disponible
- **Batch operations**: Agrupa múltiples operaciones en una sola transacción
- **Signature-based claiming**: Cualquier usuario puede reclamar SBTs con códigos válidos

## 📋 Pasos para desplegar como MiniApp

### 1. Desplegar a Vercel
```bash
# Instalar dependencias
npm install

# Build para producción
npm run build

# Desplegar a Vercel
npx vercel --prod
```

### 2. Configurar variables de entorno en Vercel
```bash
# Contratos
NEXT_PUBLIC_BASIC_MERCH=0xC0bbBd9A3A68337671dC2FF979a8c19c8d39757A
NEXT_PUBLIC_PREMIUM_MERCH=0x047743cC634a54f53a1BC9a6ad029E6a6C707C6E

# Network
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_KEY

# MiniApp
NEXT_PUBLIC_URL=https://your-app.vercel.app

# Backend issuer (mantener segura)
BACKEND_ISSUER_PRIVATE_KEY=your_private_key_here
```

### 3. Configurar Account Association

1. Ve a [Base Build](https://base.dev/preview?tab=account)
2. Ingresa tu dominio (ej: `your-app.vercel.app`)
3. Click "Submit" y luego "Verify"
4. Firma el mensaje con tu Base Account
5. Copia los campos `accountAssociation` generados
6. Actualiza el archivo `app/.well-known/farcaster.json/route.ts`

### 4. Actualizar Manifest

Edita `app/.well-known/farcaster.json/route.ts`:

```typescript
"baseBuilder": {
  "allowedAddresses": ["TU_BASE_ACCOUNT_ADDRESS"]
},
"miniapp": {
  "homeUrl": "https://your-app.vercel.app",
  "canonicalDomain": "your-app.vercel.app"
  // ... resto de configuración
}
```

### 5. Verificar deployment

- Manifest disponible en: `https://your-app.vercel.app/.well-known/farcaster.json`
- Metadata fc:miniapp incluida en el HTML
- Images (icon.svg, splash.svg, og-image.svg) accesibles

## 🧪 Testing

### En desarrollo (localhost)
- La app muestra un mensaje indicando que necesita ejecutarse como MiniApp
- Funcionalidad limitada sin contexto de Farcaster

### En producción (Base App)
1. Abre la Base app
2. Navega a Mini Apps
3. Busca tu app o usa el link directo
4. La app debería conectar automáticamente tu Base Account

## 📱 Flujo de usuario

1. **Apertura**: Usuario abre la MiniApp en Base app
2. **Conexión automática**: Base Account se conecta sin intervención
3. **Capacidades**: Detección automática de funciones avanzadas
4. **Claiming**: Usuario ingresa código y evento
5. **Validación**: Backend valida y genera firma
6. **Minting**: Contrato mintea SBT usando firma del backend
7. **Companion**: Usuario puede mintear NFT premium (opcional)

## 🔧 Configuración del contrato

La MiniApp incluye un componente de setup que:
- Verifica si el `backendIssuer` está configurado
- Permite al owner del contrato configurar la dirección del backend
- Se oculta automáticamente cuando todo está configurado

## 📚 Recursos

- [Base MiniApp Documentation](https://docs.base.org/mini-apps/)
- [Farcaster MiniApp SDK](https://docs.farcaster.xyz/mini-apps/)
- [Base Account Capabilities](https://docs.base.org/base-account/)

## ⚠️ Notas importantes

- Los códigos de prueba son: `DEMO123`, `TEST456`, `CLAIM789`, `EVENT2025`
- La validación de códigos actualmente es mock (para demo)
- Las firmas del backend son reales y funcionales
- Solo funciona en Base Sepolia (testnet)