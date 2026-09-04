import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css'

import Button from '@/components/ui/Button.vue'
import InputField from '@/components/ui/InputField.vue'
import SelectField from '@/components/ui/SelectField.vue'
import TextArea from '@/components/ui/TextArea.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import card from './components/ui/Card.vue'

const app = createApp(App)
app.use(router)

// daftar global
app.component('Button', Button)
app.component('InputField', InputField)
app.component('SelectField', SelectField)
app.component('TextArea', TextArea)
app.component('SectionTitle', SectionTitle)
app.component('Card', card)

app.mount('#app')
