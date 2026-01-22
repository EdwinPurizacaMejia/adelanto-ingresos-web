# 🔒 Solución al Error CORS - Access-Control-Allow-Origin

## 📋 Problema Identificado

```
Access to XMLHttpRequest at 'http://192.168.0.6:8000/admin/login'
from origin 'http://localhost:4200' has been blocked by CORS policy:
Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Causa:** El backend no está enviando los headers CORS necesarios para permitir requests desde `http://localhost:4200`.

---

## ✅ SOLUCIÓN 1: Configurar CORS en el Backend (RECOMENDADO ⭐)

### Si es **Django**:

```python
# settings.py

# 1. Instala django-cors-headers
# pip install django-cors-headers

INSTALLED_APPS = [
    'corsheaders',
    # ... otros apps
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Debe estar al principio
    'django.middleware.common.CommonMiddleware',
    # ... otros middleware
]

# Permite solo localhost (desarrollo)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
    "http://localhost:4201",
    "http://127.0.0.1:4200",
]

# O si necesitas permitir cualquier origen:
CORS_ALLOW_ALL_ORIGINS = True  # NO recomendado en producción

# Permite credenciales
CORS_ALLOW_CREDENTIALS = True
```

### Si es **FastAPI**:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://localhost:4201",
        "http://127.0.0.1:4200",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Permite GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Permite todos los headers
)

# Resto de la aplicación...
```

### Si es **Flask**:

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Configurar CORS
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:4200", "http://localhost:4201"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"],
    }
})

# Resto de la aplicación...
```

### Si es **Node.js/Express**:

```javascript
const express = require("express");
const cors = require("cors");

const app = express();

// Configurar CORS
app.use(
  cors({
    origin: ["http://localhost:4200", "http://localhost:4201"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Resto de la aplicación...
```

---

## ✅ SOLUCIÓN 2: Usar Proxy en Angular (Para Desarrollo)

Esta solución es temporal para desarrollo local. **NO** usar en producción.

### Ya Configurado ✅

Se han realizado los siguientes cambios:

#### 1. **proxy.conf.json** (CREADO)

```json
{
  "/api": {
    "target": "http://192.168.0.6:8000",
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": {
      "^/api": ""
    }
  }
}
```

#### 2. **angular.json** (ACTUALIZADO)

Se agregó `"proxyConfig": "proxy.conf.json"` en la configuración de desarrollo.

#### 3. **environment.ts** (ACTUALIZADO)

```typescript
export const environment = {
  production: false,
  apiUrl: "/api", // ← Cambió de la URL directa al proxy
};
```

### Cómo Funciona el Proxy

```
Request Angular
    ↓
http://localhost:4200/api/admin/login
    ↓ (proxy redirige)
http://192.168.0.6:8000/admin/login
    ↓
Backend responde
    ↓
Angular recibe respuesta
```

---

## 🚀 Cómo Usar la Solución

### Opción A: Si ya solucionaste CORS en el backend

1. **Revierte el cambio en environment.ts:**

```typescript
export const environment = {
  production: false,
  apiUrl: "http://192.168.0.6:8000", // URL directa
};
```

2. **Reinicia la aplicación:**

```bash
npm start
```

---

### Opción B: Usar el Proxy de Angular (Recomendado para desarrollo)

1. **Ya está configurado ✅** (Se realizó automáticamente)

2. **Reinicia la aplicación:**

```bash
# Detén el servidor (Ctrl+C)
# Inicia nuevamente:
npm start
```

3. **Prueba el login:**

- Usuario: `admin`
- Contraseña: `123456`

---

## 📊 Comparación de Soluciones

| Aspecto        | Backend CORS   | Proxy Angular    |
| -------------- | -------------- | ---------------- |
| Complejidad    | Media          | Baja             |
| Desarrollo     | ✅ Recomendado | ✅ Funciona bien |
| Producción     | ✅ Necesario   | ❌ NO usar       |
| Seguridad      | Alta           | Media            |
| Performance    | Alto           | Medio            |
| Mantenibilidad | Fácil          | Temporal         |

