# Etiquetas colapsables

## Proposito

Este documento busca especificar cómo va a ser el uso del sistema de etiquetas existente actualmente, cuyo propósito busca crear bloques colapsables de código. Los bloques colapsables sirven fundamentalmente para encapsular código y permitir su colapso en el editor, lo cual, si se usa inteligentemente, permitiría una lectura rápida y simple de archivos de gran tamaño. También serviría para crear estrategias de comunicación que permitan definir mejor determinadas zonas del código para lograr un entendimiento optimo entre el programador y el agente de inteligencia artificial.

Para resumir:
- Permite colapar los bloques de código
- Permite una lectura más limpia de los archivos
- Permite definir mejor algunas zonas especificas del archivo

## Definición de un bloque colapsable

Un bloque colapsable se puede definir de la siguiente forma:

```ts
// #{tag-name}
  // contenido del bloque
// #end-{tag-name}
```

Ejemplo:
``` ts
// #interface 
  // contenido del bloque
// #end-interface
```

Cuando se colapsa el bloque, solamente queda visible la etiqueta de apertura del bloque. Por lo cual, es buena idea acompañar dicha etiqueta con información que resulte interesante conocer en una lectura rápida. 

Por ejemplo, si creamos un método cualquiera:

```ts
// #function createAuthInterceptor - Crea un interceptor que agrega token de autenticación automáticamente.
const createAuthInterceptor = () => {
  // implementacion
}
// #end-function
```

Al colapsar el bloque solamente será visible en el editor la perte superior del bloque:

```ts
// #function createAuthInterceptor - Crea un interceptor que agrega token de autenticación automáticamente.
```

Esto lo hace especialmente poderoso porque permite localizar mucho más rapidamente los segmentos de código que nos interesen, además de que permiten una navegación más agil a lo largo de cualquier documento.

## Etiquetas disponibles

| Etiqueta | Descripción |
|----------|-------------|
| `function` | Encapsula la definición de una función. |
| `middleware` | Encapsula un middleware de backend (ej. Express). |
| `service` | Encapsula un servicio o capa de lógica de negocio. |
| `hook` | Encapsula un hook de React u otro framework. |
| `test` | Encapsula un bloque de pruebas (unitarias, integración, etc.). |
| `component` | Encapsula la definición de un componente de UI. |
| `class` | Encapsula la definición de una clase. |
| `store` | Encapsula un store de gestión de estado (Zustand, Redux, etc.). |
| `event` | Encapsula un manejador de eventos o emisor. |
| `type` | Encapsula la declaración de un type de TypeScript. |
| `interface` | Encapsula la declaración de una interface de TypeScript. |
| `enum` | Encapsula la declaración de un enum de TypeScript. |
| `v-field` | Encapsula un campo de variable dentro de un objeto, clase, interfaz o tipo. |
| `f-field` | Encapsula un campo de método/función dentro de un objeto, clase, interfaz o tipo. |
| `style` | Encapsula un bloque de reglas CSS (usa selector como nombre). |
| `keyframe` | Encapsula un bloque `@keyframes` de CSS (usa el nombre de la animación). |
| `media` | Encapsula un bloque `@media` de CSS (usa las reglas del query como nombre). |
| `variable` | Encapsula la declaración de una variable (dato que puede cambiar). |
| `const` | Encapsula la declaración de una constante (dato estático e inmutable). |
| `step` | Divide la lógica de un algoritmo o proceso en pasos numerados y descritos. |
| `todo` | Encapsula una tarea pendiente o punto del código que requiere atención futura. |
| `info` | Proporciona documentación técnica profunda: justificaciones, reglas de negocio, decisiones de arquitectura. |
| `section` | Encapsula un bloque genérico que no encaja en ninguna otra categoría. |
| `route` | Encapsula la definición de una ruta HTTP de backend (método + path). |
| `state` | Encapsula una variable de estado de frontend (`useState`, `register`, etc.). |

## Reglas globales de formato

