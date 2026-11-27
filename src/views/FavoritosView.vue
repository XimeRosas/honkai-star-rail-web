<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { obtenerImagen } from '../services/honkaiApi'
import {
  obtenerFavoritos,
  quitarFavorito
} from '../services/favoritosService'
import { useIdioma } from '@/composables/useIdioma'
const { idiomaActual, t } = useIdioma()

const favoritos = ref([])

function cargarFavoritos() {
  favoritos.value = obtenerFavoritos()
}

function eliminarFavorito(id) {
  quitarFavorito(id)
  cargarFavoritos()
}

onMounted(() => {
  cargarFavoritos()
})
</script>


<template>
  <main class="container py-5">
    <h1 class="titulo-favorito fw-bold text-white display-5 mb-5">{{ t.favoritos.titulo }}</h1>

    <div
      v-if="favoritos.length === 0"
      class="alert alert-secondary bg-black text-light border-secondary"
    >
      {{ t.favoritos.vacio }}
      <RouterLink to="/" class="alert-link text-warning">{{ t.favoritos.explorar }}</RouterLink>
    </div>

    <TransitionGroup
      v-else
      name="favoritos"
      tag="div"
      class="row g-4"
    >
      <div
        v-for="personaje in favoritos"
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

            <span class="personaje-estrellas d-block mb-2">
              {{ personaje.rarity }} ★
            </span>

            <div class="d-flex justify-content-center gap-2">
              <RouterLink
                :to="`/detalle/${personaje.id}`"
                class="btn btn-dark btn-sm px-3 rounded-pill"
              >
                {{ t.buscador.verDetalles }}
              </RouterLink>

              <button
                @click="eliminarFavorito(personaje.id)"
                class="btn btn-danger btn-sm px-3 rounded-pill"
              >
                {{ t.favoritos.quitar }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </main>
</template>
