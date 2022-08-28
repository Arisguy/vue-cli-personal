import { createApp } from 'vue';
import App from './App';
import router from "./router";
// ?? 全局引入element组件文件过大 我们采用按需引入
// import ElementPlus from 'element-plus';
// import 'element-plus/dist/index.css'


createApp(App)
  .use(router)
  // .use(ElementPlus)
  .mount(document.getElementById("app"));

