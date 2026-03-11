# services

## Naturaleza

Un servicio es una operación del sistema que ejecuta una tarea completa de inicio a fin.

Un servicio:

- Recibe datos de entrada.
- Ejecuta una secuencia de operaciones necesarias para completar una tarea.
- Produce un resultado o un error como salida.

Un servicio es una **unidad de ejecución**.  
Su objetivo es resolver una operación concreta del sistema sin delegar la coordinación general a otros componentes.

Un servicio no representa un concepto del dominio ni una herramienta técnica aislada.  
Es la pieza responsable de **completar una acción completa del sistema**.

---

## Rol dentro de la arquitectura

Jerarquía estructural:

services → modules → utils


Los servicios son el nivel superior de ejecución dentro del sistema.

Un servicio puede:

- Utilizar módulos.
- Utilizar utilidades.
- Acceder directamente a la base de datos.
- Utilizar librerías externas.

Un servicio **no puede utilizar otros servicios**.

Cada servicio debe ser una operación independiente y autocontenida.

---

## Definición estricta

Para que un bloque de código sea considerado un servicio debe cumplir:

- Ejecuta una operación completa del sistema.
- Recibe todos los datos necesarios como entrada.
- Realiza validaciones necesarias para la operación.
- Puede acceder a la base de datos si la operación lo requiere.
- Puede utilizar módulos o utilidades para resolver partes del proceso.
- Retorna un resultado o un error.

Un servicio **no debe**:

- Ser parcialmente responsable de una operación.
- Depender de otro servicio.
- Mantener estado persistente en memoria.
- Depender de frameworks de transporte (HTTP, Express, UI, etc.).

Un servicio debe ser **una función ejecutable de forma aislada**.

---

## Flujo de ejecución

Un servicio recibe datos, ejecuta lógica y retorna un resultado.

Ejemplo conceptual:

input → validación → operaciones → resultado


Las operaciones internas pueden incluir:

- Validación de datos.
- Transformación de información.
- Acceso a base de datos.
- Uso de módulos.
- Uso de utilidades.

El servicio controla la secuencia completa de ejecución.

---

## Dependencias permitidas

Un servicio puede depender de:

- módulos
- utilidades
- librerías externas
- base de datos

Un servicio no puede depender de:

- otros servicios

Esta regla evita la creación de flujos implícitos difíciles de rastrear.

---

## Estado

Los servicios no mantienen estado interno persistente.

Toda la información necesaria para ejecutar la operación debe recibirse como entrada.

Si el sistema requiere almacenar información, esta debe ser guardada en:

- base de datos
- cache
- store de estado del sistema
- cookies o mecanismos equivalentes

El servicio solo ejecuta lógica y finaliza.

---

## Estructura de carpetas

Los servicios se organizan por dominio funcional.

Ejemplo:
```
src/
  services/
    auth/
    login/
    logout/
    register/

  users/
    createUser/
    updateUser/
```

Cada carpeta representa **un servicio independiente**.

## Estructura de un servicio

Cada servicio vive dentro de su propia carpeta.

Ejemplo:
```
index.ts
createUser.service.ts
createUser.types.ts
createUser.errors.ts
createUser.config.ts
createUser.test.ts
README.md
```

## Archivos

### index.ts

Es la **API pública del servicio**.

Exporta únicamente la función principal del servicio.

Ejemplo:

```ts
export { createUser } from './createUser.service'
```

### *.service.ts

Contiene la implementación principal del servicio.

Aquí vive la lógica que ejecuta la operación completa.

### *.types.ts (opcional)

Define tipos utilizados por el servicio.

Solo se crea si el servicio necesita definir tipos propios.

### *.errors.ts (opcional)

Define errores específicos del servicio.

Se utiliza cuando el servicio necesita errores estructurados.

### *.config.ts (opcional)

Define configuración utilizada por el servicio.

Ejemplos:

* constantes

* límites

* configuraciones internas

### *.test.ts (obligatorio)

Contiene pruebas del servicio.

Las pruebas deben validar que la operación se ejecuta correctamente y que los errores esperados son manejados.

### README.md (obligatorio)

Describe el propósito del servicio.

Debe incluir:

* qué operación ejecuta

* qué datos recibe

* qué resultado produce

El objetivo es permitir comprender rápidamente qué hace el servicio sin leer la implementación.


