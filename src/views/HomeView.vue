<script setup>
import { storeToRefs } from "pinia";

import BoardCreator from "../components/BoardCreator.vue";
import BoardItem from "../components/BoardItem.vue";
import LoadingIcon from "../components/icons/LoadingIcon.vue";
import MainLayout from "../layouts/MainLayout.vue";
import useBoardStore from "../stores/boards";

const boardStore = useBoardStore();
boardStore.load();
const { allBoards: boards } = storeToRefs(boardStore);

function onAddNewBoard(board) {
  return boardStore.save(board);
}
</script>

<template>
  <MainLayout>
    <main class="px-8 py-4 flex-grow">
      <p v-if="boards.loading" class="flex items-center mb-3">
        <LoadingIcon /> Loading...
      </p>

      <p v-else-if="boards.error" class="text-red-500 text-center">
        {{ boards.error.message }}
      </p>

      <div
        v-else
        class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <BoardItem
          v-for="board in boards.list"
          :key="board.id"
          :board="board"
        />
        <BoardCreator :saveBoard="onAddNewBoard" />
      </div>
    </main>
  </MainLayout>
</template>
