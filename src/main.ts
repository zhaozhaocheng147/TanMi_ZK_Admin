import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';
import axios from "axios";
/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

//引入图标
import '../public/assets/font/iconfont.css'
import '../public/assets/font/iconfont1'

/* Theme variables */
import './theme/variables.css';

// Vuetify
// import 'vuetify/styles' //控制颜色
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import * as labs from 'vuetify/labs/components'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  ssr: true,
  components:{
    ...labs,
    ...components,
  },
  directives,
})

const app = createApp(App)
  .use(IonicVue)
  .use(router).use(vuetify);

router.isReady().then(() => {
  app.mount('#app');
  app.config.globalProperties.$axios = axios;  //配置axios的全局引用
});
