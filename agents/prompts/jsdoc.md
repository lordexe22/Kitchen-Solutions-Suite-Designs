# Reglas para documentar JSDOC

A lo largo de este documento se van a establecer las reglas de documentación de los JSDoc para las diferentes etiquetas definidas en etiquetas.md. La idea de este documento es dar un estándar de documentación el cual respetar en todos los casos a lo largo del proyecto.

# Reglas globales de la documentación

## Formato de bloques colapsables

No deben existir líneas vacías entre bloques colapsables consecutivos del mismo nivel. Esto aplica a **todas las etiquetas** del sistema (`v-field`, `f-field`, `function`, `type`, `interface`, `step`, etc.). Cuando dos o más bloques de cualquier tipo aparecen seguidos al mismo nivel, deben estar uno inmediatamente a continuación del otro, sin líneas en blanco de separación.

Las líneas vacías **sí están permitidas** entre bloques de nivel superior (entre interfaces, tipos, funciones exportadas, etc.).

---

Esta sección define el **significado y uso general de cada tag de JSDoc utilizado en el proyecto**.  
Las reglas aquí definidas explican **qué representa cada tag y cómo debe utilizarse cuando aparece**.

La obligatoriedad de cada tag **no se define aquí**, sino en las secciones específicas de cada etiqueta (`type`, `interface`, `function`, etc.).

---

### @description

Define **qué representa el elemento documentado**.

**Reglas:**
- Debe ser breve (máximo 2 líneas).
- Debe utilizar lenguaje semántico.
- No debe describir tipos ni detalles de implementación.
- Su objetivo es explicar **qué es el elemento**, no cómo funciona internamente.

---

### @purpose

Explica **por qué existe el elemento dentro del sistema**.

**Reglas:**
- Debe justificar la existencia del elemento.
- No debe repetir el contenido de `@description`.
- Debe enfocarse en la necesidad o problema que el elemento resuelve.

---

### @context

Indica **en qué parte del sistema se utiliza el elemento documentado**.

**Reglas:**
- Debe ubicar el elemento dentro de la arquitectura del sistema.
- Puede mencionar módulos, capas, servicios o flujos donde el elemento participa.
- No debe describir comportamiento ni lógica.

---

### @template

Documenta **parámetros genéricos**.

**Reglas:**
- Cada genérico se documenta en una línea independiente.
- Debe explicar qué representa el parámetro genérico dentro del modelo.

---

### @property

Describe **las propiedades relevantes de una estructura de datos**.

**Reglas:**
- No repetir el tipo del campo.
- Explicar el significado del dato dentro del modelo.
- Debe enfocarse en el rol del campo, no en su implementación.

---

### @remarks

Agrega **aclaraciones importantes que no encajan en otros campos**.

**Reglas:**
- Se utiliza para advertencias, decisiones de diseño o comportamientos implícitos.
- No debe duplicar información ya explicada en otros tags.

---

### @invariants

Define **reglas lógicas que siempre deben cumplirse**.

**Reglas:**
- Debe expresar condiciones que siempre deben mantenerse.
- Puede describir relaciones entre propiedades o restricciones del modelo.

---

### @example

Muestra **un uso realista del elemento documentado**.

**Reglas:**
- Debe ilustrar un uso representativo del modelo o elemento.
- Debe evitar pseudocódigo innecesario.
- Debe aportar claridad cuando el uso del elemento no es evidente.

---

### @see

Referencia **elementos relacionados dentro del sistema**.

**Reglas:**
- Debe utilizarse para vincular estructuras o elementos conceptualmente relacionados.
- Permite navegar entre piezas relacionadas de la documentación.

---

### @since

Indica **cuándo fue introducido el elemento**.

**Reglas:**
- Puede utilizarse con versiones del sistema o fechas.
- Debe permitir identificar el momento en que el elemento fue agregado.

---

### @author

Identifica **al autor responsable del elemento**.

**Reglas:**
- Se utiliza cuando el proyecto mantiene trazabilidad explícita de autoría.

# Reglas particulares 

## type / interface

### Modelo

```ts
/**
 * @description (obligatorio)
 *
 * @purpose (obligatorio)
 *
 * @context (condicional)
 *
 * @template (opcional)
 *
 * @remarks (opcional)
 *
 * @invariants (opcional)
 *
 * @example (opcional)
 *
 * @see (opcional)
 *
 * @since (obligatorio)
 *
 * @author (obligatorio)
 */
```

