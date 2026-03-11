# store

## Naturaleza

La carpeta `store` contiene los **stores globales** de la aplicación.  
Su propósito es mantener **estado global derivado del servidor** disponible para cualquier consumidor del cliente.

Un store **no es una fuente de verdad primaria**.  
La fuente de verdad siempre es el **servidor**.

Los stores funcionan como una **capa de caché en memoria** que refleja el estado más reciente obtenido desde el backend.

Cada store representa una **feature específica** y encapsula:

- El **estado global** de esa feature.
- Las **operaciones del dominio** relacionadas con ese estado.
- Los **métodos de hidratación** que actualizan el estado del store.

Las operaciones del store pueden comunicarse con el servidor para ejecutar acciones del dominio (crear, actualizar o eliminar entidades).  
Sin embargo, **las operaciones del dominio no modifican directamente el estado del store**.

La actualización del estado se realiza exclusivamente mediante **métodos de hidratación**, que reciben datos confirmados por el servidor.

---

## Flujo de Actualización del Estado

Las actualizaciones del estado del store siguen el siguiente flujo general:

1. Un evento ocurre en la interfaz de usuario.
2. La interfaz invoca un **servicio del cliente**.
3. El servicio ejecuta una **operación del dominio expuesta por el store**.
4. La operación del store se comunica con el servidor.
5. El servidor procesa la solicitud y devuelve una respuesta.
6. El servicio utiliza los datos devueltos para **hidratar el store**.

Este flujo garantiza que el estado del cliente siempre refleje **datos confirmados por el servidor**.

### Ejemplo de Flujo

Eliminar un local:

1. El usuario selecciona la opción de eliminar un local en la interfaz.
2. La interfaz invoca un servicio `removeLocal`.
3. El servicio ejecuta la operación `removeLocal` expuesta por el store.
4. La operación se comunica con el servidor para eliminar el registro.
5. El servidor procesa la operación y devuelve el nuevo estado.
6. El servicio utiliza `hydrateLocals()` para actualizar el store.

---

## Estructura General

La estructura de la carpeta `store` es la siguiente:

```
src/store/
├── _shared/                  # Código reutilizable entre múltiples features.
│   ├── _shared.types.ts      # Tipos comunes.
│   ├── _shared.validations.ts # Validaciones comunes.
│   ├── _shared.errors.ts     # Errores comunes.
├── <FeatureName>/            # Subcarpeta para cada feature.
│   ├── <FeatureName>.store.ts       # Definición del store.
│   ├── <FeatureName>.types.ts       # Tipos específicos de la feature.
│   ├── <FeatureName>.validations.ts # Validaciones específicas (opcional).
│   ├── <FeatureName>.errors.ts      # Errores específicos (opcional).
│   ├── <FeatureName>.test.ts        # Pruebas unitarias.
│   ├── index.ts                     # Punto de entrada de la feature.
│   ├── README.md                    # Documentación de la feature.
```

---

## Reglas Generales

1. **Independencia:**
   - Los stores no deben depender de otras features del sistema.
   - Pueden depender únicamente de:
     - utilidades compartidas (`_shared`)
     - clientes de infraestructura (por ejemplo, un cliente HTTP)
   - Las operaciones del store deben estar limitadas al dominio de su propia feature.

2. **Fuente de verdad:**
   - El servidor es la única fuente de verdad del sistema.
   - El estado del store debe reflejar únicamente datos confirmados por el servidor.

3. **Persistencia:**
   - La persistencia es opcional y debe implementarse dentro del store si es necesaria.

4. **Pruebas:**
   - Cada store debe incluir pruebas unitarias que cubran:
     - estado inicial
     - operaciones del dominio
     - métodos de hidratación
     - validaciones y errores posibles

5. **Documentación:**
   - Cada feature debe incluir un archivo `README.md` que explique su propósito, cómo usarla y qué exporta.

