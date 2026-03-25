<template>
  <div class="item-view-container">
    <!-- 
      说明：
      1. 这里只保留一个模板。
      2. 组件名建议使用 PascalCase (ItemContainer)，属性名建议使用 kebab-case (father-component) 或 camelCase (fatherComponent)，需与子组件定义一致。
      3. 原代码中一个传 "item" 一个传 "home"，这里根据文件名 ItemView 暂定为 "item"。
         如果您原本是想做首页，请将 "item" 改为 "home"。
    -->
    <ItemContainer father-component="item" />
    
    <!-- 如果这个页面还需要渲染子路由，取消下面这行的注释 -->
    <!-- <router-view /> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useGameStore } from '@/stores/game'; 
import ItemContainer from '@/components/ItemContainer.vue';

// 初始化 Store 实例
const gameStore = useGameStore();

onMounted(() => {
  // 执行初始化逻辑
  gameStore.initializeData();
  
  console.log('🎮 [ItemView] 游戏 store 初始化完成');
});
</script>

<style lang="less" scoped>
/* 建议加上 scoped 防止样式污染全局 */
.item-view-container {
  width: 100%;
  height: 100%;
  /* 其他布局样式 */
}
</style>