---
id: hello-world
title: Hello World
permalink: docs/hello-world.html
prev: cdn-links.html
next: introducing-jsx.html
---

尝试React最简单的方法是使用[CodePen上的Hello World例子](http://codepen.io/gaearon/pen/ZpvBNJ?editors=0010)。如果你不想安装任何东西，可以在浏览器中打开它，然后跟着尝试我们接下来的例子。如果你更愿意使用本地开发环境，可以查看[安装页面](/docs/installation.html) 。

一个最简单的React例子如下:

```js
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

它渲染了一个 "Hello, world!" 的标题。

接下来的几节将逐步向你介绍如何使用React。我们将详细了解React应用的构成模块：元素和组件。掌握了这些，你将可以使用简单的可复用代码来创建复杂的应用。

## 有关JavaScript的注意事项

React是一个JavaScript库，因此它需要你熟悉JavaScript。如果你感觉还不够了解，我们建议看看[MDN上有关JavaScript的内容](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)，以便你学得更轻松。

在例子中我们也使用了一些ES6语法。由于这些语法还比较新，我们也是尽量谨慎的尝试使用他们。但是我们还是建议你去熟悉一下这些内容：[箭头函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)， [类](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)， [模板字符串](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)， [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)， 和 [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) 声明。你可以使用 <a href="http://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015%2Creact&experimental=false&loose=false&spec=false&code=const%20element%20%3D%20%3Ch1%3EHello%2C%20world!%3C%2Fh1%3E%3B%0Aconst%20container%20%3D%20document.getElementById('root')%3B%0AReactDOM.render(element%2C%20container)%3B%0A">Babel REPL</a> 来查看ES6的编译结果。
