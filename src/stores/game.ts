import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// --- 类型定义 ---
interface TopicAnswer {
  topic_answer_id: number | string
  topic_id: number | string
  answer_name: string
  is_standard_answer: number // 0 or 1
}

interface TopicDetail {
  topic_id: number | string
  active_topic_id: number | string
  type: string
  topic_name: string
  active_id: number | string
  active_title: string
  active_topic_phase: string
  active_start_time: string
  active_end_time: string
  topic_answer: TopicAnswer[]
}

export const useGameStore = defineStore('game', () => {
  // ================= State =================
  const level = ref<string>('第一周')
  const itemNum = ref<number>(1)
  const elapsedTime = ref<number>(0) // 对应旧版 allTime
  
  // 【关键修复】timerId 只存数字 ID，初始为 null
  // 在浏览器环境下 setInterval 返回 number
  const timerId = ref<number | null>(null) 
  
  const userAnswers = ref<(number | string)[]>([])
  
  // 题目数据 (保持你提供的硬编码)
  const itemDetail = ref<TopicDetail[]>([
    {
      "topic_id": 20,
      "active_topic_id": 4,
      "type": "ONE",
      "topic_name": "题目一",
      "active_id": 1,
      "active_title": "欢乐星期五标题",
      "active_topic_phase": "第一周",
      "active_start_time": "1479139200",
      "active_end_time": "1482163200",
      "topic_answer": [
        { "topic_answer_id": 1, "topic_id": 20, "answer_name": "答案aaaa", "is_standard_answer": 0 },
        { "topic_answer_id": 2, "topic_id": 20, "answer_name": "正确答案", "is_standard_answer": 0 },
        { "topic_answer_id": 3, "topic_id": 20, "answer_name": "答案cccc", "is_standard_answer": 0 },
        { "topic_answer_id": 4, "topic_id": 20, "answer_name": "答案dddd", "is_standard_answer": 1 }
      ]
    },
    {
      "topic_id": 21,
      "active_topic_id": 4,
      "type": "MORE",
      "topic_name": "题目二",
      "active_id": 1,
      "active_title": "欢乐星期五标题",
      "active_topic_phase": "第一周",
      "active_start_time": "1479139200",
      "active_end_time": "1482163200",
      "topic_answer": [
        { "topic_answer_id": 5, "topic_id": 21, "answer_name": "答案A", "is_standard_answer": 1 },
        { "topic_answer_id": 6, "topic_id": 21, "answer_name": "答案B", "is_standard_answer": 0 },
        { "topic_answer_id": 7, "topic_id": 21, "answer_name": "正确答案", "is_standard_answer": 0 },
        { "topic_answer_id": 8, "topic_id": 21, "answer_name": "答案D", "is_standard_answer": 0 }
      ]
    },
    {
      "topic_id": 21,
      "active_topic_id": 4,
      "type": "MORE",
      "topic_name": "题目三",
      "active_id": 1,
      "active_title": "欢乐星期五标题",
      "active_topic_phase": "第一周",
      "active_start_time": "1479139200",
      "active_end_time": "1482163200",
      "topic_answer": [
        { "topic_answer_id": 9, "topic_id": 21, "answer_name": "测试A", "is_standard_answer": 1 },
        { "topic_answer_id": 10, "topic_id": 21, "answer_name": "BBBBBB", "is_standard_answer": 0 },
        { "topic_answer_id": 11, "topic_id": 21, "answer_name": "CCCCCC", "is_standard_answer": 0 },
        { "topic_answer_id": 12, "topic_id": 21, "answer_name": "正确答案", "is_standard_answer": 0 }
      ]
    },
    {
      "topic_id": 21,
      "active_topic_id": 4,
      "type": "MORE",
      "topic_name": "题目四",
      "active_id": 1,
      "active_title": "欢乐星期五标题",
      "active_topic_phase": "第一周",
      "active_start_time": "1479139200",
      "active_end_time": "1482163200",
      "topic_answer": [
        { "topic_answer_id": 13, "topic_id": 21, "answer_name": "正确答案", "is_standard_answer": 1 },
        { "topic_answer_id": 14, "topic_id": 21, "answer_name": "A是错的", "is_standard_answer": 0 },
        { "topic_answer_id": 15, "topic_id": 21, "answer_name": "D是对的", "is_standard_answer": 0 },
        { "topic_answer_id": 16, "topic_id": 21, "answer_name": "C说的不对", "is_standard_answer": 0 }
      ]
    },
    {
      "topic_id": 21,
      "active_topic_id": 4,
      "type": "MORE",
      "topic_name": "题目五",
      "active_id": 1,
      "active_title": "欢乐星期五标题",
      "active_topic_phase": "第一周",
      "active_start_time": "1479139200",
      "active_end_time": "1482163200",
      "topic_answer": [
        { "topic_answer_id": 17, "topic_id": 21, "answer_name": "错误答案", "is_standard_answer": 1 },
        { "topic_answer_id": 18, "topic_id": 21, "answer_name": "正确答案", "is_standard_answer": 0 },
        { "topic_answer_id": 19, "topic_id": 21, "answer_name": "错误答案", "is_standard_answer": 0 },
        { "topic_answer_id": 20, "topic_id": 21, "answer_name": "错误答案", "is_standard_answer": 0 }
      ]
    }
  ])

  // ================= Getters =================
  const currentTopic = computed(() => {
    const index = itemNum.value - 1
    return index >= 0 && index < itemDetail.value.length ? itemDetail.value[index] : null
  })

  const isLastQuestion = computed(() => {
    return itemNum.value >= itemDetail.value.length
  })

const calculateScore = computed(() => {
    let score = 0;
    // 遍历用户答案
    userAnswers.value.forEach((answerId, index) => {
      // 找到对应题目的正确答案 ID
      const topic = itemDetail.value[index];
      if (topic) {
        const correctAnswer = topic.topic_answer.find(ans => ans.is_standard_answer === 1);
        // 比对 (注意类型转换，防止 string 和 number 比较失败)
        if (correctAnswer && String(correctAnswer.topic_answer_id) === String(answerId)) {
          score += 20;
        }
      }
    });
    return score;
  })
  // ================= Actions =================

  function addNum(answerId: number | string) {
    userAnswers.value.push(answerId)

    if (itemNum.value < itemDetail.value.length) {
      itemNum.value++
    } else {
      // 最后一题答完，自动停止计时（可选，也可以在组件手动调）
      stopTimer()
    }
  }

  function initializeData() {
    stopTimer() // 确保先清除旧的
    itemNum.value = 1
    elapsedTime.value = 0
    userAnswers.value = []
    // 如果需要重置题目数据，可以在这里操作 itemDetail.value = [...]
  }

  function startTimer() {
    if (timerId.value !== null) return // 防止重复启动

    timerId.value = window.setInterval(() => {
      elapsedTime.value++
    }, 1000)
  }

  // 【关键修复】暴露 stopTimer 供组件调用
  function stopTimer() {
    if (timerId.value !== null) {
      clearInterval(timerId.value)
      timerId.value = null
    }
  }

  // ================= Return =================
  return {
    level,
    itemNum,
    elapsedTime,
    timerId,      // 如果组件只需要读取状态，可以暴露，但不要让组件修改它
    itemDetail,
    userAnswers,
    currentTopic,
    isLastQuestion,
    addNum,
    initializeData,
    startTimer,
    stopTimer,
    calculateScore     // 必须暴露此方法
  }
})