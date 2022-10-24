<script setup>
import { nextTick, ref } from "vue";

import LoadingIcon from "./icons/LoadingIcon.vue";
import TrashIcon from "./icons/TrashIcon.vue";

const props = defineProps(["column", "updateColumn", "removeColumn"]);
const inputShown = ref(false);
const loading = ref(false);
const input = ref();
const columnName = ref(props.column.name);

const showForm = () => {
  inputShown.value = true;
  columnName.value = props.column.name;
  nextTick(() => {
    input.value?.focus();
    input.value?.select();
  });
};

function clear() {
  inputShown.value = false;
  columnName.value = props.column.name;
}

async function updateColumn() {
  inputShown.value = false;

  if (!columnName.value || columnName.value === props.column.name) return;

  loading.value = true;
  await props.updateColumn(props.column.id, columnName.value);
  loading.value = false;
}

async function removeColumn() {
  const confirmation = confirm(
    "Are you sure you want to delete this column?\nAll cards from this column will be delete as well!"
  );

  if (!confirmation) return;

  loading.value = true;
  await props.removeColumn(props.column.id);
  loading.value = false;
}
</script>

<template>
  <div class="bg-base-300 p-3 rounded-t-2xl flex gap-2 items-center">
    <input
      v-if="inputShown"
      type="text"
      class="input input-bordered input-sm w-full"
      v-model="columnName"
      ref="input"
      @keyup.enter="updateColumn"
      @keyup.esc="clear"
      @blur="clear"
    />

    <button v-else @click="showForm" class="btn btn-sm btn-ghost h-auto flex-1">
      <h2 class="text-left w-full">{{ column.name }}</h2>
    </button>

    <LoadingIcon v-if="loading" />

    <button @click="removeColumn" class="btn btn-sm btn-ghost">
      <TrashIcon class="h-4" />
    </button>
  </div>
</template>