---

## ⚙️ Configuración por Entorno

### Desarrollo (localhost:4200)

```typescript
// environment.ts
export const environment = {
  apiUrl: "/api", // Usa proxy
};
```

### Producción

```typescript
// environment.prod.ts
export const environment = {
  apiUrl: "http://192.168.0.6:8000", // URL directa
};
```

---

## 🧪 Verificar que Funciona

### 1. Asegúrate que el backend esté corriendo

```bash
# En otra terminal
python manage.py runserver 0.0.0.0:8000  # Django
# o
uvicorn main:app --host 0.0.0.0 --port 8000  # FastAPI
```

### 2. Inicia Angular

```bash
npm start
```

### 3. Abre el navegador

```
http://localhost:4200
```

### 4. Verifica que NO hay errores de CORS

Abre DevTools → Console y busca el error CORS. Debería estar **resuelto**.

### 5. Intenta hacer login

- Usuario: `admin`
- Contraseña: `123456`

---

## 🔍 Troubleshooting

### ❌ Aún aparece error CORS

**Solución 1:** Reinicia ambos servidores (backend y Angular)

```bash
# Terminal 1: Backend
killall python  # o el comando para detener tu backend
python manage.py runserver

# Terminal 2: Angular
killall ng  # Detiene cualquier ng en ejecución
npm start
```

**Solución 2:** Limpia el cache del navegador

```
F12 → Application → Cache Storage → Limpiar todo
Ctrl+Shift+Supr → Borrar datos de navegación
```

**Solución 3:** Verifica que el backend esté permitiendo CORS

```bash
# Prueba con curl desde terminal:
curl -i -X OPTIONS http://192.168.0.6:8000/admin/login \
  -H "Access-Control-Request-Method: POST" \
  -H "Origin: http://localhost:4200"

# Deberías ver headers como:
# Access-Control-Allow-Origin: http://localhost:4200
# Access-Control-Allow-Methods: POST
```

### ❌ Error 404 con el proxy

**Solución:** Verifica que `proxy.conf.json` esté en la raíz del proyecto

```bash
ls -la proxy.conf.json
# Debe existir en: ./proxy.conf.json
```

---

## 📝 Archivo proxy.conf.json Explicado

```json
{
  "/api": {
    // Rutas que comienzan con /api
    "target": "http://192.168.0.6:8000", // Se redirigen aquí
    "secure": false, // No verificar SSL (desarrollo)
    "changeOrigin": true, // Cambiar el origin del request
    "pathRewrite": {
      // Reescribir la ruta
      "^/api": "" // /api/admin/login → /admin/login
    }
  }
}
```

---

## 🎯 Recomendaciones Finales

### Para Desarrollo (Ahora)

✅ Usa el **Proxy de Angular** (ya está configurado)

- El proxy redirige `/api/*` a tu backend

### Para Producción (Después)

✅ Configura **CORS en el backend**

- Elimina la URL de proxy
- El frontend y backend estarán en producción
- Las headers CORS las proporciona el backend

### Flujo Recomendado

```
1. Desarrollo local
   ├─ Frontend: http://localhost:4200 (usa proxy)
   └─ Backend: http://192.168.0.6:8000

2. Staging
   ├─ Frontend: https://staging.example.com
   └─ Backend: https://api.staging.example.com
   └─ CORS configurado en backend

3. Producción
   ├─ Frontend: https://example.com
   └─ Backend: https://api.example.com
   └─ CORS configurado en backend
```

---

## 📞 Próximos Pasos

1. ✅ **Reinicia npm start**

   ```bash
   npm start
   ```

2. ✅ **Prueba el login**

   - Usuario: admin
   - Contraseña: 123456

3. ✅ **Si aún hay problemas**, configura CORS en tu backend usando los ejemplos arriba

4. ✅ **Cuando pases a producción**, asegúrate de que el backend tenga CORS configurado

---

**Estado:** ✅ Proxy configurado y listo para usar  
**Último actualizado:** 13 de noviembre de 2025
