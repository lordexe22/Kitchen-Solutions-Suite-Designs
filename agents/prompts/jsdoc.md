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
 * @context (obligatorio)
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

## function / service / hook / event

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