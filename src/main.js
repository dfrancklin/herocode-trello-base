import { generateClasses } from "@formkit/themes";
import { defaultConfig, plugin } from "@formkit/vue";
import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(
  plugin,
  defaultConfig({
    config: {
      classes: generateClasses({
        global: {
          outer: "$reset form-control mb-3",
          label: "$reset label",
          input: "$reset input input-bordered w-full",
          help: "$reset text-xs text-gray-500",
          messages: "$reset list-none p-0 mt-1 mb-0",
          message: "$reset text-red-500 mb-1 text-xs",
        },
        submit: {
          input: "$reset w-full btn btn-primary",
        },
        textarea: {
          input: "$reset textarea textarea-bordered w-full",
        },
      }),
    },
  })
);

app.mount("#app");
