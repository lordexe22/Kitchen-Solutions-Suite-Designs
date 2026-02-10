# Project Standard (general design rules)

Este documento es una guia interna con reglas generales que ya se usan en el modulo Cloudinary y deben replicarse en nuevos modulos, utilidades o servicios. El foco es estructural y de convenciones, no en logica concreta del dominio.

Referencias base (patron):
- [server/modules/cloudinary/README.md](server/modules/cloudinary/README.md)
- [server/modules/cloudinary/index.ts](server/modules/cloudinary/index.ts)
- [server/modules/cloudinary/cloudinary.ts](server/modules/cloudinary/cloudinary.ts)
- [server/modules/cloudinary/cloudinary.config.ts](server/modules/cloudinary/cloudinary.config.ts)
- [server/modules/cloudinary/cloudinary.utils.ts](server/modules/cloudinary/cloudinary.utils.ts)
- [server/modules/cloudinary/cloudinary.types.ts](server/modules/cloudinary/cloudinary.types.ts)
- [server/modules/cloudinary/cloudinary.errors.ts](server/modules/cloudinary/cloudinary.errors.ts)
- [server/modules/cloudinary/test/README.md](server/modules/cloudinary/test/README.md)

## 1) Estructura de modulo (layout base)

Layout esperado:

```
<module>/
  <module>.ts              # funciones publicas principales
  <module>.config.ts       # configuracion y cliente (si aplica)
  <module>.types.ts        # tipos y contratos
  <module>.utils.ts        # helpers internos
  <module>.errors.ts       # errores tipados
  index.ts                 # API publica (exports)
  README.md                # documentacion del modulo
  docs/                    # diagramas y docs auxiliares (opcional)
  test/                    # pruebas
```

Reglas:
- Los archivos llevan el nombre del modulo como prefijo.
- index.ts siempre existe y define la API publica.
- docs/ es opcional, pero si hay documentacion extra debe ir alli.
- test/ siempre existe si el modulo tiene pruebas.

## 2) API publica y limites de exportacion

Reglas:
- index.ts expone solo funciones publicas y tipos/errores del modulo.
- No exportar utilidades internas ni helpers privados.
- Las funciones publicas se exportan desde el archivo principal del modulo.

Referencia: [server/modules/cloudinary/index.ts](server/modules/cloudinary/index.ts)

## 3) Convenciones de nombres

Reglas de archivos:
- lowercase con sufijo de rol: <module>.config.ts, <module>.utils.ts, <module>.types.ts, <module>.errors.ts.
- index.ts y README.md en la raiz del modulo.

Reglas de codigo:
- Funciones publicas: camelCase, verbo + objeto.
- Funciones internas: prefijo con guion bajo, p.ej. _validateX.
- Clases de error: PascalCase y sufijo Error.
- Tipos e interfaces: PascalCase y sufijo semantico (Params, Request, Response, Result).

## 4) Comentarios de estructura (meta tags)

Patron para lectura rapida:
- Cabecera con #info.
- Bloques #section para imports/exports.
- Bloques #function / #class / #interface / #type con #end-... correspondiente.
- Pasos de funcion con #step / #end-step.

Referencias:
- [server/modules/cloudinary/cloudinary.ts](server/modules/cloudinary/cloudinary.ts)
- [server/modules/cloudinary/cloudinary.utils.ts](server/modules/cloudinary/cloudinary.utils.ts)
- [server/modules/cloudinary/cloudinary.errors.ts](server/modules/cloudinary/cloudinary.errors.ts)

## 5) JSDoc y versionado

Reglas:
- Cada funcion publica tiene JSDoc con @param, @returns, @throws, @version.
- Funciones internas importantes llevan @internal y su nombre comienza con _.
- Types/interfaces publicas llevan @version.
- Descripciones consistentes en un solo idioma.

Referencias:
- [server/modules/cloudinary/cloudinary.ts](server/modules/cloudinary/cloudinary.ts)
- [server/modules/cloudinary/cloudinary.types.ts](server/modules/cloudinary/cloudinary.types.ts)
- [server/modules/cloudinary/cloudinary.utils.ts](server/modules/cloudinary/cloudinary.utils.ts)

## 6) Errores tipados

Reglas:
- Error base del modulo + clases especificas por operacion.
- Los errores propios no se reenvuelven (se relanzan).
- Los errores externos se mapean a errores del modulo.

Referencias:
- [server/modules/cloudinary/cloudinary.errors.ts](server/modules/cloudinary/cloudinary.errors.ts)
- [server/modules/cloudinary/cloudinary.utils.ts](server/modules/cloudinary/cloudinary.utils.ts)

## 7) Configuracion y clientes

Reglas:
- Configuracion via variables de entorno si aplica a servicios externos.
- Centralizar el acceso al cliente en <module>.config.ts.

Referencia: [server/modules/cloudinary/cloudinary.config.ts](server/modules/cloudinary/cloudinary.config.ts)

## 8) Manejo de dependencias circulares

Reglas:
- Evitar ciclos con separacion clara de responsabilidades.
- Si hay ciclo inevitable, usar require dinamico en el punto mas interno.

Referencia: [server/modules/cloudinary/cloudinary.utils.ts](server/modules/cloudinary/cloudinary.utils.ts)

## 9) README.md (template rigido)

Estructura obligatoria:

```
# moduleName

Breve descripcion

## Overview

Que hace, casos de uso principales

## Installation

Como incluirlo (si aplica)

## Configuration

Env vars, defaults, ejemplos

## Core Concepts

Ideas principales del modulo

## API Reference

- functionName(param): ReturnType - Que hace

## Examples

Ejemplos claros de uso

## Error Handling

Errores que puede lanzar y como manejarlos

## Best Practices

Tips y recomendaciones

## Changelog

Versiones y cambios

## See Also

Links o referencias relacionadas
```

Referencia: [server/modules/cloudinary/README.md](server/modules/cloudinary/README.md)

## 10) Testing

Reglas:
- Tests unitarios con mocks para dependencias externas.
- Tests de integracion opcionales y documentados.
- README en test/ con alcance, setup y variables requeridas.
- Nombres de tests orientados a comportamiento.

Referencia: [server/modules/cloudinary/test/README.md](server/modules/cloudinary/test/README.md)

## Checklist rapido (antes de cerrar un modulo)

- [ ] Estructura de archivos completa segun layout base.
- [ ] index.ts exporta solo API publica.
- [ ] Funciones publicas con JSDoc completo y @version.
- [ ] Funciones internas con @internal y prefijo _.
- [ ] Errores tipados por operacion.
- [ ] README con template rigido completo.
- [ ] Tests unitarios + notas para integracion.

## Checklist de estilo de codigo

- [ ] Nombres en ingles, precisos y consistentes.
- [ ] Helpers internos con prefijo _.
- [ ] #info, #section, #function/#class/#interface con #end-... presente.
- [ ] #step por bloque logico en funciones publicas.
- [ ] Sin exportar utilidades internas.
