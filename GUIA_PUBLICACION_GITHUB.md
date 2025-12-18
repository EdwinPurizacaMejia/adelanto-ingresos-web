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

## Publicar en GitHub Pages (Opcional)

Si deseas que tu aplicación esté disponible públicamente en GitHub Pages:

### 1. Instalar angular-cli-ghpages (si no está instalado)

```bash
npm install -g angular-cli-ghpages
```

### 2. Construir el proyecto para producción

```bash
# Construir con la base href correcta para GitHub Pages
ng build --configuration production --base-href "/adelanto-ingresos-web/"
```

### 3. Publicar en GitHub Pages

```bash
# Usando angular-cli-ghpages
npx angular-cli-ghpages --dir=dist/adelanto_ingresos_web/browser
```

O manualmente:

```bash
# Crear/actualizar rama gh-pages
git checkout -b gh-pages
git add dist/adelanto_ingresos_web/browser -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist/adelanto_ingresos_web/browser origin gh-pages
```

### 4. Activar GitHub Pages en el repositorio

1. Ve a tu repositorio en GitHub
2. Click en **Settings**
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona la rama `gh-pages`
5. Click en **Save**

Tu aplicación estará disponible en:
`https://edwinpurizacamejia.github.io/adelanto-ingresos-web/`

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
