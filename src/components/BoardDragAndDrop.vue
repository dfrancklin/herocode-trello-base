<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import draggable from "vuedraggable-es";

import useBoardStore from "../stores/boards";
import useCardStore from "../stores/cards";
import useColumnStore from "../stores/columns";

import LoadingIcon from "./icons/LoadingIcon.vue";

import BoardHeader from "./BoardHeader.vue";
import CardCreator from "./CardCreator.vue";
import CardItem from "./CardItem.vue";
import ColumnCreator from "./ColumnCreator.vue";
import ColumnHeader from "./ColumnHeader.vue";

const router = useRouter();
const route = useRoute();
const boardStore = useBoardStore();
const columnStore = useColumnStore();
const cardStore = useCardStore();

const boardId = route.params.boardId;
const { board, columnsById, cardsById, error } = await boardStore.loadById(
  boardId
);
const removing = ref(false);

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

// BOARD FUNCTIONS
async function onUpdateBoard(boardName) {
  const { error, data } = await boardStore.update(boardId, { name: boardName });

  if (error) {
    alert(error.message);
    return;
  }

  board.value.name = data[0].name;
}

async function onRemoveBoard() {
  removing.value = true;
  const cardIds = Object.keys(cardsById.value);
  const { error: cardError } = await cardStore.removeMultiple(cardIds);

  if (cardError) {
    removing.value = false;
    alert(
      "An error occurred while trying to delete all the cards from this board\nError: " +
        cardError.message +
        "\nPlease, refresh the page and try again!"
    );
    return;
  }

  const columnIds = Object.keys(columnsById.value);
  const { error: columnError } = await columnStore.removeMultiple(columnIds);

  if (columnError) {
    removing.value = false;
    alert(
      "An error occurred while trying to delete all the columns from this board\nError: " +
        columnError.message +
        "\nPlease, refresh the page and try again!"
    );
    return;
  }

  const { error: boardError } = await boardStore.remove(boardId);

  if (boardError) {
    removing.value = false;
    alert(
      "An error occurred while trying to delete this board\nError: " +
        boardError.message +
        "\nPlease, refresh the page and try again!"
    );
    return;
  }

  removing.value = false;
  alert("Successfully deleted this board");
  router.push({ name: "home" });
}

// COLUMN FUNCTIONS
async function onSaveColumn(columnName) {
  const { column, error } = await columnStore.save(boardId, columnName);

  if (error) {
    return { error };
  }

  column.order = JSON.parse(column.card_order);
  columnsById.value[column.id] = column;
  board.value.columns.push(column);
  board.value.order.push(column.id);

  return {};
}

async function onUpdateColumn(columnId, columnName) {
  const { error, data } = await columnStore.update(columnId, {
    name: columnName,
  });

  if (error) {
    alert(error.message);
    return;
  }

  columnsById.value[columnId].name = data[0].name;
}

async function onRemoveColumn(columnId) {
  const cardIds = columnsById.value[columnId].order;
  const { error: cardError } = await cardStore.removeMultiple(cardIds);

  if (cardError) {
    alert(
      "An error occurred while trying to delete all the cards from the column\nError: " +
        cardError.message +
        "\nPlease, refresh the page and try again!"
    );
    return;
  }

  const { error: columnError } = await columnStore.remove(columnId);

  if (columnError) {
    alert(
      "An error occurred while trying to delete the column\nError: " +
        columnError.message +
        "\nPlease, refresh the page and try again!"
    );
    return;
  }

  board.value.cards = board.value.cards.filter(
    (card) => !cardIds.includes(card.id)
  );
  board.value.order = board.value.order.filter((it) => it !== columnId);
  board.value.columns = board.value.columns.filter(
    (column) => column.id !== columnId
  );
}

// CARD FUNCTIONS
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

function onRemoveCard(columnId) {
  return async (cardId) => {
    const { error } = await cardStore.remove(cardId);

    if (error) {
      return { error };
    }

    const cardIndex = board.value.cards.findIndex((card) => card.id === cardId);
    const orderIndex = columnsById.value[columnId].order.indexOf(cardId);
    board.value?.cards.splice(cardIndex, 1);
    columnsById.value[columnId].order.splice(orderIndex, 1);

    return {};
  };
}
</script>

<template>
  <p v-if="error" class="text-red-500 text-center">{{ error.message }}</p>
  <p v-else-if="!error && !board" class="text-red-500 text-center">
    No board found!
  </p>

  <template v-else>
    <BoardHeader
      :board="board"
      :updateBoard="onUpdateBoard"
      :removeBoard="onRemoveBoard"
    />

    <p v-if="removing" class="flex items-center mb-3">
      <LoadingIcon /> Removing...
    </p>

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
              <ColumnHeader
                v-if="columnsById[columnId]"
                :column="columnsById[columnId]"
                :updateColumn="onUpdateColumn"
                :removeColumn="onRemoveColumn"
              />

              <div
                class="flex flex-grow overflow-y-auto p-3 gap-3 max-h-[calc(100vh_-_17.5rem)]"
              >
                <draggable
                  :list="columnsById[columnId]?.order"
                  group="cards"
                  :item-key="(id) => `card-${id}`"
                  animation="200"
                  class="flex flex-col flex-grow gap-4 overflow-hidden"
                >
                  <template #item="{ element: cardId }">
                    <div class="cursor-move">
                      <CardItem
                        v-if="cardsById[cardId]"
                        :card="cardsById[cardId]"
                        :updateCard="onUpdateCard"
                        :removeCard="onRemoveCard(columnId)"
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
