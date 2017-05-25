---
id: tutorial
title: 入门教程
layout: tutorial
sectionid: tutorial
permalink: /tutorial/tutorial.html
redirect_from:
  - "docs/tutorial.html"
  - "docs/why-react.html"
  - "docs/tutorial-ja-JP.html"
  - "docs/tutorial-ko-KR.html"
  - "docs/tutorial-zh-CN.html"
---

## 课前准备

### 教程简介

接下来，我们会一起开发一个 [tic-tac-toe](https://zh.wikipedia.org/wiki/%E4%BA%95%E5%AD%97%E6%A3%8B) 井字棋游戏。

在开始教程之前如果你想预览一下这个游戏会是什么样子的话可以点击 [效果预览](https://codepen.io/gaearon/pen/gWWZgR?editors=0010) 查看。 如果里面的代码你现在一点也看不懂，很多语法都不熟悉也不需要着急，接下来教程会一步一步教你编写出这个小游戏所有的代码。

你可以先试着玩一下这个游戏。除了下棋之外，还可以通过点击旁边的列表，返回到某一步棋时候的棋局状态。

等到你玩得差不多了，大概了解了我们要实现什么样的功能，关掉它准备开始学习编码吧！我们会在一个简单的模板上开始写起。

### 前置知识

在这里我们已经假设你对 HTML 和 JavaScript 都比较熟悉了，不过即使你之前都没有了解过也可以接着跟着教程试试看。

如果你想重新了解一下 JavaScript 的新特性，我们推荐你阅读 [这篇教程](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/A_re-introduction_to_JavaScript)。要注意我们在编码的时候已经开始使用 ES6 最新版本的 JavaScript, 在这篇教程里我们主要使用了 [arrow functions](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [classes](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes), [`let`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let), and [`const`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/const) 几个新的语法和关键字。你也可以使用 <a href="http://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015%2Creact&experimental=false&loose=false&spec=false&code=const%20element%20%3D%20%3Ch1%3EHello%2C%20world!%3C%2Fh1%3E%3B%0Aconst%20container%20%3D%20document.getElementById('root')%3B%0AReactDOM.render(element%2C%20container)%3B%0A">Babel REPL</a> 在线预览一下这些ES6的代码被编译后的效果。

### 如何编写代码

你可以选择在本地的代码编辑器软件里或者是直接在浏览器里跟着编写本教程的代码，你甚至可以试着在本地配置一下开发运行环境。选择你开心的一种方式就好。

#### 在浏览器中编写本教程代码

这是上手最快的一种方式了！

首先在新的浏览器选项卡中打开这个 [初始模板](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)。 你可以看到一个井字棋的棋盘。我们接下来会在这一基础上进行游戏交互功能的开发。

如果你选择这种方式，就可以直接从 [总览](#总览) 开始阅读教程啦。

#### 在代码编辑器中编写本教程代码

同样，你也可以试着在自己的电脑上搭建起开发运行环境来。

注意： **本地搭建React的开发运行环境并不是本教程强制要求的，根据你的实际情况自行考量。**

虽然在本地搭建环境要费一些功夫，但好处是你可以任意选择你惯用的编辑器来完成开发。

如果你已经决定了，那么跟着下面的步骤开始搭建吧：

1. 确保你电脑上安装了最新版本的 [Node.js](https://nodejs.org/zh-cn/).
2. 跟着 [安装指南](/react/docs/installation.html#creating-a-new-application) 创建一个新的 React 项目。
3. 删除掉生成项目中 `src/` 文件夹下的所有文件。
4. 在 `src/` 文件夹下新建一个名为 `index.css` 的文件并拷贝 [这里的 CSS 代码](https://codepen.io/gaearon/pen/oWWQNa?editors=0100) 到文件中。
5. 在 `src/` 文件夹下新建一个名为 `index.js` 的文件并拷贝 [这里的 JS 代码](https://codepen.io/gaearon/pen/oWWQNa?editors=0010) 到文件中, 并在此文件的最开头加上下面几行代码：

    ```js
    import React from 'react';
    import ReactDOM from 'react-dom';
    import './index.css';
    ```

接下来通过命令行在你的项目目录下运行 `npm start` 命令并在浏览器中打开 `http://localhost:3000` 你就能够看到空的井字棋棋盘了。

我们推荐根据 [这篇教程](http://babeljs.io/docs/editors) 配置你代码编辑器的代码高亮指示。

### 寻求帮助

如果你遇到了任何困难，可以在 [community support resources](https://facebook.github.io/react/community/support.html) 寻求帮助。 加入我们的 [Reactiflux chat](/react/community/support.html#reactiflux-chat) 也是一个很不错的选择。如果通过上述方式还是解决不了你的问题，你也可以给我们提一个 issue.

> **译者补充资源：**
> 
> * [从零学习React技术栈](https://zhuanlan.zhihu.com/reactjs) 
> * [React China](http://react-china.org/)

废话不多说，我们开始动手编码吧！

## 总览

### React 是什么？

React 是一个采用声明式，高效而且灵活的用来构建用户界面的框架。

React 当中包含了一些不同的组件，我们从使用 `React.Component` 开始：

```javascript
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

// 通过这种标签语法来使用我们上面声明的组件: <ShoppingList name="Mark" />
```

这样我们就拿到了一个很有趣的看起来像 XML/HTML 的标签。你的组件向 React 描述了你想要渲染的内容。之后 React 会根据你开发应用数据的变化自动渲染和更新组件。

这里的 ShoppingList 是一种 **React 组件类**，或者叫 **React 组件类型** 之类的。一个组件会接受名为 `props` 的参数，并通过名为 `render` 的方法返回一个嵌套结构的视图。

`render` 返回的是你对你想要渲染内容的**描述**。React 会根据你的描述将对应的内容在屏幕上渲染出来。讲得更具体一点，`render` 返回的是一个 **React 元素**，是一种对渲染内容比较简洁的描述。大部分 React 开发者都会使用一种名为 JSX 的语法扩展来跟方便地书写这种描述。比方说里面的 `<div />` 会被编译为 `React.createElement('div')` .上面的那个例子就等同于：

```javascript
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... h1 children ... */),
  React.createElement('ul', /* ... ul children ... */)
);
```

[查看完整代码。](https://babeljs.io/repl/#?babili=false&evaluate=false&lineWrap=false&presets=react&targets=&browsers=&builtIns=false&debug=false&experimental=false&loose=false&spec=false&playground=true&code=%3Cdiv%20className%3D%22shopping-list%22%3E%0A%20%20%3Ch1%3EShopping%20List%20for%20%7Bprops.name%7D%3C%2Fh1%3E%0A%20%20%3Cul%3E%0A%20%20%20%20%3Cli%3EInstagram%3C%2Fli%3E%0A%20%20%20%20%3Cli%3EWhatsApp%3C%2Fli%3E%0A%20%20%20%20%3Cli%3EOculus%3C%2Fli%3E%0A%20%20%3C%2Ful%3E%0A%3C%2Fdiv%3E)

如果你对这个比较感兴趣，可以在 [API 参考](/react/docs/react-api.html#createelement) 查阅对 `createElement()` 方法更详细的介绍。但在我们接下来的教程中，并不会直接使用这个方法，而是继续使用 JSX.

在 JSX 中你可以任意使用 JavaScript 表达式，只需要用一个大括号把表达式括起来。每一个 React 元素事实上都一个 JavaScript 对象，你可以在你的应用中把它当保存在变量中或者作为参数传递。

我们定义的 `ShoppingList` 组件只会渲染一些内置的 DOM 组件（`<div>`等），但是使用自定义的 React 组件也很简单，通过 `<ShoppingList />` 这样的标签你就可以在 React 当中调用整个 `ShoppingList` 组件。每个组件都是独立包装好的，这样也就方便你像搭积木一样组合各种组件来构建复杂的UI界面。

### 开始编码

你可以从这个 [模板代码](https://codepen.io/gaearon/pen/oWWQNa?editors=0010) 开始尝试本教程代码的编写。

模板已经包含了我们要开发的井字棋游戏的基本骨架，而且已经定义好了样式，所以你需要关注的就只有编写 JavaScript 代码。

讲得更具体一点，我们现在有3个组件：

* Square
* Board
* Game

Square 组件代表一个单独的 `<button>`，Board 组件包含了9个squares，也就是棋盘的9个格子。Game 组件则为我们即将要编写的代码预留了一些位置。现在这几个组件都是不具备任何的交互功能的。

### 通过 Props 传递数据

我们先来试着从 Board 组件传递一些数据到 Square 组件。


在 Board 组件的 `renderSquare` 方法中，我们将代码改写成下面这样，传递一个名为 `value` 的 prop 到 Square 当中：

```js{3}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
```

之后再修改 Square 组件的 `render` 方法，把其中的 `{/* TODO */}` 注释替换为 `{this.props.value}`:

```js{5}
class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}
```

修改前：

![React Devtools](/react/img/tutorial/tictac-empty.png)

修改后： 在每个格子当中你都能看到一个渲染出来的数字。


![React Devtools](/react/img/tutorial/tictac-numbers.png)

[查看此步完整代码示例。](https://codepen.io/gaearon/pen/aWWQOG?editors=0010)

### 给组件添加交互功能

接下来我们试着让棋盘的每一个格子在点击之后能落下一颗 "X" 作为棋子。我们试着把 `render()` 方法修改为如下内容：

```javascript{4}
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => alert('click')}>
        {this.props.value}
      </button>
    );
  }
}
```

现在你试着点击一下某个格子，在浏览器里就会弹出一个警示框。

在这里呢，我们使用了 JavaScript 当中一种新的名为 箭头函数 [arrow function](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) 的语法。注意到这里我们传给 `onClick`属性的是一个函数方法，假如我们写的是 `onClick={alert('click')}` 警示框是会立即弹出的。

在 React 组件的构造方法 `constructor` 当中，你可以通过 `this.state` 为该组件设置自身的状态数据。我们来试着把棋盘格子变化的数据储存在组件的 state  当中吧：

首先，我们为组件添加构造函数并初始化 state：

```javascript{2-7}
class Square extends React.Component {
  constructor() {
    super();
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button className="square" onClick={() => alert('click')}>
        {this.props.value}
      </button>
    );
  }
}
```
在使用 [JavaScript classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) 时，你必须调用  `super();` 方法才能在继承父类的子类中正确获取到类型的 `this` 。

现在我们试着通过点击事件触发 state 的改变来更新棋盘格子显示的内容：

* 将 `<button>` 当中的 `this.props.value` 替换为 `this.state.value` .
* 将 `() => alert()` 方法替换为 `() => setState({value: 'X'})` .

现在我们的 `<button>` 标签就变成了下面这样：

```javascript{10-12}
class Square extends React.Component {
  constructor() {
    super();
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button className="square" onClick={() => this.setState({value: 'X'})}>
        {this.state.value}
      </button>
    );
  }
}
```

每当  `this.setState` 方法被触发时，组件都会开始准备更新，React 通过比较状态的变化来更新组件当中跟随数据改变了的内容。当组件重新渲染时，`this.state.value` 会变成 `'X'` ，所以你也就能够在格子里看到 X 的字样。

现在你试着点击任何一个格子，都能够看到 X 出现在格子当中。

[查看此步完整代码示例。](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)

### 开发工具

在 [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) 或 [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) 上安装 React 开发者工具可以让你在浏览器的开发控制台里看到 React 渲染出来的组件树。

<img src="/react/img/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">

你同样可以在开发工具中观察到各个组件的 props 和 state.

安装好开发工具之后，你可以在任意页面元素上面右键选择 “审查元素”，之后在弹出的控制台选项卡最右边会看到名为 React 的选项卡。

**不过，如果你使用的是Codepen在线编辑器的话，还需要几步操作才能正确使用开发工具**

1. 注册一个正式的 Codepen 账号。
2. 点击代码编辑器页面右上角的 "Fork" 按钮，将代码示例拷贝为你自己的 pen.
3. 点击右上角的 "Change View" 按钮并选择 "Debug mode".
4. 在新打开的页面中，你就可以正常地使用 React 开发工具啦。

## 状态提升

我们现在已经编写好了井字棋游戏最基本的可以落子的棋盘。但是现在应用的状态是独立保存在棋盘上每个格子的 Square 组件当中的。想要编写出来一个真正能玩的游戏，我们还需要判断哪个玩家获胜，并在 X 或 O 两方之间交替落子。想要检查某个玩家是否获胜，需要获取所有9个格子上面的棋子分布的数据，现在这些数据分散在各个格子当中显然是很麻烦的。

你可能会想着说，我们也可以在棋盘 Board 组件中收集各个格子 Square 组件当中的数据。虽然技术上来讲是可以实现的，但是代码这么写的话会让人很难理解，并且我们以后想要修改重构时也会非常困难。

所以，最好的解决方式是直接将所有的 state 状态数据存储在 Board 组件当中。之后 Board 组件可以将这些数据传递给各个 Square 组件。

**当你遇到需要同时获取多个子组件数据，或者两个组件之间需要相互通讯的情况时，把子组件的 state 数据提升至其共同的父组件当中保存。之后父组件可以通过 props 将状态数据传递到子组件当中。这样应用当中的状态数据就能够更方便地交流共享了。**

像这种提升组件状态的情形在重构 React 组件时经常会遇到。我们趁现在也就来实践一下，在 Board 组件的构造函数中初始化一个包含9个空值的数组作为状态数据，并将这9个数组中的元素分别传递到对应的9个 Square 组件当中。

```javascript{2-7}
class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  renderSquare(i) {
    return <Square value={i} />;
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

现在传入的都是空数据，井字棋游戏进行会把数组填充成类似下面这样：

```javascript
[
  'O', null, 'X',
  'X', 'X', 'O',
  'O', null, null,
]
```

Board 现在的 `renderSquare` 方法看起来像下面这样：

```javascript
  renderSquare(i) {
    return <Square value={i} />;
  }
```

我们在 value 属性中传递对应 state 数组元素的值。

```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

[查看此步完整代码示例。](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)

现在我们需要修改当某个格子被点击时触发的事件处理函数。现在没个格子当中的数据是存储在整个棋盘当中的，所以我们就需要通过一些方法，让格子组件能够修改整个棋盘组件数据的内容。因为每个组件的 state 都是它私有的，所以我们不可以直接在格子组件当中进行修改。

惯例的做法是，我们再通过 props 传递一个父组件当中的事件处理函数到子组件当中。也就是从 Board 组件里传递一个事件处理函数到 Square 当中，我们来把 `renderSquare` 方法改成下面这样：

```javascript{5}
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }
```

注意到我们在写代码的时候，在各个属性直接换了行，这样可以改善我们代码的可读性。并且我们在 JSX 元素的最外层套上了一小括号，以防止 JavaScript 代码在解析时自动在换行处添加分号。

现在我们从 Board 组件向 Square 组件中传递两个 props 参数：`value` 和 `onClick`. `onClick` 里传递的是一个之后在 Square 组件中能够触发的方法函数。我们动手来修改代码吧：

* 将 Square 组件的 `render` 方法中的 `this.state.value` 替换为 `this.props.value` .
* 将 Square 组件的 `render` 方法中的 `this.setState()` 替换为 `this.props.onClick()` .
* 删掉 Square  组件中的 构造函数 `constructor` ，因为它现在已经不需要保存 state 了。

进行如上修改之后，代码会变成下面这样：

```javascript{1,2,4,5}
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}
```

现在每次格子被点击时就会触发传入的 `onClick` 方法。我们来捋一下这其中发生了什么：

1. 添加 `onClick` 属性到内置的 DOM 元素 `<button>` 上让 React 开启了对点击事件的监听。
2. 当按钮，也就是棋盘格子被点击时, React 会调用 Square 组件的 `render()` 方法中的 `onClick` 事件处理函数。
3. 事件处理函数触发了传入其中的 `this.props.onClick()` 方法。这个方法是由 Board 传递给 Square 的。
4. Board 传递了 `onClick={() => this.handleClick(i)}` 给 Square，所以当 Square 中的事件处理函数触发时，其实就是触发的 Board 当中的 `this.handleClick(i)` 方法。
5. 现在我们还没有编写 `handleClick()` 方法，所以代码还不能正常工作。

注意到这里的 `onClick` 事件是 React 组件当中所特有的。不过 `handleClick` 这些方法则只是我们编写事件处理函数时候的命名习惯。

现在我们来动手编写 `handleClick` 方法吧：

```javascript{9-13}
class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

[查看此步完整代码示例。](https://codepen.io/gaearon/pen/ybbQJX?editors=0010)

我们使用了 `.slice()` 方法来将之前的数组数据**深拷贝**到了一个新的数组中，而不是修改已有的数组。你可以在 [这个章节](/react/tutorial/tutorial.html#为什么不可变性在React当中非常重要) 来了解为什么不可变性在 React 当中的重要性。

现在你点击棋盘上的格子应该就能够正常落子了。而且状态数据是统一保管在棋盘组件 Board 当中的。你应该注意到了，当事件处理函数触发棋盘父组件的状态数据改变时，格子子组件会自动重新渲染。

现在格子组件 Square 不再拥有自身的状态数据了。它从棋盘父组件 Board 接受数据，并且当自己被点击时通知触发父组件改变状态数据，我们称这类的组件为 **受控组件**。

### 为什么不可变性在React当中非常重要

在上一节内容当中，我们通过使用 `.slice()` 方法对已有的数组数据进行了深拷贝，以此来防止对已有数据的改变。接下来我们稍微了解一下为什么这样的操作是一种非常重要的概念。

改变应用数据的方式一般分为两种。第一种是直接修改已有的变量的值。第二种则是将已有的变量替换为一个新的变量。

#### 直接修改数据

```javascript
var player = {score: 1, name: 'Jeff'};
player.score = 2;
// Now player is {score: 2, name: 'Jeff'}
```

#### 替换修改数据

```javascript
var player = {score: 1, name: 'Jeff'};

var newPlayer = Object.assign({}, player, {score: 2});
// Now player is unchanged, but newPlayer is {score: 2, name: 'Jeff'}

// 或者使用最新的对象分隔符语法，你可以这么写：
// var newPlayer = {...player, score: 2};
```
两种方式的结果是一样的，但是第二种并没有改变之前已有的数据。通过这样的方式，我们可以得到以下几点好处：

#### 很轻松地实现 撤销/重做以及时间旅行

运用不可变性原则可以让我们很容易实现一些复杂的功能。例如我们在这个教程中会实现的，通过点击列表中的某一项直接返回当某一步棋时的状态。不改变已有的数据内容可以让我们在需要的时候随时切换回历史数据。

#### 记录变化

在我们直接修改一个对象的内容之后，是很难判断它哪里发生了改变的。我们想要判断一个对象的改变，必须拿当前的对象和改变之前的对象相互比较，遍历整个对象树，比较每一个值，这样的操作复杂度是非常高的。

而运用不可变性原则之后则要轻松得多。因为我们每次都是返回一个新的对象，所以只要判断这个对象被替换了，那么其中数据肯定是改变了的。

#### 在 React 当中判定何时重新渲染

运用不可变性原则给 React 带来最大的好处是，既然我们现在可以很方便地判断对象数据是否发生改变了，那么也就很好决定何时根据数据的改变重新渲染组件。尤其是当我们编写的都属于 **纯组件 pure components **的时候，这种好处的效果更为明显。

了解更多有关 `shouldComponentUpdate()` 以及如何编写 *pure components* 的内容，你可以查阅 [性能优化](/react/docs/optimizing-performance.html#examples) 这一篇。

### 函数定义组件

We've removed the constructor, and in fact, React supports a simpler syntax called **functional components** for component types like Square that only consist of a `render` method. Rather than define a class extending `React.Component`, simply write a function that takes props and returns what should be rendered.

Replace the whole Square class with this function:

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

You'll need to change `this.props` to `props` both times it appears. Many components in your apps will be able to be written as functional components: these components tend to be easier to write and React will optimize them more in the future.

While we're cleaning up the code, we also changed `onClick={() => props.onClick()}` to just `onClick={props.onClick}`, as passing the function down is enough for our example. Note that `onClick={props.onClick()}` would not work because it would call `props.onClick` immediately instead of passing it down.

[查看此步完整代码示例。](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)

### Taking Turns

An obvious defect in our game is that only X can play. Let's fix that.

Let's default the first move to be by 'X'. Modify our starting state in our Board constructor.

```javascript{6}
class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
```

Each time we move we shall toggle `xIsNext` by flipping the boolean value and saving the state. Now update Board's `handleClick` function to flip the value of `xIsNext`.

```javascript{3,6}
  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

Now X and O take turns. Next, change the "status" text in Board's `render` so that it also displays who is next.

```javascript{2}
  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // the rest has not changed
```

After these changes you should have this Board component:

```javascript{6,11-16,29}
class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

[查看此步完整代码示例。](https://codepen.io/gaearon/pen/KmmrBy?editors=0010)

### Declaring a Winner

Let's show when a game is won. Add this helper function to the end of the file:

```javascript
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

You can call it in Board's `render` function to check if anyone has won the game and make the status text show "Winner: [X/O]" when someone wins.

Replace the `status` declaration in Board's `render` with this code:

```javascript{2-8}
  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      // the rest has not changed
```

You can now change `handleClick` in Board to return early and ignore the click if someone has already won the game or if a square is already filled:

```javascript{3-5}
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

Congratulations! You now have a working tic-tac-toe game. And now you know the basics of React. So *you're* probably the real winner here.

[查看此步完整代码示例。](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)

## Storing a History

Let's make it possible to revisit old states of the board so we can see what it looked like after any of the previous moves. We're already creating a new `squares` array each time a move is made, which means we can easily store the past board states simultaneously.

Let's plan to store an object like this in state:

```javascript
history = [
  {
    squares: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  },
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ]
  },
  // ...
]
```

We'll want the top-level Game component to be responsible for displaying the list of moves. So just as we pulled the state up before from Square into Board, let's now pull it up again from Board into Game – so that we have all the information we need at the top level.

First, set up the initial state for Game by adding a constructor to it:

```javascript{2-10}
class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}
```

Then change Board so that it takes `squares` via props and has its own `onClick` prop specified by Game, like the transformation we made for Square earlier. You can pass the location of each square into the click handler so that we still know which square was clicked. Here is a list of steps you need to do:

* Delete the `constructor` in Board.
* Replace `this.state.squares[i]` with `this.props.squares[i]` in Board's `renderSquare`.
* Replace `this.handleClick(i)` with `this.props.onClick(i)` in Board's `renderSquare`.

Now the whole Board component looks like this:

```javascript{17,18}
class Board extends React.Component {
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

Game's `render` should look at the most recent history entry and can take over calculating the game status:

```javascript{2-11,16-19,22}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
```

Since Game is now rendering the status, we can delete `<div className="status">{status}</div>` and the code calculating the status from the Board's `render` function:

```js{1-4}
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
```

Next, we need to move the `handleClick` method implementation from Board to Game. You can cut it from the Board class, and paste it into the Game class.

We also need to change it a little, since Game state is structured differently. Game's `handleClick` can push a new entry onto the stack by concatenating the new history entry to make a new history array.

```javascript{2-4,10-12}
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }
```

At this point, Board only needs `renderSquare` and `render`; the state initialization and click handler should both live in Game.

[查看此步完整代码示例。](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)

### Showing the Moves

Let's show the previous moves made in the game so far. We learned earlier that React elements are first-class JS objects and we can store them or pass them around. To render multiple items in React, we pass an array of React elements. The most common way to build that array is to map over your array of data. Let's do that in the `render` method of Game:

```javascript{6-15,34}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Move #' + move :
        'Game start';
      return (
        <li>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
```

[查看此步完整代码示例。](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)

For each step in the history, we create a list item `<li>` with a link `<a>` inside it that goes nowhere (`href="#"`) but has a click handler which we'll implement shortly. With this code, you should see a list of the moves that have been made in the game, along with a warning that says:

>  Warning:
>  Each child in an array or iterator should have a unique "key" prop. Check the render method of "Game".

Let's talk about what that warning means.

### Keys

When you render a list of items, React always stores some info about each item in the list. If you render a component that has state, that state needs to be stored – and regardless of how you implement your components, React stores a reference to the backing native views.

When you update that list, React needs to determine what has changed. You could've added, removed, rearranged, or updated items in the list.

Imagine transitioning from

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

to

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

To a human eye, it looks likely that Alexa and Ben swapped places and Claudia was added – but React is just a computer program and doesn't know what you intended it to do. As a result, React asks you to specify a *key* property on each element in a list, a string to differentiate each component from its siblings. In this case, `alexa`, `ben`, `claudia` might be sensible keys; if the items correspond to objects in a database, the database ID is usually a good choice:

```html
<li key={user.id}>{user.name}: {user.taskCount} tasks left</li>
```

`key` is a special property that's reserved by React (along with `ref`, a more advanced feature). When an element is created, React pulls off the `key` property and stores the key directly on the returned element. Even though it may look like it is part of props, it cannot be referenced with `this.props.key`. React uses the key automatically while deciding which children to update; there is no way for a component to inquire about its own key.

When a list is rerendered, React takes each element in the new version and looks for one with a matching key in the previous list. When a key is added to the set, a component is created; when a key is removed, a component is destroyed. Keys tell React about the identity of each component, so that it can maintain the state across rerenders. If you change the key of a component, it will be completely destroyed and recreated with a new state.

**It's strongly recommended that you assign proper keys whenever you build dynamic lists.** If you don't have an appropriate key handy, you may want to consider restructuring your data so that you do.

If you don't specify any key, React will warn you and fall back to using the array index as a key – which is not the correct choice if you ever reorder elements in the list or add/remove items anywhere but the bottom of the list. Explicitly passing `key={i}` silences the warning but has the same problem so isn't recommended in most cases.

Component keys don't need to be globally unique, only unique relative to the immediate siblings.


### Implementing Time Travel

For our move list, we already have a unique ID for each step: the number of the move when it happened. In the Game's `render` method, add the key as `<li key={move}>` and the key warning should disappear:

```js{6}
    const moves = history.map((step, move) => {
      const desc = move ?
        'Move #' + move :
        'Game start';
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });
```

[查看此步完整代码示例。](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)

Clicking any of the move links throws an error because `jumpTo` is undefined. Let's add a new key to Game's state to indicate which step we're currently viewing.

First, add `stepNumber: 0` to the initial state in Game's `constructor`:

```js{8}
class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
```

Next, we'll define the `jumpTo` method in Game to update that state. We also want to update `xIsNext`. We set `xIsNext` to true if the index of the move number is an even number.

Add a method called `jumpTo` to the Game class:

```javascript{5-10}
  handleClick(i) {
    // this method has not changed
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

  render() {
    // this method has not changed
  }
```

Then update `stepNumber` when a new move is made by adding `stepNumber: history.length` to the state update in Game's `handleClick`:

```javascript{2,13}
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
```

Now you can modify Game's `render` to read from that step in the history:

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // the rest has not changed
```

[查看此步完整代码示例。](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)

If you click any move link now, the board should immediately update to show what the game looked like at that time.

You may also want to update `handleClick` to be aware of `stepNumber` when reading the current board state so that you can go back in time then click in the board to create a new entry. (Hint: It's easiest to `.slice()` off the extra elements from `history` at the very top of `handleClick`.)

### Wrapping Up

Now, you've made a tic-tac-toe game that:

* lets you play tic-tac-toe,
* indicates when one player has won the game,
* stores the history of moves during the game,
* allows players to jump back in time to see older versions of the game board.

Nice work! We hope you now feel like you have a decent grasp on how React works.

Check out the final result here: [Final Result](https://codepen.io/gaearon/pen/gWWZgR?editors=0010).

If you have extra time or want to practice your new skills, here are some ideas for improvements you could make, listed in order of increasing difficulty:

1. Display the move locations in the format "(1, 3)" instead of "6".
2. Bold the currently-selected item in the move list.
3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
4. Add a toggle button that lets you sort the moves in either ascending or descending order.
5. When someone wins, highlight the three squares that caused the win.

Throughout this tutorial, we have touched on a number of React concepts including elements, components, props, and state. For a more in-depth explanation for each of these topics, check out [the rest of the documentation](/react/docs/hello-world.html). To learn more about defining components, check out the [`React.Component` API reference](/react/docs/react-component.html).