---

### Reglas específicas

- Cada propiedad debe documentarse inline directamente sobre el campo.

- La documentación inline debe explicar el significado del dato dentro del modelo, no repetir el tipo.

- `@context` es obligatorio cuando el tipo está ligado a un dominio o flujo específico del sistema. Se omite cuando el tipo es genérico o reutilizable sin contexto acotado (ej: `ApiResponse<T>`, `PaginationParams`).

---

### Ejemplo

```ts
/**
 * @description
 * Representa un usuario autenticado dentro del sistema.
 *
 * @purpose
 * Centralizar la información mínima necesaria para identificar al usuario en servicios y lógica de negocio.
 *
 * @context
 * Utilizado por el sistema de autenticación y por servicios que requieren conocer la identidad del usuario actual.
 *
 * @since 1.0.0
 * 
 * @author Walter Ezequiel Puig
 */
export interface AuthUser {
  /** identificador único del usuario */
  id: string
  /** correo utilizado para autenticación */
  email: string
  /** rol asignado dentro del sistema */
  role: 'admin' | 'user'
}
```




## v-field / f-field

### Modelo
```ts
// #v-field nombreCampo - descripción breve del campo
/** descripción del significado del campo */
campo: Tipo
// #end-v-field
```

> El wrapper `// #v-field` / `// #f-field` pertenece al sistema de etiquetas colapsables definido en `etiquetas.md`.  
> Este documento documenta exclusivamente el JSDoc que va dentro del wrapper, no el wrapper en sí.  
> **Ambos son obligatorios**: el wrapper colapsable y el comentario JSDoc inline.

### Reglas específicas
- El JSDoc del campo debe ser breve y debe consistir en una única descripción corta.
- El comentario debe explicar qué representa el valor, no el tipo.
- No debe repetir el nombre del campo o información expresada por el tipo.
- Debe describir el rol del campo dentro del modelo.
- Para campos de variable usar `// #v-field` / `// #end-v-field`.
- Para campos de función/método usar `// #f-field` / `// #end-f-field`.

### Ejemplo

```ts
// #v-field id - identificador único del usuario
/** identificador único del usuario */
id: string;
// #end-v-field

// #v-field email - correo utilizado para autenticación
/** correo utilizado para autenticación */
email: string;
// #end-v-field

// #f-field onClose - callback para cerrar el modal
/** callback invocado para cerrar el modal */
onClose: () => void;
// #end-f-field
```

## function / service / hook / event / middleware

### Modelo

```ts
/**
 * @description (obligatorio)
 * @purpose (obligatorio)
 * @context (obligatorio)
 * @param (obligatorio si la función recibe parámetros)
 * @returns (obligatorio si la función retorna un valor)
 * @throws (obligatorio de la función lanza excepciones)
 * @remarks (opcional)
 * @example (opcional)
 * @see (opcional)
 * @since (obligatorio)
 * @author (obligatorio)
 */
```

### Reglas específicas
- `@param` se define **una línea por parámetro de primer nivel**.  
  No se documentan propiedades internas de objetos (eso se resuelve con documentación inline en el tipo).
- `@param` debe describir **el rol del dato dentro de la función**, no su tipo.
- Si la función recibe un único objeto como parámetro, se documenta **solo el objeto**, no su desestructuración interna.
- `@returns` debe describir **qué representa el valor retornado**, no el tipo.
- `@returns` puede omitirse únicamente cuando la función no retorna nada (`void`).
- `@throws` se usa solo si la función puede fallar de forma explícita y relevante para el consumidor.
- `@remarks` se usa para aclaraciones que afectan el uso o comportamiento observable de la función.
- `@example` se incluye solo cuando el uso no es evidente o hay ambigüedad.
- No se documenta lógica interna, solo **comportamiento observable**.
- En middleware, `@remarks` debe describir explícitamente el comportamiento del flujo, es decir, si continúa la cadena (next), si puede terminar la respuesta o si puede interrumpir con error.

### Ejemplo
```ts
/**
 * @description Crea un nuevo usuario en el sistema.
 * @purpose Centralizar la lógica de creación de usuarios validando y persistiendo los datos.
 * @context Utilizado por handlers de autenticación y servicios de onboarding.
 * @param input datos necesarios para crear el usuario
 * @returns usuario creado con su identificador asignado
 * @throws Error si el email ya se encuentra registrado
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export async function createUser(input: CreateUserInput): Promise<User> {
  // implementación
}
```

