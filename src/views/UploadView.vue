<template>
  <section class="upload-page">
    <h5 class="title">动态题库上传</h5>
    <p class="desc">请选择 Word、PDF 或 Excel 文件，系统会自动解析题目。</p>

    <input
      ref="fileInputRef"
      class="file-input"
      type="file"
      accept=".doc,.docx,.pdf,.xls,.xlsx"
      @change="handleFileChange"
    />

    <div class="actions">
      <button class="primary-btn" :disabled="!selectedFile || uiStore.loading" @click="handleUpload">
        {{ uiStore.loading ? '解析中...' : '上传并开始答题' }}
      </button>
      <button class="ghost-btn" :disabled="uiStore.loading" @click="clearSelection">清空选择</button>
    </div>

    <p class="filename" v-if="selectedFile">当前文件：{{ selectedFile.name }}</p>
    <p class="error" v-if="uiStore.error">{{ uiStore.error }}</p>

    <section class="format-tips">
      <h2>文档格式要求</h2>
      <ul>
        <li>Word 支持 `.doc`/`.docx`（`.doc` 会自动转换）</li>
        <li>题目行：`1. 题目内容`（也支持 `1、` 或 `1)`）</li>
        <li>选项行：`A. 选项内容`（也支持 `A、` 或 `A)`）</li>
        <li>答案行：`答案: B` 或 `答案：A,C`</li>
        <li>支持题型标记：`[单选]`、`[多选]`、`[判断]`</li>
      </ul>
      <pre class="example">[单选]
1. 2+2等于几？
A. 3
B. 4
C. 5
答案: B

[多选]
2. 以下哪些是编程语言？
A. Python
B. Excel
C. Java
D. C++
答案: A,C,D

[判断]
3. 地球是圆的
A. 对
B. 错
答案: A</pre>
    </section>
  </section>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { parseQuizFile } from '@/api/quiz'
import { useGameStore } from '@/stores/game'
import { useUiStore } from '@/stores/ui'

const router = useRouter()
const gameStore = useGameStore()
const uiStore = useUiStore()
const selectedFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  selectedFile.value = target.files?.[0] ?? null
  uiStore.clearError()
}

function clearSelection() {
  selectedFile.value = null
  uiStore.clearError()
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

async function handleUpload() {
  if (!selectedFile.value) return
  uiStore.setLoading(true)
  uiStore.clearError()

  try {
    const result = await parseQuizFile(selectedFile.value)
    if (!result.questions?.length) {
      throw new Error('解析结果为空，请检查文件内容后重试。')
    }
    gameStore.setParseResult(result)
    await router.push('/item')
  } catch (error) {
    let message = '解析失败，请稍后重试。'
    if (axios.isAxiosError(error)) {
      const detail = error.response?.data?.detail
      if (typeof detail === 'string' && detail.trim()) {
        message = detail
      } else if (error.message) {
        message = error.message
      }
    } else if (error instanceof Error) {
      message = error.message
    }
    uiStore.setError(message)
  } finally {
    uiStore.setLoading(false)
  }
}
</script>

<style scoped>
.upload-page {
  max-width: 640px;
  margin: 24px auto;
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background-color: #fff;
}

.title {
  margin: 0 0 8px;
  font-size: 20px;
  line-height: 1.3;
}

.desc {
  margin: 0 0 12px;
  color: #4b5563;
  font-size: 14px;
  line-height: 1.5;
}

.file-input {
  display: block;
  margin-bottom: 16px;
}

.actions {
  display: flex;
  gap: 5px;
}

.primary-btn,
.ghost-btn {
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
}

.primary-btn {
  color: #fff;
  background-color: #2563eb;
}

.ghost-btn {
  color: #1f2937;
  background-color: #e5e7eb;
}

.primary-btn:disabled,
.ghost-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.filename {
  margin-top: 12px;
  color: #111827;
}

.error {
  margin-top: 12px;
  color: #dc2626;
}

.format-tips {
  margin-top: 14px;
  padding: 12px;
  border-radius: 8px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.format-tips h2 {
  margin: 0 0 8px;
  font-size: 16px;
}

.format-tips ul {
  margin: 0 0 8px;
  padding-left: 18px;
  color: #374151;
  font-size: 13px;
  line-height: 1.5;
}

.format-tips li {
  margin-bottom: 4px;
}

.example {
  margin: 0;
  padding: 10px;
  background: #111827;
  color: #f9fafb;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.45;
  overflow: auto;
}
</style>
