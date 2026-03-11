# utils

## Naturaleza
Una utilidad es una función técnica reutilizable que resuelve un problema concreto y acotado.

* No representa un concepto del dominio.
* No coordina flujos completos.
* No encapsula reglas de negocio.
* Es una herramienta técnica del sistema.

Una utilidad debe poder existir sin conocer nada sobre el proyecto específico.

## Rol dentro de la arquitectura

Jerarquía estructural:
```
services → modules → utils
```

Las utilidades están en la base técnica del sistema.

Una utilidad:
* Puede ser utilizada por servicios y módulos.
* Puede depender de librerías externas.
* No puede depender de módulos.
* No puede depender de servicios.

Regla absoluta:
* Las utilidades no conocen el dominio.
* El dominio puede conocer las utilidades.

## Definición estricta

Para que algo sea considerado una utilidad debe cumplir:
* No conoce conceptos del negocio.
* No depende de ningun modulo o servicio.
* No coordina múltiples responsabilidades.
* No tiene estado persistente.
* No encapsula reglas del sistema.
* Puede depender de librerías externas técnicas.
* Puede exportar tipos auxiliares técnicos.
* No lanza errores de dominio.

Si una pieza de código rompe estas condiciones de forma estructural, no debe vivir en utils/.

## Estructura temática

La carpeta src/utils/ no es plana. Se organiza en subcarpetas temáticas.
Cada subcarpeta representa una capacidad técnica concreta y autocontenida.

Ejemplo:
```
src/utils/
  /validator/
    index.ts
    validator.ts
    validator.types.ts
    validator.errors.ts
    validator.constants.ts
  /formatter/
    index.ts
    formatter.ts
  /crypto/
    index.ts
    crypto.ts
```

Principios:
* Cada carpeta temática agrupa utilidades relacionadas entre sí.
* No existen archivos sueltos directamente dentro de utils/.
* La carpeta temática es la unidad estructural mínima.
* No se crean carpetas por función individual, sino por tópico técnico coherente.
* No se crean micro-estructuras artificiales sin relación temática real.

## Estructura interna de una utilidad temática

Un archivo util:
* Puede contener una o varias funciones si están directamente relacionadas.
* Puede exportar tipos técnicos auxiliares.
* No debe mezclar responsabilidades distintas.

### Ejemplo 1
```
import bcrypt from 'bcrypt'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
```
### Ejemplo 2
```
export type ServerErrorType = 'validation' | 'auth' | 'unknown'

export function detectServerErrorType(error: unknown): ServerErrorType {
  // lógica técnica
}

export function getServerErrorMessage(error: unknown): string {
  // lógica técnica
}
```

## Qué no debe existir en utils

Está prohibido:
* Importar desde src/modules/.
* Importar desde src/services/.
* Acceder a base de datos.
* Ejecutar lógica de negocio.
* Coordinar múltiples dominios.
* Manipular objetos de transporte (req, res, contextos UI).
* Crear dependencias entre utilidades.

Si una utilidad comienza a requerir múltiples archivos, configuración propia o reglas del sistema, debe evaluarse su migración a modules/.

## Regla operativa

Antes de crear una nueva utilidad:

¿Es una herramienta técnica reutilizable y sin conocimiento del dominio?

* Si sí → crear una carpeta temática dentro de utils/.

¿Ya existe una carpeta temática que agrupe esa responsabilidad?

* Si sí → agregar la implementación dentro de esa carpeta.

* Si no → crear una nueva carpeta temática con su index.ts y archivo principal.

¿Requiere tipos, errores o constantes propias?

* Solo crear los archivos correspondientes si realmente existen.

El objetivo de utils/ es mantener un conjunto técnico encapsulado, organizado por tópicos coherentes, con API pública controlada y sin identidad de dominio.

## Encapsulamiento y reglas de importación

Reglas estrictas:

* Desde fuera de la carpeta solo se puede importar desde index.ts.
* Está prohibido importar desde archivos internos.
* Está prohibido generar dependencias circulares entre utilidades.
* Se permite que una utilidad dependa de otra utilidad si la dependencia es puramente técnica y no introduce dominio.
* No se permite que una utilidad dependa de módulos ni de servicios.
* La carpeta actúa como frontera de encapsulamiento técnico.

## Estructura interna de una utilidad temática

Cada utilidad temática es un mini-módulo técnico autocontenido.

### Archivos obligatorios

index.ts
* Es el único punto de exportación pública.
* No contiene lógica.
* Solo reexporta símbolos desde archivos internos.
* Ningún otro archivo puede ser importado desde fuera de la carpeta.

<topic>.ts
* Contiene la implementación principal.
* Puede contener múltiples funciones relacionadas.
* Puede utilizar tipos, errores y constantes internas.
* No debe exponer nada que no pase por index.ts.

### Archivos opcionales (solo si existen realmente)

<topic>.types.ts
* Tipos técnicos auxiliares.
* Interfaces.
* Enums.
* No contiene lógica.

<topic>.errors.ts
* Clases de error técnicas.
* No contiene lógica adicional.

<topic>.constants.ts
* Constantes técnicas no triviales.
* Configuraciones internas.
* Expresiones regulares complejas.

No se crear archivos fuera de los definidos aquí. Se pueden proponer nuevos archivos para establecer dentro de estandar.