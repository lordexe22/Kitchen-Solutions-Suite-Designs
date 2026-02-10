# Cloudinary Module

Módulo wrapper sobre Cloudinary SDK v2 para gestión integral de imágenes en la nube.

## Descripción

Este módulo proporciona una interfaz robusta y tipada para todas las operaciones de gestión de imágenes en Cloudinary, incluyendo creación, actualización, eliminación, organización y listado. Implementa validación exhaustiva, manejo de errores específico y normalización consistente de respuestas.

## Principios de Diseño

- **Fuente de verdad por operación**: `getImage`, `renameImage` y `moveImage` se validan contra `api.resource`
- **Validación consistente**: Inputs críticos se validan antes de llamar a la API
- **Errores tipados específicos**: Cada operación tiene clases de error dedicadas
- **Normalización consistente**: Las respuestas se normalizan a interfaces predecibles
- **Metadata consistente**: `getImage` y `listImages` siempre retornan `{}` si no hay metadata

## Arquitectura

```
cloudinary/
├── cloudinary.ts              # Funciones principales del módulo
├── cloudinary.config.ts       # Configuración y cliente de Cloudinary
├── cloudinary.types.ts        # Definiciones de tipos TypeScript
├── cloudinary.utils.ts        # Utilidades y helpers internos
├── cloudinary.errors.ts       # Clases de error específicas
├── docs/                      # Documentación
│   └── plantuml-test.puml      # Diagrama PlantUML (en progreso)
└── test/                      # Tests del módulo
    ├── create-image.test.ts
    ├── delete-image.test.ts
    ├── replace-image.test.ts
    ├── rename-image.test.ts
    ├── move-image.test.ts
    ├── change-image-prefix.test.ts
    ├── get-image.test.ts
    └── list-images.test.ts
```

## Funcionalidades

### 1. createImage
Sube una imagen a Cloudinary desde múltiples fuentes.

**Entrada:**
- `image`: ImageSource (URL, archivo local o buffer)
- `options`: CreateImageOptions (nombre, carpeta, prefijo, overwrite)
- `metadata`: ImageMetadata opcional

**Salida:** CreateImageResponse

**Errores:** ValidationError, UploadError

**Características:**
- Genera `public_id` automáticamente con folder/prefix/name
- Si hay prefix, se separa con `--`
- Normaliza folder/name/prefix a minúsculas y elimina caracteres inválidos
- Guarda metadata como context en Cloudinary
- Guarda `name`, `folder` y `prefix` en metadata
- Soporta overwrite opcional

---

### 2. deleteImage
Elimina una imagen por su `public_id`.

**Entrada:** `publicId` (string)

**Salida:** DeleteImageResponse

**Errores:** ValidationError, DeleteError

**Características:**
- Valida formato de publicId
- Maneja recursos inexistentes correctamente

---

### 3. replaceImage
Reemplaza el contenido de una imagen existente manteniendo el mismo `public_id`.

**Entrada:** ReplaceImageParams
- `publicId`: ID de la imagen a reemplazar
- `source`: Nueva fuente (URL, archivo o buffer)
- `metadata`: Metadata opcional a actualizar
- `overwrite`: true por defecto

**Salida:** ReplaceImageResponse

**Errores:** ValidationError, ReplaceImageError

**Características:**
- Mantiene mismo public_id
- Actualiza metadata opcionalmente
- Normaliza respuesta del upload
- Si `metadata` no se envia, preserva la metadata existente del recurso
- Si `metadata` es `{}`, limpia la metadata previa
- Preserva `name`, `folder` y `prefix` en metadata

---

### 4. renameImage
Renombra una imagen manteniendo la carpeta.

**Entrada:** RenameImageParams
- `publicId`: ID actual de la imagen
- `newName`: Nuevo nombre (solo el nombre, sin carpeta)

**Salida:** GetImageResult

**Errores:** ValidationError, NotFoundError, RenameImageError

**Características:**
- Valida que newName sea solo nombre (sin carpeta)
- Extrae carpeta del publicId original
- Retorna api.resource (no rename response)
- Preserva metadata existente

### 5. moveImage
Mueve una imagen a otra carpeta manteniendo el nombre.

**Entrada:** MoveImageParams
- `publicId`: ID actual de la imagen
- `targetFolder`: Carpeta de destino

**Salida:** GetImageResult

**Errores:** ValidationError, NotFoundError, MoveImageError

**Características:**
- Valida formato de targetFolder
- Extrae nombre del publicId original
- Construye nuevo publicId como targetFolder/nombre
- Retorna api.resource (no rename response)

### 6. changeImagePrefix
Manipula el prefijo de una imagen con tres modos de operación.

**Entrada:** ChangeImagePrefixParams
- `publicId`: ID actual
- `prefix`: Prefijo a aplicar
- `mode`: 'replace' | 'append' | 'prepend'

**Salida:** GetImageResult

**Errores:** ValidationError, NotFoundError, RenameImageError

**Modos:**
- `replace`: Reemplaza prefijo existente por uno nuevo
- `append`: Agrega prefijo al final del existente (con `--`)
- `prepend`: Agrega prefijo al inicio del existente (con `--`)

