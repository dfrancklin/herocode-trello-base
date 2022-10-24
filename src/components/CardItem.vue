<script setup>
import { computed, ref } from "vue";
import CardModal from "./CardModal.vue";
import TextIcon from "./icons/TextIcon.vue";

const props = defineProps(["card", "updateCard"]);

const dueAt = computed(() => {
  if (!props.card?.due_at) return null;

  return new Date(`${props.card?.due_at}T00:00`).toLocaleDateString("pt-br", {
    day: "2-digit",
    month: "2-digit",
  });
});
const showModal = ref(false);
</script>

<template>
  <div class="card bg-base-300 shadow-2xl relative">
    <div class="card-body">
      <h3 class="card-title text-base font-normal flex-1">{{ card.title }}</h3>

      <div class="card-actions justify-end">
        <span v-if="card.description" class="badge badge-info h-7">
          <TextIcon />
        </span>
        <span v-if="dueAt" class="badge badge-primary h-7 leading-7">
          {{ dueAt }}
        </span>

        <button @click="showModal = true" class="absolute inset-0"></button>
      </div>
    </div>
  </div>

  <CardModal
    v-if="showModal"
    :card="card"
    :updateCard="updateCard"
    @close="showModal = false"
  />
</template>
