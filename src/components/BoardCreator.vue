<script setup>
import { ref } from "vue";

import LoadingIcon from "./icons/LoadingIcon.vue";

const props = defineProps({
  saveBoard: {
    type: Function,
    required: true,
  },
});

const formShown = ref(false);
const errorMessage = ref();

async function onSubmit(formValue) {
  const { error } = await props.saveBoard(formValue);

  errorMessage.value = error;

  if (error) return;

  formShown.value = false;
}
</script>

<template>
  <div v-if="formShown">
    <FormKit
      type="form"
      @submit="onSubmit"
      :actions="false"
      form-class="w-full grid gap-2"
      #default="context"
    >
      <h2 class="text-xl text-center font-semibold uppercase">New Board</h2>

      <p v-if="errorMessage" class="text-red-500 text-center">
        {{ errorMessage }}
      </p>

      <FormKit
        type="text"
        name="name"
        placeholder="Board Name"
        validation="required"
      />

      <div class="grid gap-2 grid-cols-2">
        <button class="btn" @click="formShown = false">Cancel</button>

        <FormKit type="submit">
          <LoadingIcon v-if="context.state.loading" />
          <span>Save</span>
        </FormKit>
      </div>
    </FormKit>
  </div>

  <button
    v-else
    @click="formShown = true"
    class="text-5xl btn btn-primary btn-block h-auto aspect-video rounded-2xl"
  >
    &plus;
  </button>
</template>
