# routes

## Naturaleza

Los archivos de rutas son responsables de definir los endpoints HTTP del sistema y delegar la ejecución a middlewares específicos. Su propósito es mantener una separación clara de responsabilidades, asegurando que la lógica de negocio, validaciones complejas y acceso a la base de datos se manejen en otras capas del backend.

---

## Convenciones Generales

### Nombre del Archivo

Los archivos de rutas deben seguir el formato:

```
{recurso}.routes.ts
```

Ejemplos:
- `company.routes.ts`
- `user.routes.ts`
- `auth.routes.ts`

### Nombre del Router

El router debe declararse con el formato:

```
{recurso}Router
```

Ejemplo:

```typescript
export const companyRouter = Router();
```

### Convención de Endpoints

Los recursos se deben declarar en singular.

Ejemplos válidos:
- `GET    /company`
- `GET    /company/:id`
- `POST   /company`
- `PUT    /company/:id`
- `DELETE /company/:id`

No se deben usar nombres de acciones en el path como:
- `/getCompany`
- `/createCompany`
- `/deleteCompany`

El método HTTP define la acción.

---

## Estructura del Archivo

Todo archivo de rutas debe dividirse en tres secciones colapsables:

1. **#section Imports**: Importación de dependencias y middlewares.
2. **#section Create router**: Declaración del router.
3. **#section Routes**: Definición de los endpoints.

Ejemplo:

```typescript
// #section Imports
import { Router } from 'express';
import { getAllCompaniesMiddleware } from '../middlewares/company/getAllCompanies.middleware';
// #end-section

// #section Create router
export const companyRouter = Router();
// #end-section

// #section Routes

// rutas aquí

// #end-section
```

---

## Bloques de Rutas

Cada endpoint debe estar contenido dentro de un bloque colapsable `#route`.

### Formato Obligatorio

```typescript
// #route METHOD /path - Descripción breve

/**
 * @route METHOD /path
 * @description Breve descripción del endpoint
 *
 * @query
 * Parámetros de consulta (si aplica).
 *
 * @params
 * Parámetros de ruta (si aplica).
 *
 * @body
 * Cuerpo de la solicitud (si aplica).
 *
 * @response
 * Respuesta esperada.
 *
 * @error
 * Posibles errores.
 */

router.method('/path', middleware);

// #end-route
```

---

## Responsabilidades del Archivo

Un archivo de rutas solo debe:
- Declarar endpoints HTTP.
- Documentar los endpoints.
- Asociar endpoints con middlewares.

### Responsabilidades que NO pertenecen aquí

Las rutas no deben:
- Implementar lógica de negocio.
- Validar datos complejos.
- Interactuar con la base de datos.
- Transformar respuestas.
- Manejar errores complejos.
