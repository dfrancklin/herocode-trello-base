<script setup>
import { nextTick, ref } from "vue";

import LoadingIcon from "./icons/LoadingIcon.vue";

const props = defineProps({
  saveCard: {
    type: Function,
    required: true,
  },
});

const inputShown = ref(false);
const errorMessage = ref();
const loading = ref(false);
const cardName = ref("");
const input = ref();

function showForm() {
  inputShown.value = true;
  nextTick(() => input.value?.focus());
}

async function saveCard() {
  loading.value = true;
  const { error } = await props.saveCard(cardName.value);
  loading.value = false;

  if (error) {
    errorMessage.value = error;
    return;
  }

  clear();
}

function clear() {
  errorMessage.value = "";
  cardName.value = "";
  inputShown.value = false;
}
</script>

<template>
  <div
    v-if="inputShown"
    class="w-full grid gap-4 p-4 bg-base-300 rounded-2xl rounded-t-none"
  >
    <h2 class="text-xl text-center font-semibold uppercase">New Card</h2>

    <p v-if="errorMessage" class="text-red-500 text-center">
      {{ errorMessage }}
    </p>

    <LoadingIcon v-if="loading" />

    <input
      v-else
      type="text"
      ref="input"
      v-model="cardName"
      class="input input-bordered w-full"
      @keyup.enter="saveCard"
      @keyup.esc="clear"
      @blur="clear"
    />
  </div>

  <button
    v-else
    @click="showForm"
    class="btn bg-base-300 border-base-300 rounded-t-none"
  >
    &plus; New Card
  </button>
</template>
