---
title: "What's New in Create React App"
author: [gaearon]
---

在不到一年前，我们介绍了 [Create React App](/blog/2016/07/22/create-apps-with-no-configuration.html) 作为一种官方支持的零配置方法来构建应用。此后，该项目取得了巨大的进展，250多名参与者提交了950多次提交。

今天，我们很兴奋地宣布，过去几个月中在进展中的许多新功能最终发布了。

像过去一样， 通过 `Create React App`，**你可以通过更新单个依赖项来在现有应用程序中享受这些改进只要你的项目并没有执行弹出操作，** 请参考我们的 [迁移说明](https://github.com/facebookincubator/create-react-app/releases/tag/v1.0.0)。、

新创建的项目会自动获得这些新的功能改进。

### webpack 2

>*这个功能开发者是[@Timer](https://github.com/Timer) 在 [#1291](https://github.com/facebookincubator/create-react-app/pull/1291).*

我们已经升级到了几个月前[正式发布](https://medium.com/webpack/webpack-2-and-beyond-40520af9067f)的 `webpack2`。这对许多 bug 修复和整体改进都是一个巨大的升级。我们已经对它进行了一段时间的测试，并最终认为它已经足够稳定并鼓励大家都来尝试一下。

`webpack` 的配置风格发生了改变，但是没有使用弹出操作的 `Create React App` 用户不需要担心，我们已经在我们内部做了对应的调整。

如果出于某种原因你必须要做弹出操作的话，可以参考 `webpack` 提供的 [升级指南](https://webpack.js.org/guides/migrating/) 对你的应用进行必要的升级。需要说明的是，Create React App 发布的每个版本，我们都努力去支持尽可能多的应用场景以便将来你不需要做弹出操作。

webpack 2 最引人注目的新特性就是其对 ES6 模块 的支持，可以直接创建和引入 [ES6 模块](http://2ality.com/2014/09/es6-modules-final.html)而不必把事先它们编译成 CommonJS 模块。虽然这不应该影响你如何写代码因为你可能已经在使用 `import` 和 `export` 语句了。但是它可以在编译阶段捕获更多的错误，比如exports 的变量undefined之类的：

![Export validation](../img/blog/cra-update-exports.gif) 

未来，随着 ES6 模块相关生态系统的成熟，webpack 2 还提供了 [tree shaking](https://webpack.js.org/guides/tree-shaking/) 特性，可以通过去除冗余代码，优化打包后脚本的尺寸。

### Runtime Error Overlay

>*开发这个功能的是 [@Timer](https://github.com/Timer) 和 [@nicinabox](https://github.com/nicinabox) 在 [#1101](https://github.com/facebookincubator/create-react-app/pull/1101), [@bvaughn](https://github.com/bvaughn) 在 [#2201](https://github.com/facebookincubator/create-react-app/pull/2201).*

你有没有这种经历，代码中写错了一个地方，控制台里也报错了，但是死活找不到报错代码的位置？或者情况更糟，你允许应用上线了然后程序在生产环境下直接崩掉了，只是因为你漏掉了开发环境中的一个错误？

为了解决这个问题，我们引入了一个专门捕获错误的弹窗，当程序报错的时候会展示报错信息和引发错误的位置！当然，这只会出现在开发环境中，你也可以按 `ESC` 把它关闭。

一图胜千言，有图，有真相:
    
![Runtime error overlay](../img/blog/cra-runtime-error.gif) 

(没错，它还能跟你的编辑器结合到一起!)

未来 Creat React App 还准备支持更多错误捕获。比如在React 16 版本发布之后，Creat React App 计划支持 React 组件调用栈的展示。

### 默认支持渐进式web应用

>*这个功能的贡献者是 [@jeffposnick](https://github.com/jeffposnick) 在 [#1728](https://github.com/facebookincubator/create-react-app/pull/1728).*

使用新版本 Creat React App 创建的项目默认就会支持 [渐进式web应用](https://developers.google.com/web/progressive-web-apps/)。这意味着它们使用了 [service workers](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers)， 通过 [离线优先缓存策略](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-falling-back-to-network) 来优化用户再次访问应用的速度。当然，你也可以通过设置默认不开启这个特性，但是如果你在开发新的应用，我推荐你使用它，特别是在移动设备上运行的应用，体验会更好。

![Loading assets from service worker](../img/blog/cra-pwa.png) 

使用新版本 Creat React App 创建的项目默认就支持这些新特性，但是你可以很容易的对老项目进行升级，请参考[升级指南](https://github.com/facebookincubator/create-react-app/releases/tag/v1.0.0)。

在未来的几周我们会为这个主题增加 [更多文档](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#making-a-progressive-web-app)。希望大家在答疑区畅所欲言，[积极提问](https://github.com/facebookincubator/create-react-app/issues/new) 。


### Jest 20

>*这个功能的贡献者是 [@rogeliog](https://github.com/rogeliog) 在 [#1614](https://github.com/facebookincubator/create-react-app/pull/1614) 和 [@gaearon](https://github.com/gaearon) 在 [#2171](https://github.com/facebookincubator/create-react-app/pull/2171).*
   
   我们正在使用的是最新版的 Jest，包括了许多的 bug 修复和功能增强。更多信息请阅读博客 [Jest 19](https://facebook.github.io/jest/blog/2017/02/21/jest-19-immersive-watch-mode-test-platform-improvements.html) 和 [Jest 20](http://facebook.github.io/jest/blog/2017/05/06/jest-20-delightful-testing-multi-project-runner.html)。

主要亮点包括 [immersive watch mode](https://facebook.github.io/jest/blog/2017/02/21/jest-19-immersive-watch-mode-test-platform-improvements.html#immersive-watch-mode)， [a better snapshot format](https://facebook.github.io/jest/blog/2017/02/21/jest-19-immersive-watch-mode-test-platform-improvements.html#snapshot-updates)， [improvements to printing skipped tests](https://facebook.github.io/jest/blog/2017/02/21/jest-19-immersive-watch-mode-test-platform-improvements.html#improved-printing-of-skipped-tests)，以及 [new testing APIs](https://facebook.github.io/jest/blog/2017/05/06/jest-20-delightful-testing-multi-project-runner.html#new-improved-testing-apis)。

![Immersive test watcher](../img/blog/cra-jest-search.gif) 

现在 Create React App 只需要做少量 Jest 的配置就可以生成覆盖率报告了。

### 动态import()代码分割

>*这个功能的贡献者是 [@Timer](https://github.com/Timer) 在 [#1538](https://github.com/facebookincubator/create-react-app/pull/1538) 和 [@tharakawj](https://github.com/tharakawj) 在 [#1801](https://github.com/facebookincubator/create-react-app/pull/1801).*
   
 对于 web 应用而言很重要的一点就是减轻页面初始化时的 JS 加载负担，并做到  [按需加载](https://medium.com/@addyosmani/progressive-web-apps-with-react-js-part-2-page-load-performance-33b932d97cf2)。虽然 Create React App 发布以后通过使用 `require.ensure()` 支持 [代码分割](https://webpack.js.org/guides/code-splitting-async/) , 它使用 webpack 规范的语法然而在 Jest 及其他环境下并不适用。
   
这个版本，我们增加了它对[动态 `import()` 代码分割](http://2ality.com/2017/01/import-operator.html#loading-code-on-demand) 的支持，这与未来的 web 标准是一致的。 与 `require.ensure()` 不同的是, 它不会影响 Jest 的测试，并最终会成为 JavaScript 的一部分。我们建议你使用 `import()` 来对不必要的组件的代码做延迟加载。

![Creating chunks with dynamic import](../img/blog/cra-dynamic-import.gif)

### 更好的控制台输出

>*本功能开发者是 [@gaearon](https://github.com/gaearon) 于 [#2120](https://github.com/facebookincubator/create-react-app/pull/2120)， [#2125](https://github.com/facebookincubator/create-react-app/pull/2125)， 和 [#2161](https://github.com/facebookincubator/create-react-app/pull/2161)。*

新版的 Create React App 改善了控制台的输出。

举个例子，当你启动测试服务时，新版的 Create React App 除了会显示本地地址之外，还会显示局域网ip地址，这样你就能更快的用你的手机测试应用了：

![Better console output](../img/blog/cra-better-output.png) 

当代码错误报告出来了，我们将不再展示警告信息以便你集中注意力到更严重的问题上。错误和警告信息在生产环境下的展示也被优化了，而且构建错误的弹出字体跟浏览器字体匹配度更高了。

### 别急... 还有干货！

虽然讲了很多，但是这个版本中还有许多未能介绍的新特性，比如 [environment-specific and local `.env` files](https://github.com/facebookincubator/create-react-app/pull/1344)，[a lint rule against confusingly named globals](https://github.com/facebookincubator/create-react-app/pull/2130)，[support for multiple proxies in development](https://github.com/facebookincubator/create-react-app/pull/1790)， [a customizable browser launch script](https://github.com/facebookincubator/create-react-app/pull/1590)以及许多 bug 修复。

更多信息请参阅升级文档 [v1.0.0 发布详情](https://github.com/facebookincubator/create-react-app/releases/tag/v1.0.0)。

### 致谢

这个发布版本是 React 社区的许多成员共同奋斗几个月的成果。我们旨在同时提升开发者的开发体验和用户的使用体验，因为我们坚信，这二者是互相补充携手并进的。

我们很感谢 [参与贡献的每个人](https://github.com/facebookincubator/create-react-app/graphs/contributors), 无论是贡献代码, 文档, 或者为他人提供帮助。我们尤其要感谢 [Joe Haddad](https://github.com/timer) 为了维护项目所付出的巨大努力。

我们非常高兴为使用 Create React App 的开发者带来着这些改进，我们会继续期待着你们的反馈和贡献。

