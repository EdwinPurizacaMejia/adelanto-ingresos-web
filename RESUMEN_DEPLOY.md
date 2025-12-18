# 🚀 Resumen Rápido: Publicar en GitHub

## ¿Qué necesitas hacer?

Ya tienes GitHub Pages configurado con la rama `gh-pages`. Solo necesitas actualizar tu sitio con los últimos cambios.

---

## Opción Más Fácil: Ejecutar el Script Automatizado

```bash
./deploy-to-github-pages.sh
```

**Eso es todo.** El script hace todo automáticamente:

- ✅ Guarda tus cambios
- ✅ Los sube a GitHub
- ✅ Construye el proyecto
- ✅ Despliega a GitHub Pages

---

## Si el Script da Error: Proceso Manual

### 1. Subir cambios a GitHub (rama principal)

```bash
git add .
git commit -m "Actualizar estilos de componentes"
git push origin main
```

### 2. Construir y desplegar a GitHub Pages

```bash
# Construir
ng build --configuration production --base-href "/adelanto-ingresos-web/"

# Ir al directorio de build CORRECTO (nota: hay dos carpetas "browser")
cd dist/adelanto_ingresos_web/browser/browser

# Desplegar
git init
git add -A
git commit -m "Deploy"
git push -f https://github.com/EdwinPurizacaMejia/adelanto-ingresos-web.git main:gh-pages

# Volver al directorio raíz
cd ../../../..
```

---

## Tu Sitio Publicado

🌐 **https://edwinpurizacamejia.github.io/adelanto-ingresos-web/**

⏱️ Los cambios pueden tardar 1-5 minutos en aparecer.

---

## ¿Problemas?

### Error de autenticación

Usa tu **Personal Access Token** en lugar de contraseña:

1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Copia el token y úsalo como contraseña

### El sitio no se actualiza

- Espera 5 minutos
- Limpia caché del navegador (Ctrl + Shift + R)
- Verifica en GitHub: Settings → Pages que la rama sea `gh-pages`

---

## Comandos Rápidos de Git

```bash
# Ver qué cambió
git status

# Ver el historial
git log --oneline

# Ver diferencias
git diff
```
