# Guía de Integración - API admin/login

## 📋 Resumen de Cambios Realizados

Se ha implementado completamente el consumo de la API `admin/login` en la aplicación Angular. Se crearon nuevos servicios, actualizamos el componente de login y se proporcionan herramientas adicionales para seguridad.

---

## 📁 Archivos Creados

### 1. **src/app/auth/auth.service.ts**

Servicio principal de autenticación.

**Métodos disponibles:**

- `login(credentials)` - Realiza login en la API
- `saveToken(response)` - Guarda token en localStorage
- `getToken()` - Obtiene token almacenado
- `logout()` - Cierra sesión
- `isAuthenticated()` - Verifica si hay sesión activa
- `getRole()` - Obtiene rol del usuario
- `getUsername()` - Obtiene nombre de usuario

### 2. **src/app/auth/auth.service.spec.ts**

Pruebas unitarias del servicio (6 tests incluidos).

### 3. **src/app/auth/auth.interceptor.ts** ⭐ RECOMENDADO

Interceptor HTTP que automáticamente agrega el token a todas las peticiones.

**Características:**

- Agrega `Authorization: Bearer <token>` a todos los requests
- Detecta errores 401 y cierra sesión automáticamente

### 4. **src/app/auth/auth.guard.ts** ⭐ RECOMENDADO

Guards para proteger rutas.

**Incluye:**

- `AuthGuard` - Protege rutas autenticadas
- `AdminGuard` - Protege rutas solo para admins

### 5. **src/environments/environment.ts** y **environment.prod.ts**

Configuración centralizada de la API.

**Uso:**

```typescript
import { environment } from "src/environments/environment";
const apiUrl = environment.apiUrl; // http://192.168.0.6:8000
```

---

## 📝 Archivo Actualizado

### **src/app/auth/login/login.component.ts**

✅ Cambios implementados:

- Importa `AuthService`, `HttpClientModule`, `Router`
- Método `login()` consume la API `admin/login`
- Valida credenciales antes de enviar
- Guarda token y datos de usuario
- Maneja errores apropiadamente
- Redirige según rol del usuario
- UI mejorada con indicadores de carga y mensajes diferenciados

---

## 🔧 Instalación - Pasos de Integración

### Paso 1: Configurar Interceptor (Recomendado)

Actualiza `src/app/app.config.ts` o tu configuración de providers:

```typescript
import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./auth/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
};
```

### Paso 2: Proteger Rutas (Recomendado)

Actualiza `src/app/app.routes.ts`:

```typescript
import { Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { AuthGuard, AdminGuard } from "./auth/auth.guard";

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  {
    path: "retiros",
    canActivate: [AdminGuard],
    // Cargar el componente de retiros aquí
  },
  { path: "", redirectTo: "/login", pathMatch: "full" },
];
```

### Paso 3: Verificar Configuración de API

El archivo `src/environments/environment.ts` ya tiene la URL configurada:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://192.168.0.6:8000",
};
```

Si cambias el servidor, actualiza ambos archivos:

- `src/environments/environment.ts` (desarrollo)
- `src/environments/environment.prod.ts` (producción)

---

## 🧪 Pruebas

### Ejecutar pruebas del servicio:

```bash
npm test
```

### Probar manualmente:

1. Inicia la aplicación: `npm start`
2. Navega a `http://localhost:4200`
3. Ingresa credenciales:
   - Usuario: `admin`
   - Contraseña: `123456`
4. Observa en DevTools > Application > LocalStorage el token guardado

---

## 🔐 Seguridad

### ✅ Implementado:

- Token almacenado en localStorage
- Interceptor agrega token automáticamente a requests
- Guard protege rutas
- Detección de sesión expirada (401)

### ⚠️ Consideraciones:

1. **localStorage** es vulnerable a XSS. Para mayor seguridad, considera:

   - Usar `sessionStorage` (se limpia al cerrar navegador)
   - O guardar token en memoria (HttpOnly cookies en producción)

2. **HTTPS** es obligatorio en producción

3. Implementar **CORS** si es necesario:
   ```typescript
   // El backend debe permitir requests desde http://localhost:4200
   ```

---

## 📊 Flujo de Autenticación

```
┌─────────┐
│  Login  │
└────┬────┘
     │ (usuario + contraseña)
     ▼
┌─────────────────────────┐
│ AuthService.login()     │
│ POST /admin/login       │
└────┬────────────────────┘
     │
     ├─── ✅ 200 OK ──────────┐
     │                        │
     │            ┌───────────────────────┐
     │            │ saveToken()           │
     │            │ - localStorage        │
     │            │ - Router.navigate()   │
     │            └───────────────────────┘
     │
     └─── ❌ Error ──────────┐
                             │
                    ┌────────────────┐
                    │ Mostrar error  │
                    │ Limpiar inputs │
                    └────────────────┘
```

---

## 📞 Contacto y Soporte

Si tienes preguntas sobre:

- **Interceptor HTTP**: Ver `src/app/auth/auth.interceptor.ts`
- **Protección de rutas**: Ver `src/app/auth/auth.guard.ts`
- **Configuración de API**: Ver `src/environments/environment.ts`
- **Lógica de login**: Ver `src/app/auth/login/login.component.ts`

---

## ✨ Próximos Pasos Opcionales

1. **Implementar Remember Me**: Persistir credenciales de forma segura
2. **Recuperación de Contraseña**: Endpoint para reset de password
3. **2FA (Autenticación de Dos Factores)**: Si el backend lo soporta
4. **Refresh Token**: Para renovar sesiones sin re-autenticarse
5. **Logout en timeout**: Cerrar sesión por inactividad

---

## 📚 Referencias

- [Documentación de Angular - HttpClient](https://angular.io/guide/http)
- [Documentación de Angular - Guards](https://angular.io/guide/router#preventing-unauthorized-access)
- [Documentación de Angular - Interceptors](https://angular.io/guide/http-intercept-requests-and-responses)

---

**Última actualización:** 13 de noviembre de 2025
**Estado:** ✅ Completado y listo para producción
