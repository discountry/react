---
title: "Update on Async Rendering"
author: [bvaughn]
---

一年多来，react 团队在实现异步渲染上做了许多工作。上个月的冰岛 JSConf 演讲上，[Dan 揭晓了一些令人兴奋的解锁异步渲染的可能性](https://doc.react-china.org/blog/2018/03/01/sneak-peek-beyond-react-16.html)。现在我们想与您分享一些我们研究这些功能时的一些经验，以及帮助你准备用于异步渲染的组件的一些秘诀。

我们了解到的最大的教训就是我们传统的一些组件生命周期倾向于鼓励不安全的实践。它们是：

- `componentWillMount`
- `componentWillReceiveProps`
- `componentWillUpdate`

这些生命周期经常被误解或不知不觉地误用。此外，我们预料到这些潜在的滥用可能会给异步渲染造成更多问题。因此，我们将会在接下来的版本给这些生命周期添加 “UNSAFE_” 前缀。（这里，“unsafe” 指的不是安全，而是想传达在这些生命周期里编程可能会在未来的 react 版本引起 bug，尤其是异步渲染开启的情况下。）


## 逐步迁移之路

react 遵循语义版本控制，所以这个改变将是逐步的。我们当前的计划是：

- 16.3：介绍不安全的生命周期别名，UNSAFE_componentWillMount, UNSAFE_componentWillReceiveProps, 和 UNSAFE_componentWillUpdate。 (旧的生命周期名和新的别名会在这个版本同时有效。)
- 16.x 版本： 对 componentWillMount, componentWillReceiveProps, and componentWillUpdate 开启警告提示。（旧的生命周期名和新的别名会在这个版本同时有效，但旧的名称在开发模式下将会有 log 警告）
- 17.0: 完全移除 componentWillMount, componentWillReceiveProps, and componentWillUpdate。（从这个版本开始，只有新的 “UNSAFE_” 生命周期名称有效）

**注意，如果你是一个 react 应用开发者，你还不需要对传统的方法做任何改变。即将发布的 16.3 版本主要的意图是，让开源项目维护人员在任何弃用警告之前更新其库。这些警告还不会生效，直到之后的16.x版本。**

我们在 Facebook 维护着超过 50，000 个 react 组件， 并且我们并没有计划立即重写它们。我们明白迁移需要时间。我们会带领 react 社区的每一个人逐步迁移。

## 从旧的生命周期迁移

如果你想要在 react 16.3 版本使用上面介绍的新 APIs（或者如果你是一个维护者，想提前更新你的库），这里有一些示例希望能帮助你从另一个角度思考组件。之后，我们计划添加一些“秘诀” 到我们的文档中，以此展示如何以避免有问题的生命周期的方式编写普通业务。

在开始之前，快速回顾一下 16.3 版本所计划的生命周期的变更：

- 添加以下别名： `UNSAFE_componentWillMount`, `UNSAFE_componentWillReceiveProps`, 和 `UNSAFE_componentWillUpdate`（新旧生命周期同时支持）
- 介绍两个新的生命周期， 静态方法 `getDerivedStateFromProps` 和 `getSnapshotBeforeUpdate`。

## 新生命周期： getDerivedStateFromProps

```javascript

class Example extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    // ...
  }
}

```

这个新的静态生命周期方法 getDerivedStateFromProps 是在组件实例化之后被调用，同时接收新的 props 作为参数。它可以返回一个对象去更新 state, 或者返回 null 来表明这个新的 props 不需要更新任何 state。

和 componentDidUpdate 一起，这个新生命周期应该覆盖传统的 componentWillReceiveProps 方法的所有用例。

## 新生命周期： getSnapshotBeforeUpdate

```javascript

class Example extends React.Component {
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // ...
  }
}

```

这个新生命周期 `getSnapshotBeforeUpdate` 会在突变之前（比如DOM更新之前）调用。这个方法的返回值将会作为第三个参数传递到 `componentDidUpdate`。 （这个生命周期并不常用，但对于 rerender 期间手动保留滚动位置非常有用。）

与 `componentDidUpdate` 一起，这个新生命周期应该覆盖传统的 `componentWillUpdate` 方法的所有用例。

在[这个 gist](https://gist.github.com/gaearon/88634d27abbc4feeb40a698f760f3264)里可以找到它们的类型签名。

下面我们用一些示例展示如何使用这两个新的生命周期。

### 初始化 state

这个例子展示了一个组件在 componentWillMount 里面调用了 setState:

```javascript
// Before
class ExampleComponent extends React.Component {
  state = {};

  componentWillMount() {
    this.setState({
      currentColor: this.props.defaultColor,
      palette: 'rgb',
    });
  }
}
```

简单地将 state 初始化移动到 constructor 或者 属性初始化的位置来重构这个组件，看起来像这样：

```javascript
// After
class ExampleComponent extends React.Component {
  state = {
    currentColor: this.props.defaultColor,
    palette: 'rgb',
  };
}
```

### 获取外部数据

下面是一个组件在 componentWillMount 里面获取数据的例子：

```javascript
// Before
class ExampleComponent extends React.Component {
  state = {
    externalData: null,
  };

  componentWillMount() {
    this._asyncRequest = asyncLoadData().then(
      externalData => {
        this._asyncRequest = null;
        this.setState({externalData});
      }
    );
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    if (this.state.externalData === null) {
      // Render loading state ...
    } else {
      // Render real UI ...
    }
  }
}
```

上面的代理在服务端渲染（外部数据还没有用到）和即将到来的异步渲染模式（请求可能发送多次）两种情况下都会有问题。

对于大部分情况，推荐将数据获取移到 componentDidMount:

```javascript
// After
class ExampleComponent extends React.Component {
  state = {
    externalData: null,
  };

  componentDidMount() {
    this._asyncRequest = asyncLoadData().then(
      externalData => {
        this._asyncRequest = null;
        this.setState({externalData});
      }
    );
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    if (this.state.externalData === null) {
      // Render loading state ...
    } else {
      // Render real UI ...
    }
  }
}
```

这里普遍的误解是，在 componentWillMount 里获取数据可以避免渲染空的状态。在实际中，这从来都是不对的，因为 react 总是在 componentWillMount 之后立即执行 render。如果数据在 componentWillMount 调用的时候还不可用，那么第一次 render 也仍然显示加载状态，而不管你在哪里获取数据。这就是为什么在绝大多数情况下，将数据获取移到 componentDidMount 是感受不到差别的。

### 添加事件监听（或订阅）

下面是一个在 mounting 订阅事件的组件示例:

```javascript
// Before
class ExampleComponent extends React.Component {
  componentWillMount() {
    this.setState({
      subscribedValue: this.props.dataSource.value,
    });

    // This is not safe; it can leak!
    this.props.dataSource.subscribe(
      this.handleSubscriptionChange
    );
  }

  componentWillUnmount() {
    this.props.dataSource.unsubscribe(
      this.handleSubscriptionChange
    );
  }

  handleSubscriptionChange = dataSource => {
    this.setState({
      subscribedValue: dataSource.value,
    });
  };
}

```

不幸的是， 这会造成服务端（componentWillUnmount 永远都不会被调用）和异步渲染（在渲染完成之前可能会被中断，造成 componentWillUnmount 没有被调用）的内存泄漏。

有人经常假设 componentWillMount 和 componentWillUnmount 是对应存在的，这其实不能保证。只有 componentDidMount 被调用之后，react 才能保证 componentWillUnmount 会在清除时被调用。

因此，推荐在 componentDidMount 中添加事件监听和订阅。

```javascript
// After
class ExampleComponent extends React.Component {
  state = {
    subscribedValue: this.props.dataSource.value,
  };

  componentDidMount() {
    // Event listeners are only safe to add after mount,
    // So they won't leak if mount is interrupted or errors.
    this.props.dataSource.subscribe(
      this.handleSubscriptionChange
    );

    // External values could change between render and mount,
    // In some cases it may be important to handle this case.
    if (
      this.state.subscribedValue !==
      this.props.dataSource.value
    ) {
      this.setState({
        subscribedValue: this.props.dataSource.value,
      });
    }
  }

  componentWillUnmount() {
    this.props.dataSource.unsubscribe(
      this.handleSubscriptionChange
    );
  }

  handleSubscriptionChange = dataSource => {
    this.setState({
      subscribedValue: dataSource.value,
    });
  };
}
```

有时更新订阅以便响应属性变化是很重要的。如果你使用 redux or mobx， 这些库的容器组件应该做这些事。对于应用作者，我们创建了一个小巧的库，create-subscription 来帮助做这些事。它将会和 react v16.3 一起发布。

比起上面那样传递一个可订阅的 dataSource 属性，我们也可以使用 create-subscription 去传递订阅的值：

```javascript
import {createSubscription} from 'create-subscription';

const Subscription = createSubscription({
  getCurrentValue(sourceProp) {
    // Return the current value of the subscription (sourceProp).
    return sourceProp.value;
  },

  subscribe(sourceProp, callback) {
    function handleSubscriptionChange() {
      callback(sourceProp.value);
    }

    // Subscribe (e.g. add an event listener) to the subscription (sourceProp).
    // Call callback(newValue) whenever a subscription changes.
    sourceProp.subscribe(handleSubscriptionChange);

    // Return an unsubscribe method.
    return function unsubscribe() {
      sourceProp.unsubscribe(handleSubscriptionChange);
    };
  },
});

// Rather than passing the subscribable source to our ExampleComponent,
// We could just pass the subscribed value directly:

  {value => <ExampleComponent subscribedValue={value} />}
Subscription>;
```

> 注意：
> 像 Relay/Apollo 这样的库应该手动地使用 create-subscription 相同的技术去管理订阅（参考）以适合这些库的最佳实践。

### 基于 props 更新 state

下面是一个使用传统 componentWillReceiveProps 方法来更新基于 props 的 state 的示例：

```javascript
// Before
class ExampleComponent extends React.Component {
  state = {
    isScrollingDown: false,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.currentRow !== nextProps.currentRow) {
      this.setState({
        isScrollingDown:
          nextProps.currentRow > this.props.currentRow,
      });
    }
  }
}

```

虽然上面的代码本身没有问题，但 componentWillReceiveProps 经常被误用来解决当下的一些问题。因此，这个方法将会被弃用。

从 16.3 版本开始，推荐使用新的 静态方法 getDerivedStateFromProps 来更新基于 props 的 state.(这个生命周期将在组件被创建后和每次接收到新 props 的时候被调用)：

```javascript
// After
class ExampleComponent extends React.Component {
  // Initialize state in constructor,
  // Or with a property initializer.
  state = {
    isScrollingDown: false,
    lastRow: null,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.currentRow !== prevState.lastRow) {
      return {
        isScrollingDown:
          nextProps.currentRow > prevState.lastRow,
        lastRow: nextProps.currentRow,
      };
    }

    // Return null to indicate no change to state.
    return null;
  }
}
```

你可能注意到上面的例子中 props.currentRow 被映射到 state( 作为 state.lastRow)。这允许 getDerivedStateFromProps 和 componentWillReceiveProps 那样可以访问上一个 props 的值。

你可能想知道为什么我们不简单地将先前的 props 作为参数传递给 getDerivedStateFromProps。我们在设计API时考虑过这个问题，但因为两点原因推翻这个想法：

- prevProps 参数在第一次调用 getDerivedStateFromProps (实例化后)时会是 null。 需要在每次访问 prevProps 时判断 if-not-null。
- 在未来版本的 react 中，不传递先前的 props 到这个函数是释放内存的一步。（如果 react 不需要传递 prevProps 到生命周期，内存中就不需要保持 prevProps 的引用。）

> 注意：

> 如果你正在写一个公共组件，react-lifecycles-compat polyfill 允许在旧版本的 react 中使用新生命周期方法 getDerivedStateFromProps。

### 调用外部回调

这是一个当内部 state 改变时调用外部回调的组件：

```javascript
// Before
class ExampleComponent extends React.Component {
  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.someStatefulValue !==
      nextState.someStatefulValue
    ) {
      nextProps.onChange(nextState.someStatefulValue);
    }
  }
}
```

有时候，大家使用 componentWillUpdate 的一个误点是：认为 componentDidUpdate 触发的时机“太晚了”， 不能及时更新其他组件。其实不是这样。 react 确保 componentDidMount 和 componentDidUpdate 期间调用的任何 setState 会在用户看到UI更新之前执行完。一般来说，像这样这很容易避免级联更新，但某些情况下这是必要的（举个例子，如果你需要在测量已渲染的 DOM 元素后定位一个提示框）。

无论哪种方式，在异步模式下为了这个目的去使用 componentWillUpdate 是不安全的，因为外部回调可能会在一次更新中被调用多次。相反，应该使有和componentDidUpdate 方法替代，因为它能保证每次更新只被调用一次：

```javascript
// After
class ExampleComponent extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.someStatefulValue !==
      prevState.someStatefulValue
    ) {
      this.props.onChange(this.state.someStatefulValue);
    }
  }
}
```

### 副作用的 on props change

和上面的例子相似，有时候当组件 props 改变时会有副作用。

```javascript
// Before
class ExampleComponent extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.isVisible !== nextProps.isVisible) {
      logVisibleChange(nextProps.isVisible);
    }
  }
}
```

类似 componentWillUpdate, componentWillReceiveProps 方法可能会在单次更新中被调用多次。因此，在这些方法里避免使用有副作用的函数是很重要的。相反，应该使有和componentDidUpdate 方法替代，因为它能保证每次更新只被调用一次：

```javascript
// After
class ExampleComponent extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    if (this.props.isVisible !== prevProps.isVisible) {
      logVisibleChange(this.props.isVisible);
    }
  }
}
```

### 当 props 改变时获取外部数据

这是一个当 props 改变时获取外部数据的组件示例：

```javascript

// Before
class ExampleComponent extends React.Component {
  state = {
    externalData: null,
  };

  componentDidMount() {
    this._loadAsyncData(this.props.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.setState({externalData: null});
      this._loadAsyncData(nextProps.id);
    }
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    if (this.state.externalData === null) {
      // Render loading state ...
    } else {
      // Render real UI ...
    }
  }

  _loadAsyncData(id) {
    this._asyncRequest = asyncLoadData(id).then(
      externalData => {
        this._asyncRequest = null;
        this.setState({externalData});
      }
    );
  }
}
```

推荐升级成使用 componentDidUpdate 更新数据。也可以使用新生命周期 getDerivedStateFromProps 在渲染新 props 时清理旧数据：

```javascript

// After
class ExampleComponent extends React.Component {
  state = {
    externalData: null,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    // Store prevId in state so we can compare when props change.
    // Clear out previously-loaded data (so we don't render stale stuff).
    if (nextProps.id !== prevState.prevId) {
      return {
        externalData: null,
        prevId: nextProps.id,
      };
    }

    // No state update necessary
    return null;
  }

  componentDidMount() {
    this._loadAsyncData(this.props.id);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.externalData === null) {
      this._loadAsyncData(this.props.id);
    }
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    if (this.state.externalData === null) {
      // Render loading state ...
    } else {
      // Render real UI ...
    }
  }

  _loadAsyncData(id) {
    this._asyncRequest = asyncLoadData(id).then(
      externalData => {
        this._asyncRequest = null;
        this.setState({externalData});
      }
    );
  }
}

```

> 注意：

> 如果你使用的 HTTP 库支持取消功能，比如 axios，只需要在 unmount 的时候简单地取消一个正在处理的请求。对于原生 Promise, 你可以用这样的解决方案。

### 在更新前读取 DOM 属性

这是一个在更新前读取 DOM 属性以便维护列表的滚动位置的组件示例：

```javascript

class ScrollingList extends React.Component {
  listRef = null;
  previousScrollHeight = null;

  componentWillUpdate(nextProps, nextState) {
    // Are we adding new items to the list?
    // Capture the current height of the list so we can adjust scroll later.
    if (this.props.list.length < nextProps.list.length) {
      this.previousScrollHeight = this.listRef.scrollHeight;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // If previousScrollHeight is set, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    if (this.previousScrollHeight !== null) {
      this.listRef.scrollTop +=
        this.listRef.scrollHeight -
        this.previousScrollHeight;
      this.previousScrollHeight = null;
    }
  }

  render() {
    return (

this.setListRef}>
        {/* ...contents... */}
      </div>
    );
  }

  setListRef = ref => {
    this.listRef = ref;
  };
}
```

在上面的示例中， 在 componentWillUpdate 中读取 DOM 属性。但是在异步渲染中，这可能被延迟到 “render” 阶段（像 componentWillUpdate and render）和 “commit” 阶段(像 componentDidUpdate)才执行。如果用户在这期间做了一些类似调整窗口大小，从 componentWillUpdate 中读取的 scrollHeight 值会是旧的。

这个问题的解决方案就是使用新的 “commit” 阶段的生命周期事件，getSnapshotBeforeUpdate。这个方当会在变更产生后立即被调用（比如在 DOM 被更新之前）。它可以返回一个值并作为参数传到 componentDidUpdate。

这两个生命周期可以像下面这样用：

```javascript

class ScrollingList extends React.Component {
  listRef = null;

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Are we adding new items to the list?
    // Capture the current height of the list so we can adjust scroll later.
    if (prevProps.list.length < this.props.list.length) {
      return this.listRef.scrollHeight;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      this.listRef.scrollTop +=
        this.listRef.scrollHeight - snapshot;
    }
  }

  render() {
    return (

this.setListRef}>
        {/* ...contents... */}
      </div>
    );
  }

  setListRef = ref => {
    this.listRef = ref;
  };
}
```

> 注意：

> 如果你正在写一个公共组件，react-lifecycles-compat polyfill 允许在旧版本的 react 中使用新生命周期方法 getSnapshotBeforeUpdate。

### 其他场景

尽管我们试图在这篇文章中涵盖最常见的用例，我们承认我们可能错过了一些。如果这篇博客里有你使用 componentWillMount, componentWillUpdate, or componentWillReceiveProps 却没提到的案例，并步不确定如何迁移，可以留下评论和示例。

## 开源维护者

开源维护者可能比较想知道这些改变对开源组件意味着什么。如果你实现了上述建议，依赖于新静态生命周期事件 getDerivedStateFromProps 会发生什么？ 你是否不复不发布一个新的主版本并兼容 react 16.2及更老版本？

好消息是，不需要！

当 react 16.3 发布时，我们也会发布一个新的 npm 包， react-lifecycles-compat。 这个包提供了 polyfill 以便你能在老版本的 react（0.14.9+）使用新的生命周期事件 getDerivedStateFromProps and getSnapshotBeforeUpdate。

要使用这个 polyfill, 请先安装依赖到你的库：

```sh
# Yarn
yarn add react-lifecycles-compat

# NPM
npm install react-lifecycles-compat --save

```

接着使用新的生命周期事件更新你的组件（就像上面说的那样）。

最后，使用 polyfill 让你的组件兼容旧版本的 react:

```javascript

import React from 'react';
import {polyfill} from 'react-lifecycles-compat';

class ExampleComponent extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    // Your state update logic here ...
  }
}

// Polyfill your component to work with older versions of React:
polyfill(ExampleComponent);

export default ExampleComponent;

```

