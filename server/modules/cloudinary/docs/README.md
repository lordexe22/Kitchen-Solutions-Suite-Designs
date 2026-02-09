# Cloudinary Module - Documentation

Esta carpeta contiene la documentación arquitectural del módulo Cloudinary, separada por audiencia.

## 📖 Guía por Audiencia

### 👤 Soy Consumer del módulo
**Quiero**: Usar el módulo correctamente, sin sorpresas

**Lee**: 
- [`cloudinary-public-api.puml`](cloudinary-public-api.puml) - Mapa mental de funciones disponibles
- [`cloudinary-contracts.puml`](cloudinary-contracts.puml) - Qué promete cada función

**Preguntas que responde**:
- ¿Qué funciones hay disponibles?
- ¿Qué inputs y outputs espera cada una?
- ¿Qué errores puedo recibir?
- ¿Qué garantiza el módulo?

---

### 🔧 Soy Mantenedor / Contribuidor
**Quiero**: Extender el módulo sin romper principios

**Lee**:
- [`cloudinary-architecture.puml`](cloudinary-architecture.puml) - Estructura interna y reglas
- [`flows/`](flows/) - Flujos críticos con lógica no trivial

**Preguntas que responde**:
- ¿Dónde agrego una nueva feature?
- ¿Dónde va una validación?
- ¿Cómo se maneja un error?
- ¿Cuál es el flujo real de una operación compleja?

---

### 🏗️ Soy Arquitecto / Reviewer
**Quiero**: Validar decisiones de diseño y contratos

**Lee**:
- [`cloudinary-contracts.puml`](cloudinary-contracts.puml) - Contratos semánticos
- [`cloudinary-architecture.puml`](cloudinary-architecture.puml) - Principios de diseño

**Preguntas que responde**:
- ¿Se respetan las precondiciones?
- ¿Las postcondiciones están garantizadas?
- ¿Quién es la fuente de verdad?
- ¿Los errores son explícitos?

---

## 📂 Estructura de Archivos

```
docs/
├── README.md                           (este archivo)
├── cloudinary-public-api.puml         → Consumer View
├── cloudinary-contracts.puml          → Contract View
├── cloudinary-architecture.puml       → Maintenance View
└── flows/                             → Sequence Diagrams
    ├── rename-image-flow.puml
    ├── change-prefix-flow.puml
    └── list-images-flow.puml
```

---

## 🎯 Principios de Documentación

1. **Separación por Audiencia**  
   Cada diagrama responde preguntas específicas de una audiencia

2. **No Mezclar Niveles**  
   Public API no muestra utils internos  
   Architecture no muestra casos de uso

3. **Un Diagrama = Una Pregunta**  
   Si no responde una pregunta concreta, sobra

4. **Source of Truth Explícito**  
   Cada contrato declara quién es autoridad

5. **Flows Solo para Lógica No Trivial**  
   No documentar operaciones simples tipo CRUD

---

## 🔄 Cuándo Actualizar

- **Public API**: Al agregar/quitar funciones públicas
- **Contracts**: Al cambiar precondiciones/postcondiciones
- **Architecture**: Al cambiar estructura interna o reglas
- **Flows**: Al modificar lógica de funciones complejas

---

## 🛠️ Cómo Renderizar

```bash
# Instalar PlantUML
npm install -g node-plantuml

# Generar PNG
plantuml docs/cloudinary-public-api.puml

# Generar todos los diagramas
plantuml docs/*.puml docs/flows/*.puml
```

O usar extensiones de VS Code:
- PlantUML (jebbs.plantuml)
- PlantUML Preview (okazuki.okazukiplantuml)

---

## 📊 Cobertura de Test

Los contratos documentados están respaldados por:

- **114 tests** pasando
- **8 test suites** (uno por función principal)
- **Cobertura**: validaciones, errores, normalización, edge cases

Ver tabla completa en [`../README.md`](../README.md)

---

## 💡 Contribuyendo

Al agregar nueva documentación:

1. **Identifica la audiencia** (consumer, maintainer, architect)
2. **Determina qué pregunta responde**
3. **Usa el tipo de diagrama apropiado**
4. **No mezcles niveles de abstracción**
5. **Mantén sincronizado con el código**

---

**Última actualización**: 2026-02-06
