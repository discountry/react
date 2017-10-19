---
id: tutorial
title: "入门教程"
layout: tutorial
sectionid: tutorial
permalink: tutorial/tutorial.html
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
2. 跟着 [安装指南](/docs/installation.html#creating-a-new-application) 创建一个新的 React 项目。
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

如果你遇到了任何困难，可以在 [community support resources](https://facebook.github.io/community/support.html) 寻求帮助。 加入我们的 [Reactiflux chat](/community/support.html#reactiflux-chat) 也是一个很不错的选择。如果通过上述方式还是解决不了你的问题，你也可以给我们提一个 issue.

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

如果你对这个比较感兴趣，可以在 [API 参考](/docs/react-api.html#createelement) 查阅对 `createElement()` 方法更详细的介绍。但在我们接下来的教程中，并不会直接使用这个方法，而是继续使用 JSX.

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

![React Devtools](/images/tutorial/tictac-empty.png)

修改后： 在每个格子当中你都能看到一个渲染出来的数字。


![React Devtools](/images/tutorial/tictac-numbers.png)

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

<img src="/images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">

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

像这种提升组件状态的情形在重构 React 组件时经常会遇到。我们趁现在也就来实践一下，在 Board 组件的构造函数中初始化一个包含9个空值的数组作为状态数据，并将这个数组中的9个元素分别传递到对应的9个 Square 组件当中。

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

现在我们需要修改当某个格子被点击时触发的事件处理函数。现在每个格子当中的数据是存储在整个棋盘当中的，所以我们就需要通过一些方法，让格子组件能够修改整个棋盘组件数据的内容。因为每个组件的 state 都是它私有的，所以我们不可以直接在格子组件当中进行修改。

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

我们使用了 `.slice()` 方法来将之前的数组数据**深拷贝**到了一个新的数组中，而不是修改已有的数组。你可以在 [这个章节](/tutorial/tutorial.html#为什么不可变性在React当中非常重要) 来了解为什么不可变性在 React 当中的重要性。

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

了解更多有关 `shouldComponentUpdate()` 以及如何编写 *pure components* 的内容，你可以查阅 [性能优化](/docs/optimizing-performance.html#examples) 这一篇。

### 函数定义组件

我们刚才已经去掉了 Square 的构造函数，事实上，更进一步的，React 专门为像 Square 组件这种只有 `render` 方法的组件提供了一种更简便的定义组件的方法： **函数定义组件** 。只需要简单写一个以 `props` 为参数的 `function` 返回 JSX 元素就搞定了。

下面我们以函数定义的方式重写 Square 组件：

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

记得把所有的 `this.props` 替换成参数 `props`. 我们应用中的大部分简单组件都可以通过函数定义的方式来编写，并且 React 在将来还会对函数定义组件做出更多优化。

另外一部分简化的内容则是事件处理函数的写法，这里我们把 `onClick={() => props.onClick()}` 直接修改为 `onClick={props.onClick}` , 注意不能写成 `onClick={props.onClick()}` 否则 `props.onClick` 方法会在 Square 组件渲染时被直接触发而不是等到 Board 组件渲染完成时通过点击触发，又因为此时 Board 组件正在渲染中（即 Board 组件的 `render()` 方法正在调用），又触发 `handleClick(i)` 方法调用 `setState()` 会再次调用 `render()` 方法导致死循环。

[查看此步完整代码示例。](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)

### 轮流落子

很明显现在我们点击棋盘只后落子的只有 X . 下面我们要开发出 X 和 O 轮流落子的功能。

我们将 X 默认设置为先手棋：

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
接下来，我们每走一步棋，都需要切换 `xIsNext` 的值以此来实现轮流落子的功能，接下来在 `handleClick` 方法中添加修改 `xIsNext` 的语句。

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

到这里我们就实现了 X 和 O 轮流落子的效果了。我们再到 `render` 方法里添加一点内容来显示当前执子的一方：

```javascript{2}
  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // the rest has not changed
```

现在你整个的 Board 组件的代码应该是下面这样的：

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

### 判断赢家

接下来我们来编写判断游戏获胜方的代码，首先在你的代码里添加下面这个判断获胜方的算法函数：

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

然后你就可以在 Board 组件的 `render` 方法里调用它，来检查是否有人获胜并根据判断显示出  "Winner: [X/O]" 来表示获胜方。

将 `render` 中的 `status` 替换为如下内容：

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

继续完善游戏规则，我们在 `handleClick` 里添加当前方格内已经落子/有一方获胜就就无法继续落子的判断逻辑：

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

可喜可贺！现在你已经编写好了一个游戏规则逻辑完整的井字棋游戏了。并且你也已经掌握了一些基本的 React 知识。所以坚持到这一步的你才是真正的赢家呀！

[查看此步完整代码示例。](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)

## 保存历史记录

接下来我们一起来实现保存棋局每一步的历史记录的功能。在现有的代码逻辑中，我们已经是在每走一步棋之后就返回一个新的 `squares` 数组了，所以想要保存历史记录也非常简单。

我们计划通过一个数组对象来保存每一步的状态数据：

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

我们期望在顶层的 Game 组件中展示一个链接每一步历史记录的列表。所以就像我们之前将 state 从 Square 组件提升到 Board 中一样，现在我们把 Board 中的状态数据再提升到 Game 组件中来。

首先在 Game 组件的构造函数中初始化我们需要的状态数据：

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

接下来，就好像我们之前对 Square 组件的操作一样。我们将 Board 中的状态数据全都移动到 Game 组件当中。Board 现在通过 `props` 获取从 Game 传递下来的数据和事件处理函数。

* 删除 Board 的构造方法 `constructor` .
* 把 Board 的 `renderSquare` 方法中的 `this.state.squares[i]` 替换为 `this.props.squares[i]` .
* 把 Board 的 `renderSquare` 方法中的 `this.handleClick(i)` 替换为 `this.props.onClick(i)` .

现在我们的 Board 组件变成了下面这样：

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

Game 组件的 `render` 方法现在则要负责获取最近一步的历史记录（当前棋局状态），以及计算出游戏进行的状态（是否有人获胜）。

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

既然现在由 Game 组件负责渲染游戏状态，我们可以直接把 Board 组件的 `render` 方法里的 `<div className="status">{status}</div>` 删掉：

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

之后，我们需要将 Board 组件里的 `handleClick` 移动到 Game 组件当中。你可以直接把它剪切粘贴过来。

不过为了实现我们新的历史记录的功能，还需要稍微修改一下我们的代码，让 `handleClick` 在每次触发时，添加当前的棋局状态数据到 `histroy` 当中。

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

代码编写到这一步，Board 组件当中现在应该只有 `renderSquare` 和 `render` 两个方法；应用状态 state 以及事件处理函数现在都定义在 Game 组件当中。

[查看此步完整代码示例。](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)

### 展示每步历史记录链接

现在我们来试着展示每一步棋的历史记录链接。在教程的开始我们提到过，React 元素事实上都是 JS 当中的对象，我们可以把元素当作参数或定义到变量中使用。在 React 当中渲染多个重复的项目时，我们一般都以数组的方式传递 React 元素。最基本的方法是使用数组的 map 方法，我们试着来修改 Game 组件的 `render` 方法吧：

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

对于每一步的历史记录，我们都创建了一个带 `<a>` 链接的 `<li>` 列表项。目前链接还没指向任何地方，别着急我们后面会继续实现切换至对应棋步的功能。有了我们现有的代码，已经能渲染出一个列表了，不过你留心的话，就会在控制台看到警告：

>  Warning:
>  Each child in an array or iterator should have a unique "key" prop. Check the render method of "Game".

我们先来了解一下这条警告是什么情况。

### Keys

当你在 React 当中渲染列表项时，React 都会试着存储对应每个单独项的相关信息。如果你的组件包含 state 状态数据，那么这些状态数据必须被排序，不管你组件是怎么编写实现的。

当你想要更新这些列表项时，React 必须能够知道是那一项改变了。这样你才能够在列表中增删改查项目。

比方说下面这个例子，从前一个表单

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

变成下面这个表单

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

你用肉眼可以很轻易地分辨，Alexa 被移到了最后，多出来一个 Claudia。可是 React 只是电脑里运行地程序，它无从知晓这些改变。所以我们必须为列表中的每一项添加一个 *key* 作为唯一的标识符。标识符必须是唯一的，比方说刚才这个例子中的 `alexa`, `ben`, `claudia` 就可以用来做标识符。更普遍的一种情况，假如我们的数据是从数据库获取的话，表单每一项的 ID 就很适合当作它的 *key* ：

```html
<li key={user.id}>{user.name}: {user.taskCount} tasks left</li>
```

 `key` 是 React 当中使用的一种特殊的属性（除此之外还有 `ref` 属性）。当元素被创建时，React 会将元素的 `key` 值和对应元素绑定存储起来。尽管 `key` 看起来像是 props 的一部分，可是事实上我们无法通过 `this.props.key` 获取到 `key` 的值。React 会自动的在判断元素更新时使用 `key` ，而组件自己是无法获取到 `key` 的。 

当一个列表被重新渲染时，React 会根据较新的元素内容依据相应的 key 值来匹配之前的元素内容。当一个新的 key 值添加到列表当中时，表示有一个组件被创建；被删除时表示有一个组件被销毁。Key 值可以让 React 明确标识每个组件，这样它才能在每次重新渲染时保有对应的状态数据。假如你去改变某个组件的 key 值的话，它会在下次渲染时被销毁并当作新的组件重新渲染进来。

**强烈建议你在渲染列表项时添加 keys 值。** 假如你没有现成可以作为唯一 key 值的数据使用的话，你可能需要考虑重新组织设计你的数据了。

假如你不提供任何 key 值，React 会提示警告，并且默认使用数组的索引作为默认的 key ，但只要你想在列表中对项目进行重新排列、添加或删除的话，这都不是一个好选择（因为对应的键值都会改变，也就会出现我们上面提到的组件key值被改变就会被当作新创建的组件处理那种情况）。手动添加列表索引值 `key={i}` 可以消除警告，但也会存在相同的问题，因此在大多数情况下都不推荐这种做法。

组件的 keys 值并不需要在全局都保证唯一，只需要在当前的节点里保证唯一即可。

### 实现时间旅行

在我们的棋步的列表中，已经有了现成的唯一 key 值，也就是每一次 move 的记录值。我们通过  `<li key={move}>` 来添加一下。

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

在上面的代码中，我们同样为每一个 `<a>` 添加了一个 `jumpTo` 方法，用来将棋盘的状态切换至对应的棋步时的状态。接下来我们来着手实现这个方法： 

首先在 Game 组件的初始状态中多设置一项 `stepNumber: 0` ：

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

接下来，我们正是编写 `jumpTo` 来切换 `stepNumber` 的值。根据游戏的逻辑，与此同时我们还需要修改 `xIsNext` 来保证对应棋步时，执子的一方是能对应上的。我们可以根据棋步计算出是谁在执子。

我们把 `jumpTo` 编写在 Game 组件中： 

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

接下来，我们在 `handleClick` 方法中对 `stepNumber` 进行更新，添加 `stepNumber: history.length` 保证每走一步 `stepNumber` 会跟着改变：

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

现在你可以直接在 Game 组件的 `render` 方法里根据当前的棋步获取对应的棋局状态了：

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // the rest has not changed
```

[查看此步完整代码示例。](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)

现在你试着点击每一步棋记录的列表中的一项，棋盘会自动更新到对应项时的棋局状态。

为了实现“悔棋”的功能，也就是说在切换至某一步之后我们能够继续下，我们需要在 `handleClick` 事件触发时去除掉切回棋步后面的所有记录，最简单的办法就是在 `handleClick` 事件的开头使用 `.slice()` 方法去除。

```javascript{2}
  render() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // the rest has not changed
```

### 总结

现在你已经有了一个功能相当丰富的井字棋游戏：

* 实现了井字棋游戏的基本规则并可以进行游戏，
* 能够判断一方获胜，
* 能够存储每一步时的棋局状态，
* 允许玩家切换至之前的某一步“悔棋”。

干得不错！我们希望你至此已经基本掌握了 React 的使用。

在这里你可以查看游戏代码 [最终的成果](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)。

如果你之后还会有充裕的时间并且想练习你刚掌握的新技能的话，这里有一些可以完善的游戏功能实现供你参考，列表是由易到难排序的：

1. 以 "(1, 3)" 坐标的方式记录每一步，而不是格子序号 "6"。
2. 在棋步记录列表里加粗显示当前选中的项目。
3. 在 Board 组件中用两个循环渲染出 9 个 Square 格子组件。
4. 添加一个切换按钮来升序或降序显示棋步记录列表。
5. 当一方获胜时，高亮显示连成一线的3颗棋子。

> 译者注：如果你在实现上述功能时遇到了问题，也可以参考[React井字棋游戏完整功能示例](https://codepen.io/discountry/pen/ENrZzV)。

通过这一篇教程，我们大概了解了 React 当中包含 元素、组件、props、state 在内的一些概念。想要更深入地了解每一个关键概念，你可以继续阅读 [文档](/docs/hello-world.html)。想要更详细地了解 React 组件，可以查阅 [`React.Component` API 参考](/docs/react-component.html)。