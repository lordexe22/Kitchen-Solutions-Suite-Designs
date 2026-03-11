# widgets

## Naturaleza

La carpeta `widgets` contiene unidades de interfaz complejas y autocontenidas que implementan funcionalidades completas dentro de la aplicación. Un widget encapsula comportamiento, lógica de interacción, componentes internos y estilos necesarios para ofrecer una funcionalidad concreta dentro del sistema.

Los widgets están diseñados como unidades de UI de alto nivel, más grandes que un componente común, y capaces de operar como subsistemas de interfaz.

---

## Tipos de Widgets

### Widget de Librería

**Ubicación:**
```
src/lib/widgets
```

**Características:**
- Son agnósticos al sistema.
- No dependen de recursos internos del proyecto.
- Deben poder reutilizarse en otros proyectos sin modificaciones.

**Dependencias permitidas:**
- Librerías externas.
- Otros recursos dentro de `lib`.

**Dependencias prohibidas:**
- `store`
- `services`
- `modules`
- Widgets del sistema.
- Componentes del sistema.
- Hooks del sistema.

**Nota importante:**
Si un widget de librería necesita datos del sistema (como valores de `store` o interacción con `services`), estos deben ser proporcionados por el ente que hace uso del widget (por ejemplo, una página) a través de `props`, configuraciones u otros mecanismos externos. Un widget de librería no debe importar directamente recursos del sistema.

**Ejemplos posibles:**
- Generador de códigos QR.
- Recortador de imágenes.
- Panel de filtros genérico.
- Tabla de datos genérica.

---

### Widget de Sistema

**Ubicación:**
```
src/widgets
```

**Características:**
- Están acoplados al dominio de la aplicación.
- Pueden depender de recursos internos del sistema.
- Implementan funcionalidades que solo tienen sentido dentro de esta aplicación.

**Dependencias permitidas:**
- `components`
- `hooks`
- `modules`
- `utils`
- `store`
- `services` (disparados por eventos, evitando acoplamientos innecesarios).
- Otros widgets.

**Restricciones:**
- No deben depender de páginas: Un widget de sistema no debe importar directamente lógica, componentes o estructuras específicas de una página. Sin embargo, es válido que una página haga uso de un widget del sistema, ya que las páginas son responsables de integrar y coordinar los widgets dentro de la interfaz de usuario.
- Deben evitar dependencias circulares entre widgets.

---

## Encapsulación

Un widget debe encapsular completamente su implementación.

**Reglas:**
- Solo el archivo `index.ts` representa la interfaz pública.
- Componentes internos no deben ser importados directamente desde fuera del widget.
- Hooks internos deben usarse únicamente dentro del widget.

Esto evita que el resto del sistema dependa de detalles de implementación.

---

## Integración del Widget

La forma en que un widget se integra dentro de la aplicación puede variar según su naturaleza.

**Opciones de integración:**
- Props.
- Callbacks.
- Configuraciones.
- Eventos.

**Reglas:**
- La interfaz de uso del widget debe estar claramente definida.
- Todo widget debe incluir documentación que explique su uso.

---

## Documentación Obligatoria

Cada widget debe incluir un archivo `README.md` que explique:
- Propósito del widget.
- Cómo integrarlo.
- Configuración disponible.
- Dependencias relevantes.
- Ejemplos de uso.

El `README.md` funciona como contrato de uso del widget.

---

## Estilos

Un widget puede tener estilos propios o depender de estilos externos.

**Opciones válidas:**
- Estilos propios encapsulados dentro del widget.
- Estilos provenientes de componentes reutilizables.
- Estilos definidos en librerías externas.

**Regla importante:**
- Los estilos del widget no deben afectar elementos externos al widget.

---

## Composición entre Widgets

Los widgets pueden utilizar otros widgets como parte de su implementación.

**Ejemplo conceptual:**
```
DashboardWidget
   ├─ FilterPanelWidget
   └─ SmartTableWidget
```

**Reglas:**
- La composición es permitida.
- Se deben evitar dependencias circulares.
- La jerarquía debe ser clara y documentada.

---

## Estructura Interna Recomendada

Cada widget vive dentro de su propia carpeta.

**Estructura sugerida:**
```
widgets/
   nombre-widget/
      index.ts
      NombreWidget.widget.tsx
      README.md
      components/
      hooks/
      utils/
      styles/
      tests/  # Carpeta para pruebas unitarias e integración.
```

**Descripción de subcarpetas:**
- **`components`**: Componentes internos del widget que no tienen sentido fuera de él.
- **`hooks`**: Hooks específicos del widget.
- **`utils`**: Utilidades internas necesarias para su funcionamiento.
- **`styles`**: Estilos propios del widget cuando sea necesario.
- **`tests`**: Archivos de prueba para garantizar la funcionalidad del widget.

**Nota importante:**
Cualquier subcarpeta interna del widget contiene elementos exclusivos de ese widget. Si algún elemento interno resulta ser reutilizable en otros widgets o partes del sistema, debe ser notificado para evaluar si debe ser extraído y movido a una ubicación más general, como `components` o `utils` en el nivel del sistema.

---

## Pruebas

Los widgets deben incluir pruebas unitarias e integración siempre que sea posible y relevante.

**Cobertura esperada:**
- Pruebas unitarias para componentes internos.
- Pruebas de integración para verificar la funcionalidad completa del widget.
- Documentación clara sobre los casos cubiertos, ya sea en el `README.md` del widget o en comentarios dentro de los archivos de prueba.

---

## Reglas de importación
Los widgets deben ser importados únicamente a través de su archivo `index.ts`.
No se deben importar archivos internos del widget directamente.

---

## Consideraciones Finales

- **Relación con otras carpetas:** Los widgets pueden interactuar con `store`, `services`, y otras carpetas según sea necesario, pero siempre respetando las reglas de encapsulación y dependencias.