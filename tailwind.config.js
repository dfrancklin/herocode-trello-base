const formKitTailwind = require("@formkit/themes/tailwindcss");
const daisyui = require("daisyui");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js,vue}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui, formKitTailwind],
};
