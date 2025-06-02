import { createApp } from "vue";
import router from "./routes";
import vuetify from "./plugins/vuetify";

import "./styles/style.scss";
import App from "./App.vue";

createApp(App).use(vuetify).use(router).mount("#app");