### Sin líneas vacías entre bloques consecutivos

No deben existir líneas vacías entre bloques colapsables consecutivos del mismo nivel. Cuando dos o más bloques de cualquier tipo de etiqueta aparecen seguidos dentro del mismo contenedor (función, interfaz, tipo, archivo, etc.), deben estar uno inmediatamente a continuación del otro sin líneas en blanco de separación.

Las líneas vacías **no están permitidas**.


## Funciones prácticas de las etiquetas

### function, middleware, service, hook, test, component, class, store, event

Estas etiquetas comparten un formato y metodología similar, que incluye el uso de JSDoc para documentar el propósito del bloque.

#### Formato estándar:
```ts
// #{tag-name} nombre - descripción
/** JSDOC */
/* Bloque de código */
// #end-{tag-name}
```

#### Ejemplo:
```ts
// #function validateUserInput - Valida los datos de entrada del usuario
/** JSDOC */
const validateUserInput = (data) => {
  // implementación
};
// #end-function
```

### type, interface, enum

Estas etiquetas están destinadas para enmarcar tipos, interfaces y enums, así como también los campos internos de las mismas.

#### Formato estándar:
```ts
// #{tag-name} nombre - descripción
/** JSDOC */
/* Bloque de código */
// #end-{tag-name}
```

#### Ejemplo:
```ts
// #interface DropdownMenuItem - Item del menu desplegable del usuario
/**
 * Representa un item del menú desplegable del usuario
  */
export interface DropdownMenuItem {
  // implementación
}
// #end-interface
```



### v-field, f-field

Estas etiquetas encapsulan los campos internos de objetos, clases, interfaces, tipos, etc. Diferencian entre aquellos campos que representan variables (v-field) y los que representan métodos (f-field).

#### Formato estándar:
```ts
// #{tag-name} nombre - descripción
/** JSDOC */
/* Bloque de código */
// #end-{tag-name}
```

#### Ejemplo:
```ts
export interface AuthenticatorButtonWithGoogleProps {
  // #f-field onSuccess - Callback for successful authentication
  /** Callback that receives the authentication data on success */
  onSuccess: (data: AuthSuccessResponse) => void;
  // #end-f-field
  // #f-field onError - Callback for authentication errors
  /** Callback that receives error data on failure */
  onError: (error: ErrorData) => void;
  // #end-f-field
  // #v-field size - Size of the button
  /** Size of the button */
  size?: "large" | "medium" | "small";
  // #end-v-field
  // #v-field shape - Shape of the button
  /** Shape of the button */
  shape?: "rectangular" | "pill" | "circle" | "square";
  // #end-v-field
}
```

### style, keyframe, media

Estas etiquetas encapsulan bloques css.

#### Formato estándar:
```css
/* #{tag-name} nombre */
/* Bloque de código */
/* #end-{tag-name} */
```

Generalmente, para estas etiquetas, el nombre debe identificar rapidamente al bloque, por lo que se pueden dar casos como los que se muestrasn en los siguientes ejemplos:

```css
/* Bloque style lleva el selector del bloque */
/* #style .toast-container */
.toast-container{
  /* contenido */
}
/* #end-style */

/* Bloque keyframe lleva el nombre dado al keyframe */
/* #keyframe toastLifecycleFade5s */
@keyframes toastLifecycleFade5s {
  /* contenido */
}
/* #end-keyframe */

/* Bloque media lleva las reglas del bloque */
/* #media (max-width: 480px) */
@media (max-width: 480px) {
  /* contenido */
}
/* #end-media */
```

### variable, const

Estas etiquetas encapsulan datos (variables, constantes). Lo único que se considera constante son aquellos datos que permaneceran estáticos indefinidamente, el resto, si puede cambiar de cualquier forma, se considera variable.

#### Formato estándar:
```ts
// #{tag-name} nombre - descripción
/** JSDOC */
/* Bloque de código */
// #end-{tag-name}
```

