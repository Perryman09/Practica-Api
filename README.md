# 🏎️ APEX // DRIVE — Portal Web de Modelos de Vehículos en el Mundo (React 18)

**APEX // DRIVE** es un portal web de exhibición e inteligencia automotriz desarrollado en **React 18** para la asignatura **Diseño de Sistemas de Internet** (Universidad Nacional de Ingeniería - UNI). 

A diferencia de guías convencionales, este portal es un showroom interactivo con estética cyber-automotriz oscura (*Dark Glassmorphism*), animaciones de partículas en tiempo real, efectos de luz ambiental dinámica, sintetizador de aceleración de motor por audio y un **Cockpit Inspector integrado** que muestra toda la información técnica, fotografía en alta resolución y telemetría de cada modelo directamente en el portal sin redireccionar a enlaces externos.

---

## 🚀 Características Principales

1. **Desarrollado en React 18:**
   - Arquitectura modular basada en componentes funcionales, hooks (`useState`, `useEffect`, `useRef`, `useMemo`).
   - Actualización reactiva instantánea del estado de la interfaz.

2. **Consumo de Múltiples Servicios Web Públicos (REST APIs):**
   - **NHTSA vPIC API:** Provee el catálogo oficial mundial de marcas y modelos registrados por el Departamento de Transporte.
   - **Wikipedia Intelligence REST API:** Provee en vivo la **fotografía en alta resolución**, ficha técnica, año y descripción enciclopédica detallada de cada modelo inspeccionado.

3. **Cockpit Inspector en el Mismo Portal (Sin Enlaces Externos):**
   - Al seleccionar cualquier vehículo, se abre una cabina de telemetría directamente en la pantalla con:
     - 📸 Fotografía oficial en alta resolución del modelo.
     - ⚡ **Tacómetros y Diales SVG Animados:** Potencia (HP), Velocidad Máxima (km/h), Aceleración de 0 a 100 km/h y Par Motor (Torque Nm).
     - ⚙️ **Ficha de Ingeniería:** Tipo de bloque/motor, transmisión, sistema de tracción (AWD/RWD), país de origen y fabricante.
     - 📖 **Dossier Enciclopédico:** Historia y clasificación oficial cargada en vivo desde la API.
     - 📄 **Visor de Datos JSON Crudos:** Pestaña con el payload exacto de la respuesta REST y botón para copiarlo.

4. **Experiencia y Animaciones Fluidas:**
   - 🌌 **Canvas de Fondo:** Animación continua de partículas y líneas de velocidad a 60 FPS.
   - 💡 **Luz Ambiental Dinámica:** El resplandor de fondo cambia de color al seleccionar cada fabricante (Rojo *Rosso Corsa* para Ferrari, Amarillo para Porsche, Azul M para BMW, Verde para Lamborghini, Cyan para Tesla, etc.).
   - 🔊 **Sonido Real de Motores y Botón de Detención Inmediata:** Grabaciones auténticas de escapes de cada fabricante (Ferrari V8, Porsche Boxer-6, Lamborghini V10, BMW Inline-6, Ford V8 Flat-Plane, etc.) con botón dedicado (`⏹️ DETENER SONIDO`) en todo el portal.
   - 📸 **Galerías Exclusivas por Fabricante y Wikipedia API:** Fotografías de alta resolución verificadas por marca y carga en vivo de imágenes en 1000px desde Wikipedia Intelligence.
   - 🔍 **Buscador en Memoria:** Filtra al instante entre cientos de modelos sin recargas.

---

## 📁 Estructura del Proyecto

```text
Practica Api/
├── index.html         # Portal web interactivo completo en React 18
├── css/
│   └── styles.css     # Hoja de estilos con animaciones, diales y modo oscuro
├── js/
│   └── particles.js   # Motor del canvas de partículas y líneas de velocidad
├── package.json       # Configuración del proyecto npm/React
└── README.md          # Documentación del proyecto
```

---

## 🌐 Servicios Web Consumidos

| API | Endpoint | Utilidad en el Portal |
| :--- | :--- | :--- |
| **NHTSA vPIC** | `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/{marca}?format=json` | Obtención de modelos mundiales oficiales |
| **Wikipedia REST** | `https://en.wikipedia.org/api/rest_v1/page/summary/{modelo}` | Fotografía de alta resolución y resumen técnico |
| **Wikipedia Search** | `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=...` | Búsqueda inteligente de variantes y trims de vehículos |


*Diseño de Sistemas de Internet — Universidad Nacional de Ingeniería (UNI) — 2026*
