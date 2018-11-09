---
id: state-and-lifecycle
title: State & 生命周期
permalink: docs/state-and-lifecycle.html
redirect_from: "docs/interactivity-and-dynamic-uis.html"
prev: components-and-props.html
next: handling-events.html
---

生命周期图解
![React 生命周期图解](https://upload-images.jianshu.io/upload_images/4118241-d979d05af0b7d4db.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/488/format/webp)

参考[该例子](/docs/rendering-elements.html#更新元素渲染)。

到目前为止我们只学习了一种方法来更新UI。

我们调用 `ReactDOM.render()` 方法来改变输出：

```js{8-11}
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/gwoJZk?editors=0010)

在本节中，我们将学习如何使`Clock`组件真正可重用和封装。它将设置自己的计时器，并每秒钟更新一次。

我们可以从封装时钟开始：

```js{3-6,12}
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/dpdoYR?editors=0010)

然而，它错过了一个关键的要求：`Clock`设置一个定时器并且每秒更新UI应该是`Clock`的实现细节。

理想情况下，我们写一次 `Clock` 然后它能更新自身：

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

为了实现这个需求，我们需要为`Clock`组件添加`状态`

状态与属性十分相似，但是状态是私有的，完全受控于当前组件。

我们之前[提到过](/docs/components-and-props.html#函数定义/类定义组件)，定义为类的组件有一些特性。局部状态就是如此：一个功能只适用于类。

## 将函数转换为类

你可以通过5个步骤将函数组件 `Clock` 转换为类

1. 创建一个名称扩展为 `React.Component` 的[ES6 类](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes)

2. 创建一个叫做`render()`的空方法

3. 将函数体移动到 `render()` 方法中

4. 在 `render()` 方法中，使用 `this.props` 替换 `props`

5. 删除剩余的空函数声明

```js
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/zKRGpo?editors=0010)

`Clock` 现在被定义为一个类而不只是一个函数

使用类就允许我们使用其它特性，例如局部状态、生命周期钩子

## 为一个类添加局部状态

我们会通过3个步骤将 `date` 从属性移动到状态中：

1) 在 `render()` 方法中使用 `this.state.date` 替代 `this.props.date`

```js{6}
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

2) 添加一个[类构造函数](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes#Constructor)来初始化状态 `this.state`

```js{4}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

注意我们如何传递 `props` 到基础构造函数的：

```js{2}
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
```

类组件应始终使用`props`调用基础构造函数。

3) 从 `<Clock />` 元素移除 `date` 属性：

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

稍后将定时器代码添加回组件本身。

结果如下：

```js{2-5,11,18}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/KgQpJd?editors=0010)

接下来，我们将使`Clock`设置自己的计时器并每秒更新一次。

## 将生命周期方法添加到类中

在具有许多组件的应用程序中，在销毁时释放组件所占用的资源非常重要。

每当`Clock`组件第一次加载到DOM中的时候，我们都想[生成定时器](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval)，这在React中被称为`挂载`

同样，每当`Clock`生成的这个DOM被移除的时候，我们也会想要[清除定时器](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval)，这在React中被称为`卸载`。


我们可以在组件类上声明特殊的方法，当组件挂载或卸载时，来运行一些代码：

```js{7-9,11-13}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

这些方法被称作`生命周期钩子`。

当组件输出到 DOM 后会执行 `componentDidMount()` 钩子，这是一个建立定时器的好地方：

```js{2-5}
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

注意我们如何在 `this` 中保存定时器ID。

虽然 `this.props` 由React本身设置以及`this.state` 具有特殊的含义，但如果需要存储不用于视觉输出的东西，则可以手动向类中添加其他字段。

如果你不在 `render()` 中使用某些东西，它就不应该在状态中。

我们将在 `componentWillUnmount()`生命周期钩子中卸载计时器：

```js{2}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

最后，我们实现了每秒钟执行的 `tick()` 方法。

它将使用 `this.setState()` 来更新组件局部状态：

```js{18-22}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/amqdNA?editors=0010)

现在时钟每秒钟都会执行。

让我们快速回顾一下发生了什么以及调用方法的顺序：

