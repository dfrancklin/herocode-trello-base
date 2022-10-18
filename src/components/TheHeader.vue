<script setup>
import useUserStore from "../stores/user";

const userStore = useUserStore();
</script>

<template>
  <header class="shadow-lg">
    <nav class="navbar bg-base-300">
      <div class="flex-1">
        <RouterLink class="btn btn-ghost" :to="{ name: 'home' }">
          <h1 class="text-2xl font-black">Trello</h1>
        </RouterLink>
      </div>

      <div>
        <button class="btn btn-ghost" @click="userStore.logout">Logout</button>
      </div>
    </nav>
  </header>
</template>
