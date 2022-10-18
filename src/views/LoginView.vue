<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import LoadingIcon from "../components/icons/LoadingIcon.vue";
import useUserStore from "../stores/user";

const userStore = useUserStore();
const errorMessage = ref();
const router = useRouter();

async function onSubmit(formValue) {
  const result = await userStore.login(formValue.email, formValue.password);

  if (result.error) {
    errorMessage.value = result.error.message;
    return;
  }

  router.push({ name: "home" });
}
</script>

<template>
  <main class="min-h-[100vh] min-w-full flex justify-center items-center p-4">
    <FormKit
      type="form"
      @submit="onSubmit"
      :actions="false"
      form-class="max-w-sm w-full grid gap-4"
      #default="context"
    >
      <div>
        <h1 class="text-center text-3xl font-semibold uppercase">Trello</h1>
        <h2 class="text-center text-xl font-semibold uppercase">Login</h2>
      </div>

      <p class="text-red-500 text-center" v-if="errorMessage">
        {{ errorMessage }}
      </p>

      <FormKit
        type="text"
        name="email"
        label="Your e-mail"
        placeholder="E-mail address"
        validation="required|email"
      ></FormKit>

      <FormKit
        type="password"
        name="password"
        label="Your Password"
        placeholder="Password"
        validation="required|length:6"
      ></FormKit>

      <FormKit type="submit">
        <LoadingIcon v-if="context.state.loading" />
        <span>Login</span>
      </FormKit>

      <p class="text-center">
        New around here?

        <RouterLink class="hover:underline" :to="{ name: 'sign-up' }">
          Sign Up
        </RouterLink>
      </p>
    </FormKit>
  </main>
</template>
