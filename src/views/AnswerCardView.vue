<template>
  <section class="answer-card-page">
    <header class="header">
      <h1>答题卡</h1>
      <p>点击题号查看详情（当前题会显示角标）</p>
    </header>

    <div class="legend">
      <span class="legend-item"><i class="dot pending"></i>未作答</span>
      <span class="legend-item"><i class="dot correct"></i>答对</span>
      <span class="legend-item"><i class="dot wrong"></i>答错</span>
    </div>

    <div class="grid">
      <div
        v-for="item in gameStore.reviewItems"
        :key="item.id"
        class="cell-wrap"
      >
        <button
          class="cell"
          :class="getCellClass(item)"
          @click="goDetail(item.index)"
        >
          {{ item.index }}
        </button>
        <span v-if="currentIndex === item.index" class="current-flag">当前</span>
      </div>
    </div>

    <div class="bottom-actions">
      <router-link to="/item" class="bottom-btn ghost">重新练习</router-link>
      <router-link to="/score" class="bottom-btn primary">查看练习结果</router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore, type QuestionReviewItem } from '@/stores/game'

const router = useRouter()
const route = useRoute()
const gameStore = useGameStore()
const currentIndex = computed(() => Number(route.query.current || 1))

function getCellClass(item: QuestionReviewItem) {
  if (!item.userAnswerIds.length) return 'pending'
  return item.isCorrect ? 'correct' : 'wrong'
}

function goDetail(index: number) {
  router.push(`/answer-card/${index}`)
}

onMounted(() => {
  if (!gameStore.hasQuestions) {
    router.replace('/upload')
  }
})
</script>

<style scoped>
.answer-card-page {
  max-width: 420px;
  margin: 24px auto;
  padding: 16px 16px 90px;
  background: #fff;
  border-radius: 14px;
}

.header h1 {
  margin: 0 0 4px;
  text-align: center;
}

.header p {
  margin: 0 0 12px;
  text-align: center;
  color: #6b7280;
  font-size: 13px;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-bottom: 14px;
}

.legend-item {
  font-size: 12px;
  color: #4b5563;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  display: inline-block;
  border: 1px solid #d1d5db;
}

.dot.pending {
  background: #fff;
}

.dot.correct {
  background: #10b981;
  border-color: #10b981;
}

.dot.wrong {
  background: #ef4444;
  border-color: #ef4444;
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px 10px;
}

.cell-wrap {
  position: relative;
  display: flex;
  justify-content: center;
}

.cell {
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  background: #fff;
  border: 1px solid #e5e7eb;
  color: #374151;
}

.cell.correct {
  background: #10b981;
  color: #fff;
}

.cell.wrong {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
}

.current-flag {
  position: absolute;
  bottom: -6px;
  padding: 1px 6px;
  border-radius: 6px;
  font-size: 11px;
  background: #111827;
  color: #fff;
}

.bottom-actions {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 10px;
  max-width: 420px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  gap: 12px;
}

.bottom-btn {
  flex: 1;
  text-align: center;
  padding: 11px 16px;
  border-radius: 999px;
  text-decoration: none;
  font-size: 16px;
}

.bottom-btn.ghost {
  background: #f3f4f6;
  color: #374151;
}

.bottom-btn.primary {
  background: #0ea5e9;
  color: #fff;
}
</style>
