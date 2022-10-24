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

  function update(id, newValue) {
    return supabase
      .from("cards")
      .update({ ...newValue })
      .eq("id", id);
  }

  return { save, update };
});

export default useCardStore;
