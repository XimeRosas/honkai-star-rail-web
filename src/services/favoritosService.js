const CLAVE_FAVORITOS = 'honkai-favoritos'

export function obtenerFavoritos() {
  const guardados = localStorage.getItem(CLAVE_FAVORITOS)
  return guardados ? JSON.parse(guardados) : []
}

export function agregarFavorito(personaje) {
  const favoritos = obtenerFavoritos()

  const yaExiste = favoritos.some(
    favorito => favorito.id === personaje.id
  )

  if (!yaExiste) {
    favoritos.push(personaje)
    localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos))
  }
}

export function quitarFavorito(id) {
  const favoritos = obtenerFavoritos()

  const actualizados = favoritos.filter(
    favorito => favorito.id !== id
  )

  localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(actualizados))
}

export function esFavorito(id) {
  return obtenerFavoritos().some(
    favorito => favorito.id === id
  )
}
