<script setup>
import BoardDragAndDrop from "../components/BoardDragAndDrop.vue";
import LoadingIcon from "../components/icons/LoadingIcon.vue";
import MainLayout from "../layouts/MainLayout.vue";
</script>

<template>
  <MainLayout>
    <main class="px-8 py-4 flex-grow flex flex-col gap-4">
      <Suspense>
        <template #default>
          <BoardDragAndDrop />
        </template>

        <template #fallback>
          <p class="flex items-center mb-3">
            <LoadingIcon />
            Loading...
          </p>
        </template>
      </Suspense>
    </main>
  </MainLayout>
</template>
