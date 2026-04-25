<template>
  <aside class="upload-drawer">
    <header class="drawer-header">
      <h2>动态题库上传</h2>
      <button class="close-btn" @click="closeDrawer">关闭</button>
    </header>

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
      <h3>标准格式示例（两种格式都支持）</h3>

      <p class="example-title">格式一：每题后紧跟答案</p>
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

答案: A,C,D</pre>

      <p class="example-title">格式二：题目在前，答案集中在后</p>
      <pre class="example">[单选]
1. 2+2等于几？
A. 3
B. 4
C. 5

[多选]
2. 以下哪些是编程语言？
A. Python
B. Excel
C. Java
D. C++

参考答案
1. B
2. A,C,D</pre>
    </section>
  </aside>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { parseQuizFile } from '@/api/quiz';
import { useGameStore } from '@/stores/game';
import { useUiStore } from '@/stores/ui';

const router = useRouter();
const gameStore = useGameStore();
const uiStore = useUiStore();

const selectedFile = ref<File | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

const emit = defineEmits(['close']);

function closeDrawer() {
  emit('close');
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  selectedFile.value = target.files?.[0] ?? null;
  uiStore.clearError();
}

function clearSelection() {
  selectedFile.value = null;
  uiStore.clearError();
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
}

async function handleUpload() {
  if (!selectedFile.value) return;
  uiStore.setLoading(true);
  uiStore.clearError();

  try {
    const result = await parseQuizFile(selectedFile.value);
    if (!result.questions?.length) {
      throw new Error('解析结果为空，请检查文件内容后重试。');
    }
    gameStore.setParseResult(result);
    closeDrawer();
    await router.push('/item');
  } catch (error) {
    let message = '解析失败，请稍后重试。';
    if (axios.isAxiosError(error)) {
      const detail = error.response?.data?.detail;
      if (typeof detail === 'string' && detail.trim()) {
        message = detail;
      } else if (error.message) {
        message = error.message;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }
    uiStore.setError(message);
  } finally {
    uiStore.setLoading(false);
  }
}

// Watch for drawer closing to clear file selection and error
watch(() => emit, () => {
  clearSelection();
}, { immediate: true });
</script>

<style scoped>
.upload-drawer {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: min(90vw, 420px);
  background: #fff;
  border-left: 1px solid #e5e7eb;
  padding: 14px;
  z-index: 30;
  overflow: auto;
  font-size: 13px;
  line-height: 1.45;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.drawer-header h2 {
  margin: 0;
  font-size: 18px;
  line-height: 1.25;
}

.close-btn,
.primary-btn,
.ghost-btn {
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 13px;
  cursor: pointer;
}

.close-btn {
  background: #e5e7eb;
}

.desc {
  color: #4b5563;
  margin-bottom: 8px;
  font-size: 13px;
  line-height: 1.4;
}

.file-input {
  margin-bottom: 10px;
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 10px;
}

.primary-btn {
  background: #2563eb;
  color: #fff;
}

.ghost-btn {
  background: #e5e7eb;
  color: #111827;
}

.primary-btn:disabled,
.ghost-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.filename {
  margin-top: 8px;
  color: #111827;
  font-size: 12px;
}

.error {
  margin-top: 8px;
  color: #dc2626;
  font-size: 12px;
}

.format-tips {
  margin-top: 10px;
}

.format-tips h3 {
  margin: 0 0 6px;
  font-size: 14px;
}

.example-title {
  margin: 8px 0 4px;
  font-size: 12px;
  color: #374151;
}

.example {
  margin: 0;
  padding: 10px;
  border-radius: 8px;
  background: #111827;
  color: #f9fafb;
  font-size: 12px;
  line-height: 1.35;
  overflow: auto;
}
</style>
