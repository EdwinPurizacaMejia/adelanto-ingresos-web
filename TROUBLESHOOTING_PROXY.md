# 🔧 Solución: Error JSON Parse - Proxy No Funciona Correctamente

## 📋 Problema

```
HttpErrorResponse {
  status: 200,
  statusText: 'OK',
  url: 'http://localhost:4200/api/admin/login',
  error: SyntaxError: Unexpected token '<',
  message: "Http failure during parsing"
}
```

**Causa:** El proxy está devolviendo HTML (la página de Angular) en lugar de JSON. Esto significa que:

1. El proxy NO está redirigiendo correctamente a la API
2. El servidor Angular está respondiendo en lugar del backend

---

## ✅ SOLUCIÓN

### Paso 1: Reinicia el servidor Angular

El archivo `proxy.conf.json` fue creado recientemente, así que el servidor Angular no lo ha cargado aún.

```bash
# Detén el servidor actual (si está corriendo)
Ctrl+C

# Limpia el cache
rm -rf node_modules/.cache 2>/dev/null
rm -rf .angular 2>/dev/null

# Reinstala (si es necesario)
npm install

# Reinicia con el proxy
npm start
```

**Importante:** El proxy solo funciona en desarrollo, **NO** en `npm run build`.

### Paso 2: Verifica que el proxy esté funcionando

Abre DevTools → Network tab y busca peticiones a `/api/admin/login`:

```
Request URL: http://localhost:4200/api/admin/login
Status: 200
Type: xhr
```

Si ves esto, ¡el proxy está funcionando! ✅

### Paso 3: Verifica el Response

En DevTools → Network → Request a `/api/admin/login`:

**✅ Correcto (JSON válido):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "role": "admin",
  "username": "admin"
}
```

**❌ Incorrecto (HTML):**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Adelanto Ingresos Web</title>
    ...
  </head>
</html>
```

Si ves HTML, el proxy NO está funcionando. Continúa con los pasos siguientes.

---

## 🔍 Troubleshooting

### Si aún no funciona, sigue estos pasos:

#### 1. Verifica que `proxy.conf.json` existe

```bash
ls -la proxy.conf.json
# Debe mostrar: -rw-r--r-- ... proxy.conf.json
```

#### 2. Verifica que `angular.json` tiene la configuración correcta

```bash
grep -A 5 '"proxyConfig"' angular.json
```

Debe mostrar:

```json
"development": {
  "buildTarget": "adelanto_ingresos_web:build:development",
  "proxyConfig": "proxy.conf.json"
}
```

#### 3. Verifica que `environment.ts` usa `/api`

```bash
grep 'apiUrl' src/environments/environment.ts
```

Debe mostrar:

```typescript
apiUrl: "/api";
```

#### 4. Prueba el proxy con curl

```bash
curl -i -X POST http://localhost:4200/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

Deberías ver:

- Status: `200 OK` o error del backend
- Content-Type: `application/json`
- Body: JSON response o error

### Si curl devuelve HTML, el proxy NO está configurado. Haz lo siguiente:

#### Opción A: Elimina el cache de Angular CLI

```bash
rm -rf node_modules/.cache
rm -rf .angular
npm start
```

#### Opción B: Reinstala todo

```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

#### Opción C: Usa proxy avanzado (más robusto)

Actualiza `proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://192.168.0.6:8000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": {
      "^/api": ""
    },
    "onProxyRes": function(proxyRes, req, res) {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
  }
}
```

---

## 📊 Comparativa de Soluciones

| Solución         | Complejidad | Funciona | Uso        |
| ---------------- | ----------- | -------- | ---------- |
| Proxy + ng serve | Baja        | ✅ Sí    | Desarrollo |
| CORS en backend  | Media       | ✅ Sí    | Producción |
| Ambas combinadas | Media       | ✅ Sí    | Dev + Prod |

---

## 🎯 Recomendación: Solución Definitiva

Para evitar estos problemas, **configura CORS en tu backend permanentemente**:

### Si es Django:

```python
# settings.py
INSTALLED_APPS = [
    'corsheaders',
    'django.contrib.admin',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
    "http://localhost:4201",
    "http://127.0.0.1:4200",
]

CORS_ALLOW_CREDENTIALS = True
```

### Luego, revierte environment.ts a URL directa:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://192.168.0.6:8000",
};
```

Así no dependerás del proxy y funcionará en cualquier entorno.

---

## ✅ Checklist de Verificación

- [ ] ¿Detuviste el servidor Angular con Ctrl+C?
- [ ] ¿Ejecutaste `npm start` nuevamente?
- [ ] ¿Esperaste a que compile (debe decir "Angular live development server")?
- [ ] ¿Abriste http://localhost:4200 en una pestaña nueva?
- [ ] ¿Abriste DevTools → Network?
- [ ] ¿Ingresaste credenciales: admin / 123456?
- [ ] ¿Ves la petición a `/api/admin/login` en Network?
- [ ] ¿La respuesta es JSON, no HTML?
- [ ] ¿El status es 200?
- [ ] ¿Se guardó el token en localStorage?

---

## 🚀 Próximos Pasos

### Opción 1: Usar Proxy (Temporal)

1. ✅ Reinicia `npm start`
2. ✅ Prueba login
3. ✅ Cuando pases a producción, configura CORS en backend

### Opción 2: Configurar CORS (Recomendado)

1. ✅ Configura CORS en tu backend
2. ✅ Cambia `environment.ts` a URL directa
3. ✅ Ya no necesitas el proxy

### Opción 3: Ambas (Lo Mejor)

1. ✅ Mantén el proxy para desarrollo
2. ✅ Configura CORS en backend
3. ✅ Tendrás cobertura en todos los escenarios

---

## 💡 Por Qué Pasó Esto

1. **Creamos** `proxy.conf.json`
2. **Actualizamos** `angular.json` para usarlo
3. **Pero el servidor Angular seguía corriendo** sin cargar la nueva configuración
4. **Solución:** Reiniciar el servidor para que lea `proxy.conf.json`

Es como actualizar un archivo de configuración de Node.js: necesitas reiniciar el servidor para que apliquen los cambios.

---

## 📞 Si Aún No Funciona

1. Verifica que el backend esté corriendo:

   ```bash
   curl http://192.168.0.6:8000/admin/login
   # Deberías obtener un error, pero NO HTML
   ```

2. Verifica logs del backend:

   - ¿Aparece la petición?
   - ¿Hay errores?

3. Usa DevTools → Network → Preview para ver la respuesta exacta

4. Si todo lo demás falla, **configura CORS en backend** (es la solución definitiva)

---

**Generado:** 13 de noviembre de 2025  
**Versión:** 1.0 - Guía de Troubleshooting Proxy
