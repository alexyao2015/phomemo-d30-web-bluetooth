import { createApp } from "vue";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import "vuetify/styles";
import App from "./App.vue";

// Vuetify
import { createVuetify } from "vuetify";
import "vuetify/styles";

const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark",
  },
});

createApp(App).use(vuetify).mount("#app");
