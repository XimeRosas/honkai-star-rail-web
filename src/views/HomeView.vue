<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  obtenerPersonajes,
  obtenerImagen
} from '../services/honkaiApi'

import { useIdioma } from '@/composables/useIdioma'
const { t } = useIdioma()

const personajes = ref([])
const cargando = ref(false)
const error = ref('')

// Seleccionar los primeros cuatro personajes
const personajesDestacados = computed(() => {
  return personajes.value.slice(0, 4)
})

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

onMounted(() => {
  cargarPersonajes()
})
</script>

<template>
  <main>
    <div class="contenido-principal">
      <header class="hero-banner py-5 bg-black border-bottom border-secondary">
        <div class="container py-3">
          <h1 class="home-titulo display-5">
            Honkai: Star Rail
          </h1>
          <p class="parrafo-hero "> {{ t.hero.subtitulo }}</p>
  
           <a class="btn-hero" href="#">{{ t.hero.btnExplorar }}</a>
        </div>
      </header>

    </div>

    <!--Seccion 2 presentacion del juego-->
    <section class="historia-section my-5">
  <div class="container">
    <div class="row align-items-center">

      <!-- Columna izquierda: Personajes flotando y sobresaliendo del fondo -->
      <div class="col-12 col-lg-6 text-center position-relative">
        <img
          src="/img/protas-seccion1.png"
          alt="Caelus y Stelle - Trazacaminos"
          class="img-fluid personajes-flotantes"
        />
      </div>

      <!-- Columna derecha: Título, historia y botón -->
      <div class="col-12 col-lg-6 text-white py-4 py-lg-0 ps-lg-5">
        <h2 class="historia-titulo fw-bold mb-3">
          {{ t.historia.titulo }}
        </h2>

        <p class="historia-parrafo mb-4">
          {{ t.historia.parrafo }}
        </p>

        <RouterLink to="/buscador" class="btn-historia">
          {{ t.historia.btn }}
        </RouterLink>
      </div>

    </div>
  </div>
    </section>


    <!--Seccion 3 personajes del juego-->
    <section class="container py-5">
  <h2 class="titulo-personaje display-5 mb-5">
    {{ t.destacados.titulo }}
  </h2>

  <div v-if="cargando" class="text-center text-light py-5">
    <div class="spinner-border text-warning"></div>
    <p class="mt-3">{{ t.destacados.cargando }}</p>
  </div>

  <div v-else-if="error" class="alert alert-danger">
    {{ error }}

    <button
      @click="cargarPersonajes"
      class="btn btn-outline-danger btn-sm ms-3"
    >
      {{ t.destacados.reintentar }}
    </button>
  </div>

  <template v-else>
    <div class="row g-4">
      <div
        v-for="personaje in personajesDestacados"
        :key="personaje.id"
        class="col-6 col-md-3"
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

            <span class="personaje-estrellas d-block mb-2">
              {{ personaje.rarity }} ★
            </span>

            <RouterLink
              :to="`/detalle/${personaje.id}`"
              class="btn btn-dark btn-sm px-3 rounded-pill"
            >
              {{ t.destacados.verMas }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center mt-5">
      <RouterLink
        to="/buscador"
        class="btn-hero d-inline-block"
      >
        {{ t.destacados.verTodos }}
      </RouterLink>
    </div>
  </template>
    </section>

    <section class="descarga-section my-5">
  <div class="container py-5">
    <div class="row align-items-center">
      <!-- Columna izquierda vacía en escritorio para dejar lucir el Expreso Astral del fondo -->
      <div class="col-12 col-lg-6"></div>

      <!-- Columna derecha con título, invitación a jugar y botones de descarga -->
      <div class="col-12 col-lg-6 text-white descarga-contenido">
        <h2 class="descarga-titulo fw-bold mb-3">
          {{ t.descarga.titulo }}
        </h2>

        <p class="descarga-parrafo mb-4">
          {{ t.descarga.parrafo }}
        </p>

        <!-- Botones de Google Play y App Store -->
        <div class="d-flex flex-wrap gap-3">
          <a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-store d-flex align-items-center gap-2 px-3 py-2 rounded-3"
          >
            <!-- Ícono SVG de Google Play -->
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            <div class="text-start lh-1">
              <small class="d-block store-sub">{{ t.descarga.disponible }}</small>
              <span class="fw-bold store-name">Google Play</span>
            </div>
          </a>

          <a
            href="https://apple.com"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-store d-flex align-items-center gap-2 px-3 py-2 rounded-3"
          >
            <!-- Ícono SVG de Apple -->
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
            </svg>
            <div class="text-start lh-1">
              <small class="d-block store-sub">{{ t.descarga.consiguelo }}</small>
              <span class="fw-bold store-name">App Store</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<footer class="footer-hsr border-top border-secondary mt-5 py-5 text-light">
  <div class="container">
    <div class="row align-items-center gy-4">
      
      <!-- Logo a la izquierda como en tu boceto -->
      <div class="col-12 col-md-4 text-center text-md-start">
        <RouterLink to="/">
          <img src="/img/logo.png" alt="Honkai Star Rail" class="footer-logo mb-2" />
        </RouterLink>
        <p class="small text-secondary mb-0">
          {{ t.footer.descripcion }}
        </p>
      </div>

      <!-- Enlaces rápidos al centro -->
      <div class="col-12 col-md-4 text-center">
        <ul class="list-inline mb-0">
          <li class="list-inline-item mx-3">
            <RouterLink to="/" class="footer-link">{{ t.nav.inicio }}</RouterLink>
          </li>
          <li class="list-inline-item mx-3">
            <RouterLink to="/buscador" class="footer-link">{{ t.nav.personajes }}</RouterLink>
          </li>
          <li class="list-inline-item mx-3">
            <RouterLink to="/favoritos" class="footer-link">{{ t.nav.favoritos }}</RouterLink>
          </li>
        </ul>
      </div>

      <!-- Créditos y aviso de fan-project a la derecha -->
      <div class="col-12 col-md-4 text-center text-md-end">
        <p class="small text-secondary mb-1">
          {{ t.footer.datos }} <span class="text-light">StarRailStaticAPI</span>
        </p>
        <p class="small text-secondary mb-0">
          {{ t.footer.creditos }}
        </p>
      </div>

    </div>
  </div>
</footer>
  </main>
</template>
