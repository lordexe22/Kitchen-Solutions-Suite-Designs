# Reglas para documentar JSDOC

A lo largo de este documento se van a establecer las reglas de documentación de los JSDoc para las diferentes etiquetas definidas en etiquetas.md. La idea de este documento es dar un estándar de documentación el cual respetar en todos los casos a lo largo del proyecto.

# Reglas globales de la documentación

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


