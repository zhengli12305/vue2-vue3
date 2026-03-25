import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import App from '../App.vue'; // 注意：Vue 3 通常需要显式写 .vue 后缀，除非配置了别名解析

// 定义路由类型，获得 TS 智能提示
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: App,
    children: [
      {
        path: '', // 默认子路由
        name: 'Home', // 建议加上 name，方便 keep-alive 和调试
        // 👇 核心变化：使用 import() 动态导入
        component: () => import('../views/HomeView.vue'), 
      },
      {
        path: '/item',
        name: 'Item',
        component: () => import('../views/ItemView.vue'),
      },
      {
        path: '/score',
        name: 'Score',
        component: () => import('../views/ScoreView.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(), // 推荐使用 History 模式，URL 更干净 (没有 #)
  routes,
});

export default router;
