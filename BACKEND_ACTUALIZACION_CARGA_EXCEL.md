# Actualización del Backend - Endpoint de Carga de Excel

## Problema Resuelto

El frontend ahora envía archivos Excel en formato **base64 dentro de un JSON** en lugar de `multipart/form-data`, evitando problemas con AWS API Gateway.

## Nuevo Formato de Request

### Headers

```
Content-Type: application/json
Authorization: Bearer {token}
```

### Body (JSON)

```json
{
  "filename": "retiros_disponibilidad.xlsx",
  "content": "<contenido-del-archivo-en-base64>",
  "content_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
}
```

## Actualización Requerida en el Backend

### Python (FastAPI) - Ejemplo de Implementación

```python
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import base64
from io import BytesIO
import pandas as pd

router = APIRouter()

class FileUpload(BaseModel):
    filename: str
    content: str  # base64 encoded
    content_type: str

@router.post("/retiros/disponibilidad/cargar")
async def cargar_disponibilidad(
    file_data: FileUpload,
    current_user = Depends(get_current_user)
):
    try:
        # Decodificar el contenido base64
        file_bytes = base64.b64decode(file_data.content)

        # Crear un objeto BytesIO para simular un archivo
        file_stream = BytesIO(file_bytes)

        # Leer el archivo Excel
        try:
            df = pd.read_excel(file_stream, engine='openpyxl')
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Error leyendo Excel: {str(e)}"
            )

        # Validar que el DataFrame no esté vacío
        if df.empty:
            raise HTTPException(
                status_code=400,
                detail="El archivo Excel está vacío"
            )

        # Aquí va tu lógica de procesamiento del Excel
        # Por ejemplo:
        # - Validar columnas requeridas
        # - Procesar los datos
        # - Guardar en base de datos

        return {
            "message": "Archivo procesado correctamente",
            "filename": file_data.filename,
            "rows_processed": len(df)
        }

    except base64.binascii.Error:
        raise HTTPException(
            status_code=400,
            detail="Error decodificando el archivo base64"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error procesando archivo: {str(e)}"
        )
```

### Cambios Necesarios

1. **Cambiar el parámetro de entrada** de `UploadFile` a `FileUpload` (modelo Pydantic)
2. **Decodificar base64** antes de procesar el archivo
3. **Usar BytesIO** para crear un stream de bytes que pandas pueda leer

### Migración del Código Existente

Si tu código actual es algo como:

```python
@router.post("/retiros/disponibilidad/cargar")
async def cargar_disponibilidad(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_excel(BytesIO(contents))
    # ... resto del código
```

Cámbialo a:

```python
@router.post("/retiros/disponibilidad/cargar")
async def cargar_disponibilidad(file_data: FileUpload):
    file_bytes = base64.b64decode(file_data.content)
    df = pd.read_excel(BytesIO(file_bytes))
    # ... resto del código (sin cambios)
```

## Ventajas de este Enfoque

1. ✅ **Compatible con API Gateway** - No requiere configuración especial de binary media types
2. ✅ **Sin problemas de CORS** - JSON es más fácil de manejar
3. ✅ **Funciona en GitHub Pages** - No depende de configuraciones del servidor
4. ✅ **Más fácil de debuggear** - Puedes ver el payload completo en los logs
5. ✅ **Consistente** - Mismo formato que otros endpoints JSON

## Testing

Puedes probar el nuevo endpoint con curl:

```bash
# Primero, convierte tu archivo a base64
BASE64_CONTENT=$(base64 -w 0 retiros_disponibilidad.xlsx)

# Luego haz el request
curl -X POST 'https://2hqwzhusml.execute-api.us-east-1.amazonaws.com/Prod/retiros/disponibilidad/cargar' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d "{
    \"filename\": \"retiros_disponibilidad.xlsx\",
    \"content\": \"$BASE64_CONTENT\",
    \"content_type\": \"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\"
  }"
```

## Dependencias

Asegúrate de tener instaladas:

```
pandas>=1.3.0
openpyxl>=3.0.0  # Para leer archivos .xlsx
```

## Notas Importantes

- El tamaño máximo del payload en API Gateway es **10 MB** (ya validado en el frontend)
- Base64 aumenta el tamaño del archivo en ~33%, por lo que un archivo de 7.5 MB será el máximo práctico
- El frontend ya valida el tamaño antes de enviar
