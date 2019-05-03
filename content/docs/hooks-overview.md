---
id: hooks-overview
title: Hooks at a Glance
permalink: docs/hooks-overview.html
next: hooks-state.html
prev: hooks-intro.html
---

*Hooks*是React v16.7.0-alpha中加入的新特性。它可以让你在class以外使用state和其他React特性。你可以在[这里](https://github.com/reactjs/rfcs/pull/68)看到关于它的一些讨论。

Hooks[向后兼容](/docs/hooks-intro.html#no-breaking-changes)。这个页面为有经验的React用户提供了Hooks的概览。

这是一个快节奏的概览。当你感到困惑时，请搜寻下面这样的黄色盒子：

>详细解释
>
>阅读[动机](/docs/hooks-intro.html#motivation)以了解我们为什么要在React中引入Hooks。

**↑↑↑ 每一部分的结尾都会有一个这样的黄色盒子** 它们链接到详细的解释。

## 📌 状态钩子（State Hook）

这个例子渲染了一个计数器。当你点击按钮时，页面中的值会随之增加：

```js{1,4,5}
import { useState } from 'react';

function Example() {
  // 声明一个名为“count”的新状态变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>你点击了{count}次</p>
      <button onClick={() => setCount(count + 1)}>
        点我
      </button>
    </div>
  );
}
```

在这里, `useState`是一个*钩子（Hook）* （稍后我们将会谈及它的含义）。我们在一个函数式组件中调用它，为这个组件增加一些内部的状态。React将会在下一次渲染前保存此状态。 `useState`返回一对值：*当前*的状态（state value）和一个可以更新状态的函数。你可以在事件处理程序（event handler）中或其他地方调用这个函数。 它与类组件中的`this.setState`类似，但不能将新旧状态进行合并。（我们在[使用状态钩子](/docs/hooks-state.html)中展示了一个将`useState`和`this.state`进行对比的例子。）

`useState`唯一的参数就是初始状态（initial state）。在上面的例子中,因为我们的计数器从零开始所以它是`0`。这里的状态与`this.state`不同，它不必是一个对象-- 如果你想这么做，当然也可以。初始状态参数只在第一次渲染中被使用。

#### 声明多个状态变量

你可以在一个组件中多次使用状态钩子:

```js
function ExampleWithManyStates() {
  // 声明多个状态变量！
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
  // ...
}
```

通过调用`useState`我们声明了一些状态变量，我们可以使用[数组解构](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring)语法赋予这些状态变量不同的名字。这些名字不是`useState` API的一部分。 相反，当你多次调用`useState`时，React假定你在每一次渲染中以相同的顺序调用它们。我们会在之后再来解释为什么这样可以运行以及在什么时候起作用。

#### 但是什么是钩子（Hook）？

钩子是可以让你与React状态以及函数式组件的生命周期特性“挂钩”的函数。钩子是为了让你抛弃类使用React的，所以它不能在类中运行。（我们[不推荐](/docs/hooks-intro.html#gradual-adoption-strategy)你立即重写已经存在的组件，但是如果你喜欢的话可以在新的组件中开始使用钩子。）

React提供了少量内置的钩子，如`useState`。你也可以创建自己的钩子在不同的组件之间复用有状态的行为。我们先来看一下内置的钩子。

>详细解释
>
>你可以在这个页面上了解到更多关于状态钩子的信息: [使用状态钩子](/docs/hooks-state.html)。

## ⚡️ 副作用钩子（Effect Hook）

你可能之前已经在React中执行过获取数据，订阅或者手动改变DOM。我们称这些操作为“副作用（side effects）”（或者简称为“作用（effects）”），因为它们可以影响其他的组件并且不能在渲染中完成。

副作用钩子, `useEffect`, 为函数式组件带来执行副作用的能力。它与类组件中的`componentDidMount` ，`componentDidUpdate`和 `componentWillUnmount`具有相同的用途，但是被统一为一个API。（我们在[使用副作用钩子](/docs/hooks-effect.html)中展示了一个将`useEffect`和这些方法进行对比的例子。）

举个例子，这个组件在React更新DOM之后设置文档的标题：

```js{1,6-10}
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // 类似于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    // 使用浏览器API更新文档标题
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

当你调用`useEffect`,就是告诉React在刷新DOM之后运行你的副作用函数。副作用函数在组件中声明，所以可以使用组件的状态（state）和属性（props）。React默认在每一次渲染后运行副作用函数——*包括*第一次渲染。(与类组件的生命周期函数的对比请看[使用副作用钩子](/docs/hooks-effect.html)。)

副作用函数可以通过返回一个函数来指定如何“回收”它们。举个例子，这个组件使用了一个副作用函数来订阅一个朋友的在线状态，通过取消订阅来回收：

```js{10-16}
import { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

在这个例子中，当组件被卸载时，React会在由随后的渲染引起的副作用函数运行之前取消对`ChatAPI`的订阅。（如果有需要的话，可以用这个方法[告诉React跳过重订阅](/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects)当传给`ChatAPI`的`props.friend.id`没有改变时。）

像使用`useState`一样,你可以在一个组件中使用多个副作用：

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
  // ...
```

有了钩子，你可以在组件中按照代码块的相关性组织副作用，而不是基于生命周期方法强制进行切分。

>详细解释
>
>你可以在这个页面上了解到更多关于`useEffect`的信息: [使用副作用钩子](/docs/hooks-effect.html)。

## ✌️ 钩子的使用规则

钩子就是强制实现了两条额外规则的Javascript函数：

* 只能在*顶层*调用钩子。不要在循环，控制流和嵌套的函数中调用钩子。
* 只能*从React的函数式组件中*调用钩子。不要在常规的JavaScript函数中调用钩子。（此外，你也可以在你的自定义钩子中调用钩子。我们马上就会讲到它。）

我们提供了一个[语法检查插件](https://www.npmjs.com/package/eslint-plugin-react-hooks)以自动执行这些规则。我们能够理解开发者在一开始可能会对这些规则感到困惑或束手束脚，但它们正是保证钩子正确运行的基石。

>详细解释
>
>你可以在这个页面上了解到更多关于这些规则的信息: [钩子的使用规则](/docs/hooks-rules.html)。

## 💡 构建你自己的钩子

有时你希望在组件之间复用一些状态逻辑。在之前有两种流行的解决方案：[高阶组件](/docs/higher-order-components.html) and [渲染属性](/docs/render-props.html)。现在你可以利用自定义钩子做到这些而不用在你的组件树中添加更多的组件。

在此之前，我们展示了一个`FriendStatus` 组件，它可以调用`useState`和`useEffect`钩子来订阅一个朋友的在线状态。假设我们想要在其他的组件中复用这个订阅逻辑。

首先，我们要把这个逻辑抽取到名为`useFriendStatus`的自定义钩子中：

```js{3}
import { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

这个钩子需要一个`friendID`作为参数，返回你的朋友是否在线。

现在，我们可以同时在两个组件中使用它：


```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

```js{2}
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

两个组件中的状态是完全独立的。钩子只复用状态逻辑而不是状态本身。事实上，每一次调用钩子都会得到一个完全孤立的状态——所以你甚至可以在同一个组件中使用两次相同的自定义钩子。

自定义钩子更多的是一个约定而不是特性。如果一个函数的名字以 "`use`" 开头并且调用了其他的钩子，我们就称它为自定义钩子。`useSomething`的命名约定方便语法检查插件找到代码中钩子的错误使用。

自定义钩子可以覆盖非常多的用例，像表单处理，动画，声明式订阅，定时器，还有很多我们还没有考虑到的。我们非常激动能够看到React社区提出的自定义钩子。

>详细解释
>
>你可以在专门的页面上了解到更多关于自定义钩子的信息:[构建你自己的钩子](/docs/hooks-custom.html)。

## 🔌 其他钩子

还有一些不太常用的内置钩子，也许你会觉得非常有用。使用[`useContext`](/docs/hooks-reference.html#usecontext)可以订阅React context而不用引入嵌套：

```js{2,3}
function Example() {
  const locale = useContext(LocaleContext);
  const theme = useContext(ThemeContext);
  // ...
}
```

[`useReducer`](/docs/hooks-reference.html#usereducer)则允许你使用一个reducer来管理一个复杂组件的局部状态（local state）：

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer);
  // ...
```

>详细解释
>
>你可以在这个页面上了解到所有的内置钩子: [钩子API参考](/docs/hooks-reference.html)。

## 下一步

噢，太快了！如果有些地方没有讲清楚或者你想了解更多细节，你可以阅读下一页，从[状态钩子](/docs/hooks-state.html)这篇文档开始。

你也可以查看[钩子API参考](/docs/hooks-reference.html)和[钩子常见问题](/docs/hooks-faq.html)。

最后，不要错过[介绍页面](/docs/hooks-intro.html)，这里解释了为什么我们要引入钩子以及我们如何同时使用类和钩子，而无需重写我们的应用。
