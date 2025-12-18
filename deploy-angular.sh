#!/bin/bash

echo "========================================"
echo "🚀 DEPLOY A GITHUB PAGES - ANGULAR 17"
echo "========================================"

# 1. Verificar que angular.json está correcto
echo "1️⃣  Verificando configuración..."
if [ ! -f "angular.json" ]; then
    echo "❌ No se encuentra angular.json"
    exit 1
fi

# 2. Instalar angular-cli-ghpages si no está
echo "2️⃣  Instalando dependencias..."
npm list angular-cli-ghpages || npm install --save-dev angular-cli-ghpages

# 3. Limpiar builds anteriores
echo "3️⃣  Limpiando builds anteriores..."
rm -rf dist/ 2>/dev/null
echo "✅ Builds anteriores eliminados"

# 4. Hacer build (sin --vendorChunk ni otros parámetros obsoletos)
echo "4️⃣  Construyendo aplicación Angular..."
echo "    Usando: ng build --configuration production"
ng build --configuration production

# Verificar si el build fue exitoso
if [ $? -ne 0 ]; then
    echo "❌ Error en el build de Angular"
    echo "   Intentando con build simple..."
    ng build
fi

# 5. Verificar que los archivos se generaron
echo "5️⃣  Verificando archivos generados..."
if [ ! -d "dist/adelanto_ingresos_web/browser" ]; then
    echo "⚠️  No se encontró browser/, buscando en otra ubicación..."
    find dist/ -name "index.html" | head -5
    echo "❌ No se encontraron archivos de build"
    exit 1
fi

# 6. Navegar a la carpeta de build
cd dist/adelanto_ingresos_web/browser

# 7. Crear archivos necesarios para GitHub Pages
echo "6️⃣  Creando archivos para GitHub Pages..."
touch .nojekyll

# Crear 404.html
cat > 404.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Redirecting to Angular App</title>
    <script>
        // Guardar la ruta original
        const redirect = sessionStorage.redirect;
        delete sessionStorage.redirect;
        if (redirect && redirect != location.href) {
            history.replaceState(null, null, redirect);
        }
    </script>
    <meta http-equiv="refresh" content="0;URL='/adelanto-ingresos-web/index.html'">
</head>
<body>
    <p>Redirigiendo a la aplicación Angular...</p>
</body>
</html>
EOF

# 8. Inicializar git y subir
echo "7️⃣  Preparando para subir a GitHub..."
git init
git checkout -b gh-pages
git add -A
git commit -m "Deploy Angular app - $(date '+%Y-%m-%d %H:%M:%S')"

echo "8️⃣  Subiendo a rama gh-pages..."
git remote add origin https://github.com/edwinpurizacamejia/adelanto-ingresos-web.git
git push -f origin gh-pages

echo ""
echo "✅ ¡Deploy completado!"
echo ""
echo "📋 SIGUE ESTOS PASOS:"
echo "1. Ve a: https://github.com/edwinpurizacamejia/adelanto-ingresos-web/settings/pages"
echo "2. En 'Build and deployment' → 'Source'"
echo "3. Selecciona: Branch: gh-pages, Folder: / (root)"
echo "4. Click en Save"
echo ""
echo "⏳ Espera 1-2 minutos..."
echo ""
echo "🌐 Tu sitio estará disponible en:"
echo "   https://edwinpurizacamejia.github.io/adelanto-ingresos-web/"
echo ""
echo "🔍 Para verificar:"
echo "   https://github.com/edwinpurizacamejia/adelanto-ingresos-web/tree/gh-pages"