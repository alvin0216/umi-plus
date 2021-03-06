
# umi plus 

**UMI 的构建配置优化**

- [umi](https://github.com/umijs/umi)
- [Fast Refresh](https://umijs.org/zh-CN/docs/fast-refresh): 开发环境下，可以保持组件状态，同时编辑提供即时反馈。
- [mfsu](https://umijs.org/zh-CN/docs/mfsu): `mfsu` 是一种基于 `webpack5` 新特性 `Module Federation` 的打包提速方案。
- [替换 Moment.js](https://ant-design.gitee.io/docs/react/replace-moment-cn)
- [externals](https://umijs.org/zh-CN/config#externals): 使用 cdn 代替本地包，如 react、react-dom...
- [dynamicImport](https://umijs.org/zh-CN/config#dynamicimport): 按需加载
- [如何做编译提速](https://umijs.org/zh-CN/guide/boost-compile-speed#%E9%85%8D%E7%BD%AE-nodemodulestransform-%E4%B8%BA---type-none-)

## 详见 .umirc.ts 配置

```ts
// @ts-ignore
import AntdDayjsWebpackPlugin from 'antd-dayjs-webpack-plugin';
import { defineConfig } from 'umi';

export default defineConfig({
  proxy: {
    '/api': {
      target: 'http://jsonplaceholder.typicode.com/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },

  routes: [{ path: '/', component: '@/pages/index' }],

  // favicon: '',
  // title: '',
  theme: { 'primary-color': '#1DA57A' },
  locale: { default: 'zh-CN' }, // 默认中文

  // 配置 external
  externals: { react: 'window.React', 'react-dom': 'window.ReactDOM' },
  scripts:
    process.env.NODE_ENV === 'development'
      ? [
          'https://gw.alipayobjects.com/os/lib/react/17.0.2/umd/react.development.js',
          'https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.development.js',
        ]
      : [
          'https://gw.alipayobjects.com/os/lib/react/17.0.2/umd/react.production.min.js',
          'https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.production.min.js',
        ],

  chunks: ['antd', 'umi'],
  chainWebpack(config) {
    config.module.rule('mjs-rule').test(/.m?js/).resolve.set('fullySpecified', false);
    config.plugin('AntdDayjsWebpackPlugin').use(new AntdDayjsWebpackPlugin());
    config.plugins.delete('friendly-error'); // 出问题再开启

    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 3,
          automaticNameDelimiter: '.',
          cacheGroups: {
            antd: {
              name: 'antd',
              test: /[\\/]node_modules[\\/](antd)[\\/]/,
              enforce: true,
              priority: 4,
            },
          },
        },
      },
    });
  },

  // 构建相关
  publicPath: './', // 打包相对路径
  dynamicImport: {}, // 启用按需加载
  hash: true, // 配置是否让生成的文件包含 hash 后缀，通常用于增量发布和避免浏览器加载缓存
  devtool: 'eval', // 使用最低成本的 sourcemap 生成方式，默认是 cheap-module-source-map
  esbuild: {}, // 试验性功能，可能有坑，但效果拔群。
  webpack5: {}, // 使用 webpack 5 代替 webpack 4 进行构建。
  mfsu: {}, // mfsu 是一种基于 webpack5 新特性 Module Federation 的打包提速方案
  fastRefresh: {},
  workerLoader: {},
  nodeModulesTransform: { type: 'none', exclude: [] }, // 编译优化 不希望 node_modules 下的文件走 babel 编译
  targets: { chrome: 79, firefox: false, safari: false, edge: false, ios: false }, // 选择合适的浏览器版本，可减少不少尺寸
  // ignoreMomentLocale: true, // 忽略 moment 的 locale 文件，用于减少尺寸 ===> 使用 dayjs 代替了

  analyze: {
    analyzerMode: 'server',
    analyzerPort: 8888,
    openAnalyzer: true,
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info',
    defaultSizes: 'parsed', // stat  // gzip
  },
});
```