## const / variable

### Modelo

```ts
/**
 * @description (obligatorio)
 *
 * @purpose (obligatorio)
 *
 * @context (obligatorio)
 *
 * @remarks (opcional)
 *
 * @example (opcional)
 *
 * @see (opcional)
 *
 * @since (obligatorio)
 *
 * @author (obligatorio)
 * 
 */
```

---

### Reglas específicas

- `@description` debe describir qué dato o valor representa la constante/variable, no su tipo.
- `@purpose` debe justificar por qué ese valor existe como constante independiente en lugar de estar inlined.
- `@context` debe indicar qué módulos, funciones o componentes la consumen.
- Si la constante es un objeto con campos, cada campo debe documentarse con `v-field` inline. El JSDoc del bloque no repite los campos.
- `@remarks` se usa para decisiones de diseño relevantes sobre el valor concreto (ej: por qué se eligió ese valor por defecto).
- `@param`, `@returns`, `@throws`, `@template`, `@invariants` y `@property` **no aplican** a constantes ni variables.

---

### Ejemplo

```ts
// #const DEFAULT_TIMEOUT - Tiempo máximo de espera global para todas las peticiones HTTP
/**
 * @description Valor en milisegundos utilizado como timeout por defecto en todas las peticiones HTTP.
 * @purpose Centralizar el timeout base para evitar valores dispersos a lo largo del código.
 * @context Consumido por HttpClient como fallback cuando una petición no define su propio timeout.
 * @since 1.0.0
 * @author my-dev-solutions
 */
export const DEFAULT_TIMEOUT = 10000;
// #end-const
```

## route

### Modelo

```ts
/**
 * @description (obligatorio)
 * @purpose (obligatorio)
 * @context (obligatorio)
 * @input (opcional)
 * @returns (obligatorio)
 * @remarks (opcional)
 * @since (obligatorio)
 * @author (obligatorio)
 */
```

---

### Reglas específicas

- `@input` sigue el formato fijo: `@input fuente: descripción`.
- Las fuentes válidas son: `params` | `body` | `query`. Una línea por fuente.
- `@input` no debe describir la estructura tipada de los datos. Solo debe indicar el rol del input dentro de la operación.
- Los headers HTTP no se documentan aquí; se documentan en el middleware que los consume.
- `@returns` documenta una línea por status HTTP posible, incluyendo tanto éxitos como errores.
- `@returns` describe el status HTTP y el significado semántico de la respuesta. No debe incluir la estructura tipada del body.
- `@throws` no aplica en `route`. Todos los resultados posibles se documentan en `@returns`.
- `@remarks` se usa para aclaraciones sobre el comportamiento de la ruta (auth requerida, permisos, etc.).

---

### Ejemplo

```ts
// #route POST /companies - Crear una nueva compañía
/**
 * @description Recibe los datos de una nueva compañía y la persiste en el sistema.
 * @purpose Exponer el endpoint de creación de compañías al cliente.
 * @context Utilizado por el módulo de administración de compañías.
 * @input body: datos necesarios para crear la compañía
 * @returns 201 compañía creada con su identificador asignado
 * @returns 422 datos inválidos en el body
 * @returns 409 conflicto por duplicidad de nombre
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
router.post('/companies', createCompanyHandler);
// #end-route
```

## component

### Modelo

```ts
/**
 * @description (obligatorio)
 * @purpose (condicional)
 * @context (condicional)
 * @remarks (opcional)
 * @since (obligatorio)
 * @author (obligatorio)
 */
```

---

### Reglas específicas

- `@param`, `@returns` y `@throws` no aplican. Las props se documentan en su interfaz con `v-field` / `f-field`.
- Si la información es evidente por el nombre del componente y sus props, no debe repetirse en la documentación.
- `@description` debe describir qué renderiza el componente y qué problema visual o de interacción resuelve. No debe ser una reformulación del nombre del componente.
- `@purpose` debe justificar por qué el componente existe como unidad independiente dentro del sistema. Es obligatorio cuando el componente abstrae lógica, evita duplicación o encapsula una responsabilidad clara. Se omite cuando es puramente presentacional y su razón de existir es evidente.
- `@context` debe ubicar el componente dentro de una estructura concreta (layout, feature o módulo). Es obligatorio cuando el componente está ligado a un flujo o feature y su ubicación afecta su comportamiento. Se omite cuando es reutilizable sin contexto específico (ej: `Button`, `Input`). Expresiones genéricas como "usado en varias partes" no son válidas.
- `@remarks` documenta únicamente: dependencias implícitas (providers requeridos), restricciones de uso y efectos no obvios. No debe contener descripciones de props, lógica interna ni comportamiento evidente desde el JSX.

