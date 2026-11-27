<template>
  <div class="pompom-box p-4 rounded-4 border border-warning my-4">
    <div class="d-flex align-items-center mb-3">
      <div class="pompom-badge d-flex align-items-center justify-content-center me-3">
        <img src="/img/pompom.jpg" alt="Pom-Pom"
            class="pompom-avatar me-3">
      </div>
      <div>
        <h4 class="text-warning fw-bold mb-0">Asistente del Expreso: Pom-Pom</h4>
        <small class="text-light opacity-75">
          Cuéntame qué tipo de personaje buscas para tu equipo
        </small>
      </div>
    </div>

    <form @submit.prevent="pedirRecomendacion" class="d-flex flex-column flex-sm-row gap-2 mb-3">
      <input
        v-model="pedidoUsuario"
        type="text"
        class="form-control bg-black text-white border-secondary"
        placeholder="Ej: Busco un personaje de fuego que haga mucho daño o alguien que cure..."
        :disabled="pensando"
      />
      <button
        type="submit"
        class="btn btn-warning fw-bold px-4"
        :disabled="pensando || !pedidoUsuario.trim()"
      >
        {{ pensando ? 'Revisando vagones...' : 'Preguntar a Pom-Pom' }}
      </button>
    </form>

    <!-- Mensaje claro si se alcanza el límite de cuota gratuita (Plan Spark) -->
    <div v-if="errorCuota" class="alert alert-warning mb-0">
      <strong>¡Freno de emergencia, pasajero!</strong> {{ errorCuota }}
    </div>

    <!-- Respuesta en personaje de Pom-Pom -->
    <div
      v-else-if="respuestaPomPom"
      class="p-3 rounded-3 bg-black border border-secondary text-light"
    >
      <p class="mb-0" style="white-space: pre-line;">{{ respuestaPomPom }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { pomPomModel } from '@/services/pomPomAi'

const props = defineProps({
  personajes: {
    type: Array,
    required: true
  }
})

const pedidoUsuario = ref('')
const respuestaPomPom = ref('')
const errorCuota = ref('')
const pensando = ref(false)

async function pedirRecomendacion() {
  if (!pedidoUsuario.value.trim()) return

  pensando.value = true
  errorCuota.value = ''
  respuestaPomPom.value = ''

  try {
    // Enviamos solo los datos esenciales de los personajes ya cargados para ahorrar cuota
    const contextoPersonajes = props.personajes.map(p => ({
      nombre: p.name,
      rareza: `${p.rarity} estrellas`,
      elemento: p.element,
      via: p.path
    }))

    const promptCompleto = `
      Personajes cargados actualmente en el Expreso Astral:
      ${JSON.stringify(contextoPersonajes)}

      Pedido del pasajero: "${pedidoUsuario.value}"
    `

    const result = await pomPomModel.generateContent(promptCompleto)
    respuestaPomPom.value = result.response.text()
  } catch (error) {
    console.error('Error con Firebase AI:', error)
    const msg = error?.message?.toLowerCase() || ''

    // Detecta límite de cuota del Plan Spark (429 / resource-exhausted)
    if (
      error?.status === 429 ||
      msg.includes('429') ||
      msg.includes('quota') ||
      msg.includes('resource-exhausted') ||
      msg.includes('rate limit')
    ) {
      errorCuota.value =
        'Se alcanzó el límite gratuito de consultas de IA (cuota excedida). ¡Espera un minuto mientras Pom-Pom revisa los motores del Expreso Astral e inténtalo de nuevo!'
    } else {
      errorCuota.value =
        '¡Hubo una interferencia espacial al conectar con Pom-Pom! Verifica tu conexión o inténtalo en unos segundos.'
    }
  } finally {
    pensando.value = false
  }
}
</script>

<style scoped>
.pompom-box {
  background: linear-gradient(180deg, #1b1b24 0%, #111116 100%);
}

.pompom-badge {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #262632;
  border: 2px solid #ffc107;
  font-size: 1.5rem;
  flex-shrink: 0;
}
</style>
