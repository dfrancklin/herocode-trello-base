<script setup>
import { nextTick, ref } from "vue";
import LoadingIcon from "./icons/LoadingIcon.vue";

const props = defineProps({
  saveColumn: {
    type: Function,
    required: true,
  },
});

const formShown = ref(false);
const errorMessage = ref();
const loading = ref(false);
const columnName = ref("");
const input = ref();

function showForm() {
  formShown.value = true;
  nextTick(() => input.value?.focus());
}

async function saveColumn() {
  loading.value = true;
  const { error } = await props.saveColumn(columnName.value);
  loading.value = false;

  if (error) {
    errorMessage.value = error;
    return;
  }

  clear();
}

function clear() {
  errorMessage.value = "";
  columnName.value = "";
  formShown.value = false;
}
</script>

<template>
  <div v-if="formShown" class="w-full grid gap-4 p-4 bg-base-300 rounded-xl">
    <h2 class="text-xl text-center font-semibold uppercase">New Column</h2>

    <p v-if="errorMessage" class="text-red-500 text-center">
      {{ errorMessage }}
    </p>

    <LoadingIcon v-if="loading" />

    <input
      v-else
      type="text"
      ref="input"
      v-model="columnName"
      class="input input-bordered w-full"
      @keyup.enter="saveColumn"
      @keyup.esc="clear"
      @blur="clear"
    />
  </div>

  <button
    v-else
    @click="showForm"
    class="btn btn-primary h-auto text-5xl aspect-video"
  >
    &plus;
  </button>
</template>
