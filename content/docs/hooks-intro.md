---
id: hooks-intro
title: Introducing Hooks
permalink: docs/hooks-intro.html
next: hooks-overview.html
---

*Hooks*是React v16.7.0-alpha中加入的新特性。它可以让你在class以外使用state和其他React特性。你可以在[这里](https://github.com/reactjs/rfcs/pull/68)看到关于它的一些讨论。

```js{4,5}
import { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

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

`useState`这个方法是我们接触到的第一个"hook"。我们用它完成了一个最简单的组件，接下来我们会看到更多有趣的应用。

**你可以立即跳到[下一页](/docs/hooks-overview.html)开始学习Hooks。** 在这一页，我们将继续解释为什么我们要在React中引入Hooks，以及它们将如何帮助你写出超棒的React应用。

## 视频介绍

在React Conf 2018，Sophie Alpert 和 Dan Abramov介绍了Hooks，然后Ryan Florence演示了如何用它们重构我们的应用。你可以在这里看到这个视频：

<br>

<iframe width="650" height="366" src="//www.youtube.com/embed/dpw9EHDh2bM" frameborder="0" allowfullscreen></iframe>

## No Breaking Changes

在我们继续学习之前，你需要注意：

* **完全可选** 如果你喜欢Hooks，你可以立即在一些组件和已经存在的代码中使用它们。不过如果你不喜欢也不要紧，你完全没必要学习或者使用它们。
* **100% 向后兼容** Hooks不包含任何爆炸性的更新。
* **立即可用** Hooks现在已经包含在alpha版本中。而且我们期望在接受社区反馈后把他们加入到React 16.7版本中。

**classes不会被移除** 你可以在这一页的[最后一节](#gradual-adoption-strategy) )读到更多关于Hooks的渐进策略。

**Hooks不会影响你对React的理解** 恰恰相反，Hooks为React的这些概念提供了更直接的API。之后你将会看到，有了Hooks，你可以以一种更加强大的方式将props, state, context, refs 和生命周期整合起来。

**如果你只是想要学学Hooks如何使用，你可以直接跳到[下一页](/docs/hooks-overview.html)。** 当然你也可以继续读这一页。你将会在这里了解到更多我们引入Hooks的原因，以及要如何在已有的代码上使用Hooks重构我们的应用。

## 动机

Hooks解决了我们在React发布至今的五年来遇到的一系列看似不相关的问题。不论你是刚刚开始学习React，或是一直在用它，甚至你只是在使用与React具有相似组件模型的框架，你一定或多或少注意到这些问题。

### 跨组件复用包含状态的逻辑十分困难

React没有提供一种将可复用的行为“attach”到组件上的方式（比如redux的connect方法）。如果你已经使用了一段时间的React，你可能对[render props](/docs/render-props.html) 和 [高阶组件](/docs/higher-order-components.html)有一定的了解，它们的出现就是为了解决逻辑复用的问题。但是这些模式都要求你重新构造你的组件，这可能会非常麻烦。在很多典型的React组件中，你可以在React DevTool里看到我们的组件被层层叠叠的providers, consumers, higher-order components, render props, 和其他抽象层。当然你可以通过[筛选功能](https://github.com/facebook/react-devtools/pull/503)把它们全部都过滤掉，但是这种现象也指出了一些更深层次的问题：React需要一些更好的底层元素来复用含状态的逻辑

With Hooks, you can extract stateful logic from a component so it can be tested independently and reused. **Hooks allow you to reuse stateful logic without changing your component hierarchy.** This makes it easy to share Hooks among many components or with the community.

We'll discuss this more in [Building Your Own Hooks](/docs/hooks-custom.html).

### Complex components become hard to understand

We've often had to maintain components that started out simple but grew into an unmanageable mess of stateful logic and side effects. Each lifecycle method often contains a mix of unrelated logic. For example, components might perform some data fetching in `componentDidMount` and `componentDidUpdate`. However, the same `componentDidMount` method might also contain some unrelated logic that sets up event listeners, with cleanup performed in `componentWillUnmount`. Mutually related code that changes together gets split apart, but completely unrelated code ends up combined in a single method. This makes it too easy to introduce bugs and inconsistencies.

In many cases it's not possible to break these components into smaller ones because the stateful logic is all over the place. It's also difficult to test them. This is one of the reasons many people prefer to combine React with a separate state management library. However, that often introduces too much abstraction, requires you to jump between different files, and makes reusing components more difficult.

To solve this, **Hooks let you split one component into smaller functions based on what pieces are related (such as setting up a subscription or fetching data)**, rather than forcing a split based on lifecycle methods. You may also opt into managing the component's local state with a reducer to make it more predictable.

We'll discuss this more in [Using the Effect Hook](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns).

### Classes confuse both people and machines

In our observation, classes are the biggest barrier to learning React. You have to understand how `this` works in JavaScript, which is very different from how it works in most languages. You have to remember to bind the event handlers. Without unstable [syntax proposals](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/), the code is very verbose. People can understand props, state, and top-down data flow perfectly well but still struggle with classes. The distinction between function and class components in React and when to use each one leads to disagreements even between experienced React developers.

Additionally, React has been out for about five years, and we want to make sure it stays relevant in the next five years. As [Svelte](https://svelte.technology/), [Angular](https://angular.io/), [Glimmer](https://glimmerjs.com/), and others show, [ahead-of-time compilation](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) of components has a lot of future potential. Especially if it's not limited to templates. Recently, we've been experimenting with [component folding](https://github.com/facebook/react/issues/7323) using [Prepack](https://prepack.io/), and we've seen promising early results. However, we found that class components can encourage unintentional patterns that make these optimizations fall back to a slower path. Classes present issues for today's tools, too. For example, classes don't minify very well, and they make hot reloading flaky and unreliable. We want to present an API that makes it more likely for code to stay on the optimizable path.

To solve these problems, **Hooks let you use more of React's features without classes.** Conceptually, React components have always been closer to functions. Hooks embrace functions, but without sacrificing the practical spirit of React. Hooks provide access to imperative escape hatches and don't require you to learn complex functional or reactive programming techniques.

>Examples
>
>[Hooks at a Glance](/docs/hooks-overview.html) is a good place to start learning Hooks.

## Gradual Adoption Strategy

>**TLDR: There are no plans to remove classes from React.**

We know that React developers are focused on shipping products and don't have time to look into every new API that's being released. Hooks are very new, and it might be better to wait for more examples and tutorials before considering learning or adopting them.

We also understand that the bar for adding a new primitive to React is extremely high. For curious readers, we have prepared a [detailed RFC](https://github.com/reactjs/rfcs/pull/68) that dives into motivation with more details, and provides extra perspective on the specific design decisions and related prior art.

**Crucially, Hooks work side-by-side with existing code so you can adopt them gradually.** We are sharing this experimental API to get early feedback from those in the community who are interested in shaping the future of React — and we will iterate on Hooks in the open.

Finally, there is no rush to migrate to Hooks. We recommend avoiding any "big rewrites", especially for existing, complex class components. It takes a bit of a mindshift to start "thinking in Hooks". In our experience, it's best to practice using Hooks in new and non-critical components first, and ensure that everybody on your team feels comfortable with them. After you give Hooks a try, please feel free to [send us feedback](https://github.com/facebook/react/issues/new), positive or negative.

We intend for Hooks to cover all existing use cases for classes, but **we will keep supporting class components for the foreseeable future.** At Facebook, we have tens of thousands of components written as classes, and we have absolutely no plans to rewrite them. Instead, we are starting to use Hooks in the new code side by side with classes.

## Next Steps

By the end of this page, you should have a rough idea of what problems Hooks are solving, but many details are probably unclear. Don't worry! **Let's now go to [the next page](/docs/hooks-overview.html) where we start learning about Hooks by example.**
