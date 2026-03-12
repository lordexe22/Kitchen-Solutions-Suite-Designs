# Estructura General del Proyecto

Este documento resume las carpetas estandarizadas del proyecto y referencia todos los documentos de esta carpeta.

Objetivo:
- Unificar criterios de organización.
- Diferenciar claramente qué aplica al frontend, al backend y a ambos.
- Servir como índice rápido de las reglas de arquitectura.

## Índice de Documentos

### Comunes a Frontend y Backend
- Librerías internas reutilizables: [lib.md](lib.md)
- Módulos del sistema: [modules.md](modules.md)
- Servicios: [services.md](services.md)
- Utilidades técnicas: [utils.md](utils.md)

### Frontend
- Componentes: [component.md](component.md)
- Hooks: [hooks.md](hooks.md)
- Pages: [pages.md](pages.md)
- Store: [store.md](store.md)
- Widgets: [widgets.md](widgets.md)

### Backend
- Rutas HTTP: [routes.md](routes.md)
- Middlewares: [middlewares.md](middlewares.md)

## Estructuras por Plataforma

### Estructura Base Común

```
src
┣ lib
┣ modules
┣ services
┗ utils
```

### Estructura Típica Frontend

```
src
┣ components
┣ hooks
┣ pages
┣ store
┣ widgets
┣ modules
┣ services
┣ utils
┗ lib
```

### Estructura Típica Backend

```
src
┣ routes
┣ middlewares
┣ services
┣ modules
┣ utils
┗ lib
```

## Regla de Uso

Antes de crear o modificar código:
1. Identificar si el cambio pertenece a frontend, backend o a una capa común.
2. Aplicar la guía específica de la carpeta objetivo.
3. Verificar que las dependencias respeten la jerarquía arquitectónica definida.