6. **Punto de entrada:**
   - Cada feature debe tener un archivo `index.ts` que sirva como único punto de entrada para consumir el store.

---

## Tipos de Acciones en un Store

Las acciones de un store se dividen en tres categorías principales.

### Operaciones del Dominio

Representan acciones del usuario sobre el sistema.

Estas operaciones pueden comunicarse con el servidor para ejecutar cambios en la base de datos, pero **no deben modificar directamente el estado del store**.

Ejemplos:

- `createLocal`
- `updateLocal`
- `removeLocal`
- `fetchLocals`

Estas operaciones devuelven los datos necesarios para que el servicio pueda actualizar el estado mediante hidratación.

---

### Hidratación

Los métodos de hidratación actualizan el estado del store utilizando datos confirmados por el servidor.

Ejemplo:

- `hydrateLocals(locals: Local[])`

La hidratación puede:

- reemplazar completamente el estado
- actualizar parcialmente el estado existente

---

### Reset

Eliminan completamente el estado del store.

Ejemplo:

- `clearLocals()`

Se utilizan principalmente en procesos como:

- logout
- cambio de usuario
- reinicio de la aplicación

---

## Estructura de una Feature

Cada feature dentro de `store` debe seguir esta estructura:

```
src/store/<FeatureName>/
├── <FeatureName>.store.ts       # Obligatorio: Definición del store con Zustand.
├── <FeatureName>.types.ts       # Obligatorio: Tipos y estructuras relacionadas con el estado.
├── <FeatureName>.validations.ts # Opcional: Validaciones y normalizaciones específicas.
├── <FeatureName>.errors.ts      # Opcional: Definición de errores específicos.
├── <FeatureName>.test.ts        # Obligatorio: Pruebas unitarias para el store y validaciones.
├── index.ts                     # Obligatorio: Punto de entrada para la feature.
├── README.md                    # Obligatorio: Documentación de la feature.
```

### Descripción de los Archivos

- **`<FeatureName>.store.ts`:** Contiene la definición del store, incluyendo el estado inicial, operaciones del dominio y métodos de hidratación.
- **`<FeatureName>.types.ts`:** Define los tipos y estructuras necesarias para el estado y las acciones.
- **`<FeatureName>.validations.ts`:** Incluye funciones para validar y normalizar datos antes de procesarlos (opcional).
- **`<FeatureName>.errors.ts`:** Define errores específicos relacionados con la feature (opcional).
- **`<FeatureName>.test.ts`:** Contiene pruebas unitarias para garantizar que el store y las validaciones funcionan correctamente.
- **`index.ts`:** Exporta todo lo necesario para consumir la feature.
- **`README.md`:** Explica el propósito del store, cómo usarlo y qué exporta.

---

## Estructura de `_shared`

La carpeta `_shared` contiene código reutilizable entre múltiples features. Su propósito es evitar la duplicación de código y centralizar elementos comunes.

```
src/store/_shared/
├── _shared.types.ts       # Tipos comunes a varias features.
├── _shared.validations.ts # Validaciones reutilizables.
├── _shared.errors.ts      # Errores comunes.
```

### Reglas para `_shared`

1. **Propósito:**
   - `_shared` no es una feature, sino un espacio para código común.
   - Debe usarse únicamente para elementos reutilizables entre múltiples features.

2. **Contenido:**
   - Los archivos dentro de `_shared` deben seguir las mismas convenciones que los archivos de las features.

---

## Ejemplo de Uso

### Definición de un Store

```typescript
// src/store/Users/Users.store.ts

import { create } from 'zustand';
import type { UsersStore } from './Users.types';

export const useUsersStore = create<UsersStore>()((set) => ({
  users: [],

  hydrateUsers: (users) => set({ users }),

  clearUsers: () => set({ users: [] }),
}));
```

### Punto de Entrada

```typescript
// src/store/Users/index.ts

export { useUsersStore } from './Users.store';
export type { UsersStore } from './Users.types';
```
