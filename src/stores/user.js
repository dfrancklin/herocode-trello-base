import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

import supabase from "../config/supabase";

const useUserStore = defineStore("user", () => {
  const user = ref(supabase.auth.user());
  const router = useRouter();

  function login(email, password) {
    return supabase.auth.signIn({ email, password });
  }

  function signUp(email, password) {
    return supabase.auth.signUp({ email, password });
  }

  function logout() {
    return supabase.auth.signOut();
  }

  supabase.auth.onAuthStateChange((event, session) => {
    if (session) user.value = session.user;

    if (event === "SIGNED_OUT") {
      user.value = null;
      return router.push({ name: "login" });
    }
  });

  return { user, login, signUp, logout };
});

export default useUserStore;
