<template>
  <div class="home_container">
    <ItemContainer father-component="home" />
  </div>
</template>

<script setup lang="ts">
// 1. 引入组件 (使用 @ 别名指向 src 目录)
import ItemContainer from '@/components/ItemContainer.vue'

// 2. 如果需要生命周期钩子 (原 created 为空，故省略)
// import { onMounted } from 'vue'
// onMounted(() => { ... })
</script>

<style lang="less" scoped>


</style>npm 