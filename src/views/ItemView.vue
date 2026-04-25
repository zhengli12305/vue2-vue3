<template>
  <div class="item-view-container">
    <ItemContainer father-component="item" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import ItemContainer from '@/components/ItemContainer.vue'

const router = useRouter()
const gameStore = useGameStore()

onMounted(() => {
  if (!gameStore.hasQuestions) {
    router.replace('/upload')
    return
  }
  gameStore.initializeData()
  gameStore.startTimer()
})
</script>

<style lang="less" scoped>
.item-view-container {
  min-height: 100vh;
  background: #f3f4f6;
}
</style>