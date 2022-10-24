<script setup>
import { nextTick, ref } from "vue";

import LoadingIcon from "./icons/LoadingIcon.vue";
import TrashIcon from "./icons/TrashIcon.vue";

const props = defineProps(["board", "updateBoard", "removeBoard"]);

const inputShown = ref(false);
const loading = ref(false);
const input = ref();
const boardName = ref(props.board.name);

const showInput = () => {
  inputShown.value = true;
  boardName.value = props.board.name;

  nextTick(() => {
    input.value?.focus();
    input.value?.select();
  });
};

function clear() {
  inputShown.value = false;
  boardName.value = props.board.name;
}

async function updateBoard() {
  inputShown.value = false;

  if (!boardName.value || boardName.value === props.board.name) return;

  loading.value = true;
  await props.updateBoard(boardName.value);
  loading.value = false;
}

async function removeBoard() {
  const confirmation = confirm(
    "Are you sure you want to delete this board?\nAll columns and cards from this board will be delete as well!"
  );

  if (!confirmation) return;

  await props.removeBoard();
}
</script>

<template>
  <div class="flex items-center gap-4">
    <input
      v-if="inputShown"
      v-model="boardName"
      type="text"
      ref="input"
      class="input input-bordered text-2xl flex-1"
      @keyup.enter="updateBoard"
      @keyup.esc="clear"
      @blur="clear"
    />

    <button
      v-else
      class="btn btn-block btn-ghost text-2xl flex-1"
      @click="showInput"
    >
      <span class="text-left w-full">
        {{ board.name }}
      </span>
    </button>

    <LoadingIcon v-if="loading" />

    <button @click="removeBoard" class="btn btn-ghost">
      <TrashIcon />
    </button>
  </div>
</template>
