/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import { createPinia } from 'pinia'
import App from './App.vue'
// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'
const pinia = createPinia()
const app = createApp(App)

registerPlugins(app)
app.use(pinia)
app.mount('#app')
