---
id: hooks-state
title: Using the Effect Hook
permalink: docs/hooks-effect.html
next: hooks-rules.html
prev: hooks-intro.html
---

*Hooks* 是 React v16.7.0-alpha 中加入的新特性。它可以让你在 class 以外使用 state 和其他 React 特性。你可以在[这里](https://github.com/reactjs/rfcs/pull/68)看到关于它的一些讨论。

*Effect Hook* 可以让你在函数组件中执行一些具有 side effect（副作用）的操作：

```js{1,6-10}
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // 与 componentDidMount 和 componentDidUpdate 类似:
  useEffect(() => {
    // 通过浏览器自带的 API 更新页面标题
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

这段代码基于[前一页的计数器示例](/docs/hook-state.html)，但是我们添加了一个新特性:我们将文档标题设置为包含单击次数的自定义消息。

获取数据、设置订阅和手动更改 React 组件中的 DOM 都是副作用的例子。不管您是否习惯将这些操作称为什么，您以前都可能在组件中执行过这些操作。

>Tip
>
> 如果你熟悉 class 组件中的生命周期方法，你可以把 `useEffect` Hooks 视作 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 的结合。

React 组件中的 side effects 大致可以分为两种：一种是不需要手动清理（cleanup）的，一种是需要的。让我们看看这部分的细节。

## 不需要清理的 effects

有时我们想要 **在 React 更新过 DOM 之后执行一些额外的操作。** 比如网络请求、手动更新 DOM 、以及打印日志都是常见的不需要清理的 effects。让我们比较一下我们在 classes 和 Hooks 中如何做到这些。

### 使用 Class 的例子

在 class 组件中，`render` 方法本身不应该导致 side effects。`render` 方法太早了————我们通常会在 React 更新过 DOM *之后* 再执行 effect。

这也是我们在 class 组件中，把 side effects 放在 `componentDidMount` 和 `componentDidUpdate` 中的原因。回到我们的例子上，在这个例子中，我们在 React 更新 DOM 之后立刻更新 document title ：
```js{9-15}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

注意 **我们 class 组件中需要在两个生命周期中重复这段代码。**

这是因为在很多时候，我们想要执行相同的 side effect，不管组件是刚刚挂载，或是刚刚更新。从概念上讲，我们想要它在每次 render 之后执行————尽管 React class 组件并不包含这样的方法。就算我们把这个公用的 side effect 抽象出来，我们依旧需要在两个地方分别调用它。

现在让我们来看看我们用 `useEffect` Hook，如何做到这些。 

### 使用 Hooks的例子

我们已经在这一页的顶部看过了这个例子，不过让我们再仔细地研究一下：

```js{1,6-8}
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
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

**`useEffect` 做了什么？** 通过这个 Hook，React 知道你想要这个组件在每次 render 之后做些事情。React 会记录下你传给 `useEffect` 的这个方法（我们可以把它看做我们的 `effect` ），然后在进行了 DOM 更新之后调用这个方法。在这个 effect 中，我们设置 document title，但我们同样也可以进行数据获取或是调用其它必要的 API。

**为什么 `useEffect` 在组件内部调用？** 将 `useEffect` 放在一个组件内部，可以让我们在 effect 中，即可获得对 `count` state（或其它 props）的访问，而不是使用一个特殊的 API 去获取它。Hooks 使用了 JavaScript 的闭包，从而避免了引入 React 特有的 API 来解决 JavaScript 已经提供解决方案。

**`useEffect` 是不是在每次 render 之后都会调用？** 是的！默认情况下，它会在第一次 render *和* 之后的每次 update 后运行。（我们会在之后讨论如何[优化](#tip-optimizing-performance-by-skipping-effects)。）比起 “mounting” 和 “updating”，effect 在“每次 render”之后调用，想必会更容易理解。React 保证每次运行 effects 之前 DOM 已经更新了。

### 细节解释

现在我们来看看下面这几行代码的作用：

```js
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
```

我们声明了 `count` state，然后我们告诉 React 我们将会用到一个 effect。我们将一个函数传递给 `useEffct` Hook。我们传递的这个方法 *就是* 我们的 effect（副作用）。在这个 effect 里，我们使用 `document.title` API 设置了 document title。同时，由于 effect 在这个函数的作用域内，我们也可以在 effect 中读取到最新的 `count`。当 React 渲染组件时，它会记录下我们使用的 effect，然后再更新完 DOM 后调用它。这发生在每一次 render 之后，包括最开始的一次。

有经验的 JavaScript 开发者也许已经发现，在每次 render 的时候，我们传递给 `useEffect` 的方法都是全新的。这是故意的。事实上，这正是我们可以在 effect 内部读取到 `count` 值，并且不用担心 `count` 值过期的原因。每当我们重新 render 的时候，我们都会使用一个 _不同的_ effect，替换掉之前的哪一个。在某种程度上，这使得 effect 表现得更像是 render 结果的一部分————每个 effect “属于”一个特定的 render。我们会在[这一节的后面](#explanation-why-effects-run-on-each-update)更清晰地了解到这么做的作用。

>Tip
>
> 不像 `componentDidMount` 或者 `componentDidUpdate`，`useEffect` 中使用的 effect 并不会阻滞浏览器渲染页面。这让你的 app 看起来更加流畅。尽管大多数 effect 不需要同步调用。但是在一些不常见的情况下你也许需要他们同步调用（比如计算元素尺寸），我们提供了一个单独的 [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect) 来达成这样的效果。它的 API 和 `useEffect` 是相同的。

## 需要清理的 Effect

我们刚刚看过了如何书写不需要清理的 side effect。然而，还有一些 effects 需要清理。比如，**我们可能会需要从一些外部数据源获取数据**。在这种情况下，我们就要确保我们进行了清理，以避免内存泄漏。我们还是来比较一下 class 和 Hooks。

### 使用 Class 的例子

在 React class 中，典型的做法是在 `componentDidMount` 里创建订阅，然后在 `componentWillUnmount` 中清除它。比如说我们假设我们有一个 `ChatAPI` 模块，可以让我们获取朋友的在线状态。我们使用 class 一般是这么做的：

```js{8-26}
class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'Loading...';
    }
    return this.state.isOnline ? 'Online' : 'Offline';
  }
}
```

注意 `componentDidMount` 和 `componentWillUnmount` 中我们需要重复同一段代码。生命周期要求我们不得不拆分这段逻辑，就算从概念上讲他们是从属于同一个 effect 的。

>Note
>
> 细心的读者也许已经注意到，这段例子需要一个 `componentDidUpdate` 方法才能是完全正确的。不过我们在这里暂时忽略这一点。我们将在[后文](#explanation-why-effects-run-on-each-update)继续讨论这一内容。

### 使用 Hooks 的例子

让我们来看看使用 Hooks 如何书写这个组件。

你有可能以为我们依旧需要使用单独的 effect 来执行清理。但是添加和删除订阅的代码是如此的紧密相关，因此 `useEffect` 选择将它们保存在一起。如果你的 effect 返回了一个函数，React 将会在清理时运行它：

```js{10-16}
import { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // 明确在这个 effect 之后如何清理它
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

**我们为什么在 effect 中返回一个函数** 这是一种可选的清理机制。每个 effect 都可以返回一个用来在晚些时候清理它的函数。这让我们让添加和移除订阅的逻辑彼此靠近。它们是同一个 effect 的一部分！

**React 究竟在什么时候清理 effect？** React 在每次组件 unmount 的时候执行清理。然而，正如我们之前了解的那样，effect 会在每次 render 时运行，而不是仅仅运行一次。这也就是为什么 React *也* 会在下次运行 effect 之后清理上一次 render 中的 effect。我们会在接下来讨论[为什么这可以帮助避免 bug](#explanation-why-effects-run-on-each-update) 以及[如何有选择的运行 effect 以避免出现性能问题](#tip-optimizing-performance-by-skipping-effects)

>Note
>
> 我们没必要在 effect 中返回一个具名函数。我们在这里称它为 `清理` 就可以表明它的目的，但你也可以返回一个箭头函数或者给它起一个名字。

## 小结

我们现在知道 `useEffect` 让我们可以在每次组件 render 之后调用不同种类的 side effect。其中的一些可能会需要被清理，所以它们返回一个函数：

```js
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

其他的一些并不需要清理操作，所以它们并不返回任何东西。

```js
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
```

Effect Hook 使用一个 API 使这两者获得了统一。

-------------

**不论你觉得对 Effect Hook 的工作方式有了很好的了解，或者你还是觉得有些迷惑，你都可以在这里跳转到 [下一页](/docs/hooks-rules.html)**

-------------

## 使用 Effect 的 Tips

在这一页我们将会继续深入探讨关于 `useEffect` 的细节。有经验的 React 用户或许会对这部分内容感兴趣，不过你也可以先去看看其他 Hook 的使用方法。你可以随时返回这个页面以了解 Effect Hook 的更多细节。

### Tip: 使用多个 Effect 以实现关注点分离

我们在 Hook 的[动机](/docs/hooks-intro.html#complex-components-become-hard-to-understand)中提到的一个问题是 class 的生命周期函数常常包含不相关的逻辑，同时相关的逻辑被拆分进不同的方法。这里有一个结合了之前的计数器和朋友状态指示器逻辑的组件：

```js
class FriendStatusWithCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }
  // ...
```

注意这里设置 `document.title` 的代码被拆分到了 `componentDidMount` 和 `componentDidUpdate` 中。订阅的逻辑也分散到了 `componentDidMount` 和 `componentWillUnmount` 中。而 `componentDidMount` 包含了这两部分的代码。

所以 Hooks 要如何解决这一问题呢？就像[你可以不止一次使用 *State* Hooks](/docs/hooks-state.html#tip-using-multiple-state-variables) 中说的一样，你同样可以使用多个 effects。这让我们可以把不相关的逻辑分离到不同的 effect 里：

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
}
```

**Hook 让我们根据代码的作用将它们拆分** 而不是根据生命周期。React 将会按照指定的顺序应用 *每个* effect。

### Explanation: Why Effects Run on Each Update

If you're used to classes, you might be wondering why the effect cleanup phase happens after every re-render, and not just once during unmounting. Let's look at a practical example to see why this design helps us create components with fewer bugs.

[Earlier on this page](#example-using-classes-1), we introduced an example `FriendStatus` component that displays whether a friend is online or not. Our class reads `friend.id` from `this.props`, subscribes to the friend status after the component mounts, and unsubscribes during unmounting:

```js
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

**But what happens if the `friend` prop changes** while the component is on the screen? Our component would continue displaying the online status of a different friend. This is a bug. We would also cause a memory leak or crash when unmounting since the unsubscribe call would use the wrong friend ID.

In a class component, we would need to add `componentDidUpdate` to handle this case:

```js{8-19}
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate(prevProps) {
    // Unsubscribe from the previous friend.id
    ChatAPI.unsubscribeFromFriendStatus(
      prevProps.friend.id,
      this.handleStatusChange
    );
    // Subscribe to the next friend.id
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

Forgetting to handle `componentDidUpdate` properly is a common source of bugs in React applications.

Now consider the version of this component that uses Hooks:

```js
function FriendStatus(props) {
  // ...
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

It doesn't suffer from this bug. (But we also didn't make any changes to it.)

There is no special code for handling updates because `useEffect` handles them *by default*. It cleans up the previous effects before applying the next effects. To illustrate this, here is a sequence of subscribe and unsubscribe calls that this component could produce over time:

```js
// Mount with { friend: { id: 100 } } props
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // Run first effect

// Update with { friend: { id: 200 } } props
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // Run next effect

// Update with { friend: { id: 300 } } props
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // Run next effect

// Unmount
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // Clean up last effect
```

This behavior ensures consistency by default and prevents bugs that are common in class components due to missing update logic.

### Tip: Optimizing Performance by Skipping Effects

In some cases, cleaning up or applying the effect after every render might create a performance problem. In class components, we can solve this by writing an extra comparison with `prevProps` or `prevState` inside `componentDidUpdate`:

```js
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```

This requirement is common enough that it is built into the `useEffect` Hook API. You can tell React to *skip* applying an effect if certain values haven't changed between re-renders. To do so, pass an array as an optional second argument to `useEffect`:

```js{3}
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // Only re-run the effect if count changes
```

In the example above, we pass `[count]` as the second argument. What does this mean? If the `count` is `5`, and then our component re-renders with `count` still equal to `5`, React will compare `[5]` from the previous render and `[5]` from the next render. Because all items in the array are the same (`5 === 5`), React would skip the effect. That's our optimization.

When we render with `count` updated to `6`, React will compare the items in the `[5]` array from the previous render to items in the `[6]` array from the next render. This time, React will re-apply the effect because `5 !== 6`. If there are multiple items in the array, React will re-run the effect even if just one of them is different.

This also works for effects that have a cleanup phase:

```js{6}
useEffect(() => {
  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // Only re-subscribe if props.friend.id changes
```

In the future, the second argument might get added automatically by a build-time transformation.

>Note
>
>If you use this optimization, make sure the array includes **any values from the outer scope that change over time and that are used by the effect**. Otherwise, your code will reference stale values from previous renders. We'll also discuss other optimization options in the [Hooks API reference](/docs/hooks-reference.html).
>
>If you want to run an effect and clean it up only once (on mount and unmount), you can pass an empty array (`[]`) as a second argument. This tells React that your effect doesn't depend on *any* values from props or state, so it never needs to re-run. This isn't handled as a special case -- it follows directly from how the inputs array always works. While passing `[]` is closer to the familiar `componentDidMount` and `componentWillUnmount` mental model, we suggest not making it a habit because it often leads to bugs, [as discussed above](#explanation-why-effects-run-on-each-update). Don't forget that React defers running `useEffect` until after the browser has painted, so doing extra work is less of a problem.

## Next Steps

Congratulations! This was a long page, but hopefully by the end most of your questions about effects were answered. You've learned both the State Hook and the Effect Hook, and there is a *lot* you can do with both of them combined. They cover most of the use cases for classes -- and where they don't, you might find the [additional Hooks](/docs/hooks-reference.html) helpful.

We're also starting to see how Hooks solve problems outlined in [Motivation](/docs/hooks-intro.html#motivation). We've seen how effect cleanup avoids duplication in `componentDidUpdate` and `componentWillUnmount`, brings related code closer together, and helps us avoid bugs. We've also seen how we can separate effects by their purpose, which is something we couldn't do in classes at all.

At this point you might be questioning how Hooks work. How can React know which `useState` call corresponds to which state variable between re-renders? How does React "match up" previous and next effects on every update? **On the next page we will learn about the [Rules of Hooks](/docs/hooks-rules.html) -- they're essential to making Hooks work.**
