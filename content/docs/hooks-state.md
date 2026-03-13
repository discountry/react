---
id: hooks-state
title: Using the State Hook
permalink: docs/hooks-state.html
next: hooks-effect.html
prev: hooks-overview.html
---

*Hooks* is a new feature proposal that lets you use state and other React features without writing a class. They're currently in React v16.7.0-alpha and being discussed in [an open RFC](https://github.com/reactjs/rfcs/pull/68).

*Hooks* 是一个新的特性（提案）用来在不书写class的情况下处理组件的状态. 已经部署在最新的React v16.7.0-alpha版本中，这里有关于它的讨论 [an open RFC](https://github.com/reactjs/rfcs/pull/68).

The [previous page](/docs/hooks-intro.html) introduced Hooks with this example:
下面这一页介绍了Hooks的一个示例 
```js{4-5}
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

We'll start learning about Hooks by comparing this code to an equivalent class example.
我们通过比较类声明组件的方式和函数声明的方式来学习Hooks.
## Equivalent Class Example
## 这是一个等价的类声明的组件
If you used classes in React before, this code should look familiar:

```js
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
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

The state starts as `{ count: 0 }`, and we increment `state.count` when the user clicks a button by calling `this.setState()`. We'll use snippets from this class throughout the page.
这个状态从`{ count: 0 }`开始，然后在用户点击按钮的时候通过`this.setState()`增加 `state.count`，我们将在这一整页中使用这个代码段。
>Note
>
>You might be wondering why we're using a counter here instead of a more realistic example. This is to help us focus on the API while we're still making our first steps with Hooks.

>注意
>
>你可能疑惑为什么我们要使用counter而不是一个更实际的例子，因为我们现在的目的是集中讨论使用钩子的第一步，它的API

## Hooks and Function Components

As a reminder, function components in React look like this:
## Hooks和函数式组件

提醒一下，React函数组件是这个样子

```js
const Example = (props) => {
  // You can use Hooks here!
  return <div />;
}
```

或者:

```js
function Example(props) {
  // You can use Hooks here!
  return <div />;
}
```

You might have previously known these as "stateless components". We're now introducing the ability to use React state from these, so we prefer the name "function components".

Hooks **don't** work inside classes. But you can use them instead of writing classes.
你可能之前使用过无状态组件，而现在要讨论的是在这里使用React的state，所以更适合叫“函数式组件”.

Hooks 在class声明中**无法使用**，但是你可以使用它来代替类声明
## What's a Hook?

Our new example starts by importing the `useState` Hook from React:
## 什么是Hook

我们的例子是通过从React中导入一个 `useState` 钩子来开始的。
```js{1}
import { useState } from 'react';

function Example() {
  // ...
}
```

**What is a Hook?** A Hook is a special function that lets you "hook into" React features. For example, `useState` is a Hook that lets you add React state to function components. We'll learn other Hooks later.

**什么是钩子函数？**钩子函数是一个简单的函数，它允许你 “钩入” （hook into）React的特性，例如，`useState`是一个允许你在函数式组件中使用React的状态特性的钩子
**When would I use a Hook?** If you write a function component and realize you need to add some state to it, previously you had to convert it to a class. Now you can use a Hook inside the existing function component. We're going to do that right now!
**我该在什么时候使用钩子函数？**如果你编写了一个函数式组件，并且意识到你需要在上面添加一些必要的状态的时候使用它，当然，你必须从类声明中转变过来，现在你可以在已经存在的函数式组件中使用钩子函数(Hook)，我们现在就开始。
>Note:
>
>There are some special rules about where you can and can't use Hooks within a component. We'll learn them in [Rules of Hooks](/docs/hooks-rules.html).

>注意:
>
>有一些特殊的规则，你在组件的某些地方不可以使用钩子函数[Rules of Hooks](/docs/hooks-rules.html).
## Declaring a State Variable

In a class, we initialize the `count` state to `0` by setting `this.state` to `{ count: 0 }` in the constructor:

## 声明一个状态变量

在类中的构造函数里面，我们通过设置`this.state`为`{count:0}`,从而初始化`count`状态为`0`
```js{4-6}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
```

In a function component, we have no `this`, so we can't assign or read `this.state`. Instead, we call the `useState` Hook directly inside our component:

在一个函数式组件中，我们没有`this`，所以不用赋值或者读取`this.state`,与之相对应的，我们直接在组件中调用`useState`这个钩子函数

```js{4,5}
import { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
```

**What does calling `useState` do?** It declares a "state variable". Our variable is called `count` but we could call it anything else, like `banana`. This is a way to "preserve" some values between the function calls — `useState` is a new way to use the exact same capabilities that `this.state` provides in a class. Normally, variables "disappear" when the function exits but state variables are preserved by React.
**这个叫做`useState`的东西做了什么** 它声明了一个"状态变量",此时我们的变量叫做`count`，当然我们也可以给它任意取一个名字，像“香蕉”“苹果”什么的，这是一种在函数调用中保存值的手段————`useState`是一个新的方法来实现`this.state`在class中所实现的相同的功能，通常情况下，变量在函数调用之后会"消失"，但是在这里，React会将变量保存在自身。
**What do we pass to `useState` as an argument?** The only argument to the `useState()` Hook is the initial state. Unlike with classes, the state doesn't have to be an object. We can keep a number or a string if that's all we need. In our example, we just want a number for how many times the user clicked, so pass `0` as initial state for our variable. (If we wanted to store two different values in state, we would call `useState()` twice.)
**如何通过`useState`来传递参数？**`useState`钩子唯一的参数就是初始化参数，不像在类组件中，函数式组件中的状态不是一个对象，如果需要的话，我们可以保存一个数字，或者一个字符串，在这个示例中，我们刚刚想要一个数字来显示用户点击的次数，所以设置`0`作为初始化状态（如果想要存储两个不同的值，必须再调一次`useState()`）
**What does `useState` return?** It returns a pair of values: the current state and a function that updates it. This is why we write `const [count, setCount] = useState()`. This is similar to `this.state.count` and `this.setState` in a class, except you get them in a pair. If you're not familiar with the syntax we used, we'll come back to it [at the bottom of this page](/docs/hooks-state.html#tip-what-do-square-brackets-mean).
**使用`useState`得到什么？**它会返回一对值：变化的状态变量和一个用来更新该状态的函数，也就是我们编写的`const [count, setCount] = useState()`,如果你对使用的语法不熟悉，可以返回[页面顶部](/docs/hooks-state.html#tip-what-do-square-brackets-mean).
Now that we know what the `useState` Hook does, our example should make more sense:
现在，已经知道了`useState`钩子的作用，我们的例子就更有意义了
```js{4,5}
import { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
```

We declare a state variable called `count`, and set it to `0`. React will remember its current value between re-renders, and provide the most recent one to our function. If we want to update the current `count`, we can call `setCount`.
我们声明了一个状态变量，名字是`count`，设置它的值是`0`，React会在重新渲染的时候记得它的值，提供最新的一个给函数，如果我们想要更新变化的`count`，直接调用`setCount。`
>Note
>
>You might be wondering: why is `useState` not named `createState` instead?
>
>"Create" wouldn't be quite accurate because the state is only created the first time our component renders. During the next renders, `useState` gives us the current state. Otherwise it wouldn't be "state" at all! There's also a reason why Hook names *always* start with `use`. We'll learn why later in the [Rules of Hooks](/docs/hooks-rules.html).
>注意
>
>你可能会疑惑：为什么`useState`不叫做`createState`?
>
>“创建”(create)不太准确，因为状态只在第一次渲染的时候创建，在接下来的渲染过程中，`useState`返回的是变化后的值，另外，它已经不再是"状态"，还有很多理由说明为何使用`use`，我们会在后面了解更多相关的信息[Rules of Hooks](/docs/hooks-rules.html).

## Reading State

When we want to display the current count in a class, we read `this.state.count`:
## 渲染状态

当我们想要在类组件中展示变化的count，我们读取`this.state.count`:
```js
  <p>You clicked {this.state.count} times</p>
```

In a function, we can use `count` directly:
在函数中，我们可以直接使用`count`

```js
  <p>You clicked {count} times</p>
```

## Updating State
## 更新状态
In a class, we need to call `this.setState()` to update the `count` state:
在类中，我们需要调用`this.setState()`来更新`count`
```js{1}
  <button onClick={() => this.setState({ count: this.state.count + 1 })}>
    Click me
  </button>
```

In a function, we already have `setCount` and `count` as variables so we don't need `this`:
在函数中，我们已经有了`setCount`和`count`作为变量，所以我们不需要`this`
```js{1}
  <button onClick={() => setCount(count + 1)}>
    Click me
  </button>
```

## Recap
## 重申
Let's now **recap what we learned line by line** and check our understanding.
我们现在重新来一行一行理解刚才所讲的东西
<!--
  I'm not proud of this line markup. Please somebody fix this.
  But if GitHub got away with it for years we can cheat.
  我对行注释不是很自信，要是谁可以帮我补充一些
-->
```js{1,4,9}
 1:  import { useState } from 'react';
 2: 
 3:  function Example() {
 4:    const [count, setCount] = useState(0);
 5:
 6:    return (
 7:      <div>
 8:        <p>You clicked {count} times</p>
 9:        <button onClick={() => setCount(count + 1)}>
10:         Click me
11:        </button>
12:      </div>
13:    );
14:  }
```

* **Line 1:** We import the `useState` Hook from React. It lets us keep local state in a function component.
* **Line 1:** 我们从React中导入`useState`钩子，它让我们将函数中的状态保存起来
* **Line 4:** Inside the `Example` component, we declare a new state variable by calling the `useState` Hook. It returns a pair of values, to which we give names. We're calling our variable `count` because it holds the number of button clicks. We initialize it to zero by passing `0` as the only `useState` argument. The second returned item is itself a function. It lets us update the `count` so we'll name it `setCount`.
* **Line4:** 在`Example`组件中，我们通过`useState`声明了一个新的状态变量，它返回一对我们给定的值，我们把`count`定义为按钮点击的次数，初始化为零，写在`useState`的参数中，第二个值是一个函数，用来更新我们`count`。
* **Line 9:** When the user clicks, we call `setCount` with a new value. React will then re-render the `Example` component, passing the new `count` value to it.
* **Line9:** 在用户点击的时候，调用`setCount`传入一个新的值，React会重新渲染`Examole`组件，同一时刻分配这个更新后的`count`值
This might seem like a lot to take in at first. Don't rush it! If you're lost in the explanation, look at the code above again and try to read it from top to bottom. We promise that once you try to "forget" how state works in classes, and look at this code with fresh eyes, it will make sense.
这个看起来挺不容易理解的，但是不要着急，如果你对某些地方感觉还需要理清思路，重复阅读上面的代码，我们保证，一旦你试图将脑海中class声明的`this.state`的方式去除掉，再理解起来，就会很非常轻松。
### Tip: What Do Square Brackets Mean?
### 小技巧：方括号是什么意思
You might have noticed the square brackets when we declare a state variable:
你也许注意到变量声明时候的方括号
```js
  const [count, setCount] = useState(0);
```

The names on the left aren't a part of the React API. You can name your own state variables:
变量的声明不是ReactAPI的一部分，你可以命名自己的变量
```js
  const [fruit, setFruit] = useState('banana');
```

This JavaScript syntax is called ["array destructuring"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring). It means that we're making two new variables `fruit` and `setFruit`, where `fruit` is set to the first value returned by `useState`, and `setFruit` is the second. It is equivalent to this code:
这个语法是ES6中的解构赋值["array destructuring"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring)，表示我们定义了两个变量`fruit`和`setFruit`，`fruit`被设置为`useState`的第一个值，`setFruit`是第二个，等价于下代码
```js
  var fruitStateVariable = useState('banana'); // Returns a pair
  var fruit = fruitStateVariable[0]; // First item in a pair
  var setFruit = fruitStateVariable[1]; // Second item in a pair
```

When we declare a state variable with `useState`, it returns a pair — an array with two items. The first item is the current value, and the second is a function that lets us update it. Using `[0]` and `[1]` to access them is a bit confusing because they have a specific meaning. This is why we use array destructuring instead.
当我们使用`useState`声明状态变量，它返回一对，带有两个值的数组，第一个参数是变化的状态值，第二个是用来更新该状态的函数，使用`[0]`和`[1]`来访问会有一些困惑，因为它们有特定的含义，所以我们使用解构赋值来代替。
>Note
>
>You might be curious how React knows which component `useState` corresponds to since we're not passing anything like `this` back to React. We'll answer [this question](/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components) and many others in the FAQ section.
>注意
>
>你可能感到好奇，为何React知道哪个组件的`useState`，因为我们并没有将this之类的东西传递给React，在这里可以找到答案[this question](/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components) and many others in the FAQ section.
### Tip: Using Multiple State Variables
### 小技巧：使用多个状态变量
Declaring state variables as a pair of `[something, setSomething]` is also handy because it lets us give *different* names to different state variables if we want to use more than one:
声明状态变量的一对值`[something, setSomething]`是很容易的，因为我们使用的是不同的命名，不同的名字返回更多的状态变量
```js
function ExampleWithManyStates() {
  // Declare multiple state variables!
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
```

In the above component, we have `age`, `fruit`, and `todos` as local variables, and we can update them individually:
在下面的这个组件中，有年龄，水果，待办事项，作为本地变量，我们可以分别声明它们
```js
  function handleOrangeClick() {
    // Similar to this.setState({ fruit: 'orange' })
    setFruit('orange');
  }
```

You **don't have to** use many state variables. State variables can hold objects and arrays just fine, so you can still group related data together. However, unlike `this.setState` in a class, updating a state variable always *replaces* it instead of merging it.
你 **不必** 使用很多状态变量，状态变量可以保持一个对象和一个数组，你也可以将相关联的数据组合到一起，然而，不像类中的`this.setState`，更新一个状态的值总是需要*替换*它，而不是合并它
We provide more recommendations on splitting independent state variables [in the FAQ](/docs/hooks-faq.html#should-i-use-one-or-many-state-variables).
我们提供了更多的分离状态的推荐[in the FAQ](/docs/hooks-faq.html#should-i-use-one-or-many-state-variables).
## Next Steps
## 下一步
On this page we've learned about one of the Hooks provided by React, called `useState`. We're also sometimes going to refer to it as the "State Hook". It lets us add local state to React function components -- which we did for the first time ever! 
在这里我们已经学会了React提供的Hooks，叫做`useState`，我们有时候也将它称为“状态钩子”，它让我们添加一个本地的状态给React的函数组件，就像之前那样。
We also learned a little bit more about what Hooks are. Hooks are functions that let you "hook into" React features from function components. Their names always start with `use`, and there are more Hooks we haven't seen yet.
我们已经学会了一些关于钩子函数的东西，钩子函数是一个在函数式组件中使用React状态特性的函数，它们的名字通常以`use`开头，有更多的钩子函数我们会在后面看见。
**Now let's continue by [learning the next Hook: `useEffect`.](/docs/hooks-effect.html)** It lets you perform side effects in components, and is similar to lifecycle methods in classes.
**接下来我们继续下一部分[learning the next Hook: `useEffect`.](/docs/hooks-effect.html)**它允许你在组件中使用一些副作用，类似于class中的生命周期函数。
