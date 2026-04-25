<template>
  <section class="answer-detail-page" v-if="reviewItem && question">
    <header class="top">
      <h1>第 {{ reviewItem.index }} 题</h1>
      <router-link :to="`/answer-card?current=${reviewItem.index}`" class="back">返回答题卡</router-link>
    </header>

    <p class="type">{{ question.type }}</p>
    <p class="stem">{{ question.stem }}</p>

    <ul class="options">
      <li
        v-for="option in question.options"
        :key="option.id"
        :class="getOptionClass(option.id)"
      >
        <span class="label">{{ option.id }}</span>
        <span>{{ option.text }}</span>
      </li>
    </ul>

    <p class="result-line">
      正确答案：
      <strong class="correct-text">{{ reviewItem.correctAnswerIds.join(', ') || '无' }}</strong>
      &nbsp;&nbsp;您的选择：
      <strong class="wrong-text">{{ reviewItem.userAnswerIds.join(', ') || '未作答' }}</strong>
    </p>

    <div class="pager">
      <button class="pager-btn ghost" :disabled="questionIndex <= 1" @click="goPrev">上一题</button>
      <button class="pager-btn" :disabled="questionIndex >= gameStore.reviewItems.length" @click="goNext">
        下一题
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()

const questionIndex = computed(() => Number(route.params.index) || 1)

const reviewItem = computed(() => gameStore.reviewItems[questionIndex.value - 1])
const question = computed(() => gameStore.questions[questionIndex.value - 1])

function getOptionClass(optionId: string) {
  const isCorrect = reviewItem.value?.correctAnswerIds.includes(optionId)
  const isUserSelected = reviewItem.value?.userAnswerIds.includes(optionId)
  return {
    correct: Boolean(isCorrect),
    selected: Boolean(isUserSelected),
    wrong: Boolean(isUserSelected && !isCorrect)
  }
}

function goPrev() {
  if (questionIndex.value <= 1) return
  router.push(`/answer-card/${questionIndex.value - 1}`)
}

function goNext() {
  if (questionIndex.value >= gameStore.reviewItems.length) return
  router.push(`/answer-card/${questionIndex.value + 1}`)
}

onMounted(() => {
  if (!gameStore.hasQuestions) {
    router.replace('/upload')
    return
  }
  if (!question.value || !reviewItem.value) {
    router.replace('/answer-card')
  }
})
</script>

<style scoped>
.answer-detail-page {
  max-width: 420px;
  margin: 24px auto;
  padding: 20px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.top h1 {
  margin: 0;
}

.back {
  text-decoration: none;
  color: #2563eb;
}

.type {
  display: inline-block;
  font-size: 12px;
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 8px;
  border-radius: 8px;
}

.stem {
  margin: 10px 0 14px;
  font-size: 20px;
  line-height: 1.4;
}

.options {
  list-style: none;
  margin: 0;
  padding: 0;
}

.options li {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 16px;
  line-height: 1.35;
}

.options li.correct {
  border-color: #10b981;
  background: #ecfdf5;
}

.options li.wrong {
  border-color: #ef4444;
  background: #fef2f2;
}

.options li.selected {
  font-weight: 600;
}

.label {
  width: 30px;
  color: #475569;
  font-weight: 700;
}

.result-line {
  margin-top: 16px;
  font-size: 15px;
}

.correct-text {
  color: #059669;
}

.wrong-text {
  color: #dc2626;
}

.pager {
  margin-top: 18px;
  display: flex;
  gap: 10px;
}

.pager-btn {
  flex: 1;
  border: none;
  border-radius: 999px;
  background: #0ea5e9;
  color: #fff;
  padding: 10px 14px;
  cursor: pointer;
}

.pager-btn.ghost {
  background: #e5e7eb;
  color: #374151;
}

.pager-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