---

### Ejemplo

Componente con contexto y propósito definidos:

```ts
// #component UserAvatarMenu - Menú desplegable de acciones del usuario autenticado
/**
 * @description Muestra el avatar del usuario y despliega un menú de acciones al interactuar.
 * @purpose Centralizar las acciones rápidas del usuario autenticado en un único punto de acceso del header.
 * @context Layout principal, dentro del header de navegación de la aplicación.
 * @remarks Requiere AuthProvider en el árbol padre. Consume el store de sesión activa.
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const UserAvatarMenu = ({ ... }: UserAvatarMenuProps) => { ... }
// #end-component
```

Componente presentacional reutilizable (`@purpose` y `@context` se omiten):

```ts
// #component Badge - Indicador visual de estado o categoría
/**
 * @description Renderiza una etiqueta con color y texto para representar un estado o categoría.
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const Badge = ({ ... }: BadgeProps) => { ... }
// #end-component
```

## class

### Modelo

```ts
/**
 * @description (obligatorio)
 * @purpose (obligatorio)
 * @context (condicional)
 * @template (opcional)
 * @invariants (opcional)
 * @remarks (opcional)
 * @since (obligatorio)
 * @author (obligatorio)
 */
```

---

### Reglas específicas

- `@param`, `@returns` y `@throws` no aplican a nivel de clase. El constructor solo se documenta con su propio bloque `#function constructor` si introduce lógica, validación o efectos relevantes. No se documenta si es trivial o implícito.
- Los campos y métodos de la clase se documentan con `v-field` / `f-field` inline.
- `@description` describe qué representa la clase dentro del sistema, no su estructura interna ni el comportamiento de sus métodos.
- `@context` es obligatorio solo cuando la clase forma parte de una capa, módulo o flujo específico del sistema. Se omite en clases utilitarias o de bajo nivel sin contexto arquitectónico relevante.
- `@template` debe describir el rol del parámetro genérico dentro del modelo de la clase, no su restricción tipada. Una línea por parámetro.
- `@invariants` documenta condiciones que deben mantenerse durante toda la vida del objeto, incluyendo tanto restricciones de estado interno como de uso externo (ej: "no llamar a `emit` antes de `init`").
- `@remarks` documenta consideraciones relevantes sobre la forma esperada de uso de la clase cuando aporten información no evidente en la declaración. Puede incluir restricciones o convenciones de diseño, por ejemplo: uso vía singleton, factory, extensión, resolución por DI o secuencia esperada de inicialización. No debe repetir información que TypeScript ya expresa en la sintaxis ni listar métodos o describir implementación interna.
- La documentación de la clase no debe duplicar comportamiento específico de métodos. La clase define el modelo y propósito general; los métodos definen el comportamiento concreto.
- Clases que solo contienen datos sin comportamiento significativo deben considerarse como `type` o `interface`. Si se mantienen como clase, `@purpose` debe justificar explícitamente su uso frente a una estructura de datos.

---

### Ejemplo

```ts
// #class EventEmitter - Emisor de eventos tipado para comunicación desacoplada entre módulos
/**
 * @description Gestiona la suscripción y emisión de eventos dentro de un contexto acotado.
 * @purpose Desacoplar la comunicación entre módulos sin dependencias directas entre ellos.
 * @context Utilizado por módulos del sistema que necesitan reaccionar a cambios de estado sin acoplarse al origen.
 * @template TEvents mapa de eventos disponibles y sus tipos de payload
 * @invariants Los listeners se invocan en el orden de suscripción. No debe llamarse a `emit` antes de que la instancia esté inicializada.
 * @remarks Diseñada para ser extendida. No usar como singleton en contextos con ciclos de vida distintos.
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export class EventEmitter<TEvents extends Record<string, unknown>> {
  // implementación
}
// #end-class
```