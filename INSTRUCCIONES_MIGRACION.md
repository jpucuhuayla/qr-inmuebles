# Instrucciones para aplicar los cambios

## 1. Ejecutar la migración de base de datos

Cuando la base de datos PostgreSQL esté disponible, ejecuta el siguiente comando para crear la migración y aplicar los cambios al esquema:

```bash
cd packages/api
npx prisma migrate dev --name add_property_display_fields
```

Este comando creará una nueva migración que agrega los siguientes campos a la tabla `Property`:
- `price_sol` (Decimal, opcional) - Precio en soles
- `description` (String, opcional) - Descripción del inmueble
- `common_areas` (String, opcional) - Áreas comunes
- `main_image_key` (String, opcional) - Clave de la imagen principal en S3

## 2. Reiniciar los servicios

Después de aplicar la migración, reinicia los servicios:

```bash
# En el directorio packages/api
npm run dev

# En el directorio packages/web (en otra terminal)
npm run dev
```

## 3. Cambios implementados

### Base de datos
- ✅ Agregados 4 nuevos campos al modelo Property
- ✅ El campo `price_usd` ya existía, ahora se complementa con `price_sol`
- ✅ El campo `address` ya existía
- ✅ Los campos `area_m2`, `bedrooms`, `bathrooms`, `parking_spaces` ya existían

### Backend (API)
- ✅ El servicio de propiedades ahora incluye la imagen principal en el listado
- ✅ Si no hay `main_image_key` configurada, usa la primera imagen subida

### Frontend (Listado público)
- ✅ Nuevo diseño de dos columnas:
  - **Izquierda**: Información del inmueble (fondo blanco, fuente Arial)
  - **Derecha**: Imagen principal
- ✅ **Campo 1**: Título del aviso
- ✅ **Campo 2**: Precio en soles y/o dólares (tamaño de letra doble)
- ✅ **Campo 3**: Dirección
- ✅ **Campo 4**: Descripción + detalles (dormitorios, área)
- ✅ **Campo 5**: Áreas comunes
- ✅ **Campo 6**: Botón verde "Clic aquí para más información"

### Frontend (Administración)
- ✅ Formulario de creación actualizado con todos los campos nuevos
- ✅ Formulario de edición con sección dedicada para modificar información
- ✅ Funcionalidad para seleccionar imagen principal (aparece con borde verde y estrella)
- ✅ Los campos opcionales están claramente marcados

## 4. Uso para el administrador

### Crear un nuevo inmueble:
1. Ir a `/admin/inmuebles/new`
2. Llenar los campos requeridos (título, slug, tipo, distrito)
3. Llenar los campos opcionales según sea necesario
4. Hacer clic en "Crear Inmueble"
5. Luego podrás subir imágenes y seleccionar la imagen principal

### Editar un inmueble existente:
1. Ir a `/admin/inmuebles/[id]`
2. Hacer clic en "Editar" en la sección de información
3. Modificar los campos deseados
4. Hacer clic en "Guardar Cambios"

### Seleccionar imagen principal:
1. En la sección de imágenes, pasar el cursor sobre la imagen deseada
2. Hacer clic en el botón verde "Imagen principal"
3. La imagen seleccionada aparecerá con un borde verde y una estrella (★)
4. Esta será la imagen que se muestre en el listado público

## 5. Formato de imagen recomendado

Para una mejor visualización en el diseño de dos columnas:
- **Formato**: JPG o PNG
- **Proporción recomendada**: 4:3 o 16:9 (horizontal)
- **Resolución mínima**: 800x600 px
- **Tamaño máximo**: Según lo configurado en tu bucket S3

Las imágenes se ajustarán automáticamente usando `object-cover` para mantener la proporción sin distorsión.
