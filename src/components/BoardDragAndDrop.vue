<script setup>
import { useRoute } from "vue-router";
import draggable from "vuedraggable-es";

import useBoardStore from "../stores/boards";

const route = useRoute();
const boardStore = useBoardStore();

const boardId = route.params.boardId;
const { board, columnsById, cardsById, error } = await boardStore.loadById(
  boardId
);
console.log(board, error);
</script>

<template>
  <p v-if="error" class="text-red-500 text-center">{{ error.message }}</p>
  <p v-else-if="!error && !board" class="text-red-500 text-center">
    No board found!
  </p>

  <template v-else>
    <button class="btn btn-ghost h-auto">
      <h1 class="text-2xl text-left w-full">{{ board.name }}</h1>
    </button>

    <div class="overflow-x-auto flex flex-grow -mx-8">
      <div class="flex flex-grow px-8 pb-4">
        <draggable
          :list="board.order"
          group="columns"
          :item-key="(id) => `column-${id}`"
          class="flex flex-grow flex-shrink-0 overscroll-x-auto"
        >
          <template #item="{ element: columnId }">
            <div
              class="column bg-base-100 flex flex-col rounded-2xl mr-4 w-[300px]"
            >
              <h2>{{ columnsById[columnId].name }}</h2>

              <div
                class="flex flex-grow overflow-y-auto p-3 gap-3 max-h-[calc(100vh_-_17.5rem)]"
              >
                <draggable
                  :list="columnsById[columnId].order"
                  group="cards"
                  :item-key="(id) => `card-${id}`"
                  animation="200"
                  class="flex flex-col flex-grow gap-4 overflow-hidden"
                >
                  <template #item="{ element: cardId }">
                    <div class="cursor-move">
                      <h3>{{ cardsById[cardId].title }}</h3>
                    </div>
                  </template>
                </draggable>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </template>
</template>