1) 当 `<Clock />` 被传递给 `ReactDOM.render()` 时，React 调用 `Clock` 组件的构造函数。 由于 `Clock` 需要显示当前时间，所以使用包含当前时间的对象来初始化 `this.state` 。 我们稍后会更新此状态。

2) React 然后调用 `Clock` 组件的 `render()` 方法。这是 React 了解屏幕上应该显示什么内容，然后 React 更新 DOM 以匹配 `Clock` 的渲染输出。

3) 当 `Clock` 的输出插入到 DOM 中时，React 调用 `componentDidMount()` 生命周期钩子。 在其中，`Clock` 组件要求浏览器设置一个定时器，每秒钟调用一次 `tick()`。

4) 浏览器每秒钟调用 `tick()` 方法。 在其中，`Clock` 组件通过使用包含当前时间的对象调用 `setState()` 来调度UI更新。 通过调用 `setState()` ，React 知道状态已经改变，并再次调用 `render()` 方法来确定屏幕上应当显示什么。 这一次，`render()` 方法中的 `this.state.date` 将不同，所以渲染输出将包含更新的时间，并相应地更新DOM。

5) 一旦`Clock`组件被从DOM中移除，React会调用`componentWillUnmount()`这个钩子函数，定时器也就会被清除。

## 正确地使用状态

关于 `setState()` 这里有三件事情需要知道

### 不要直接更新状态

例如，此代码不会重新渲染组件：

```js
// Wrong
this.state.comment = 'Hello';
```

应当使用 `setState()`:

```js
// Correct
this.setState({comment: 'Hello'});
```

构造函数是唯一能够初始化 `this.state` 的地方。

### 状态更新可能是异步的

React 可以将多个`setState()` 调用合并成一个调用来提高性能。

因为 `this.props` 和 `this.state` 可能是异步更新的，你不应该依靠它们的值来计算下一个状态。

例如，此代码可能无法更新计数器：

```js
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

要修复它，请使用第二种形式的 `setState()` 来接受一个函数而不是一个对象。 该函数将接收先前的状态作为第一个参数，将此次更新被应用时的props做为第二个参数：

```js
// Correct
this.setState((prevState, props) => ({
  counter: prevState.counter + props.increment
}));
```

上方代码使用了[箭头函数](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions)，但它也适用于常规函数：

```js
// Correct
this.setState(function(prevState, props) {
  return {
    counter: prevState.counter + props.increment
  };
});
```

### 状态更新合并

当你调用 `setState()` 时，React 将你提供的对象合并到当前状态。

例如，你的状态可能包含一些独立的变量：

```js{4,5}
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```

你可以调用 `setState()` 独立地更新它们：

```js{4,10}
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

这里的合并是浅合并，也就是说`this.setState({comments})`完整保留了`this.state.posts`，但完全替换了`this.state.comments`。

## 数据自顶向下流动

父组件或子组件都不能知道某个组件是有状态还是无状态，并且它们不应该关心某组件是被定义为一个函数还是一个类。

这就是为什么状态通常被称为局部或封装。 除了拥有并设置它的组件外，其它组件不可访问。

组件可以选择将其状态作为属性传递给其子组件：

```js
<h2>It is {this.state.date.toLocaleTimeString()}.</h2>
```

这也适用于用户定义的组件：

```js
<FormattedDate date={this.state.date} />
```

`FormattedDate` 组件将在其属性中接收到 `date` 值，并且不知道它是来自 `Clock` 状态、还是来自 `Clock` 的属性、亦或手工输入：

```js
function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}
```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/zKRqNB?editors=0010)

这通常被称为`自顶向下`或`单向`数据流。 任何状态始终由某些特定组件所有，并且从该状态导出的任何数据或 UI 只能影响树中`下方`的组件。

如果你想象一个组件树作为属性的瀑布，每个组件的状态就像一个额外的水源，它连接在一个任意点，但也流下来。

为了表明所有组件都是真正隔离的，我们可以创建一个 `App` 组件，它渲染三个`Clock`：

```js{4-6}
function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/vXdGmd?editors=0010)

每个 `Clock` 建立自己的定时器并且独立更新。

在 React 应用程序中，组件是有状态还是无状态被认为是可能随时间而变化的组件的实现细节。 可以在有状态组件中使用无状态组件，反之亦然。
