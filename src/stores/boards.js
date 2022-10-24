import { defineStore } from "pinia";
import { computed, ref } from "vue";

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

    const { data, error } = await supabase
      .from("boards")
      .select("*, columns(*), cards(*)")
      .eq("id", id);

    if (error) return { error };

    board.value = data[0];
    board.value.order = JSON.parse(board.value.column_order);

    const columnsById = computed(() => {
      return board.value.columns.reduce((obj, column) => {
        obj[column.id] = column;
        column.order = JSON.parse(column.card_order);
        return obj;
      }, {});
    });

    const cardsById = computed(() => {
      return board.value.cards.reduce((obj, card) => {
        obj[card.id] = card;
        return obj;
      }, {});
    });

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

  function update(id, newValues) {
    return supabase
      .from("boards")
      .update({ ...newValues })
      .eq("id", id);
  }

  function remove(id) {
    return supabase.from("boards").delete().eq("id", id);
  }

  return { allBoards, load, loadById, save, update, remove };
});

export default useBoardStore;
