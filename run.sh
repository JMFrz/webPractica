#!/bin/bash
# Script para ejecutar TextME (versión Bash)

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}    TextME - Setup y Ejecución${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Paso 1: Verificar Node.js
echo -e "${GREEN}[1/5] Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}\n"

# Paso 2: Verificar MongoDB
echo -e "${GREEN}[2/5] Verificando MongoDB...${NC}"
if ! command -v mongod &> /dev/null; then
    echo -e "${RED}❌ MongoDB no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ MongoDB instalado${NC}\n"

# Paso 3: Instalar dependencias
echo -e "${GREEN}[3/5] Instalando dependencias...${NC}"
if [ ! -d "node_modules" ]; then
    npm install > /dev/null 2>&1
    echo -e "${GREEN}✅ Dependencias instaladas${NC}"
else
    echo -e "${GREEN}✅ Dependencias ya instaladas${NC}"
fi
echo ""

# Paso 4: Cargar datos de ejemplo
echo -e "${GREEN}[4/5] ¿Cargar datos de ejemplo? (s/n)${NC}"
read -r response
if [[ "$response" == "s" || "$response" == "S" ]]; then
    echo -e "${GREEN}Cargando datos...${NC}"
    node seedDatabase.js
    echo -e "${GREEN}✅ Datos cargados${NC}"
else
    echo -e "${GREEN}⏭️  Saltando carga de datos${NC}"
fi
echo ""

# Paso 5: Iniciar servidor
echo -e "${GREEN}[5/5] Iniciando servidor...${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ TextME ejecutándose en:${NC}"
echo -e "${GREEN}   http://localhost:5000${NC}"
echo -e "${BLUE}========================================${NC}\n"

npm start
