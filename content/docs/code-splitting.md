---
id: code-splitting
title: Code-Splitting
permalink: docs/code-splitting.html
---

## 打包

大多数 React 应用都会通过类似 [Webpack](https://webpack.js.org/) 或 [Browserify](http://browserify.org/) 构建自己的文件 “包（bundled）”。构建是一个将文件引入并合并到一个单独文件：“包（bundle）” 的环节。该包包含在一个 web  页面上用以立刻加载整个应用。

#### 例子

**App:**

```js
// app.js
import { add } from './math.js';

console.log(add(16, 26)); // 42
```

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

**Bundle:**

```js
function add(a, b) {
  return a + b;
}

console.log(add(16, 26)); // 42
```

> 注意：
>
> 你的包最终看起来会和这个有很大的不同。

若你正在使用 [Create React App](https://github.com/facebookincubator/create-react-app), [Next.js](https://github.com/zeit/next.js/)、[Gatsby](https://www.gatsbyjs.org/) 或类似工具，你将有一个能够立即对你的应用进行打包的 webpack 配置。

若你未使用，你职责需要自己来进行配置。例如，查看 webpack 文档上的[安装](https://webpack.js.org/guides/installation/)和
[入门](https://webpack.js.org/guides/getting-started/)指南。

## 代码分隔

打包非常棒，但随着你的应用增长，你的代码包也将随之增长。尤其是如果你包含了体积大的第三方库。你需要关注你代码包中所包含的代码以避免体积过大而使得加载时间过长。

为了避免清理大体积的代码包，在一开始就解决该问题并开始对代码包进行分割则十分不错。[代码分割](https://webpack.js.org/guides/code-splitting/)是由如 webpack 和 Browserify（通过 [factor-bundle](https://github.com/browserify/factor-bundle)）等打包器支持的一项能够创建多个包并在运行时动态加载的特性。

代码分割你的应用能够帮助你“懒加载”当前用户所需要的内容，能够显著地提高你的应用性能。尽管你不用减少你的应用中过多的代码体积，你仍然能够避免加载用户永远不需要的代码，并在初始化时候减少所需加载的代码量。

## `import()`

在你的应用中引入代码分割的最佳方式是通过动态 `import()` 语法。

**之前:**

```js
import { add } from './math';

console.log(add(16, 26));
```

**之后:**

```js
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```

> 注意：
>
> 动态 `imports()` 语法目前是 ECMAScript (JavaScript) [提案](https://github.com/tc39/proposal-dynamic-import) 而不是语言标准。期待其在不远的将来被接纳成为标准的一部分。

当 Webpack 解析到该语法时，它会自动地开始进行代码分割。如果你使用 Create React App，该功能已配置好，你已可以[开始使用](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#code-splitting)。[Next.js](https://github.com/zeit/next.js/#dynamic-import) 也已支持该特性而无需再配置(out of box)。

如果你自己配置 Webpack，你可能要阅读下 Webpack [关于代码分割的指南](https://webpack.js.org/guides/code-splitting/)。你的 Webpack 配置应该看起来有点[类似于此](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269)。

当使用 [Babel](http://babeljs.io/) 时，你需要确保 Babel 能够解析动态引入语法而不是将其进行转换。对于这一要求你需要 [babel-plugin-syntax-dynamic-import](https://yarnpkg.com/en/package/babel-plugin-syntax-dynamic-import)。

## 库

### React Loadable

[React Loadable](https://github.com/thejameskyle/react-loadable) 将动态引入(dynamic import)封装成了一个对 React 友好的 API 来在特定组件下引入代码分割的功能。

**之前:**

```js
import OtherComponent from './OtherComponent';

const MyComponent = () => (
  <OtherComponent/>
);
```

**之后:**

```js
import Loadable from 'react-loadable';

const LoadableOtherComponent = Loadable({
  loader: () => import('./OtherComponent'),
  loading: () => <div>Loading...</div>,
});

const MyComponent = () => (
  <LoadableOtherComponent/>
);
```

React Loadable 帮助你创建[加载状态](https://github.com/thejameskyle/react-loadable#creating-a-great-loading-component)、[错误状态](https://github.com/thejameskyle/react-loadable#loading-error-states)、[超时](https://github.com/thejameskyle/react-loadable#timing-out-when-the-loader-is-taking-too-long)、[预加载](https://github.com/thejameskyle/react-loadable#preloading)等等。它甚至能通过大量的代码分割帮助进行[服务端渲染](https://github.com/thejameskyle/react-loadable#------------server-side-rendering)。

## 基于路由的代码分隔

决定在哪引入代码分割则需要一些技巧。你需要确保选择的位置能够均匀地分割代码包而不会影响用户体验。

一个不错的位置是从路由开始。大多数网络用户习惯于花费些时间在页面交互。你也可以立刻重渲整个页面这样你的用户则无法与页面的其他元素进行交互。

这有一个使用类似 [React Router](https://reacttraining.com/react-router/) 和
[React Loadable](https://github.com/thejameskyle/react-loadable) 库的关于如何配置基于路由的代码分割的例子。

```js
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';

const Loading = () => <div>Loading...</div>;

const Home = Loadable({
  loader: () => import('./routes/Home'),
  loading: Loading,
});

const About = Loadable({
  loader: () => import('./routes/About'),
  loading: Loading,
});

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
    </Switch>
  </Router>
);
```
