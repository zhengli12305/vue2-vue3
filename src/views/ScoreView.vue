<template>
  <div class="score-page">
    <h1>答题结果</h1>
    <p class="score">{{ score }} 分</p>
    <p class="tip">{{ scoreTips }}</p>
    <p class="meta">共 {{ gameStore.questionCount }} 题，用时 {{ gameStore.elapsedTime }} 秒</p>

    <div class="actions">
      <router-link to="/" class="button ghost">返回首页</router-link>
      <router-link to="/answer-card" class="button secondary">查看答案卡</router-link>
      <router-link to="/upload" class="button">继续上传文件</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()

const score = computed<number>(() => gameStore.calculateScore)

const scoreTips = computed<string>(() => {
  const tipsArr = [
    '继续努力，再做几套题就更稳了。',
    '掌握得不错，保持这个节奏。',
    '表现很好，已经超过大多数人。',
    '优秀，答题准确率很高。',
    '满分表现，太强了。'
  ]
  let index = Math.ceil(score.value / 20) - 1
  if (index < 0) index = 0
  if (index > 4) index = 4
  return tipsArr[index]!
})

onMounted(() => {
  if (!gameStore.hasQuestions) {
    router.replace('/upload')
  }
})
</script>

<style scoped>
.score-page {
  max-width: 640px;
  margin: 48px auto;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.score {
  font-size: 40px;
  font-weight: 700;
  margin: 12px 0;
}

.tip {
  color: #1f2937;
}

.meta {
  color: #6b7280;
}

.actions {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.button {
  width: 180px;
  padding: 12px 18px;
  border-radius: 999px;
  color: #fff;
  background: #2563eb;
  text-decoration: none;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
}

.button::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
}

.button.ghost {
  background: #4b5563;
}

.button.secondary {
  background: #0ea5e9;
}
</style>