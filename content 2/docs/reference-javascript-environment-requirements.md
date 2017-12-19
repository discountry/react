---
id: javascript-environment-requirements
title: JavaScript 环境要求
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 16 依赖集合类型 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 和 [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)。若你要支持老式的可能未提供原生支持的浏览器和设备（例如 IE < 11），考虑在你的应用库中包含一个全局的 polyfill，例如 [core-js](https://github.com/zloirock/core-js) 或 [babel-polyfill](https://babeljs.io/docs/usage/polyfill/)。

一个使用 core-js 支持老版浏览器的 React 16 polyfill 环境大致如下：

```js
import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

React 也依赖于 `requestAnimationFrame` （甚至包括测试环境）。你可以使用[raf](https://www.npmjs.com/package/raf) 包去 shim `requestAnimationFrame`：

```js
import 'raf/polyfill';
```
