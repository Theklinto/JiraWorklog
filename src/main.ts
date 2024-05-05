import { createApp } from "vue";
import App from "./App.vue";
import { RouteDefinition } from "@/router";

const app = createApp(App);
app.use(new RouteDefinition().router);
app.mount("#app");
