import { useIdioma } from '@/composables/useIdioma'

const BASE_API_URL = 'https://vizualabstract.github.io/StarRailStaticAPI/db'
const IMAGE_URL = 'https://vizualabstract.github.io/StarRailStaticAPI/assets/'

export async function obtenerPersonajes() {
  const { idiomaActual } = useIdioma()

  // Ahora la URL usa el idioma seleccionado dinámicamente (es, en o jp)
  const respuesta = await fetch(`${BASE_API_URL}/${idiomaActual.value}/characters.json`)

  if (!respuesta.ok) {
    throw new Error('No se pudieron cargar los personajes')
  }

  const datos = await respuesta.json()

  return Object.values(datos).filter(
    personaje => personaje.name !== '{NICKNAME}'
  )
}

export function obtenerImagen(ruta) {
  if (!ruta) return ''

  return `${IMAGE_URL}${ruta}`
}
