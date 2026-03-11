# lib

## Naturaleza

src/lib/ contiene código agnóstico al dominio de Kitchen Solutions Suite. La idea es que contenga internamente carpetas de modulos, utilidades, servicios, estilos, etc. Todo el contenido de esta carpeta debe cumplir con lo siguiente:

* No contiene reglas de negocio.
* No depende de ninguna carpeta dentro de src/.
* Puede depender de librerias externas.
* Puede depender de variables de entorno.
* El proyecto se adapta al módulo, no al revés.

## Dependencias permitidas

Dentro de src/lib/ se permiten las siguientes operaciones
* Importar paquetes externos (NPM).

Dentro de src/lib/ está prohibido:
* Importar desde cualquier otra carpeta del proyecto (raiz) que no sea lib/

Regla absoluta:
* lib no depende del proyecto. El proyecto depende de lib.

## Variables de entorno

Permitido. Pero bajo esta condición:
* El módulo debe documentar explícitamente qué variables requiere.
* El módulo debe fallar de forma controlada si no existen.
* La variable debe tener sentido en cualquier proyecto donde el módulo sea reutilizado.

Casos no válidos:
* Variables específicas de lógica interna del proyecto.

## Modificabilidad

Reglas críticas:
* El contenido de src/lib/ no debe ser modificado.
* El agente no debe sugerir refactors internos.
* El agente no debe corregir código dentro de src/lib/.
* Si detecta un bug → debe notificarlo.
* La modificación solo ocurre bajo orden explícita del desarrollador.
* Esto es una política operativa, no solo estructural.

## Configuración externa

Permitido y obligatorio cuando aplique.

El comportamiento de un módulo de lib puede modificarse:

* Mediante parámetros.
* Mediante configuración explícita.
* Mediante inyección de estrategias.

Pero nunca editando el código fuente.

## Restricción de Autoría sobre lib/

La carpeta src/lib/ es de control exclusivo del autor del proyecto.

Reglas obligatorias:

* El agente no puede generar código dentro de src/lib/.
* El agente no puede sugerir refactors dentro de src/lib/.
* El agente no puede aplicar fixes dentro de src/lib/.

Excepciones:

* Puede reportar bugs o comportamientos anómalos.
* Puede sugerir que una abstracción candidata podría vivir en src/lib/.

La decisión final de incorporación o modificación pertenece exclusivamente al autor.

## Diferenciación de Carpetas Homónimas

Existen carpetas con el mismo nombre dentro y fuera de src/lib/.
El nombre no define la naturaleza. La ubicación sí.

Ejemplo formal:

src/lib/modules/
→ Módulos agnósticos, reutilizables, inmutables.

src/modules/
→ Módulos propios del proyecto, con lógica de negocio.
→ Espacio válido de trabajo del agente.

Lo mismo aplica para:

src/lib/utils vs src/utils
src/lib/services vs src/services

cualquier otra carpeta homónima futura

Regla estructural:
* Si el código está dentro de lib/, es infraestructura reutilizable y no se toca.
* Si está fuera de lib/, pertenece al dominio del proyecto y puede evolucionar.

Regla Operativa para el Agente

Antes de crear o modificar código, debe verificarse:

¿La modificación afecta algo dentro de lib/?
→ Si sí, detenerse y reportar.

¿La funcionalidad propuesta podría abstraerse de forma genérica?
→ Puede sugerirse como candidato a lib/, pero no implementarse allí.

## Responsabilidades del agente

El contenido dentro de la carpeta `lib` es **estrictamente intocable** para el agente. Esto significa que:

1. El agente no debe modificar o crear en ningún archivo dentro de `lib`.
2. El agente debe trabajar exclusivamente con el contenido del sistema (fuera de `lib`).
3. Si el agente detecta que una parte del sistema podría ser abstraída para convertirse en contenido reutilizable dentro de `lib`, debe notificarlo, pero no realizar el cambio.

Cualquier contenido dentro de `lib` será creado y supervisado exclusivamente por el desarrollador. El agente debe limitarse a comprender las reglas, respetarlas en todo momento y hacer uso de las herramientas proporcionadas en lib dentro del proyecto siempre que sea posible.

