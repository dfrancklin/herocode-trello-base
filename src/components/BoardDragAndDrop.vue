<script setup>
import { watch } from "vue";
import { useRoute } from "vue-router";
import draggable from "vuedraggable-es";

import useBoardStore from "../stores/boards";
import useCardStore from "../stores/cards";
import useColumnStore from "../stores/columns";
import CardCreator from "./CardCreator.vue";
import CardItem from "./CardItem.vue";
import ColumnCreator from "./ColumnCreator.vue";

const route = useRoute();
const boardStore = useBoardStore();
const columnStore = useColumnStore();
const cardStore = useCardStore();

const boardId = route.params.boardId;
const { board, columnsById, cardsById, error } = await boardStore.loadById(
  boardId
);

watch(
  () => board.value?.order,
  async () => {
    board.value.column_order = JSON.stringify(board.value.order);
    const newColumnOrder = { column_order: board.value.column_order };
    await boardStore.update(board.value.id, newColumnOrder);
  },
  { deep: true }
);

watch(
  () => board.value?.columns,
  () => {
    console.log("columns updated");
    board.value?.columns.forEach(async (column) => {
      const newCardOrder = JSON.stringify(column.order);

      if (newCardOrder !== column.card_order) {
        column.card_order = newCardOrder;
        await columnStore.update(column.id, { card_order: newCardOrder });
      }
    });
  },
  { deep: true }
);

async function onSaveColumn(columnName) {
  const { column, error } = await columnStore.save(boardId, columnName);

  if (error) {
    return { error };
  }

  board.value.columns.push(column);
  board.value.order.push(column.id);

  return {};
}

function onSaveCard(columnId) {
  return async (cardName) => {
    const { card, error } = await cardStore.save(boardId, cardName);

    if (error) {
      return { error };
    }

    board.value.cards.push(card);
    columnsById.value[columnId].order.push(card.id);

    return {};
  };
}

async function onUpdateCard(cardId, newValues) {
  const { error, data } = await cardStore.update(cardId, newValues);

  if (error) {
    return { error: error.message };
  }

  const index = board.value?.cards.findIndex((card) => card.id === data[0].id);
  board.value?.cards.splice(index, 1, data[0]);

  return {};
}
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
              <div class="bg-base-300 p-3 rounded-t-xl flex gap-2 items-center">
                <button class="btn btn-sm btn-ghost h-auto flex-1">
                  <h2 class="text-left w-full">
                    {{ columnsById[columnId].name }}
                  </h2>
                </button>
              </div>

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
                      <CardItem
                        :card="cardsById[cardId]"
                        :updateCard="onUpdateCard"
                      />
                    </div>
                  </template>
                </draggable>
              </div>

              <CardCreator :saveCard="onSaveCard(columnId)" />
            </div>
          </template>

          <template #footer>
            <div class="column flex flex-col mr-4 w-[300px]">
              <ColumnCreator :saveColumn="onSaveColumn" />
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </template>
</template>
