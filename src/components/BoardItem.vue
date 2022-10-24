<script setup>
defineProps(["board"]);

const randomColor = `hsl(${Math.floor(Math.random() * 361)}, 100%, 50%)`;
</script>

<template>
  <RouterLink
    class="card shadow-xl image-full aspect-video before:!bg-base-100"
    :to="{ name: 'board', params: { boardId: board.id } }"
  >
    <div class="aspect-video w-full" :style="{ background: randomColor }"></div>
    <div class="card-body">
      <h2 class="card-title">
        {{ board.name }}
      </h2>
    </div>
  </RouterLink>
</template>