**Características:**
- Valida redundancia (no agregar prefijo que ya existe)
- Maneja casos sin prefijo actual
- Convención de prefijo con separador `--`
- Obtiene el prefijo desde metadata (no hace parsing del publicId)
- Recalcula el publicId usando `folder/prefix--name`
- Normaliza respuesta de Cloudinary

### 7. getImage
Obtiene datos completos de una imagen por su `public_id`.

**Entrada:** `publicId` (string)

**Salida:** GetImageResult
- publicId, url, secureUrl, width, height, format, bytes, metadata, raw

**Errores:** ValidationError, NotFoundError, FetchImageError

**Características:**
- Normaliza response de api.resource
- Extrae metadata de context.custom
- Metadata siempre es objeto {} si no existe
- Incluye response raw de Cloudinary

### 8. listImages
Lista imágenes en un folder con paginación.

**Entrada:** ListImagesParams
- `folder`: Carpeta a listar (sin trailing slash)
- `recursive`: boolean opcional (default: false)
- `limit`: número opcional (default: 20, max: 100)
- `cursor`: string opaco opcional para paginación

**Salida:** ListImagesResult
- `items`: GetImageResult[]
- `nextCursor`: string opcional

**Errores:** ValidationError, FetchImageError

**Características:**
- Paginación con cursor opaco
- Modo recursivo para incluir subdirectorios
- Filtra recursos incompletos (sin campos obligatorios)
- Filtra non-images (resource_type !== 'image')
- 404 devuelve array vacío (no error)
- Preserva orden de Cloudinary
- Respeta limit incluso si Cloudinary devuelve más

---

## Tipos Principales

### ImageSource
```typescript
type ImageSource =
  | { type: 'url'; url: string }
  | { type: 'file'; filePath: string }
  | { type: 'buffer'; buffer: Buffer };
```

### CreateImageOptions
```typescript
interface CreateImageOptions {
  name: string;
  folder: string;
  prefix?: string;
  overwrite?: boolean;
}
```

### GetImageResult
```typescript
interface GetImageResult {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  metadata: Record<string, any>;
  raw: any;
}
```

### ListImagesParams
```typescript
interface ListImagesParams {
  folder: string;
  recursive?: boolean;
  limit?: number;
  cursor?: string;
}
```

### ListImagesResult
```typescript
interface ListImagesResult {
  items: GetImageResult[];
  nextCursor?: string;
}
```

## Errores

Todas las clases de error extienden de la clase base apropiada y tienen mensaje descriptivo:

- **ValidationError**: Input inválido (formato, valores fuera de rango)
- **ConfigurationError**: Cliente de Cloudinary mal configurado
- **UploadError**: Fallo en upload de imagen
- **DeleteError**: Fallo en eliminación
- **NotFoundError**: Recurso no existe (404)
- **ReplaceImageError**: Fallo en reemplazo de imagen
- **RenameImageError**: Fallo en rename (incluye changeImagePrefix)
- **MoveImageError**: Fallo en mover imagen a otra carpeta
- **FetchImageError**: Fallo en obtener/listar imágenes

## Convenciones de publicId

- `createImage` normaliza `folder`, `name` y `prefix`.
- Para operaciones con `publicId` existente, el módulo usa `name`, `folder` y `prefix` guardados en metadata.
- Formato final: `directorios/prefix--name` (prefix opcional).

## Uso

### Ejemplo: Crear Imagen

```typescript
import { createImage } from './cloudinary';

const result = await createImage(
  { type: 'url', url: 'https://example.com/image.jpg' },
  { name: 'profile', folder: 'users', prefix: 'avatar' },
  { source: 'upload', userId: '123' }
);

// result.publicId = 'users/avatar--profile'
// result.metadata = { source: 'upload', userId: '123' }
```

### Ejemplo: Listar Imágenes con Paginación

```typescript
import { listImages } from './cloudinary';

// Primera página
let result = await listImages({
  folder: 'products',
  recursive: true,
  limit: 50
});

console.log(`Found ${result.items.length} images`);

// Siguiente página
if (result.nextCursor) {
  result = await listImages({
    folder: 'products',
    recursive: true,
    limit: 50,
    cursor: result.nextCursor
  });
}
```

### Ejemplo: Cambiar Prefijo

```typescript
import { changeImagePrefix } from './cloudinary';

// Replace: user--admin-profile → company--admin-profile
await changeImagePrefix({
  publicId: 'users/user--admin-profile',
  prefix: 'company',
  mode: 'replace'
});

// Append: admin-profile → admin-profile--verified
await changeImagePrefix({
  publicId: 'users/admin-profile',
  prefix: 'verified',
  mode: 'append'
});

// Prepend: admin-profile → special--admin-profile
await changeImagePrefix({
  publicId: 'users/admin-profile',
  prefix: 'special',
  mode: 'prepend'
});
```

## Configuración

El módulo requiere credenciales de Cloudinary configuradas:

```typescript
// cloudinary.config.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
```

## Diagrama de Funcionalidades

Ver [plantuml-test.puml](./docs/plantuml-test.puml) para diagrama PlantUML (en progreso).

## Contribución

Al agregar nuevas funcionalidades:
1. Seguir principios de diseño establecidos
2. Crear clase de error específica si es necesario
3. Normalizar respuestas consistentemente
4. Escribir tests exhaustivos (contract testing)
5. Documentar en README

## Licencia

[Especificar licencia del proyecto]
