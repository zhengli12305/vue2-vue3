<template>
  <section class="item-container">
    <div class="quiz-block">
      <div v-if="!currentTopic">
        <p>暂无题目，请先上传文件。</p>
        <router-link to="/upload" class="button">去上传</router-link>
      </div>
      <div v-else>
        <div class="question-strip">
          <button
            v-for="num in visibleQuestionNumbers"
            :key="num"
            class="strip-item"
            :class="{ active: num === gameStore.itemNum }"
            @click="handleGoToQuestion(num)"
          >
            {{ num }}
          </button>
        </div>

        <header class="topic-title">
          <span>{{ currentTopic.type === 'ONE' ? '单选题' : currentTopic.type === 'MORE' ? '多选题' : '判断题' }}</span>
          <strong>{{ gameStore.itemNum }}/{{ gameStore.questionCount }}</strong>
        </header>
        <p class="stem">{{ currentTopic.stem }}</p>

        <ul class="option-list">
          <li
            v-for="(option, index) in currentTopic.options"
            :key="option.id"
            class="option-item"
            @click="toggleOption(option.id)"
          >
            <span class="option-tag" :class="{ selected: isSelected(option.id) }">
              {{ getOptionLabel(index) }}
            </span>
            <span>{{ option.text }}</span>
          </li>
        </ul>

        <div class="nav-actions">
          <button class="button ghost" :disabled="gameStore.itemNum <= 1" @click="handlePrevItem">上一题</button>
          <button class="button" @click="handleNextItem">
            {{ gameStore.isLastQuestion ? '提交答卷' : '下一题' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()
const localSelection = ref<string[]>([])

const currentTopic = computed(() => gameStore.currentTopic)
const visibleQuestionNumbers = computed(() => {
  const total = gameStore.questionCount
  if (total <= 0) return []
  const nums: number[] = []
  for (let i = 1; i <= total; i++) nums.push(i)
  return nums
})

watch(
  () => currentTopic.value?.id,
  (id) => {
    if (!id) {
      localSelection.value = []
      return
    }
    localSelection.value = [...(gameStore.userAnswersMap[id] ?? [])]
  },
  { immediate: true }
)

function getOptionLabel(index: number): string {
  return String.fromCharCode(65 + index)
}

function isSelected(optionId: string) {
  return localSelection.value.includes(optionId)
}

function toggleOption(optionId: string) {
  const topic = currentTopic.value
  if (!topic) return

  if (topic.type === 'MORE') {
    if (isSelected(optionId)) {
      localSelection.value = localSelection.value.filter((id) => id !== optionId)
      return
    }
    localSelection.value = [...localSelection.value, optionId]
    return
  }

  localSelection.value = [optionId]
}

function persistCurrentSelection() {
  const topic = currentTopic.value
  if (!topic) return
  gameStore.submitCurrentQuestion(localSelection.value)
}

function handleNextItem() {
  persistCurrentSelection()
  if (gameStore.isLastQuestion) {
    handleSubmitAnswer()
    return
  }
  gameStore.nextQuestion()
}

function handlePrevItem() {
  persistCurrentSelection()
  gameStore.prevQuestion()
}

function handleGoToQuestion(index: number) {
  persistCurrentSelection()
  gameStore.goToQuestion(index)
}

async function handleSubmitAnswer() {
  persistCurrentSelection()
  gameStore.stopTimer()
  await router.push('/score')
}

// if (props.fatherComponent === 'home') {
//   gameStore.initializeData()
// }
</script>

<style lang="less" scoped>
.item-container {
  max-width: 920px;
  margin: 24px auto;
  padding: 28px 24px 42px;
}

.quiz-block,
.home-block {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 26px 24px;
}

.quiz-block {
  min-height: 72vh;
}

.topic-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 700;
}

.stem {
  font-size: 18px;
  margin-bottom: 20px;
  line-height: 1.6;
}

.question-strip {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 2px 2px 12px;
  margin-bottom: 14px;
  scrollbar-width: thin;
}

.strip-item {
  min-width: 46px;
  height: 46px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  font-size: 17px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.strip-item.active {
  border-color: #22d3ee;
  color: #06b6d4;
  font-weight: 700;
  box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.18);
}

.strip-item:hover {
  border-color: #93c5fd;
  background: #eff6ff;
}

.option-list {
  list-style: none;
  margin: 0 0 16px;
  padding: 0;
}

.option-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1.6;
  padding: 8px 4px;
  border-radius: 10px;
}

.option-item:hover {
  background: #f8fafc;
}

.option-tag {
  min-width: 28px;
  font-weight: 600;
  color: #475569;
}

.option-tag.selected {
  color: #2563eb;
}

.button {
  display: inline-block;
  border: none;
  border-radius: 8px;
  background-color: #2563eb;
  color: #fff;
  padding: 12px 20px;
  text-decoration: none;
  cursor: pointer;
  font-size: 16px;
}

.button.ghost {
  background: #e5e7eb;
  color: #374151;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.nav-actions {
  margin-top: 28px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
</style>
