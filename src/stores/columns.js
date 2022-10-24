import { defineStore } from "pinia";

import supabase from "../config/supabase";

const useColumnStore = defineStore("column", () => {
  async function save(board_id, name) {
    const { error, data } = await supabase.from("columns").insert({
      board_id,
      name,
    });

    let column;

    if (!error) column = data[0];

    return {
      column,
      error: error?.message,
    };
  }

  function update(id, newValues) {
    return supabase
      .from("columns")
      .update({ ...newValues })
      .eq("id", id);
  }

  function remove(id) {
    return supabase.from("columns").delete().eq("id", id);
  }

  function removeMultiple(ids) {
    return supabase.from("columns").delete().in("id", ids);
  }

  return { save, update, remove, removeMultiple };
});

export default useColumnStore;
