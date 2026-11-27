<script setup>
import { RouterLink } from 'vue-router'
import { useIdioma } from '@/composables/useIdioma'
const { t } = useIdioma()
</script>

<template>
  <main class="container text-center py-5 mt-5">
    <h1 class="display-1 fw-bold text-warning">404</h1>

    <h2 class="text-light mb-3">{{ t.error404.titulo }}</h2>

    <p class="text-secondary mb-4">
      {{ t.error404.descripcion }}
    </p>

    <RouterLink to="/" class="btn btn-warning">
      {{ t.error404.btnVolver }}
    </RouterLink>
  </main>
</template>
