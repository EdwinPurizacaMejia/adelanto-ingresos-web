# Guía para Publicar el Proyecto Angular en GitHub

## Repositorio

**URL**: https://github.com/EdwinPurizacaMejia/adelanto-ingresos-web.git

---

## Pasos para Publicar tu Proyecto

### 1. Verificar la conexión con el repositorio remoto

```bash
# Ver los repositorios remotos configurados
git remote -v

# Si no está configurado, agregar el remoto
git remote add origin https://github.com/EdwinPurizacaMejia/adelanto-ingresos-web.git
```

### 2. Verificar el estado de los archivos

```bash
# Ver qué archivos han cambiado
git status
```

### 3. Agregar todos los cambios al staging area

```bash
# Agregar todos los archivos modificados
git add .

# O agregar archivos específicos
git add src/app/retiros/politicas-historial/
git add src/app/retiros/carga-excel/
git add src/app/retiros/log/
```

### 4. Hacer commit de los cambios

```bash
# Crear un commit con un mensaje descriptivo
git commit -m "Unificar estilos de las páginas y corregir visualización de historial de políticas"
```

### 5. Subir los cambios a GitHub

```bash
# Primera vez (si la rama no existe en remoto)
git push -u origin main

# O si ya existe la rama
git push origin main

# Si tu rama principal se llama 'master' en lugar de 'main'
git push origin master
```

---

## Publicar en GitHub Pages

Ya tienes GitHub Pages configurado con la rama `gh-pages`. Aquí están las opciones para actualizar tu sitio:

### Opción 1: Usar el Script Automatizado (Recomendado)

He creado un script que hace todo el proceso automáticamente:

```bash
# Dar permisos de ejecución al script
chmod +x deploy-to-github-pages.sh

# Ejecutar el script
./deploy-to-github-pages.sh
```

El script hace lo siguiente:

1. ✅ Guarda todos los cambios en tu rama actual
2. ✅ Sube los cambios a GitHub
3. ✅ Construye el proyecto para producción
4. ✅ Despliega automáticamente a la rama gh-pages
5. ✅ Te muestra la URL donde estará disponible tu sitio

### Opción 2: Proceso Manual

Si prefieres hacerlo paso a paso:

#### 1. Construir el proyecto para producción

```bash
ng build --configuration production --base-href "/adelanto-ingresos-web/"
```

#### 2. Navegar al directorio de build correcto

```bash
# IMPORTANTE: Nota que hay dos carpetas "browser"
cd dist/adelanto_ingresos_web/browser/browser
```

#### 3. Inicializar git y hacer commit

```bash
git init
git add -A
git commit -m "Deploy to GitHub Pages"
```

#### 4. Hacer push a la rama gh-pages

```bash
git push -f https://github.com/EdwinPurizacaMejia/adelanto-ingresos-web.git HEAD:gh-pages
```

#### 5. Volver al directorio raíz

```bash
cd ../../..
```

### Tu sitio está disponible en:

🌐 **https://edwinpurizacamejia.github.io/adelanto-ingresos-web/**

**Nota**: Después de hacer el deploy, puede tomar entre 1-5 minutos para que los cambios se reflejen en el sitio publicado.

---

## Comandos Útiles

### Ver el historial de commits

```bash
git log --oneline
```

### Ver diferencias antes de hacer commit

```bash
git diff
```

### Deshacer cambios no commiteados

```bash
# Deshacer cambios en un archivo específico
git checkout -- nombre-archivo

# Deshacer todos los cambios
git reset --hard
```

### Crear una nueva rama

```bash
git checkout -b nombre-rama
```

### Cambiar entre ramas

```bash
git checkout main
git checkout nombre-rama
```

### Ver todas las ramas

```bash
git branch -a
```

---

## Configuración Inicial de Git (Si es necesario)

```bash
# Configurar tu nombre
git config --global user.name "Tu Nombre"

# Configurar tu email
git config --global user.email "tu-email@example.com"

# Ver la configuración actual
git config --list
```

---

## Archivo .gitignore

Asegúrate de tener un archivo `.gitignore` con el siguiente contenido para no subir archivos innecesarios:

```
# See http://help.github.com/ignore-files/ for more about ignoring files.

# Compiled output
/dist
/tmp
/out-tsc
/bazel-out

# Node
/node_modules
npm-debug.log
yarn-error.log

# IDEs and editors
.idea/
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.history/*

# Misc
/.angular/cache
.sass-cache/
/connect.lock
/coverage
/libpeerconnection.log
testem.log
/typings

# System files
.DS_Store
Thumbs.db
```

---

## Solución de Problemas Comunes

### Error: "fatal: refusing to merge unrelated histories"

```bash
git pull origin main --allow-unrelated-histories
```

### Error: "Authentication failed"

- Usa un Personal Access Token en lugar de tu contraseña
- Genera uno en: GitHub → Settings → Developer settings → Personal access tokens

### Error: "Updates were rejected because the remote contains work"

```bash
# Traer los cambios del remoto primero
git pull origin main --rebase

# Luego hacer push
git push origin main
```

---

## Buenas Prácticas

1. **Commits frecuentes**: Haz commits pequeños y frecuentes
2. **Mensajes descriptivos**: Usa mensajes de commit claros y descriptivos
3. **Revisar antes de commit**: Usa `git status` y `git diff` antes de hacer commit
4. **Ramas para features**: Crea ramas para nuevas funcionalidades
5. **Pull antes de Push**: Siempre haz `git pull` antes de `git push`
6. **No subir secretos**: No incluyas API keys, contraseñas o tokens en el código

---

## Resumen Rápido

```bash
# 1. Ver estado
git status

# 2. Agregar cambios
git add .

# 3. Hacer commit
git commit -m "Descripción de los cambios"

# 4. Subir a GitHub
git push origin main
```
