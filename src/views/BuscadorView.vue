<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { obtenerPersonajes, obtenerImagen } from '../services/honkaiApi'
import PomPomAsistente from '@/components/PomPomAsistente.vue'

import { useIdioma } from '@/composables/useIdioma'
const { idiomaActual, t } = useIdioma()

const route = useRoute()
const router = useRouter()

const personajes = ref([])
const busqueda = ref(
  typeof route.query.busqueda === 'string' ? route.query.busqueda : ''
)
const elementoSeleccionado = ref(
  typeof route.query.elemento === 'string' ? route.query.elemento : ''
)
const cargando = ref(false)
const error = ref('')

// Cantidad de personajes que se muestran inicialmente
const cantidadVisible = ref(12)

// Personajes que se muestran en pantalla
const personajesVisibles = computed(() => {
  return personajesFiltrados.value.slice(0, cantidadVisible.value)
})

function cargarMas() {
  cantidadVisible.value += 12
}

// Reiniciar la cantidad visible cuando cambian los filtros
watch([busqueda, elementoSeleccionado], () => {
  cantidadVisible.value = 12
})

const elementos = computed(() => t.value.buscador.elementos)

const personajesFiltrados = computed(() => {
  return personajes.value.filter(personaje => {
    const coincideNombre = personaje.name
      .toLowerCase()
      .includes(busqueda.value.toLowerCase())

    const coincideElemento = elementoSeleccionado.value === '' ||
      personaje.element === elementoSeleccionado.value

    return coincideNombre && coincideElemento
  })
})

// Actualizar la URL cuando cambian los filtros
watch([busqueda, elementoSeleccionado], () => {
  const nuevaQuery = { ...route.query }

  if (busqueda.value.trim()) {
    nuevaQuery.busqueda = busqueda.value
  } else {
    delete nuevaQuery.busqueda
  }

  if (elementoSeleccionado.value) {
    nuevaQuery.elemento = elementoSeleccionado.value
  } else {
    delete nuevaQuery.elemento
  }

  const mismaBusqueda =
    route.query.busqueda === nuevaQuery.busqueda

  const mismoElemento =
    route.query.elemento === nuevaQuery.elemento

  if (!mismaBusqueda || !mismoElemento) {
    router.replace({ query: nuevaQuery })
  }
})

// Recuperar los filtros cuando cambia la URL
watch(
  () => route.query,
  (query) => {
    busqueda.value =
      typeof query.busqueda === 'string' ? query.busqueda : ''

    elementoSeleccionado.value =
      typeof query.elemento === 'string' ? query.elemento : ''
  }
)

async function cargarPersonajes() {
  cargando.value = true
  error.value = ''

  try {
    personajes.value = await obtenerPersonajes()
  } catch (err) {
    error.value = t.value.destacados.error
    console.error(err)
  } finally {
    cargando.value = false
  }
}

watch(idiomaActual, () => {
  cargarPersonajes()
})

onMounted(() => {
  cargarPersonajes()
})
</script>


<template>
  <main>
    <div class="contenido-principal">
      <header class="hero-banner-buscador py-5 bg-black border-bottom border-secondary">
        <div class="container py-3">
          <h1 class="home-titulo display-5">
            {{ t.buscador.heroTitulo }}
          </h1>
          <p class="parrafo-hero "> {{ t.buscador.heroSubtitulo }}</p>
  
        </div>
      </header>
    </div>

    <section class="container py-5">

      <PomPomAsistente v-if="!cargando && personajes.length" :personajes="personajes" />

      <!-- Buscador y filtros -->
      <div class="buscador row g-3 mb-4">
        <div class="col-12 col-md-8">
          <input
            v-model="busqueda"
            type="text"
            class="form-control bg-black text-light border-secondary"
            :placeholder="t.buscador.placeholder"
          />
        </div>

        <div class="col-12 col-md-4">
          <select
            v-model="elementoSeleccionado"
            class="form-select bg-black text-light border-secondary"
          >
            <option value="">{{ t.buscador.todosElementos }}</option>

            <option
              v-for="(nombre, codigo) in elementos"
              :key="codigo"
              :value="codigo"
            >
              {{ nombre }}
            </option>
          </select>
        </div>
      </div>

      <!-- Cargando -->
      <div v-if="cargando" class="text-center text-light py-5">
        <div class="spinner-border text-warning"></div>
        <p class="mt-3">{{ t.destacados.cargando }}</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}

        <button
          @click="cargarPersonajes"
          class="btn btn-outline-danger btn-sm ms-3"
        >
          {{ t.destacados.reintentar }}
        </button>
      </div>

      <!-- Resultados -->

      <template v-else>
        <p class="text-secondary mb-3">
          {{ personajesFiltrados.length }} {{ t.buscador.encontrados }}
        </p>

        <div v-if="personajesFiltrados.length" class="row g-4">

          <div
            v-for="personaje in personajesVisibles"
            :key="personaje.id"
            class="col-6 col-md-4 col-lg-3"
          >
            <div class="card card-hsr border-0">

              <img
                :src="obtenerImagen(personaje.preview)"
                :alt="personaje.name"
                class="card-img-top personaje-img"
                loading="lazy"
              />

              <div class="card-body card-hsr-info text-center">
                <h5 class="card-title personaje-nombre fw-bold mb-1">
                  {{ personaje.name }}
                </h5>

                <span class="personaje-estrellas d-block mb-1">
                  {{ personaje.rarity }} ★
                </span>

                <p class="personaje-elemento small mb-2">
                  {{ elementos[personaje.element] || personaje.element }}
                </p>

                <RouterLink
                  :to="`/detalle/${personaje.id}`"
                  class="btn btn-dark btn-sm px-3 rounded-pill"
                >
                  {{ t.buscador.verDetalles }}
                </RouterLink>

              </div>
            </div>
          </div>
        </div>

        <div v-else class="alert alert-secondary bg-black text-light">
          {{ t.buscador.sinResultados }}
        </div>

        <div
          v-if="personajesVisibles.length < personajesFiltrados.length"
          class="text-center mt-5"
        >
          <button
            @click="cargarMas"
            class="btn-hero d-inline-block"
          >
            {{ t.buscador.cargarMas }}
          </button>
        </div>
      </template>


    </section>
  </main>
</template>
