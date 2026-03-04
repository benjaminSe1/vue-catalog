import "@mdi/font/css/materialdesignicons.css"

import { createPinia } from "pinia"
import { createApp } from "vue"

import App from "./App.vue"
import vuetify from "./plugins/vuetify"
import { router } from "./router"

const pinia = createPinia()

createApp(App).use(router).use(vuetify).use(pinia).mount("#app")
