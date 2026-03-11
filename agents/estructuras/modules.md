# modules

## Naturaleza

Un módulo es un bloque de operaciones cohesionadas que giran en torno a un mismo tópico del sistema.

No ejecuta flujos completos de inicio a fin.
No representa una tarea transversal.
Eso corresponde a los servicios.

El módulo encapsula comportamientos relacionados bajo una misma temática.

Ejemplo conceptual:

```
src/modules/user/
  createUser.ts
  updateUser.ts
  validateUserRules.ts
```

Todo lo relacionado al tópico “user” vive dentro del mismo módulo.

## Rol dentro de la arquitectura

Jerarquía estructural:

```
services → modules → utils
services → modules → lib
modules → utils
modules → lib
```

Un módulo:
* Puede ser utilizado por uno o varios servicios.
* Puede utilizar utilidades.
* Puede utilizar módulos de librería (src/lib/).
* Puede, con criterio, utilizar otros módulos de sistema.
* No debe depender de servicios.

Regla absoluta:
* Los servicios están por encima de los módulos.
* Un módulo nunca depende de un servicio.

## Modulos de libreria vs modulos del sistema
src/lib/modules/ → Módulos de librería.
* Agnósticos.
* Reutilizables.
* Inmutables.
* El sistema se adapta a ellos.

src/modules/ → Módulos de sistema.
* Específicos del proyecto.
* Evolutivos.
* Diseñados para facilitar la construcción de servicios.

La ubicación determina su naturaleza.

## Responsabilidad

Un módulo puede:
* Centralizar reglas relacionadas a su tópico.
* Exponer múltiples operaciones.
* Aplicar validaciones propias del componente.
* Encapsular lógica repetible dentro del sistema.
* Interactuar con infraestructura del proyecto cuando sea necesario.

Un módulo no debe:
* Ejecutar tareas transversales completas.
* Coordinar múltiples dominios grandes.
* Convertirse en una capa de transporte.
* Manipular directamente objetos req, res o frameworks UI.

## Dependencias permitidas

Dentro de src/modules/ se permite:
* Importar desde src/lib/
* Importar desde src/utils/
* Importar paquetes externos
* Acceder a infraestructura del proyecto
* Importar otros módulos de sistema (sin dependencia circular)

Dentro de src/modules/ está prohibido:
* Importar desde src/services/
* Crear dependencias circulares entre módulos
* Acoplarse a frameworks de transporte

## Regla de dependencia entre módulos

La dependencia entre módulos de sistema está permitida bajo estas condiciones:
* No debe existir dependencia circular.
* La jerarquía debe ser clara.
* Debe evitarse acoplamiento lateral innecesario.

Si dos módulos comparten demasiada lógica, evaluar:
* Extraer utilidades
* Crear un módulo más atómico

Regla práctica:
* Preferir módulos atómicos y composables antes que módulos grandes y acoplados.

## Cohesión

Un módulo debe cumplir:
* Alta cohesión temática.
* Bajo acoplamiento externo.
* API clara y explícita.
* No convertirse en contenedor genérico de funciones inconexas.

Si el módulo empieza a cubrir múltiples tópicos distintos:
* Debe dividirse.

## Uso transversal

Un módulo debe trabajar con datos puros y contratos definidos.

No debe depender directamente de:
* Express
* Next.js
* React
* Objetos HTTP
* Contextos de UI

El transporte actúa como adaptador externo.

## Evolución

A diferencia de lib/:
* Los módulos de sistema pueden modificarse.
* Pueden refactorizarse.
* Pueden reorganizarse.
* Son parte activa del desarrollo.

## Regla operativa

Antes de crear código en modules/ verificar:

¿La funcionalidad pertenece a un tópico específico del sistema?
→ Si sí, corresponde aquí.

¿Es una tarea transversal completa?
→ Entonces pertenece a services/.

¿Es reutilizable fuera del proyecto sin cambios?
→ Evaluar moverla a lib/.

## Inmutabilidad Operativa de los Módulos de Sistema

Los módulos de sistema constituyen bloques de operaciones reutilizables sobre los cuales dependen los servicios.

Dado que los servicios consumen directamente sus operaciones, cualquier modificación en un módulo puede alterar el comportamiento de múltiples servicios simultáneamente y generar efectos colaterales no deseados.

Por esta razón:

* Los módulos de sistema no deben modificarse de manera rutinaria.
* No se deben editar para resolver necesidades específicas de un único servicio.
* No se deben alterar contratos públicos sin un proceso explícito de revisión.

Si se identifica lógica reutilizable dentro de un servicio, la práctica correcta es:

1. Extraer dicha lógica.
2. Crear un nuevo módulo.
3. Reemplazar la implementación interna del servicio para que consuma el nuevo módulo.

El agente puede:
* Crear nuevos módulos.
* Refactorizar servicios para consumir módulos existentes.
* Proponer mejoras estructurales.

El agente no debe:
* Modificar arbitrariamente módulos existentes.
* Alterar contratos públicos sin justificación estructural.

El objetivo es preservar estabilidad sistémica, evitar regresiones en cadena y mantener una arquitectura modular predecible.