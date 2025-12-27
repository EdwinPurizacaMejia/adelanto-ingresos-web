# Resumen: Corrección del Problema de GitHub Pages

## Problema Identificado

Cuando se visitaba el sitio en GitHub Pages en `https://edwinpurizacamejia.github.io/adelanto-ingresos-web/`, la página se mostraba en blanco con el siguiente error en consola:

```
auth:1  Failed to load resource: the server responded with a status of 404 ()
```

La URL se mostraba como: `https://edwinpurizacamejia.github.io/adelanto-ingresos-web/auth`

## Causa Raíz del Problema

### 1. **Estructura de Archivos del Nuevo Builder de Angular**

Con Angular 19 y el nuevo application builder (`@angular-devkit/build-angular:application`), la estructura de salida cambió:

```
dist/adelanto_ingresos_web/
├── 3rdpartylicenses.txt
└── browser/           ← Los archivos ahora están en un subdirectorio
    ├── 404.html
    ├── index.html
    ├── main-WMUIANPJ.js
    ├── polyfills-FFHMD2TL.js
    ├── styles-BPEY4GH7.css
    └── ...
```

Anteriormente con el builder antiguo (`@angular-devkit/build-angular:browser`):

```
dist/adelanto_ingresos_web/
├── index.html
├── main.js
├── polyfills.js
└── ...
```

### 2. **Script de Deploy Desactualizado**

El script `deploy-to-github-pages.sh` copiaba archivos desde la ubicación antigua:

```bash
cp -r dist/adelanto_ingresos_web/* "$TEMP_DIR/"  # ❌ Carpeta incorrecta
```

Esto resultaba en que GitHub Pages solo recibía el archivo `3rdpartylicenses.txt` y la carpeta `browser/`, pero **no** los archivos directamente en la raíz donde GitHub Pages los espera.

### 3. **Problema de Redirección y Carga de Recursos**

Cuando GitHub Pages no encontraba archivos en la raíz:

- Servía la ruta `/auth` (por defecto de Angular)
- El navegador intentaba cargar los scripts JS desde rutas relativas incorrectas
- Los scripts no se encontraban porque estaban en la ubicación equivocada
- Resultado: página en blanco con error 404

## Solución Implementada

### 1. **Actualización del Script de Deploy**

Modificamos `deploy-to-github-pages.sh` para copiar desde la ubicación correcta:

```bash
# Copiar archivos construidos desde el subdirectorio browser
cp -r dist/adelanto_ingresos_web/browser/* "$TEMP_DIR/"
```

**Nota importante:** El archivo `404.html` debe copiarse desde la raíz del proyecto, no desde `dist/`, porque queremos usar nuestra versión personalizada con el script de manejo de SPA.

### 2. **Mejora del Archivo 404.html**

Implementamos la solución estándar para SPAs en GitHub Pages basada en [spa-github-pages](https://github.com/rafgraph/spa-github-pages):

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Adelanto Ingresos Web</title>
  <script>
    // Single Page Apps for GitHub Pages
    // Este script captura la URL y la preserva para el index.html
    (function(l) {
      if (l.search[1] === '/' ) {
        var decoded = l.search.slice(1).split('&').map(function(s) {
          return s.replace(/~and~/g, '&')
        }).join('?');
        window.history.replaceState(null, null,
            l.pathname.slice(0, -1) + decoded + l.hash
        );
      }
    }(window.location))
  </script>
  <meta http-equiv="refresh" content="0;URL='/adelanto-ingresos-web/'"></meta>
</head>
<body>
</body>
</html>
```

### 3. **Actualización del src/index.html**

Agregamos el script complementario en `src/index.html` que restaura la ruta original antes de que Angular arranque:

```html
<!-- Start Single Page Apps for GitHub Pages -->
<script type="text/javascript">
  // Este script verifica si hay una ruta redirigida desde el 404.html
  // y la restaura antes de que Angular arranque
  (function (l) {
    if (l.search[1] === "/") {
      var decoded = l.search
        .slice(1)
        .split("&")
        .map(function (s) {
          return s.replace(/~and~/g, "&");
        })
        .join("?");
      window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
    }
  })(window.location);
</script>
<!-- End Single Page Apps for GitHub Pages -->
```

## Flujo Corregido

1. Usuario visita: `https://edwinpurizacamejia.github.io/adelanto-ingresos-web/`
2. GitHub Pages sirve `index.html` desde la raíz de gh-pages
3. Angular carga y redirige a `/auth` (ruta por defecto)
4. El navegador navega a `https://edwinpurizacamejia.github.io/adelanto-ingresos-web/auth`
5. GitHub Pages no encuentra `/auth`, sirve `404.html`
6. El script en `404.html` redirige a `/adelanto-ingresos-web/` preservando la ruta
7. El script en `index.html` restaura la ruta `/auth`
8. Angular maneja la ruta y muestra el componente de login correctamente

## Pasos para Redesplegar

```bash
# 1. Reconstruir el proyecto
npm run build

# 2. Ejecutar el script de deploy actualizado
bash deploy-to-github-pages.sh

# 3. Verificar en GitHub que los archivos estén en la raíz de gh-pages
# 4. Visitar https://edwinpurizacamejia.github.io/adelanto-ingresos-web/
```

## Verificación

Después del redespliegue, verificar:

1. ✅ La página carga correctamente
2. ✅ No hay errores 404 en la consola
3. ✅ La navegación entre rutas funciona
4. ✅ El deep linking funciona (puedes compartir URLs específicas)
5. ✅ El historial del navegador funciona correctamente

## Archivos Modificados

1. `deploy-to-github-pages.sh` - Actualizado para copiar desde `browser/`
2. `404.html` - Mejorado con script de SPA para GitHub Pages
3. `src/index.html` - Agregado script de restauración de rutas
4. `RESUMEN_CORRECCION_GITHUB_PAGES.md` - Este documento

## Referencias

- [Angular CLI Application Builder](https://angular.dev/tools/cli/build-system-migration)
- [SPA GitHub Pages](https://github.com/rafgraph/spa-github-pages)
- [GitHub Pages Routing for SPAs](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site)
