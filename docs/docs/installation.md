---
id: installation
title: 安装
permalink: docs/installation.html
redirect_from:
  - "download.html"
  - "downloads.html"
  - "docs/tooling-integration.html"
  - "docs/package-management.html"
  - "docs/language-tooling.html"
  - "docs/environments.html"
next: hello-world.html
---
<style>
  .tab-hidden {
    display: none;
  }
</style>

React 可被灵活地运用在各种项目中。你可以用它创建新的应用程序，也可以逐渐地将其加入到现有的代码库中而无需重写。

<div class="toggler">
  <style>
    .toggler li {
       display: inline-block;
       position: relative;
       top: 1px;
       padding: 10px;
       margin: 0px 2px 0px 2px;
       border: 1px solid #05A5D1;
       border-bottom-color: transparent;
       border-radius: 3px 3px 0px 0px;
       color: #05A5D1;
       background-color: transparent;
       font-size: 0.99em;
       cursor: pointer;
    }
    .toggler li:first-child {
      margin-left: 0;
    }
    .toggler li:last-child {
      margin-right: 0;
    }
    .toggler ul {
      display: inline-block;
      list-style-type: none;
      margin: 0;
      border-bottom: 1px solid #05A5D1;
      cursor: default;
    }
    @media screen and (max-width: 960px) {
      .toggler li,
      .toggler li:first-child,
      .toggler li:last-child {
        display: block;
        border-bottom-color: #05A5D1;
        border-radius: 3px;
        margin: 2px 0px 2px 0px;
      }
      .toggler ul {
        border-bottom: 0;
      }
    }
    .display-target-fiddle .toggler .button-fiddle:focus,
    .display-target-newapp .toggler .button-newapp:focus,
    .display-target-existingapp .toggler .button-existingapp:focus {
      background-color: #046E8B;
      color: white;
    }
    .display-target-fiddle .toggler .button-fiddle,
    .display-target-newapp .toggler .button-newapp,
    .display-target-existingapp .toggler .button-existingapp {
      background-color: #05A5D1;
      color: white;
    }
    block {
      display: none;
    }
    .display-target-fiddle .fiddle,
    .display-target-newapp .newapp,
    .display-target-existingapp .existingapp {
      display: block;
    }
  </style>
  <script>
    document.querySelector('.toggler').parentElement.className += ' display-target-fiddle';
  </script>
  <span>下一步你想做什么？</span>
  <br />
  <br />
   <ul role="tablist" >
      <li id="fiddle" class="button-fiddle" aria-selected="false" role="tab" tabindex="0" aria-controls="fiddletab"
          onclick="display('target', 'fiddle')" onkeyup="keyToggle(event, 'fiddle', 'existingapp', 'newapp')">
        尝试 React
      </li>
      <li id="newapp" class="button-newapp" aria-selected="false" role="tab" tabindex="-1" aria-controls="newapptab"
          onclick="display('target', 'newapp')" onkeyup="keyToggle(event, 'newapp', 'fiddle', 'existingapp')">
        创建新应用
      </li>
      <li id="existingapp" class="button-existingapp" aria-selected="false" role="tab" tabindex="-1" aria-controls="existingapptab"
          onclick="display('target', 'existingapp')" onkeyup="keyToggle(event, 'existingapp', 'newapp', 'fiddle')">
        添加 React 到现有应用
      </li>
    </ul>
</div>

<block id="fiddletab" role="tabpanel" class="fiddle"  />

## 尝试 React

