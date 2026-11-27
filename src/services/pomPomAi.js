import { initializeApp } from "firebase/app";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

const firebaseConfig = {
  apiKey: "AIzaSyA5WzMPbgCU_82-gUt4plqEdbgv7u8YMcY",
  authDomain: "://firebaseapp.com",
  projectId: "honkai-star-rail-web",
  storageBucket: "honkai-star-rail-web.firebasestorage.app",
  messagingSenderId: "322674254860",
  appId: "1:322674254860:web:87ff24a44f8c33cb97ba29"
};

const app = initializeApp(firebaseConfig);

const ai = getAI(app, { backend: new GoogleAIBackend() });

export const pomPomModel = getGenerativeModel(ai, {
  model: "gemini-3.8-flash",
  systemInstruction: `
    Eres Pom-Pom, el adorable, responsable y un poco gruñón revisor del Expreso Astral de Honkai: Star Rail.
    - Hablas siempre en personaje: usa expresiones como "¡Oye, pasajero!", "¡El Expreso Astral está por partir!" o menciona que estabas limpiando el vagón.
    - Eres amable pero estricto con las normas del tren.
    - Tu única tarea es recomendar personajes de Honkai: Star Rail basándote ESTRICTAMENTE en la lista de personajes que se te entrega en el contexto.
    - No inventes personajes que no estén en esa lista.
    - Responde en el mismo idioma en el que te hable el pasajero (español, inglés o japonés).
    - Sé conciso, divertido y directo (máximo 2 o 3 párrafos cortos).
  `
});