#### Ejemplo:
```ts
// #const DEFAULT_EMPLOYEE_PERMISSIONS - modelo por defecto de los permisos de un usuario
/** JSDOC */
/* Bloque de código */
// #end-const

// #variable usersTable - Tabla de usuarios
/** JSDOC */
/* Bloque de código */
// #end-variable
```

### step

Esta etiqueta se utiliza para dividir la lógica de un algoritmo, función o proceso en pasos concretos y más pequeños. Es especialmente útil para mejorar la legibilidad y el mantenimiento del código, ya que permite identificar rápidamente las diferentes etapas de un flujo lógico. Para su uso correcto se recomienda
- **Numerar los pasos**: Utilizar números consecutivos para mantener un orden lógico.
- **Descripciones claras**: Acompañar cada paso con una descripción breve pero informativa.

#### Formato estándar:
```ts
// #step número - descripción
/* Bloque de código */
// #end-step
```

#### Ejemplo en TypeScript:
```ts
// #step 1 - Validar entrada
if (!input) {
  throw new Error("Input inválido");
}
// #end-step

// #step 2 - Procesar datos
const result = processData(input);
// #end-step
```

### todo

Esta etiqueta encapsula un bloque en el cual se comenta una tarea pendiente. Es útil para señalar puntos específicos del código que requieren atención o trabajo adicional.

#### Formato estándar:
```ts
// #todo descripción
/* Bloque de código */
// #end-todo
```

#### Ejemplo:
```ts
// #todo Implementar validación de datos
function validateData(data) {
  // lógica pendiente
}
// #end-todo

// #todo Refactorizar esta función para mejorar la legibilidad
function processData(input) {
  // lógica actual
}
// #end-todo
```

### info

Esta etiqueta proporciona una descripción profunda sobre alguna implementación o funcionalidad. Aca se especifican detalles tecnicos y justificaciones de desiciones empleadas a la hora de decidir factores criticos sobre el proyecto. Justifican reglas de negocios y diseños de arquitecturas dentro del proyecto.

#### Formato General
```typescript
// #info - [Descripción breve del propósito o funcionalidad]
// Desarrollo de la idea
// #end-info
```

#### Ejemplo
```typescript
// #info - Google OAuth authentication button component with full customization
// Explicación detallada
// #end-info
```

### section

Esta etiqueta se utiliza para encapsular bloques de código que aún no tienen una categoría específica o que no requieren su propia categoría. Es una herramienta agnóstica que ayuda a organizar y delimitar secciones dentro de un archivo, facilitando la lectura y el mantenimiento del código.

#### Ejemplo:
```ts
// #section Imports
import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
// #end-section

// #section qr-options
<div className="qr-options">
  {/* Opciones básicas */}
</div>
// #end-section
```



### route

Esta etiqueta encapsula la definición de rutas en aplicaciones backend, como las que se definen en frameworks como Express.js. Es útil para identificar rápidamente las rutas disponibles y su propósito dentro del archivo de rutas.

#### Formato estándar:
```ts
// #route [método HTTP] [ruta] - descripción
/** JSDOC */
/* Bloque de código */
// #end-route
```

#### Ejemplo:
```ts
// #route POST /avatar - Subir/actualizar avatar de usuario
/** JSDOC */
/* Bloque de código */
// #end-route

// #route DELETE /avatar - Eliminar avatar de usuario
/** JSDOC */
/* Bloque de código */
// #end-route
```


### state

Esta etiqueta encapsula variables de estado en aplicaciones frontend, como las que se definen en React utilizando el hook `useState` o en formularios con `register`. Es útil para identificar rápidamente las variables de estado y su propósito dentro de un componente.

#### Formato estándar:
```ts
// #state nombre - descripción
/* Bloque de código */
// #end-state
```

#### Ejemplo:
```ts
// #state isLoading - Indica si está procesando el login
const [isLoading, setIsLoading] = useState(false);
// #end-state

// #state serverError - Para errores de servidor/red
const [serverError, setServerError] = useState<string | null>(null);
// #end-state
```

