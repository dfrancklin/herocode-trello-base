import { defineStore } from "pinia";

import supabase from "../config/supabase";

const useCardStore = defineStore("card", () => {
  async function save(board_id, title) {
    const { error, data } = await supabase.from("cards").insert({
      board_id,
      title,
    });

    let card;

    if (!error) card = data[0];

    return {
      card,
      error: error?.message,
    };
  }

  function update(id, newValues) {
    return supabase
      .from("cards")
      .update({ ...newValues })
      .eq("id", id);
  }

  function remove(id) {
    return supabase.from("cards").delete().eq("id", id);
  }

  const removeMultiple = (ids) => {
    return supabase.from("cards").delete().in("id", ids);
  };

  return { save, update, remove, removeMultiple };
});

export default useCardStore;
