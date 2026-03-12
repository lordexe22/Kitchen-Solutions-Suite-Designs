# middlewares

## Naturaleza

Los middlewares son responsables de ejecutar la lógica completa asociada a un endpoint, desde la recepción de datos hasta la entrega de la respuesta HTTP. Su propósito es orquestar la operación, delegando la lógica de negocio a servicios y asegurando una separación clara de responsabilidades.

---

## Responsabilidad de un Middleware

Un middleware debe encargarse de:
- Procesar datos del request (params, query, body).
- Ejecutar servicios necesarios.
- Interactuar indirectamente con la base de datos (a través de servicios).
- Aplicar validaciones necesarias.
- Manejar errores de ejecución.
- Devolver la respuesta HTTP al cliente.

El middleware comienza la operación y la termina.

---

## Flujo Típico de Ejecución

1. Leer datos del request.
2. Ejecutar servicios necesarios.
3. Procesar la respuesta de los servicios.
4. Manejar errores si existen.
5. Retornar la respuesta HTTP.

---

## Respuestas HTTP

El middleware es responsable de enviar la respuesta al cliente utilizando:

```typescript
res.status(...).json(...);
```

### Estructura de Respuesta Recomendada

#### Respuesta Exitosa

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

- **success**: Indica éxito.
- **data**: Payload principal.
- **meta**: Metadata opcional (paginación, conteos, etc.).

#### Respuesta de Error

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": null
  }
}
```

- **code**: Identificador estable del error.
- **message**: Mensaje legible.
- **details**: Información adicional (opcional).

---

## Firma Estándar del Middleware

Siempre que sea posible, se debe utilizar la firma estándar de Express:

```typescript
(req: Request, res: Response, next: NextFunction)
```

- Los middlewares suelen ser `async`, aunque depende del caso.
- Se recomienda mantener `next` para compatibilidad con Express.

---

## Organización de la Carpeta

Los middlewares se organizan por dominio o recurso.

Ejemplo:

```
middlewares/
   company/
   user/
   auth/
```

Cada carpeta puede contener varios middlewares relacionados.

---

## Convención de Nombres

### Nombre del Middleware

Los middlewares deben seguir esta convención:

```
{action}{Resource}Middleware
```

Ejemplos:
- `getCompanyMiddleware`
- `createCompanyMiddleware`
- `deleteCompanyMiddleware`
- `updateCompanyMiddleware`

### Nombre del Archivo

El archivo debe coincidir con el nombre del middleware:

```
getCompany.middleware.ts
createCompany.middleware.ts
deleteCompany.middleware.ts
```

Esto facilita la navegación del proyecto.

---

## Relación entre Rutas y Middlewares

Idealmente, cada endpoint debe resolverse con un solo middleware.

Ejemplo en rutas:

```typescript
companyRouter.get('/', getCompanyMiddleware);
```

Sin embargo, pueden existir middlewares reutilizables para tareas comunes, como:
- Verificación de JWT.
- Verificación de permisos.
- Validaciones compartidas.

---

## Estructura Interna del Archivo

Los archivos de middleware deben usar bloques colapsables.

### Tipos de Bloques Permitidos

- **#section**: Para secciones generales.
- **#middleware**: Para definir un middleware.
- **#step**: Para pasos internos dentro del middleware.

### Ejemplo de Estructura

```typescript
// #section Imports
import { Response } from 'express';
// #end-section

// #section Middleware

// #middleware deleteBranchSchedule
/**
 * Middleware: deleteBranchSchedule
 *
 * Elimina un horario (hard delete).
 * Requiere que verifyBranchOwnership se ejecute antes.
 *
 * @param {AuthenticatedRequest} req - Request con usuario autenticado
 * @param {Response} res - Response de Express
 */
export const deleteBranchSchedule = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { scheduleId } = req.params;

    const result = await deleteScheduleService(scheduleId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
// #end-middleware

// #end-section
```

---

## Uso de Pasos (#step)

Cuando el middleware contiene varias operaciones, se pueden separar en pasos para mejorar la legibilidad.

Ejemplo:

```typescript
// #step Extract request data
const { scheduleId } = req.params;
// #end-step

// #step Execute service
const result = await deleteScheduleService(scheduleId);
// #end-step

// #step Return response
res.status(200).json({
  success: true,
  data: result
});
// #end-step
```

---

## Resumen

Cada middleware debe cumplir estas reglas:
- Orquestar la operación.
- Delegar la lógica de negocio a servicios.
- Manejar errores con bloques `try/catch`.
- Utilizar la estructura recomendada de respuestas.
- Seguir la convención de nombres y organización.

Este estándar garantiza middlewares mantenibles, navegables y consistentes.