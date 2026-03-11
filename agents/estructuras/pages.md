# pages

## Naturaleza

La carpeta `pages` contiene los **componentes principales** que representan las vistas o pantallas de la aplicación. Estas páginas actúan como **puntos de entrada de navegación** dentro de la interfaz y son responsables de **componer la interfaz utilizando componentes existentes** y coordinar la interacción entre los distintos elementos de la aplicación.

Una página puede:

- Renderizar la interfaz principal asociada a una ruta.
- Conectar componentes con hooks, stores o servicios.
- Manejar parámetros de navegación o eventos de interacción del usuario.
- Orquestar el flujo de interacción entre los distintos componentes que conforman la vista.

Las páginas **no deben contener estilos visuales complejos ni lógica de presentación detallada**, ya que estas responsabilidades deben residir en los componentes reutilizables que la página utiliza.

Cada página encapsula su propia estructura de renderizado y está organizada en subcarpetas según su propósito dentro de la aplicación.

---

## Estructura General

La estructura de la carpeta `pages` es la siguiente:

```
src/pages/
├── dashboard/                   # Páginas privadas o internas
│   ├── companies/
│   │   ├── Companies.page.module.css
│   │   ├── Companies.page.tsx
│   │   ├── README.md
│   ├── devtools/
│   │   ├── DevTools.page.module.css
│   │   ├── DevTools.page.tsx
│   │   ├── README.md
│   ├── README.md                # Documentación general de dashboard
├── public/                      # Páginas públicas
│   ├── main/
│   │   ├── Main.page.module.css
│   │   ├── Main.page.tsx
│   │   ├── README.md
│   ├── README.md                # Documentación general de public
```

Cada página vive dentro de su propia subcarpeta y contiene los archivos necesarios para definir la estructura de esa vista.

---

## Reglas Generales

1. **Encapsulación**
   - Cada página debe estar contenida dentro de su propia subcarpeta.
   - El nombre de la carpeta debe representar el dominio o propósito funcional de la página.

2. **Convención de nombres**
   - El archivo principal de una página debe seguir el formato:

   ```
   Nombre.page.tsx
   ```

   - El archivo de estilos asociado debe seguir el formato:

   ```
   Nombre.module.css
   ```

3. **Estilos de página**
   - Cada página puede definir un archivo `.module.css` propio.
   - Este archivo debe utilizarse **únicamente para definir la estructura de layout de la página**, por ejemplo:
     - grid
     - flex
     - distribución de columnas
     - espaciado entre secciones
     - organización de contenedores

   - Los estilos visuales específicos (colores, tipografía, componentes interactivos, etc.) deben vivir en los componentes reutilizables utilizados por la página.

4. **Composición**
   - Las páginas deben estar compuestas principalmente por componentes reutilizables.
   - Los componentes deben encargarse de la presentación visual y comportamiento interno, mientras que la página organiza cómo se combinan dentro de la vista.

5. **Documentación**
   - Cada página debe incluir un archivo `README.md` dentro de su carpeta.
   - Este archivo debe documentar el propósito de la página y su relación con otros elementos del sistema.

---

## Documentación de Página (`README.md`)

Cada página debe incluir un archivo `README.md` con una estructura mínima que permita comprender rápidamente su función dentro de la aplicación.

Estructura recomendada:

```py
# Nombre de la Página

## Propósito
Descripción breve de qué problema resuelve esta página dentro de la aplicación.

## Componentes principales
Lista de los componentes relevantes que utiliza la página.

## Fuentes de datos
Hooks, stores o servicios que la página utiliza para obtener o manipular datos.

## Flujo de interacción
Descripción simplificada de cómo interactúa el usuario con la página.
```

Este archivo debe servir como **referencia rápida para otros desarrolladores** que necesiten comprender el rol de la página dentro del sistema.

---

## Ejemplo de Página

### Archivo principal

```ts
import styles from './Companies.page.module.css'

export default function CompaniesPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Empresas</h1>
      </header>

      <section className={styles.content}>
        {/* Componentes de la página */}
      </section>
    </div>
  )
}
```

### Archivo de estilos

```css
.page {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  display: grid;
  gap: 16px;
}
```

---

## Consideraciones Finales

- **Estilos Globales**  
  No se incluirán estilos globales dentro de la carpeta `pages`.  
  Cada página define únicamente su estructura de layout y utiliza componentes con estilos encapsulados.

- **Componentes Reutilizables**  
  Los componentes compartidos (por ejemplo: headers, tablas, formularios o widgets de interfaz) deben residir en carpetas dedicadas a componentes reutilizables y ser importados por las páginas cuando sea necesario.

Con esta estructura se busca garantizar que las páginas sean **claras, predecibles y fáciles de mantener**, manteniendo una separación adecuada entre estructura de vista, lógica y componentes reutilizables.