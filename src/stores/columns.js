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

  function update(id, newValue) {
    return supabase
      .from("columns")
      .update({ ...newValue })
      .eq("id", id);
  }

  return { save, update };
});

export default useColumnStore;
