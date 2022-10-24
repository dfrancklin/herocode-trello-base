<script setup>
import { ref } from "vue";

import LoadingIcon from "./icons/LoadingIcon.vue";
import TrashIcon from "./icons/TrashIcon.vue";

const emit = defineEmits(["close"]);
const props = defineProps(["card", "updateCard", "removeCard"]);
const errorMessage = ref();
const removing = ref(false);

async function onSubmit(newValues) {
  const keys = Object.keys(newValues);
  keys.forEach((key) => (newValues[key] = newValues[key] || null));

  const { error } = await props.updateCard(props.card.id, { ...newValues });

  if (error) {
    errorMessage.value = error;
    return;
  }

  errorMessage.value = "";
  emit("close");
}

async function removeCard() {
  const confirmation = confirm("Are you sure you want to delete this card?");

  if (!confirmation) return;

  removing.value = true;
  const { error } = await props.removeCard(props.card.id);
  removing.value = false;

  if (error) {
    errorMessage.value = error;
    return;
  }

  errorMessage.value = "";
  emit("close");
}
</script>

<template>
  <Teleport to="body">
    <div class="modal modal-open">
      <div class="modal-box relative w-11/12 max-w-3xl">
        <button
          class="btn btn-sm btn-circle absolute right-2 top-2"
          @click="$emit('close')"
        >
          ✕
        </button>

        <FormKit
          type="form"
          @submit="onSubmit"
          :actions="false"
          :value="card"
          :disabled="removing"
          #default="context"
          form-class="w-full grid gap-4 pt-4"
        >
          <p v-if="errorMessage" class="text-red-500 text-center">
            {{ errorMessage }}
          </p>

          <p v-if="removing" class="flex items-center mb-3">
            <LoadingIcon /> Removing...
          </p>

          <FormKit
            type="text"
            name="title"
            validation="required"
            label="Title"
          />

          <FormKit type="date" name="due_at" label="Due at" />

          <FormKit
            type="textarea"
            name="description"
            label="Description"
            rows="5"
          />

          <div class="modal-action">
            <button
              type="button"
              class="btn flex gap-2 items-center"
              @click="removeCard"
            >
              <TrashIcon /> Remove
            </button>

            <FormKit type="submit">
              <LoadingIcon v-if="context.state.loading" />
              <span>Save</span>
            </FormKit>
          </div>
        </FormKit>
      </div>
    </div>
  </Teleport>
</template>
