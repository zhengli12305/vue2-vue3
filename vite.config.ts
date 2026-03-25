// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// 【重要】尝试动态导入 compression 插件，如果没安装则忽略，防止报错
let compressionPlugin: any = null
try {
  // 如果您还没运行 npm install -D vite-plugin-compression，这里会失败，我们捕获它
  const mod = require('vite-plugin-compression')
  compressionPlugin = mod.default || mod
} catch (e) {
  // 插件未安装，忽略
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProd = mode === 'production'

  // ===========================
  // 1. 配置参数 (源自 config/index.js)
  // ===========================
  const assetsSubDirectory = 'static' 
  const assetsPublicPath = isProd ? '/public/' : '/'
  const productionSourceMap = true
  const productionGzip = false // 原配置为 false
  const productionGzipExtensions = ['js', 'css']
  
  const devPort = 8088
  const devProxyPath = 'https://mainsite-restapi.ele.me'

  // ===========================
  // 2. 插件配置
  // ===========================
  const plugins: any[] = [vue()]

  // 只有当 productionGzip 为 true 且插件已安装时才启用
  if (isProd && productionGzip && compressionPlugin) {
    plugins.push(
      compressionPlugin({
        algorithm: 'gzip',
        ext: '.gz',
        include: new RegExp(`\\.(${productionGzipExtensions.join('|')})$`),
        threshold: 10240,
        minRatio: 0.8,
      })
    )
  }

  // ===========================
  // 3. 返回配置对象
  // ===========================
  return {
    plugins,

    // 基础路径
    base: assetsPublicPath,

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'src': path.resolve(__dirname, './src'),
        'assets': path.resolve(__dirname, './src/assets'),
        'components': path.resolve(__dirname, './src/components'),
      },
      extensions: ['.js', '.vue', '.json', '.ts', '.tsx', '.jsx', '.less', '.css', '.scss'],
    },

    server: {
      port: devPort,
      open: true,
      proxy: {
        // 代理配置
        '/api': {
          target: devProxyPath,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

    build: {
      outDir: 'public', // 对应 assetsRoot
      assetsDir: assetsSubDirectory, // 对应 assetsSubDirectory
      sourcemap: productionSourceMap, // 对应 productionSourceMap
      
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia'],
          },
          entryFileNames: `${assetsSubDirectory}/js/[name].js`,
          chunkFileNames: `${assetsSubDirectory}/js/[name].[hash].min.js`,
          assetFileNames: ({ name }) => {
            if (name && name.endsWith('.css')) {
              return `${assetsSubDirectory}/css/[name].[ext]`
            }
            if (name && /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/.test(name)) {
              return `${assetsSubDirectory}/img/[name].[ext]`
            }
            return `${assetsSubDirectory}/[name].[ext]`
          }
        }
      }
    },

    css: {
      devSourcemap: false, // 对应 cssSourceMap: false
    },
  }
})