# Implementación: Log de Políticas de Aceptación

## Resumen

Se ha implementado una nueva funcionalidad para consultar el historial de políticas de aceptación mediante la API `politicas/historial/{doc_type}/{dni}`.

## Cambios Realizados

### 1. Nuevo Componente: PoliticasHistorialComponent

**Ubicación:** `src/app/retiros/politicas-historial/`

#### Archivos creados:

- `politicas-historial.component.ts` - Lógica del componente
- `politicas-historial.component.html` - Template HTML
- `politicas-historial.component.scss` - Estilos
- `politicas-historial.component.spec.ts` - Tests

#### Características:

- **Selector de tipo de documento**: Permite seleccionar entre DNI y CE
- **Input de número de documento**: Campo para ingresar el número de documento
- **Botón de consulta**: Inicia la petición a la API
- **Botón limpiar**: Resetea el formulario y resultados
- **Tabla de resultados**: Muestra el historial obtenido de forma dinámica
- **Manejo de errores**: Muestra mensajes de error apropiados
- **Estado de carga**: Indica cuando se está consultando la API

### 2. Actualización de Rutas

**Archivo:** `src/app/retiros/retiros.routes.ts`

Se agregó la nueva ruta:

```typescript
{
  path: 'politicas-historial',
  component: PoliticasHistorialComponent,
  title: 'Log Políticas de Aceptación'
}
```

### 3. Actualización del Navbar

**Archivo:** `src/app/shared/navbar/navbar.component.html`

Se agregó un nuevo item de menú **a la izquierda** de "Cargar Excel":

- Nombre: "Log politica de aceptación"
- Ruta: `/retiros/politicas-historial`
- Ícono: Documento con líneas (SVG)

## Funcionalidad

### Flujo de Usuario:

1. El usuario hace clic en "Log politica de aceptación" en el navbar
2. Se muestra una pantalla con:
   - Selector de tipo de documento (DNI/CE)
   - Campo para ingresar número de documento
   - Botón "Consultar Historial"
   - Botón "Limpiar"
3. Al ingresar los datos y hacer clic en "Consultar Historial":
   - Se realiza una petición GET a: `{apiUrl}/politicas/historial/{tipo_documento}/{numero_documento}`
   - Se incluye el token de autenticación en los headers
   - Se muestra un estado de carga mientras se procesa
4. Los resultados se muestran en una tabla dinámica
5. Si hay errores, se muestra un mensaje apropiado

### API Endpoint:

```
GET {apiUrl}/politicas/historial/{doc_type}/{dni}
Headers:
  Authorization: Bearer {token}
```

**Parámetros:**

- `doc_type`: Tipo de documento (DNI o CE)
- `dni`: Número de documento

**Respuesta esperada:**

```json
[
  {
    "fecha": "2024-12-01",
    "tipo_documento": "DNI",
    "documento": "12345678",
    "accion": "Aceptación",
    "estado": "aprobado"
    // ... otros campos dinámicos
  }
]
```

O con wrapper:

```json
{
  "data": [
    { ... }
  ]
}
```

## Características Técnicas

### Componente Standalone

El componente es standalone y no requiere módulos adicionales:

```typescript
@Component({
  selector: 'app-politicas-historial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  ...
})
```

### Tabla Dinámica

La tabla se adapta automáticamente a los campos recibidos en la respuesta:

- Muestra columnas fijas: fecha, tipo_documento, documento, accion, estado
- Muestra columnas adicionales dinámicamente según los datos recibidos
- Aplica estilos condicionales a los estados (badges de color)

### Responsive Design

Los estilos incluyen media queries para dispositivos móviles:

- Padding reducido en pantallas pequeñas
- Botones en columna en lugar de fila
- Header de resultados apilado verticalmente

### Validaciones

- No permite consultar sin número de documento
- Deshabilita controles durante la carga
- Maneja errores de la API apropiadamente
- Muestra mensaje cuando no hay resultados

## Integración con el Sistema

### Autenticación

El componente utiliza el token almacenado en `localStorage` para autenticar las peticiones:

```typescript
const token = localStorage.getItem("token");
const headers = new HttpHeaders({
  Authorization: `Bearer ${token}`,
});
```

### Configuración de API

Utiliza la configuración centralizada en `environment.ts`:

```typescript
const url = `${environment.apiUrl}/politicas/historial/...`;
```

## Pruebas

Para probar la funcionalidad:

1. Iniciar sesión en la aplicación
2. Hacer clic en "Log politica de aceptación" en el navbar
3. Seleccionar tipo de documento (DNI o CE)
4. Ingresar un número de documento válido
5. Hacer clic en "Consultar Historial"
6. Verificar que se muestren los resultados o un mensaje de error apropiado

## Notas Adicionales

- El componente maneja tanto respuestas directas (array) como respuestas con wrapper (`{data: []}`)
- Los estilos siguen el diseño del resto de la aplicación
- El componente es completamente independiente y puede ser reutilizado
- La tabla se ajusta automáticamente a cualquier estructura de datos recibida
