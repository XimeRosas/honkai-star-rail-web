<script setup>
import { RouterLink, RouterView } from 'vue-router'

import { useIdioma } from '@/composables/useIdioma'

const { idiomaActual, t, cambiarIdioma } = useIdioma()

</script>




<template>
 <nav class="navbar navbar-expand-lg navbar-dark bg-black fixed-top px-3">
  <div class="container-fluid">
    <RouterLink to="/">
      <img src="/img/logo.png" alt="Honkai Star Rail" class="logo" />
    </RouterLink>

    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNavAltMarkup"
      aria-controls="navbarNavAltMarkup"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
  <div class="navbar-nav ms-auto align-items-center text-center py-3 py-lg-0 gap-lg-3">
    <RouterLink class="nav-link" to="/">{{ t.nav.inicio }}</RouterLink>
    <RouterLink class="nav-link" to="/buscador">{{ t.nav.personajes }}</RouterLink>
    <RouterLink class="nav-link" to="/favoritos">{{ t.nav.favoritos }}</RouterLink>

    <!-- Botones para cambiar el idioma -->
    <div class="btn-group btn-group-sm ms-lg-3 mt-2 mt-lg-0" role="group">
      <button
        type="button"
        class="btn"
        :class="idiomaActual === 'es' ? 'btn-warning fw-bold' : 'btn-outline-light'"
        @click="cambiarIdioma('es')"
      >
        ES
      </button>
      <button
        type="button"
        class="btn"
        :class="idiomaActual === 'en' ? 'btn-warning fw-bold' : 'btn-outline-light'"
        @click="cambiarIdioma('en')"
      >
        EN
      </button>
      <button
        type="button"
        class="btn"
        :class="idiomaActual === 'jp' ? 'btn-warning fw-bold' : 'btn-outline-light'"
        @click="cambiarIdioma('jp')"
      >
        JP
      </button>
    </div>
  </div>
</div>


  </div>
</nav>

<RouterView v-slot="{ Component }">
  <Transition name="pagina" mode="out-in">
    <component :is="Component" />
  </Transition>
</RouterView>
</template>
