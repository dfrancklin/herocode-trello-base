<script setup>
import { ref } from "vue";
import LoadingIcon from "./icons/LoadingIcon.vue";

const emit = defineEmits(["close"]);
const props = defineProps(["card", "updateCard"]);
const errorMessage = ref();

async function onSubmit(newValues) {
  const { error } = await props.updateCard(props.card.id, { ...newValues });

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
          x
        </button>

        <FormKit
          type="form"
          @submit="onSubmit"
          :actions="false"
          form-class="w-full grid gap-4 pt-4"
          :value="card"
          #default="context"
        >
          <p v-if="errorMessage" class="text-red-500 text-center">
            {{ errorMessage }}
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
