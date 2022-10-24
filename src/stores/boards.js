import { defineStore } from "pinia";
import { ref, watch } from "vue";

import supabase from "../config/supabase";
import useUserStore from "./user";

const useBoardStore = defineStore("board", () => {
  const allBoards = ref({
    list: [],
    error: null,
    loading: false,
  });

  async function load() {
    allBoards.value.loading = true;
    const result = await supabase.from("boards").select();
    allBoards.value.loading = false;

    allBoards.value.list = result.data;
    allBoards.value.error = result.error;
  }

  async function loadById(id) {
    const board = ref();
    const columnsById = ref();
    const cardsById = ref();

    const { data, error } = await supabase
      .from("boards")
      .select("*, columns(*), cards(*)")
      .eq("id", id);

    if (error) return { error };

    board.value = data[0];
    board.value.order = JSON.parse(board.value.column_order);
    columnsById.value = board.value.columns.reduce((obj, column) => {
      obj[column.id] = column;
      column.order = JSON.parse(column.card_order);
      return obj;
    }, {});
    cardsById.value = board.value.cards.reduce((obj, card) => {
      obj[card.id] = card;
      return obj;
    }, {});

    watch(
      () => board.value?.order,
      async () => {
        board.value.column_order = JSON.stringify(board.value.order);
        const newColumnOrder = { column_order: board.value.column_order };
        await update(board.value.id, newColumnOrder);
      }
    );

    function update(id, newValue) {
      return supabase
        .from("boards")
        .update({ ...newValue })
        .eq("id", id);
    }

    return { board, columnsById, cardsById, error };
  }

  async function save({ name }) {
    const userStore = useUserStore();
    const user_id = userStore.user.id;

    const { error, data } = await supabase
      .from("boards")
      .insert({ name, user_id });

    if (!error) {
      allBoards.value.list.push(data[0]);
    }

    return { error: error?.message };
  }

  return { allBoards, load, loadById, save };
});

export default useBoardStore;
