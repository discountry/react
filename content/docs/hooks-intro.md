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

**classes不会被移除** 你可以在这一页的[最后一节](#gradual-adoption-strategy)读到更多关于Hooks的渐进策略。

**Hooks不会影响你对React的理解** 恰恰相反，Hooks为React的这些概念提供了更直接的API。之后你将会看到，有了Hooks，你可以以一种更加强大的方式将props, state, context, refs 和生命周期整合起来。

**如果你只是想要学学Hooks如何使用，你可以直接跳到[下一页](/docs/hooks-overview.html)。** 当然你也可以继续读这一页。你将会在这里了解到更多我们引入Hooks的原因，以及要如何在已有的代码上使用Hooks重构我们的应用。

## 动机

Hooks解决了我们在React发布至今的五年来遇到的一系列看似不相关的问题。不论你是刚刚开始学习React，或是一直在用它，甚至你只是在使用与React具有相似组件模型的框架，你一定或多或少注意到这些问题。

### 跨组件复用stateful logic(包含状态的逻辑)十分困难

React没有提供一种将可复用的行为“attach”到组件上的方式（比如redux的connect方法）。如果你已经使用了一段时间的React，你可能对[render props](/docs/render-props.html) 和 [高阶组件](/docs/higher-order-components.html)有一定的了解，它们的出现就是为了解决逻辑复用的问题。但是这些模式都要求你重新构造你的组件，这可能会非常麻烦。在很多典型的React组件中，你可以在React DevTool里看到我们的组件被层层叠叠的providers, consumers, 高阶组件, render props, 和其他抽象层包裹。当然你可以通过[筛选功能](https://github.com/facebook/react-devtools/pull/503)把它们全部都过滤掉，但是这种现象也指出了一些更深层次的问题：React需要一些更好的底层元素来复用stateful logic.

使用Hooks，你可以在将含有state的逻辑从组件中抽象出来，这将可以让这些逻辑容易被测试。同时，**Hooks可以帮助你在不重写组件结构的情况下复用这些逻辑。** 这样这些逻辑就可以跨组件复用，甚至你可以将他们分享到社区中。

我们将在[自定义Hooks](/docs/hooks-custom.html)中继续这一部分的讨论。

### 复杂的组件难以理解

我们在刚开始构建我们的组件时它们往往很简单，然而随着开发的进展它们会变得越来越大、越来越混乱，各种逻辑在组件中散落的到处都是。每个生命周期钩子中都包含了一堆互不相关的逻辑。比如我们常常在`componentDidMount` 和 `componentDidUpdate` 中拉取数据，同时`compnentDidMount` 方法可能又包含一些不相干的逻辑，比如设置事件监听（之后需要在 `componentWillUnmount` 中清除）。最终的结果是强相关的代码被分离，反而是不相关的代码被组合在了一起。这显然会导致大量错误。

在许多情况下，我们也不太可能将这些组件分解成更小的组件，因为stateful logic到处都是。测试它们也很困难。这是许多人喜欢将React与单独的状态管理库结合使用的原因之一。然而，这通常会引入太多的抽象，需要在不同的文件之间跳转，并且使得重用组件更加困难。

为了解决这个问题，**Hooks允许您根据相关部分(例如设置订阅或获取数据)将一个组件分割成更小的函数**，而不是强制基于生命周期方法进行分割。您还可以选择使用一个reducer来管理组件的本地状态，以使其更加可预测。

我们将在[使用Effect Hook](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns)中继续这一部分的讨论。

### 不止是用户，机器也对Classes难以理解

据我们观察，classes是学习React的最大障碍。您必须了解`this`如何在JavaScript中工作，这与它在大多数语言中的工作方式非常不同。必须记住绑定事件处理程序。没有稳定的[语法提案](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/)，代码非常冗长。尽管人们可以很好地理解props、state和自顶向下的数据流，但仍然要与类做斗争。React中功能和类组件的区别以及何时使用每种组件都会导致有经验的React开发人员之间的分歧。

除此以外，React已经发布了五年，我们还想在未来的五年让他保持稳定。就像在[Svelte](https://svelte.technology/), [Angular](https://angular.io/), [Glimmer](https://glimmerjs.com/)和其他框架中展示的那样，组件的提前编译潜力巨大。尤其是在它不局限于模板的时候。最近我们在测试使用[Prepack](https://prepack.io/)来进行[component folding](https://github.com/facebook/react/issues/7323)，而且我们已经初步看到了成果。然而我们发现class组件可能会导致一些让我们做的这些优化白费的编码模式。类也为今天的工具带来了不少的issue。比如，classes不能很好的被minify，同时他们也造成了太多不必要的组件更新。我们想要提供一种便于优化的API。

为了解决这些问题，**Hooks让你可以在classes之外使用更多React的新特性。** 从概念上讲，React组件也是更接近于函数的。Hooks基于函数，但是并不会修改React的基本概念。Hooks在不需要您学习复杂的函数式编程的情况下，为您提供了逃离这些问题的途径。

>Examples
>
>您可以从[Hooks概览](/docs/hooks-overview.html)开始，快速地学习Hooks。

## 渐进策略

>**太长不看版: 我们完全没有把classes从React中移除的打算。**

我们知道React开发者都非常忙。你们可能没有时间去研究我们一个发布的新API。Hooks还非常新，也许你可以等待出现了更多关于它们的示例和教程之后再来学习。

我们也理解添加新的底层API的门槛非常的高。对于感到好奇的读者，我们准备了一份[详细的RFC](https://github.com/reactjs/rfcs/pull/68)来提供更多我们设计Hook的细节和动机，我们设计Hooks时的独特视角，以及更多细节。

**最重要的是，Hooks与现有的代码可以同时工作，所以你完全可以逐步采用它们。** 我们正在分享这个API，以便得到那些对React的未来感兴趣的人们的反馈——我们将在开放的基础上开发Hooks。

最后，您没有必要着急迁移到Hooks。我们建议避免任何“大范围重构”，尤其是对已有的、复杂的class组件。“Thinking in Hooks”需要您进行一些思想上的切换。在我们的经验中，最佳实践是先在新的、非关键性的代码中试用Hooks，并且保证团队里的所有人都喜欢它们。在你试用过Hooks之后，请一定要来[这里](https://github.com/facebook/react/issues/new)给我们提供建议或是意见，我们都非常欢迎。

我们打算用钩子覆盖类的所有现有用例，但是在可预见的将来，我们将继续支持类组件。**在Facebook，我们有成千上万的组件被写成类，我们绝对没有重写它们的计划。相反，我们开始在新代码中与类一起使用钩子。

## 下一步

在这一页的结尾，你应该对Hooks解决了什么样的问题有了一个初步的了解，但是许多细节你可能还不那么清楚。不过不要担心！**让我们去到[下一页](/docs/hooks-overview.html)。在那里我们将会学到更多关于Hooks的例子。** 
