# hooks

## Propósito del Documento

El objetivo de este documento es definir las reglas arquitectónicas, estructurales y operativas de los hooks del sistema. Sirve como guía obligatoria para la creación de cualquier hook nuevo dentro del proyecto.

El documento se centra exclusivamente en:
- Naturaleza de los hooks.
- Su rol dentro de la arquitectura.
- Estructura de archivos.
- Dependencias permitidas.
- Reglas de implementación.
- Reglas de documentación.

---

## Naturaleza de los Hooks

Un hook es una unidad reutilizable de lógica reactiva basada en React Hooks. Su propósito es encapsular:
- Estado.
- Efectos.
- Sincronización con fuentes externas.
- Lógica de interacción.
- Orquestación de acciones del sistema.

**Conceptos clave:**
- Encapsulación de lógica.
- Reutilización.
- Composición.
- Aislamiento de comportamiento.

Los hooks permiten separar la lógica de comportamiento del resto de la aplicación.

---

## Ubicación de la Carpeta

La carpeta `hooks` se encuentra en:
```
src/hooks
```
Esta ubicación centraliza los hooks reutilizables del sistema.

---

## Alcance de la Carpeta

La carpeta `hooks` contiene hooks reutilizables a nivel de aplicación. Esto significa que:
- No pertenecen a una implementación específica.
- Encapsulan lógica reutilizable.
- Pueden ser utilizados en distintos contextos del sistema.

**Nota:** La carpeta no es un contenedor genérico para cualquier hook, sino para aquellos que representan lógica reutilizable.

---

## Convención de Nomenclatura

**Reglas obligatorias:**
- El nombre debe comenzar con `use`.
- Debe utilizar `camelCase`.

**Ejemplos correctos:**
- `useAuth`
- `usePermissions`
- `useProducts`
- `useDebounce`

**Ejemplos incorrectos:**
- `authHook`
- `use-auth`
- `use_permissions`

---

## Organización Interna de la Carpeta

La carpeta `hooks` no debe ser plana. Debe organizarse por dominio o área funcional del sistema.

**Ejemplo:**
```
src/hooks
   auth
   permissions
   products
   users
```
Cada dominio agrupa hooks relacionados, mejorando la navegación, mantenibilidad y descubrimiento de hooks existentes.

---

## Estructura de Cada Hook

Cada hook debe tener su propia carpeta.

**Ejemplo:**
```
hooks/
   auth/
      useAuth/
         useAuth.ts
         README.md
         tests/
```
Esto permite que el hook evolucione sin romper la estructura del proyecto.

**Archivo principal:**
El archivo principal debe llamarse igual que el hook.

**Ejemplo:**
- `useAuth.ts`
- `usePermissions.ts`
- `useProducts.ts`

---

## Encapsulación

**Reglas:**
- Los archivos dentro de la carpeta del hook deben considerarse internos.
- El punto de acceso del hook es el archivo principal.

Esto evita que otras partes del sistema dependan de detalles internos.

---

## Dependencias Permitidas

Los hooks pueden depender de:
- `store`
- `services`
- `utils`
- Librerías externas.
- APIs de React.

Los hooks suelen actuar como capa de coordinación entre estas dependencias.

---

## Uso del Store

Los hooks pueden acceder al `store` global del sistema. Esto es común para:
- Leer estado global.
- Ejecutar acciones.
- Sincronizar datos.

El acceso al `store` debe mantenerse encapsulado dentro del hook.

---

## Uso de Services

Los hooks pueden ejecutar `services`, pero deben hacerlo de forma explícita y controlada.

**Reglas:**
- Los `services` deben ejecutarse dentro de:
  - Una función expuesta por el hook.
  - Un efecto controlado.

**Ejemplo:**
```typescript
const createUser = async () => {
   await createUserService();
};
```
Esto evita efectos secundarios inesperados.

---

## Responsabilidad de los Hooks

Cada hook debe tener una responsabilidad clara y delimitada. Debe evitarse crear hooks que:
- Mezclen múltiples dominios.
- Contengan lógica excesiva.
- Gestionen demasiados estados distintos.

Un hook debe ser fácil de entender, reutilizar y testear.

---

## Documentación Obligatoria

Cada hook debe tener dos niveles de documentación:

1. **JSDoc:**
   - Propósito del hook.
   - Parámetros.
   - Valores retornados.
   - Comportamiento relevante.

2. **README.md:**
   - Objetivo del hook.
   - Cuándo debe utilizarse.
   - Dependencias relevantes.
   - Ejemplos de uso.

---

## Ejemplos de Uso

El `README.md` de cada hook debe incluir ejemplos claros para facilitar su comprensión y uso.

---

## Testing

Los hooks deben incluir pruebas cuando sea posible.

**Estructura recomendada:**
```
tests/
```

**Las pruebas deben validar:**
- Comportamiento del hook.
- Manejo de estado.
- Ejecución de efectos relevantes.

---

## Principios de Diseño

**Principios recomendados:**
- Responsabilidad única.
- Reutilización.
- Encapsulación.
- Predictibilidad.

---

## Mantenibilidad

Los hooks forman una capa importante de la arquitectura. Una mala organización en esta carpeta puede producir:
- Duplicación de lógica.
- Comportamiento difícil de rastrear.
- Acoplamiento innecesario.

Una buena organización permite:
- Reutilización consistente.
- Componentes más simples.
- Evolución controlada del sistema.