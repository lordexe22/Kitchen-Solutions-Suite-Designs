# components

## Naturaleza


La carpeta `components` contiene los **componentes de sistema**. Estos se encuentran en `src/components`. Son componentes específicos de la aplicación que tienen sentido únicamente dentro del contexto del sistema actual. A diferencia de los **componentes de librería**, los componentes de sistema no están diseñados para ser reutilizados en otros proyectos.

Por otro lado, los **componentes de librería** son componentes genéricos y reutilizables que pueden ser utilizados en múltiples proyectos. Estos se encuentran en `src/lib/components`.

---

## Rol dentro de la arquitectura

- **Componentes de Sistema**: Son piezas de la interfaz de usuario que encapsulan lógica y estilos específicos de la aplicación. Estos componentes pueden depender de otros elementos del sistema, como servicios, módulos o utilidades, pero no deben incluir lógica de negocio.
- **Componentes de Librería**: Son componentes genéricos que no dependen del sistema y están diseñados para ser reutilizados en otros proyectos. No deben incluir lógica específica del sistema ni depender de configuraciones globales.


---

## Reglas

1. **Propósito**:
   - Los componentes de sistema deben resolver necesidades específicas de la aplicación.
   - No deben ser genéricos ni diseñados para ser reutilizados fuera del sistema.
   - Los componentes de libreria son componentes pensados para una maxima reutilizabilidad y son mas genéricos.

2. **Estructura**:
   - Cada componente debe vivir en su propia subcarpeta dentro de `components/`.
   - La subcarpeta debe incluir los siguientes archivos:
     ```
     ComponentName/
     ├── ComponentName.tsx         # Implementación principal del componente
     ├── ComponentName.module.css  # Estilos específicos del componente
     ├── ComponentName.types.ts    # Tipos utilizados por el componente (opcional)
     ├── ComponentName.utils.ts    # Funciones auxiliares específicas del componente (opcional)
     ├── ComponentName.hooks.ts    # Hooks específicos del componente (opcional)
     ├── ComponentName.config.ts   # Configuración específica del componente (opcional)
     ├── ComponentName.test.ts     # Pruebas unitarias del componente (obligatorio)
     ├── index.ts                  # Exportación pública del componente
     └── README.md                 # Documentación del componente
     ```

3. **Estilos**:
   - Los estilos deben estar encapsulados en un archivo `*.module.css` dentro de la subcarpeta del componente.

4. **Documentación**:
   - Cada componente debe incluir un archivo `README.md` que explique:
     - El propósito del componente.
     - Cómo usarlo (con ejemplos de código).
     - Qué props acepta y cómo configurarlo.

5. **Dependencias**:
   - Los componentes de sistema pueden depender de:
     - Servicios.
     - Módulos.
     - Utilidades.
     - No deben depender de configuraciones globales o de otros componentes, salvo que sea estrictamente necesario.
   - Los componentes de libreria solo pueden depender de bibliotecas externas genéricas, pero no de elementos específicos del sistema.

---

## Ejemplo de Estructura de un Componente

```
components/
└── Modal/
    ├── Modal.tsx
    ├── Modal.module.css
    ├── Modal.types.ts
    ├── Modal.utils.ts
    ├── Modal.hooks.ts
    ├── Modal.config.ts
    ├── Modal.test.ts
    ├── index.ts
    └── README.md
```

---

## Ejemplo de README.md para un Componente

```markdown
# Modal

## Propósito
El componente `Modal` es una ventana modal reutilizable diseñada para mostrar contenido superpuesto en la aplicación. Este componente es específico del sistema y no está diseñado para ser utilizado fuera de este proyecto.

## Uso

```tsx
import { Modal } from './Modal';

<Modal
  isOpen={true}
  onClose={() => console.log('Modal cerrado')}
  title="Título de la Modal"
>
  <p>Contenido de la modal</p>
</Modal>;
```
