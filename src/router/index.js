import { createRouter, createWebHashHistory } from 'vue-router'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/home',
      component: () => import("../pages/Home/index.vue")
    },
    {
      path: '/about',
      component: () => import("../pages/About/index.vue")
    },
  ]
})
