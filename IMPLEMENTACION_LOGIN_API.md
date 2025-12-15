# Implementación de Consumo de API admin/login

## Resumen

Se ha implementado la integración completa del consumo de la API `admin/login` en el proyecto Angular. Anteriormente, el componente de login solo tenía un comentario indicando que se debería hacer la llamada HTTP.

## Archivos Creados

### 1. **src/app/auth/auth.service.ts**

Servicio de autenticación que encapsula toda la lógica de comunicación con la API de login.

**Características principales:**

- Método `login(credentials: LoginRequest): Observable<LoginResponse>` - Realiza la llamada HTTP POST a `http://192.168.0.6:8000/admin/login`
- `saveToken(response: LoginResponse)` - Almacena el token y datos de usuario en localStorage
- `getToken()` - Recupera el token almacenado
- `logout()` - Limpia la sesión
- `isAuthenticated()` - Verifica si hay una sesión activa
- `getRole()` y `getUsername()` - Métodos auxiliares para obtener datos del usuario

**Interfaces definidas:**

```typescript
interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
  username: string;
}
```

### 2. **src/app/auth/auth.service.spec.ts**

Suite de pruebas unitarias para el servicio de autenticación.

**Pruebas incluidas:**

- Verificación de creación del servicio
- Validación de llamada correcta al endpoint
- Guardado de token en localStorage
- Recuperación de token
- Logout y limpieza de datos
- Verificación de autenticación

## Archivos Modificados

### **src/app/auth/login/login.component.ts**

**Cambios realizados:**

1. **Importaciones agregadas:**

   - `HttpClientModule` - Para las llamadas HTTP
   - `AuthService` - Servicio de autenticación
   - `Router` - Para redireccionamiento tras login exitoso

2. **Propiedades nuevas del componente:**

   - `messageType: 'error' | 'success' | ''` - Para distinguir tipos de mensajes
   - `loading: boolean` - Indicador de estado de carga

3. **Método login() actualizado:**

   - Valida que usuario y contraseña no estén vacíos
   - Llama al servicio de autenticación
   - Maneja la respuesta exitosa guardando el token
   - Redirige según el rol del usuario:
     - Admin → `/retiros`
     - Otros → `/dashboard`
   - Maneja errores de manera específica (401, conexión, etc.)

4. **Mejoras visuales:**
   - Deshabilitación de inputs durante la autenticación
   - Mensajes diferenciados por tipo (error en rojo, éxito en verde)
   - Indicador visual del estado de carga en el botón
   - Mejor experiencia de usuario

## Comportamiento del Flujo de Autenticación

### Solicitud HTTP

```bash
POST http://192.168.0.6:8000/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "123456"
}
```

### Respuesta Exitosa (200 OK)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzYzMDUwMjg2fQ.9ss38_ZNybS7MMxRvj6fkaj1GOIb0UyLFvsNHfxheIc",
  "token_type": "bearer",
  "role": "admin",
  "username": "admin"
}
```

### Datos Guardados en localStorage

- `access_token` - Token JWT para futuras peticiones
- `token_type` - Tipo de token (bearer)
- `role` - Rol del usuario (admin)
- `username` - Nombre de usuario

## Próximos Pasos Recomendados

1. **Crear un interceptor HTTP** para incluir automáticamente el token en todas las peticiones:

   ```typescript
   // src/app/auth/auth.interceptor.ts
   // Agregar el Authorization header con el token
   ```

2. **Implementar un Guard** para proteger rutas:

   ```typescript
   // src/app/auth/auth.guard.ts
   // Verificar autenticación antes de acceder a rutas protegidas
   ```

3. **Configurar la IP/URL del API** desde un archivo de configuración:

   ```typescript
   // environment.ts
   export const environment = {
     apiUrl: "http://192.168.0.6:8000",
   };
   ```

4. **Actualizar el componente carga-excel** para usar el token en las peticiones al servicio de retiros.

## Instalación y Pruebas

El proyecto ya tenía `HttpClient` en las dependencias, por lo que no requiere instalación adicional de paquetes.

Para ejecutar las pruebas del servicio:

```bash
npm test
```

Para iniciar la aplicación:

```bash
npm start
```

## Verificación

El componente de login ahora:

- ✅ Consume correctamente la API `admin/login`
- ✅ Valida credenciales antes de enviar
- ✅ Almacena el token de forma segura
- ✅ Maneja errores apropiadamente
- ✅ Proporciona feedback visual al usuario
- ✅ Redirige según el rol del usuario