如果你只是想简单尝试下 React，可以使用 CodePen. 首先试试这个 [Hello World 示例代码](http://codepen.io/gaearon/pen/rrpgNB?editors=0010)。你不需要安装任何东西，还能简单修改下代码使其生效。

如果你喜欢使用自己的文本编辑器，你还可以 <a href="/react/downloads/single-file-example.html" download="hello.html">下载此 HTML 文件</a> 进行编辑, 然后在本地浏览器中打开。它会执行缓慢的运行时代码转换，所以不要在生产环境中使用。

如果你想在一个完整的项目中使用 React，一般有两种方式：创建 React 应用或添加 React 到现有应用。

<block id="newapptab" role="tabpanel" class="newapp" />

## 创建新应用

[Create React App](http://github.com/facebookincubator/create-react-app) 是开始构建新的 React 单页面应用的最佳途径。 它可以帮你配置开发环境，以便你可以使用最新的 JavaScript 特性，还能提供很棒的开发体验，并为生产环境优化你的应用

```bash
npm install -g create-react-app
create-react-app my-app

cd my-app
npm start
```

Create React App 并不处理后端逻辑和数据库，它只会创建一个前端的构建管道，所以可以和任何后端搭配使用。它可以使用 Babel 和 Webpack 这样的配置工具，也可以零配置使用。

当你准备好将其部署到生产环境中时，运行 `npm run build`  将会在 `build` 文件夹中创建一个优化好的应用。你可以从 [README](https://github.com/facebookincubator/create-react-app#create-react-app-) 和 [用户指南](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#table-of-contents) 中了解更多信息。

<block id="existingapptab" role="tabpanel" class="existingapp" />

## 添加 React 到现有应用

你不需要为了使用 React 重写你的应用。

我们建议你将 React 添加到应用的一小部分中，比如单个小部件，以便你看它是否适用于你的情况。

虽然 React [可以在没有构建管道的情况下使用](/react/docs/react-without-es6.html) ，但是为了更高效我是还建议你使用它，现代的构建管道通常包括:

* **包管理器**，比如 [Yarn](https://yarnpkg.com/) 或 [npm](https://www.npmjs.com/)。它可以让你使用庞大的第三方软件包生态系统，还能很方便的安装或升级。
* **构建器**，比如 [webpack](https://webpack.js.org/) 或 [Browserify](http://browserify.org/)。它允许你编写模块化代码并且压缩文件以优化加载时间。
* **编译器** 比如 [Babel](http://babeljs.io/)。它可以让包含新特性的代码运行在旧版浏览器上。

### 安装 

>**Note:**
>
>一旦安装 React，我们强烈建议你将它配置为[生产构建程序](/react/docs/optimizing-performance.html#use-the-production-build) ，以确保你在生产环境中使用最新版本的 React。

我们建议使用 [Yarn](https://yarnpkg.com/) 或 [npm](https://www.npmjs.com/) 来管理前端的依赖关系, 如果你还未使用过包管理器，阅读 [Yarn 文档](https://yarnpkg.com/en/docs/getting-started) 以快速入门。 

使用 Yarn 安装 React：

```bash
yarn init
yarn add react react-dom
```

使用 npm 安装 React：

```bash
npm init
npm install --save react react-dom
```

Yarn 和 npm 都会从 [npm 仓库](http://npmjs.com/) 下载软件包。

### 使用 ES6 和 JSX

我们推荐使用 [Babel](http://babeljs.io/) 以便你在 JavaScript 中使用 ES6 和 JSX，ES6 拥有一系列 JavaScript 新特性的标准，能使你的开发更简单。JSX 是与 React 搭配使用的 JavaScript 语言的扩展。

[Babel 安装说明](https://babeljs.io/docs/setup/) 说明了如何在多种不同的环境中配置 Babel，确保你已经安装了[`babel-preset-react`](http://babeljs.io/docs/plugins/preset-react/#basic-setup-with-the-cli-) 和 [`babel-preset-es2015`](http://babeljs.io/docs/plugins/preset-es2015/#basic-setup-with-the-cli-) 并且在 [`.babelrc` configuration](http://babeljs.io/docs/usage/babelrc/) 配置文件中启用它们, 到这里就准备就绪了。

### 在 Hello Wrorld 中使用 ES6 的 JSX

我们建议你使用像 [webpack](https://webpack.js.org/) 或 [Browserify](http://browserify.org/) 这样的构建工具，以便于编写模块代码并将其压缩，优化加载时间。

下面是最基本的 React 示例：

```js
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

这段代码会将其渲染入一个 ID 为 `root` 的 DOM 元素，所以在你的 HTML 文件中需要有 `<div id="root"></block>div>`。

类似以上，你可以在任何由其他 JavaScript UI 库编辑的现有应用中，将 React 渲染进一个 DOM 元素。

[了解有关将 React 与现有代码集成的更多信息。](/react/docs/integrating-with-other-libraries.html#integrating-with-other-view-libraries)

### 开发和生产版本

默认情况下，React 会包含很多有用的警告，这些警告在开发中非常有用。

**然而，这些警告使开发版本的 React 体积过大并且运行过慢，所以你应该在部署应用时使用生产版本**

了解[如何判断你的网页是否运行了合适的 React 版本](/react/docs/optimizing-performance.html#use-the-production-build), 以及如何有效的配置生产构建程序：

* [使用 Create React App 构建应用](/react/docs/optimizing-performance.html#create-react-app)
* [使用独立文件构建应用](/react/docs/optimizing-performance.html#single-file-builds)
* [使用 Brunch 构建应用](/react/docs/optimizing-performance.html#brunch)
* [使用 Browserify 构建应用](/react/docs/optimizing-performance.html#browserify)
* [使用 Rollup 构建应用](/react/docs/optimizing-performance.html#rollup)
* [使用 Webpack 构建应用](/react/docs/optimizing-performance.html#webpack)

### 使用 CDN

如果你不想使用 npm 来管理软件包，'react' 和 'react-dom' npm 软件包同样提供了托管在 CDN 上的独立文件。

```html
<script src="https://unpkg.com/react@15/dist/react.js"></script>
<script src="https://unpkg.com/react-dom@15/dist/react-dom.js"></script>
```

以上版本仅用于开发，不适合生产。压缩优化的生产版本如下：

```html
<script src="https://unpkg.com/react@15/dist/react.min.js"></script>
<script src="https://unpkg.com/react-dom@15/dist/react-dom.min.js"></script>
```

如果想要加载指定版本的 `react` 和 `react-dom`，用版本号替换 15。

如果你在使用 Bower，可以通过 `react` 包来使用 React。

<script>
/**
 * The code below is based on a snippet from React Native Getting Started page.
 */

// Convert <div>...<span><block /></span>...</div>
// Into <div>...<block />...</div>
var blocks = document.getElementsByTagName('block');
for (var i = 0; i < blocks.length; ++i) {
  var block = blocks[i];
  var span = blocks[i].parentNode;
  var container = span.parentNode;
  container.insertBefore(block, span);
  container.removeChild(span);
}
// Convert <div>...<block />content<block />...</div>
// Into <div>...<block>content</block><block />...</div>
blocks = document.getElementsByTagName('block');
for (var i = 0; i < blocks.length; ++i) {
  var block = blocks[i];
  while (block.nextSibling && block.nextSibling.tagName !== 'BLOCK') {
    block.appendChild(block.nextSibling);
  }
}

function setSelected(value){
  var tabs = document.querySelectorAll('li[role="tab"]');
  for (var i = 0; i < tabs.length; ++i) {
    var tab = tabs[i];
    if (tab.className === 'button-' + value) {
      tabs[i].setAttribute('aria-selected', 'true');
      tabs[i].setAttribute('tabindex', '0');
    } else {
      tabs[i].setAttribute('aria-selected', 'false');
      tabs[i].setAttribute('tabindex', '-1');
    }
  }
}

function keyToggle(e, value, prevTab, nextTab){
  if (e.keyCode === 37) {
    document.getElementById(prevTab).focus();
    display('target', prevTab);
  }
  if (e.keyCode === 39) {
    document.getElementById(nextTab).focus();
    display('target', nextTab);
  }
}

function display(type, value) {
  setSelected(value);
  var container = document.getElementsByTagName('block')[0].parentNode;
  container.className = 'display-' + type + '-' + value + ' ' +
    container.className.replace(RegExp('display-' + type + '-[a-z]+ ?'), '');
}

// If we are coming to the page with a hash in it (i.e. from a search, for example), try to get
// us as close as possible to the correct platform and dev os using the hashtag and block walk up.
var foundHash = false;
if (window.location.hash !== '' && window.location.hash !== 'content') { // content is default
  // Hash links are added a bit later so we wait for them.
  window.addEventListener('DOMContentLoaded', selectTabForHashLink);
}

function selectTabForHashLink() {
  var hashLinks = document.querySelectorAll('a.hash-link');
  for (var i = 0; i < hashLinks.length && !foundHash; ++i) {
    if (hashLinks[i].hash === window.location.hash) {
      var parent = hashLinks[i].parentElement;
      while (parent) {
        if (parent.tagName === 'BLOCK') {
          var target = null;
          if (parent.className.indexOf('fiddle') > -1) {
            target = 'fiddle';
          } else if (parent.className.indexOf('newapp') > -1) {
            target = 'newapp';
          } else if (parent.className.indexOf('existingapp') > -1) {
            target = 'existingapp';
          } else {
            break; // assume we don't have anything.
          }
          display('target', target);
          foundHash = true;
          break;
        }
        parent = parent.parentElement;
      }
    }
  }
}
</script>
