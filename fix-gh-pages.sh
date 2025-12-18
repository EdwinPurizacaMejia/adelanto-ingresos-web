#!/bin/bash

echo "🔄 Corrigiendo estructura para GitHub Pages..."

# 1. Hacer build
echo "📦 Construyendo aplicación..."
ng build --configuration production --base-href /adelanto-ingresos-web/

# 2. Crear carpeta temporal con estructura correcta
echo "📁 Reorganizando archivos..."
rm -rf dist/gh-pages-fixed 2>/dev/null
mkdir -p dist/gh-pages-fixed

# 3. Copiar todo de browser a la raíz
cp -r dist/adelanto_ingresos_web/browser/* dist/gh-pages-fixed/

# 4. Asegurar archivos necesarios
cd dist/gh-pages-fixed
touch .nojekyll

# 5. Crear 404.html actualizado
cat > 404.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <script>
        sessionStorage.redirect = location.pathname;
    </script>
    <meta http-equiv="refresh" content="0;URL='/adelanto-ingresos-web/'">
</head>
<body>
    Redirecting...
</body>
</html>
EOF

# 6. Subir a GitHub
echo "⬆️  Subiendo a GitHub Pages..."
git init
git checkout -b gh-pages
git add -A
git commit -m "Fix: Move files to root - $(date '+%Y-%m-%d %H:%M:%S')"
git remote add origin https://github.com/edwinpurizacamejia/adelanto-ingresos-web.git
git push -f origin gh-pages

echo ""
echo "✅ ¡Corrección completada!"
echo ""
echo "🔧 Ahora configura GitHub Pages:"
echo "   1. Ve a Settings → Pages"
echo "   2. En 'Folder', selecciona: / (root)"
echo "   3. Save"
echo ""
echo "🌐 Tu sitio: https://edwinpurizacamejia.github.io/adelanto-ingresos-web/"