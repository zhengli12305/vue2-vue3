// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProd = mode === 'production'

  // ===========================
  // 1. 配置参数 (源自 config/index.js)
  // ===========================
  const assetsSubDirectory = 'static' 
  const assetsPublicPath = env.VITE_PUBLIC_BASE || '/'
  const productionSourceMap = true
  
  const devPort = 8088
  const devProxyPath = env.VITE_PARSER_API_TARGET || 'http://127.0.0.1:8000'

  // ===========================
  // 2. 插件配置
  // ===========================
  const plugins: any[] = [vue()]

  // ===========================
  // 3. 返回配置对象
  // ===========================
  return {
    plugins,

    // 基础路径
    base: assetsPublicPath,
    //设置路径别名
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'src': path.resolve(__dirname, './src'),
        'assets': path.resolve(__dirname, './src/assets'),
        'components': path.resolve(__dirname, './src/components'),
      },
      extensions: ['.js', '.vue', '.json', '.ts', '.tsx', '.jsx', '.less', '.css', '.scss'],
    },
    // 配置开发服务器代理，解决前端开发的跨域问题
    server: {
      port: devPort,
      open: true,
      proxy: {
        // 代理配置
        '/api': {
          target: devProxyPath,
          changeOrigin: true,
          secure: false
        }
      },
    },

    build: {
      outDir: 'dist', // 对应 assetsRoot
      assetsDir: assetsSubDirectory, // 对应 assetsSubDirectory
      sourcemap: productionSourceMap, // 对应 productionSourceMap
      
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
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