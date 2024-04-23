import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { useAuthStore } from "./stores/authStore";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);

const authStore = useAuthStore();
app.mount("#app");
