<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { obtenerPersonajes, obtenerImagen } from '../services/honkaiApi'
import {
  agregarFavorito,
  quitarFavorito,
  esFavorito
} from '../services/favoritosService'
import { useIdioma } from '@/composables/useIdioma'
const { idiomaActual, t } = useIdioma()

const route = useRoute()

const personaje = ref(null)
const infoVia = ref(null)
const infoElemento = ref(null)
const descripcionPersonaje = ref('')
const habilidadesPersonaje = ref([])
const cargando = ref(false)
const error = ref('')
const guardado = ref(false)

// Limpia etiquetas internas del juego como #1[i]% o colores HTML
function limpiarTextoSkill(texto) {
  if (!texto) return ''
  return texto
    .replace(/<[^>]*>/g, '')
    .replace(/#\d+\[i\]%?/g, 'X')
    .replace(/\{F#[^}]*\}\{M#([^}]*)\}/g, '$1')
}

async function cargarPersonaje() {
  cargando.value = true
  error.value = ''
  personaje.value = null

  try {
    const BASE_DB = `https://vizualabstract.github.io/StarRailStaticAPI/db/${idiomaActual.value}`

    // Cargamos tus personajes + los endpoints adicionales en paralelo según el idioma elegido
    const [personajes, resPaths, resElements, resDesc, resSkills] = await Promise.all([
      obtenerPersonajes(),
      fetch(`${BASE_DB}/paths.json`).then(r => r.json()),
      fetch(`${BASE_DB}/elements.json`).then(r => r.json()),
      fetch(`${BASE_DB}/descriptions.json`).then(r => r.json()),
      fetch(`${BASE_DB}/character_skills.json`).then(r => r.json())
    ])

    personaje.value = personajes.find(
      item => String(item.id) === String(route.params.id)
    )

    if (!personaje.value) {
      error.value = t.value.detalle.error
      return
    }

    guardado.value = esFavorito(personaje.value.id)

    // 1. Íconos y nombres oficiales de Vía y Elemento en el idioma elegido
    infoVia.value = resPaths[personaje.value.path] || null
    infoElemento.value = resElements[personaje.value.element] || null

    // 2. Buscamos la historia en descriptions.json coincidiendo con el nombre del personaje
    const listaDescripciones = Object.values(resDesc)
    const entradaDesc = listaDescripciones.find(
      d =>
        d.title?.toLowerCase() === personaje.value.name?.toLowerCase() ||
        (personaje.value.tag?.includes('player') && d.title === '{NICKNAME}')
    )

    descripcionPersonaje.value = entradaDesc
      ? limpiarTextoSkill(entradaDesc.desc)
      : ''

    // 3. Extraemos las habilidades principales (Ataque básico, Habilidad, Definitiva, Talento, Técnica)
    if (Array.isArray(personaje.value.skills)) {
      habilidadesPersonaje.value = personaje.value.skills
        .map(skillId => resSkills[skillId])
        .filter(skill => skill && skill.type_text)
    }
  } catch (err) {
    error.value = t.value.detalle.error
    console.error(err)
  } finally {
    cargando.value = false
  }
}

function alternarFavorito() {
  if (guardado.value) {
    quitarFavorito(personaje.value.id)
    guardado.value = false
  } else {
    agregarFavorito(personaje.value)
    guardado.value = true
  }
}

watch(idiomaActual, () => {
  cargarPersonaje()
})

onMounted(() => {
  cargarPersonaje()
})
</script>

<template>

  <main class="container pt-5 mt-5 pb-5 overflow-hidden">
    <RouterLink to="/" class="btn-hero btn-sm mb-4">
      {{ t.detalle.volver }}
    </RouterLink>

    <div v-if="cargando" class="text-center text-light py-5">
      <div class="spinner-border text-warning"></div>
      <p class="mt-3">{{ t.detalle.cargando }}</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
      <button @click="cargarPersonaje" class="btn btn-outline-danger btn-sm ms-3">
        {{ t.destacados.reintentar }}
      </button>
    </div>

    <div v-else-if="personaje" class="contenido-principal detalle-ficha p-3 p-md-5 rounded-4">
      <div class="row align-items-center g-4 g-lg-5">
        
        <!-- Imagen completa con transición desde la izquierda -->
        <div class="col-12 col-lg-6 text-center animar-izquierda">
          <img
            :src="obtenerImagen(personaje.portrait || personaje.preview)"
            :alt="personaje.name"
            class="img-fluid personaje-portrait"
          />
        </div>

        <!-- Información con transición desde la derecha -->
        <div class="col-12 col-lg-6 text-light animar-derecha">
          
          <!-- Badges con íconos y nombres reales de la API según el idioma -->
          <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
            <span class="badge bg-warning text-dark fs-6 px-3 py-2">
              {{ personaje.rarity }} ★
            </span>

            <span v-if="infoElemento" class="badge-api d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill">
              <img :src="obtenerImagen(infoElemento.icon)" :alt="infoElemento.name" class="icono-mini" />
              <span>{{ infoElemento.name }}</span>
            </span>

            <span v-if="infoVia" class="badge-api d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill">
              <img :src="obtenerImagen(infoVia.icon)" :alt="infoVia.name" class="icono-mini" />
              <span>{{ infoVia.name }}</span>
            </span>
          </div>

          <h1 class="titulo-detalle fw-bold text-white mb-3">
            {{ personaje.name }}
          </h1>

          <!-- Descripción / Historia desde descriptions.json -->
          <p v-if="descripcionPersonaje" class="descripcion-detalle text-light opacity-75 mb-4">
            {{ descripcionPersonaje }}
          </p>

          <!-- Habilidades con ventanita flotante al hacer hover -->
          <div v-if="habilidadesPersonaje.length" class="mb-4">
            <h6 class="text-uppercase text-secondary fw-bold mb-3">
              {{ t.detalle.habilidades }}
            </h6>

            <div class="d-flex flex-wrap gap-2 gap-sm-3">
              <div
                v-for="skill in habilidadesPersonaje"
                :key="skill.id"
                class="skill-wrapper position-relative"
                tabindex="0"
              >
                <div class="skill-circle">
                  <img
                    :src="obtenerImagen(skill.icon)"
                    :alt="skill.name"
                    class="skill-icon"
                  />
                </div>
                <small class="d-block text-center text-secondary mt-1 skill-tipo">
                  {{ skill.type_text }}
                </small>

                <!-- Ventanita flotante en hover -->
                <div class="skill-tooltip shadow-lg">
                  <div class="d-flex justify-content-between align-items-center border-bottom border-secondary pb-2 mb-2 gap-2">
                    <strong class="text-warning small">{{ skill.name }}</strong>
                    <span class="badge bg-secondary">{{ skill.type_text }}</span>
                  </div>
                  <p class="small mb-0 text-light">{{ limpiarTextoSkill(skill.desc) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Botón de Favoritos -->
          <button
            @click="alternarFavorito"
            class="btn fw-bold mt-2 w-100 w-sm-auto px-4 py-2"
            :class="guardado ? 'btn-outline-warning' : 'btn-warning'"
          >
            {{ guardado ? t.detalle.quitarFav : t.detalle.agregarFav }}
          </button>
        </div>

      </div>
    </div>
  </main>
</template>
