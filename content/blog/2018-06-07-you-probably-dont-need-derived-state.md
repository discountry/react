---
title: "You Probably Don't Need Derived State"
author: [bvaughn]
---

React 16.4  [修复了一个关于 getDerivedStateFromProps 的 bug](/blog/2018/05/23/react-v-16-4.html#bugfix-for-getderivedstatefromprops)。若这篇文章提及了你应用中正在使用的反模式，并在修复后导致了无法正确工作，我们对此感到抱歉。在这篇文章，我们将对在派生状态下普遍使用的反模式以及我们倾向的选择方案进行说明。

在很长的一段时间，生命周期 `componentWillReceiveProps` 是唯一的能够在 props 变更时更新状态而不触发渲染的唯一方式。在 16.3，[我们引入了一个替代的生命周期，`getDerivedStateFromProps`](https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes) 用以更安全的方式来解决同样的问题。同时，我们意识到有些用户可能会对如何使用这两个方法有很多误解，我们也发现了一些反模式会导致潜在的令人困惑的 bug。在 16.4 中修复的 `getDerivedStateFromProps` [使得派生状态会更容易预测](https://github.com/facebook/react/issues/12898)，因此一些错误的用例会更容易注意到。

> 注意
>
> 本文所提及的反模式同时应用了 `componentWillReceivedProps` 和 `getDerivedStateFromProps` 两个方法。

本文将涵盖以下主题：
* [何时使用派生状态](#何时使用派生状态)
* [使用派生状态的一些常见问题](#使用派生状态的一些常见问题)
    * [反模式：无条件地将 props 拷贝到状态上](#反模式：无条件地将 props 拷贝到状态上)
    * [反模式：当 props 更新时擦除状态](#反模式：当 props 更新时擦除状态)
* [更好的解决方案](#更好的解决方案)
* [记忆化（memoization）是否可行？](#记忆化（memoization）是否可行？)

## 何时使用派生状态

`getDerivedStateFromeProps` 存在仅有一个目的。其能够让组件在 **prop 变更时** 更新内部的状态。我们之前的博文提供了一些例子，例如[基于当前变更的偏移（offset）prop 记录当前的滚动方向](/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props) 或者 [通过资源 prop 加载额外的特定资源](/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change)。 

我们没有提供更多的例子，因为作为一个通用规则，**派生状态应谨慎使用**。我们所见过的所有的由派生状态导致的问题最终都可归结为（1）无条件的通过 props 来更新状态或（2）无论 props 是否和 状态匹配都更新状态。（我们将在接下来更为细致地探讨这两个问题。）

* 若你仅通过当前的 props 使用派生状态来缓存一些计算操作，则没必要使用派生状态。可查看 [记忆化是否可行？](#what-about-memoization)一节。
* 若你只是无条件的更新派生状态或无论 props 和状态是否匹配都进行更新，你的组件可能太过于频繁的重置它的内部状态。继续阅读了解更多细节。

## 使用派生状态的一些常见问题 

术语 [“受控”](/docs/forms.html#controlled-components) 和 [“非受控”](/docs/uncontrolled-components.html) 通常指的是表单的输入框，但它们也可用于描述组件的数据的生命周期。作为 props 传递组件可以认为是 **受控**的（因为父组件_控制_那ß些数据）。仅存在于内部状态的数据则可以认为是**非受控的**（因为父组件无法直接改变它）。

派生组件最常见的错误是混淆了这两者；当一个派生状态的值也能通过 `setState` 调用来更新时，之前在[额外的数据加载例子](/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change)可能听起来有些类似，但在一些重要的方式上存在着差异。在加载的例子中，对于 "source" prop 和 "loading" 状态都有一个清晰的来源。当 source prop 发生改变，loading 状态则应当**永远**被重写。反过来，仅当 prop **发生改变**并且由组件管理时，状态才会被重写。

当这些约束的任何一条被改变都会引发问题。典型的情况是在两个表单下。让我们来看个例子。

### 反模式：无条件地将 props 拷贝到状态上

一个普遍的误解是 `getDerivedStateFromProps` 和 `componentWillReceiveProps` 仅在 props 改变时被调用。这些生命周期会在父组件重新渲染时被调用，无论其 props 是否和之前有不同。由于这一原因，总是_无条件_地使用这些生命周期重载状态是不安全的。**这么做可能会导致更新状态的丢失。**

考虑一个描述了这一问题的例子。有一个将 email prop 复制到状态的 `EmailInput` 的组件：

```js
class EmailInput extends Component {
  state = { email: this.props.email };

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />;
  }

  handleChange = event => {
    this.setState({ email: event.target.value });
  };

  componentWillReceiveProps(nextProps) {
    // This will erase any local state updates!
    // Do not do this.
    this.setState({ email: nextProps.email });
  }
}
```

首先，该组件看起来没问题。状态通过特定的 prop 进行初始化并当我们在 `<input>` 中输入时进行更新。但如果我们组件的父元素重渲，任何我们在 `<input>` 中的输入都将丢失！（[查看这一例子。](https://codesandbox.io/s/m3w9zn1z8x)）即使我们在重置前对 `nextProps.email !== this.state.email` 进行比较，仍返回真。

在这一例子中，增加 `shouldComponentUpdate` 方法保证当且仅当 email prop 发生变更时才进行重渲可能能修复该问题。然而在实践中，组件通常可以接受多个 props；另一个 prop 的变更仍会导致重渲并进行错误的重置。函数和对象类型的 props 常通过内联的形式创建，使得其很难实现一个可靠的 `shouldComponentUpdate` 保证当且仅当元素变更时才返回真值。[这一例子描述了具体的内容。](https://codesandbox.io/s/jl0w6r9w59)最终，`shouldComponentUpdate` 最好用于性能优化，而不是保证派生状态的正确性。

希望现在对于为何**无条件地将 prop 复制到状态是个糟糕的理念**已经解释清楚了。在回顾可行的解决方案前，先来看一个相关的问题模式：要是我们仅在 email prop 发生变更时才更新如何？

### 反模式：当 props 更新时擦除状态

继续之前的例子，我们可以仅当 `props.email` 变更时进行更新来避免意外的擦除状态：

```js
class EmailInput extends Component {
  state = {
    email: this.props.email
  };

  componentWillReceiveProps(nextProps) {
    // Any time props.email changes, update state.
    if (nextProps.email !== this.props.email) {
      this.setState({
        email: nextProps.email
      });
    }
  }
  
  // ...
}
```

> 注意
>
> 即使之前的例子展示了 `componentWillReceiveProps`，其和使用 `getDerivedStateFromProps` 一样是反模式。

我们做了一个巨大的提升。现在我们的组件仅当 props 真的改变时才会擦除我们的输入。

这仍然存在一个潜在的问题。想象一个使用了之前输入框组件的密码管理应用。当定位到了使用相同邮箱的两个账户，输入框将无法进行重设。这是由于两个账户传递给组件的值都是相同的！这可能会让用户感到诧异，由于碰巧使用了相同的邮箱，对于一个账户的不安全变更的出现会影响到其他账户。（[点击查看案例。](https://codesandbox.io/s/mz2lnkjkrx)）

这一设计存在潜在的缺陷，但却很容易犯。（[我自己也曾出错过！](https://twitter.com/brian_d_vaughn/status/959600888242307072)）幸运的是有两种替代方案效果更好。二者的关键在于 **对于数据的任何部分，你需要保证其是一个组件唯一数据源，并避免将其复制给其他组件。**现在来看一下每种替代的方案。

## 更好的解决方案

### 推荐方案：完全受控组件

一种可以避免之前提到的问题的方式是将状态从我们的组件中完全移除。如果邮箱地址仅作为 prop 存在，而后我们就不需要担心和状态产生冲突的问题。我们甚至可以将 `EmailInput` 变为一个轻量的函数组件：

```js
function EmailInput(props) {
  return <input onChange={props.onChange} value={props.email} />;
}
```

这一方法简化了我们的组件实现，但如果仍想要保存一个临时的值，现在需要父组件去手动进行调整。（[点击查看这一模式示例。](https://codesandbox.io/s/7154w1l551)）

### 推荐方案：带 `key` 的完全不受控组件

另一个对于我们组件来说可行的替代方案是完全由我们的组件来“定义” email 状态。在这一情况下，我们的组件仍接受一个 prop 作为_初始_值，但其会忽略该 prop 可能的变更：

```js
class EmailInput extends Component {
  state = { email: this.props.defaultEmail };

  handleChange = event => {
    this.setState({ email: event.target.value });
  };

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />;
  }
}
```

为了保证当传入一个不同的内容时能重设该值（类似我们的密码管理器的场景），我们可以使用一个被称为 `key` 的特殊的 React 特性。当一个 `key` 变更时，React 将 [_创建_一个新的组件实例而不是更新当前组件](/docs/reconciliation.html#keys)。Keys 通常被用于动态列表但也适用于这里的场景。在我们的案例中，我们可以在任意时间上当新用户被选定时使用用户的 ID 重建邮件输入框：

```js
<EmailInput
  defaultEmail={this.props.user.email}
  key={this.props.user.id}
/>
```

每次 ID 的变更，`EmailInput` 都会重新创建且它的内部状态将会被重设为最新的 `defaultEmail` 值。（[点击查看这一模式。](https://codesandbox.io/s/6v1znlxyxn)）通过这一方式，你不必给每个输入框添加一个 `key`。而给整个表单设置一个 `key` 似乎更有意义。每次 key 变更时，所有表单的内部组件将会重建并带有一个最新的初始值。

在大多数场景下，这是最好的处理状态需要变更的方式。

> 注意
>
> 这一方是听上去可能比较慢，但性能上并没有明显的差异。如果该组件包含了繁重的逻辑如通过对比传递给子树的 prop 来进行更新等， 使用 key 甚至会更快。

#### 替代方案 1：通过 ID prop 重置非受控组件

若 `key` 在某些情况下不生效（可能是乳尖在初始化时非常耗时），一个可行但非常笨重的解决方案是在 `getDerivedStateFromeProps` 方法里监听 “userID” 的变更：

```js
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail,
    prevPropsUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (props.userID !== state.prevPropsUserID) {
      return {
        prevPropsUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

如果我们选择了这一方式，其也提供了一种灵活的方式来仅重置我们组件内部的部分状态。（[点击查看这一模式。](https://codesandbox.io/s/rjyvp7l3rq)）

> Note
>
> Even though the example above shows `getDerivedStateFromProps`, the same technique can be used with `componentWillReceiveProps`.

> 注意
>
> 即使之前的例子使用了 `getDerivedStateFromProps`，其同样也可以使用 `componentWillReceiveProps`。

#### 替代方案 2：通过实例方法重置非受控组件

更少见的是，即使没有合适的 ID 作为 `key`，你也需要重置状态。一种解决方案是重设 key 为一个随机值或每次设置一个你期望的自增的数字。另一种可行的替代方案是暴露一个实例方法来强制重置内部状态：

```js
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail
  };

  resetEmailForNewUser(newEmail) {
    this.setState({ email: newEmail });
  }

  // ...
}
```

父表单组件而后可以通过[使用 `ref` 来调用这一方法](/docs/glossary.html#refs)。([点击查看这一例子。](https://codesandbox.io/s/l70krvpykl))

Ref 在特定的情况下非常有用，如这一场景，但通常我们推荐你尽量不要使用。甚至在这一情况，这一强制的方法并不理想，因为会引发两次渲染而不是一次。

-----

### 总结

作为概括，当在设计一个组件时，决定其数据是受控还是非受控非常关键。

让组件变得**可控**，以及在父组件中将两个不同的值进行合并，而不是仅仅尝试将**prop 的值“复制”到状态中**。例如，与其让子组件接受一个“提交”的 `props.value` 并追踪“变更(draft)”的 `state.value`，不如让父组件同时管理 `state.draftValue` 和 `state.committedValue` 并直接控制子组件的值。这让数据流更为直接和可预测。

对于**非受控**组件，如果你尝试当一个特殊的 prop（通常是 ID） 改变时重置状态，通常有以下一些选择：
* **建议：使用 `key` 属性来重置_所有内部状态_。**
* 方案1：监听一些特殊属性的变更（如：`props.userID`），重置_特定的状态_。
* 方案2：可以考虑通过 refs 强制调用实例方法来进行刷新。

## 记忆化（memoization）是否可行？

我们已经看到了派生状态被用于确保在 `render` 方法中仅当输入改变时进行重新计算。这一技术也被认为是 [记忆化](https://en.wikipedia.org/wiki/Memoization)。

对于记忆化来说，使用派生状态并不算糟糕，但通常来说也不算最佳的解决方案。在管理派生状态存在着内涵的复杂性，而这一复杂性随着增加的属性也在不断地提升。例如，如果我们给我们的组件增加了第二个派生状态，而后我们也将在分别跟踪这二者的变更。

现在来看一个接受一个 props 的组件的例子-展示一系列内容的列表-并将与用户输入匹配的查询渲染出来。我们可以用派生状态来存储过滤后的列表：

```js
class Example extends Component {
  state = {
    filterText: "",
  };

  // *******************************************************
  // NOTE: this example is NOT the recommended approach.
  // See the examples below for our recommendations instead.
  // *******************************************************

  static getDerivedStateFromProps(props, state) {
    // Re-run the filter whenever the list array or filter text change.
    // Note we need to store prevPropsList and prevFilterText to detect changes.
    if (
      props.list !== state.prevPropsList ||
      state.prevFilterText !== state.filterText
    ) {
      return {
        prevPropsList: props.list,
        prevFilterText: state.filterText,
        filteredList: props.list.filter(item => item.text.includes(state.filterText))
      };
    }
    return null;
  }

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{this.state.filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

该实现避免了更频繁地重复计算 `filteredList`。但其也更复杂，因为不得不单独地追踪和监测每一个 prop 和状态的变更以为了正确地更新过滤列表。在这一例子中，我们可以通过使用 `PureComponent` 以及将过滤操作放进渲染方法里来进行简化：

```js
// PureComponents only rerender if at least one state or prop value changes.
// Change is determined by doing a shallow comparison of state and prop keys.
class Example extends PureComponent {
  // State only needs to hold the current filter text value:
  state = {
    filterText: ""
  };

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    // The render method on this PureComponent is called only if
    // props.list or state.filterText has changed.
    const filteredList = this.props.list.filter(
      item => item.text.includes(this.state.filterText)
    )

    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

之前提到的方法相较于派生状态的版本要更为的清晰和简单。有时，这对于大型列表来说这一方法就可能不那么好了有可能会比较慢，`PureComponent` 也有可能无法阻止重渲染若另外的 prop 发生了改变。为了处理这些问题，我们可以增加一个记忆化的帮助函数来避免不必要的重新过滤我们的列表项：

```js
import memoize from "memoize-one";

class Example extends Component {
  // State only needs to hold the current filter text value:
  state = { filterText: "" };

  // Re-run the filter whenever the list array or filter text changes:
  filter = memoize(
    (list, filterText) => list.filter(item => item.text.includes(filterText))
  );

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    // Calculate the latest filtered list. If these arguments haven't changed
    // since the last render, `memoize-one` will reuse the last return value.
    const filteredList = this.filter(this.props.list, this.state.filterText);

    return (
      <Fragment> 
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

这一实现则更为简单且和之前派生状态的版本行为一致！

当在使用记忆化时，记住几点限制：

1. 大多数场景，你想要**记忆函数来标记组件实例**。这一行为阻止了组件多个实例通过每一个不同的 key 进行重置。
2. 典型地你想要用一个缓存函数来**限制缓存大小**以避免时不时地内存泄露。（在前一个例子中，我们使用了 `memoize-one`，因为它仅缓存最新的参数和结果。）
3. 如果在每次父组件渲染时 `prop.list` 都重新创建，那么本节提到的所有方法都将不会起作用。但大多数场景下，这一设置是合理的。

## 尾声

真是世界的应用里，组件通常混合了受控和非受控的行为。这是没问题的！如果每一个值都只有一个清晰的来源，则可以避免之前提及的反模式。

值得重申的是 `getDerivedStateFromProps`（通常是派生状态）是一个高级特性，由于其 复杂性应尽可能地避免使用。如果你在使用这些模式中出现了我们未曾提及的问题，可以通过 [Github](https://github.com/reactjs/reactjs.org/issues/new) 或 [Tiwtter](https://twitter.com/reactjs) 与我们分享！
