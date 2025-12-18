#!/bin/bash

echo "======================================"
echo "   Deploy a GitHub Pages"
echo "======================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Verificar que estamos en main/master
echo -e "${YELLOW}📋 Verificando rama actual...${NC}"
CURRENT_BRANCH=$(git branch --show-current)
echo "Rama actual: $CURRENT_BRANCH"
echo ""

# 2. Asegurarse de que todos los cambios estén guardados
echo -e "${YELLOW}💾 Guardando cambios en $CURRENT_BRANCH...${NC}"
git add .
git commit -m "Actualizar estilos y componentes - $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 3. Subir cambios a main/master
echo -e "${YELLOW}⬆️  Subiendo cambios a GitHub...${NC}"
git push origin $CURRENT_BRANCH
echo ""

# 4. Construir el proyecto para producción
echo -e "${YELLOW}🏗️  Construyendo proyecto para producción...${NC}"
ng build --configuration production

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al construir el proyecto${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Proyecto construido exitosamente${NC}"
echo ""

# 5. Navegar al directorio de build correcto
echo -e "${YELLOW}📂 Preparando archivos para deploy...${NC}"
cd dist/adelanto_ingresos_web/browser

# 6. Inicializar git en el directorio de build
git init
git add -A
git commit -m "Deploy to GitHub Pages - $(date '+%Y-%m-%d %H:%M:%S')"

# 7. Forzar push a la rama gh-pages
echo -e "${YELLOW}🚀 Desplegando a GitHub Pages...${NC}"
git push -f https://github.com/EdwinPurizacaMejia/adelanto-ingresos-web.git HEAD:gh-pages

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}======================================"
    echo -e "   ✅ Deploy Exitoso!"
    echo -e "======================================${NC}"
    echo ""
    echo -e "${GREEN}Tu sitio estará disponible en:${NC}"
    echo -e "${GREEN}https://edwinpurizacamejia.github.io/adelanto-ingresos-web/${NC}"
    echo ""
    echo -e "${YELLOW}Nota: Puede tomar unos minutos para que los cambios se reflejen${NC}"
else
    echo ""
    echo -e "${RED}❌ Error al hacer deploy${NC}"
fi

# 8. Volver al directorio raíz
cd ../../..

echo ""
echo -e "${GREEN}Proceso completado${NC}"
