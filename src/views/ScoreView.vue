<template>
  
  <!-- 确保模板中正确使用了组件 -->
  <ItemContainer fatherComponent="home" />
  <!-- 或者根据你的路由逻辑渲染 -->
  <router-view />

  <div class="score-page">
    <!-- 分数展示区 -->
    <div class="your_scores_container">
      <header class="your_scores">
        <span class="score_num">{{ score }}</span>
        <span class="fenshu">分！</span>
      </header>
      <div class="result_tip">{{ scoreTips }}</div>
    </div>

    <!-- 分享按钮 -->
    <div class="share_button" @click="toggleShareCover"></div>

    <!-- 二维码区域 -->
    <div class="share_code">
      <header class="share_header">关注葡萄之家，获取答案。</header>
      <!-- 请确认图片路径是否正确，建议使用 import 引入或绝对路径 -->
      <img src="../../images/4-4.png" height="212" width="212" class="code_img" alt="QR Code"> 
    </div>

    <!-- 分享遮罩层 -->
    <div class="share_cover" v-show="showHide" @click="toggleShareCover">
      <img src="../../images/5-2.png" class="share_img" alt="Share Guide">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/game' // 引入 Store

// --- Store ---
const gameStore = useGameStore()

// --- State (Local) ---
const showHide = ref<boolean>(false) // 是否显示分享提示

// --- Computed (基于 Store 数据) ---

// 1. 直接从 Store 获取计算好的分数
// 前提：你在 game.ts 中添加了 calculateScore getter
const score = computed<number>(() => gameStore.calculateScore)

// 2. 分数提示语逻辑
const scoreTips = computed<string>(() => {
  const tipsArr = [
    '你说，是不是把知识都还给小学老师了？',
    '还不错，但还需要继续加油哦！',
    '不要嘚瑟还有进步的空间！',
    '智商离爆表只差一步了！',
    '你也太聪明啦，葡萄之家欢迎你！'
  ]
  
  // 计算索引：每20分一级，最大索引为4
  // Math.ceil(20/20)-1 = 0, Math.ceil(100/20)-1 = 4
  let index = Math.ceil(score.value / 20) - 1
  
  // 边界保护：防止分数为0时 index 为 -1，或超过满分
  if (index < 0) index = 0
  if (index > 4) index = 4
  
  return tipsArr[index]!
})

// --- Methods ---
const toggleShareCover = () => {
  showHide.value = !showHide.value
}

// --- Lifecycle ---
onMounted(() => {
  // 设置背景图
  // 注意：如果图片在 public 文件夹，使用 '/static/img/4-1.jpg'
  // 如果图片在 src/assets，建议使用 import 或 Vite 的 new URL
  document.body.style.backgroundImage = "url('/static/img/4-1.jpg')"
  
  // 可选：如果用户直接刷新此页面，确保数据存在
  // 如果 gameStore 是空的（例如用户直接访问 /score 链接），可能需要重定向回首页
  if (gameStore.userAnswers.length === 0) {
    console.warn('未检测到答题记录，请从首页开始答题。')
    // router.push('/') // 如果需要强制跳转，解开此行并引入 router
  }
})
</script>

<style lang="less" scoped>
/* 全局 body 样式建议在 App.vue 或主路由级别控制，或者保留在此处但去掉 scoped 影响 */
/* 由于加了 scoped，body 选择器可能不生效，建议将 body 样式移到全局 style 或 App.vue */
/* 这里为了还原效果，暂时保留，但请注意 scoped 对 body 无效 */
:global(body) {
  background-image: url(../images/4-1.png);
  padding-top: 1.2rem;
}

.your_scores_container {
  width: 9.7rem;
  height: 9.1rem;
  background: url(../images/4-2.png) no-repeat;
  background-size: 100% 100%;
  margin: 0 auto 0;
  position: relative;
  
  .your_scores {
    position: absolute;
    width: 100%;
    text-indent: 3.3rem;
    top: 4.7rem;
    font-size: 1.4rem;
    font-weight: 900;
    -webkit-text-stroke: 0.05rem #412318;
    font-family: 'Microsoft YaHei';
    
    .score_num {
      font-family: Tahoma, Helvetica, Arial;
      color: #a51d31;
    }
    .fenshu {
      color: #a51d31;
    }
  }
  
  .result_tip {
    position: absolute;
    top: 7rem;
    width: 9rem;
    left: 0.6rem;
    color: #3e2415;
    font-size: 0.65rem;
    text-align: center;
  }
}

.share_button {
  width: 6.025rem;
  height: 2.4rem;
  margin: 0.8rem auto 0;
  background: url(../images/4-3.png) no-repeat 0.4rem 0;
  background-size: 5.825rem 100%;
  cursor: pointer;
}

.share_code {
  width: 5.3rem;
  margin: 1.5rem auto 0;
  
  .share_header {
    color: #664718;
    font-size: 0.475rem;
    font-family: 'Microsoft YaHei';
    width: 7rem;
    font-weight: 500;
    text-align: center; /* 增加居中以防万一 */
  }
  
  .code_img {
    height: 5.3rem;
    width: 5.3rem;
    margin-top: 0.5rem;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
}

.share_cover {
  position: fixed;
  bottom: 0;
  right: 0;
  top: 0;
  left: 0;
  background: url(../images/4-4.png) no-repeat;
  background-size: 100% 100%;
  opacity: 0.92;
  z-index: 999;
  cursor: pointer;
}

.share_img {
  height: 10.975rem;
  width: 11.95rem;
  position: fixed;
  top: 0.5rem;
  left: 50%;
  margin-left: -5.975rem;
}
</style>