import { ref, computed } from 'vue'
import es from '../locales/es.json'
import en from '../locales/en.json'
import jp from '../locales/jp.json'

const mensajes = { es, en, jp }
const idiomaActual = ref(localStorage.getItem('hsr-idioma') || 'es')

export function useIdioma() {
  const t = computed(() => mensajes[idiomaActual.value] || mensajes.es)

  function cambiarIdioma(nuevoIdioma) {
    if (mensajes[nuevoIdioma]) {
      idiomaActual.value = nuevoIdioma
      localStorage.setItem('hsr-idioma', nuevoIdioma)
    }
  }

  return {
    idiomaActual,
    t,
    cambiarIdioma
  }
}
