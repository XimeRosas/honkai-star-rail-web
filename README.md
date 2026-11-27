# 🚂 Honkai: Star Rail — Guía Interactiva del Expreso Astral

Aplicación web SPA (*Single Page Application*) desarrollada con **Vue 3** y **Bootstrap 5** que permite explorar los personajes, vías, elementos y habilidades del universo de *Honkai: Star Rail*, incluyendo soporte multi-idioma (`ES` / `EN` / `JP`) y un asistente inteligente potenciado por **Firebase AI Logic (Gemini)** con la personalidad de **Pom-Pom**.

🌐 **Aplicación desplegada en Firebase Hosting:** [https://web.app](https://web.app)

---

## 👤 Integrantes

- **Ximena Sadit** *(Completa aquí si tienes compañeros/as de equipo, carrera, materia y comisión)*

---

## 🎯 Tema y API Elegidos

- **Temática:** Enciclopedia interactiva y gestor de favoritos de personajes del videojuego *Honkai: Star Rail*.
- **API utilizada:** [StarRailStaticAPI](https://github.io)
  - Se consumen de forma asíncrona y en paralelo los endpoints `characters.json`, `paths.json`, `elements.json`, `descriptions.json` y `character_skills.json` en tres idiomas (`es`, `en` y `jp`), además de los recursos gráficos oficiales (`preview`, `portrait` e íconos de habilidades, vías y elementos).

---

## ✨ Funcionalidades Principales

- **Catálogo y Buscador con Filtros en URL:** Búsqueda por nombre y filtrado por elemento sincronizados con `query params` (`vue-router`) y paginación progresiva (*Cargar más*).
- **Ficha de Detalle Interactiva:** Retrato completo del personaje con transiciones animadas, historia oficial y visualización de habilidades activas con descripción emergente (`hover` en escritorio / toque en móvil).
- **Biblioteca de Favoritos:** Persistencia local mediante `localStorage` con transiciones animadas (`<TransitionGroup>`).
- **Internacionalización (`i18n`):** Cambio dinámico de idioma entre **Español**, **Inglés** y **Japonés** tanto en la interfaz como en los datos traídos desde la API.

---

## 🤖 Opción de IA Elegida: Asistente Pom-Pom

- **Servicio utilizado:** **Firebase AI Logic** (`firebase/ai`) conectado mediante `GoogleAIBackend` (Gemini Developer API en el **Plan Spark gratuito**), utilizando el modelo `gemini-3.8-flash`.
- **Funcionamiento:** Se implementó el componente `PomPomAsistente.vue` dentro de la vista de búsqueda, caracterizado mediante `systemInstruction` como **Pom-Pom** (el revisor del Expreso Astral). El asistente recibe como contexto el listado real de personajes cargados desde la API para recomendar personajes acordes al pedido del usuario, respetando el idioma elegido y manejando de forma clara los posibles límites de cuota gratuita (`429 / quota exceeded`).

---

## ⚙️ Configuración de Variables de Entorno y Firebase

Para conectar el proyecto con Firebase AI Logic, las credenciales de la aplicación web se configuran en `src/services/pomPomAi.js` (o mediante variables de entorno en un archivo `.env` en la raíz del proyecto):

1. Crear un proyecto en [Firebase Console](https://google.com) en el **Plan Spark** (sin facturación).
2. Habilitar **AI Logic > Gemini Developer API** y registrar una aplicación Web.
3. Si se utilizan variables de entorno con Vite, crear un archivo `.env` en la raíz basado en las siguientes claves:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_://firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

---

## 🚀 Instrucciones para Instalar y Correr el Proyecto

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DE_TU_REPOSITORIO_EN_GITHUB>
   cd honkai-star-rail-web
   ```

2. **Instalar las dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar el servidor de desarrollo local:**
   ```bash
   npm run dev
   ```
   Luego abrir en el navegador la dirección indicada por Vite (por defecto `http://localhost:5173`).

4. **Compilar para producción y desplegar en Firebase Hosting:**
   ```bash
   npm run build
   npx firebase-tools deploy
   ```

---

## 📸 Capturas de Pantalla

### Versión de Escritorio (Desktop)
![Vista de Escritorio - Inicio](public/img/captura-desktop-1.png)
![Vista de Escritorio - Buscador y Pom-Pom](public/img/captura-desktop-2.png)

### Versión Móvil (Mobile - 375px)
![Vista Móvil - Inicio](public/img/captura-mobile-1.png)
![Vista Móvil - Detalle](public/img/captura-mobile-2.png)
