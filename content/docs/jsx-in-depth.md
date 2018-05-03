---
id: jsx-in-depth
title: 深入 JSX
permalink: docs/jsx-in-depth.html
redirect_from:
  - "docs/jsx-spread.html"
  - "docs/jsx-gotchas.html"
  - "tips/if-else-in-JSX.html"
  - "tips/self-closing-tag.html"
  - "tips/maximum-number-of-jsx-root-nodes.html"
  - "tips/children-props-type.html"
  - "docs/jsx-in-depth-zh-CN.html"
  - "docs/jsx-in-depth-ko-KR.html"
---

本质上来讲，JSX 只是为 `React.createElement(component, props, ...children) ` 方法提供的语法糖。比如下面的代码：

```js
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>
```

编译为：

```js
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)
```

如果没有子代，你还可以使用自闭合标签，比如：

```js
<div className="sidebar" />
```

编译为：

```js
React.createElement(
  'div',
  {className: 'sidebar'},
  null
)
```

如果你想彻底验证 JSX 是如何转换为 JavaScript 的，你可以尝试 [在线 Babel 编译器](https://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015%2Creact%2Cstage-0&code=function%20hello()%20%7B%0A%20%20return%20%3Cdiv%3EHello%20world!%3C%2Fdiv%3E%3B%0A%7D).

## 指定 React 元素类型

JSX 的标签名决定了 React 元素的类型。

大写开头的 JSX 标签表示一个 React 组件。这些标签将会被编译为同名变量并被引用，所以如果你使用了 `<Foo />` 表达式，则必须在作用域中先声明 `Foo` 变量。

### React 必须声明

由于 JSX 编译后会调用 `React.createElement` 方法，所以在你的 JSX 代码中必须首先声明 `React` 变量。

比如，下面两个导入都是必须的，尽管 `React` 和 `CustomButton` 都没有在代码中被直接调用。

```js{1,2,5}
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  // 返回 React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```

如果你使用 `<script>` 加载 React，它将作用于全局。

### 点表示法

你还可以使用 JSX 中的点表示法来引用 React 组件。你可以方便地从一个模块中导出许多 React 组件。例如，有一个名为 `MyComponents.DatePicker` 的组件，你可以直接在 JSX 中使用它：

```js{10}
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

### 首字母大写

当元素类型以小写字母开头时，它表示一个内置的组件，如 `<div>` 或 `<span>`，并将字符串 'div' 或 'span' 传 递给 `React.createElement`。 以大写字母开头的类型，如 `<Foo />` 编译为 `React.createElement(Foo)`，并它正对应于你在 JavaScript 文件中定义或导入的组件。

我们建议用大写开头命名组件。如果你的组件以小写字母开头，请在 JSX 中使用之前其赋值给大写开头的变量。

例如，下面的代码将无法按预期运行：

```js{3,4,10,11}
import React from 'react';

// 错误！组件名应该首字母大写:
function hello(props) {
  // 正确！div 是有效的 HTML 标签:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // 错误！React 会将小写开头的标签名认为是 HTML 原生标签:
  return <hello toWhat="World" />;
}
```

为了解决这个问题，我们将 `hello` 重命名为 `Hello`，然后使用 `<Hello />` 引用：

```js{3,4,10,11}
import React from 'react';

// 正确！组件名应该首字母大写:
function Hello(props) {
  // 正确！div 是有效的 HTML 标签:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // 正确！React 能够将大写开头的标签名认为是 React 组件。
  return <Hello toWhat="World" />;
}
```

### 在运行时选择类型

你不能使用表达式来作为 React 元素的标签。如果你的确想通过表达式来确定 React 元素的类型，请先将其赋值给大写开头的变量。这种情况一般会在你想通过属性值条件渲染组件时出现：

```js{10,11}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // 错误！JSX 标签名不能为一个表达式。
  return <components[props.storyType] story={props.story} />;
}
```

要解决这个问题，我们需要先将类型赋值给大写开头的变量。

```js{10-12}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // 正确！JSX 标签名可以为大写开头的变量。
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

## 属性

在 JSX 中有几种不同的方式来指定属性。

### 使用 JavaScript 表达式

你可以传递任何 `{}` 包裹的 JavaScript 表达式作为一个属性值。例如，在这个 JSX 中：

```js
<MyComponent foo={1 + 2 + 3 + 4} />
```

对于 `MyComponent`来说， `props.foo` 的值为 10，这是 `1 + 2 + 3 + 4` 表达式计算得出的。

`if` 语句和 `for` 循环在 JavaScript 中不是表达式，因此它们不能直接在 JSX 中使用，但是你可以将它们放在周围的代码中。

```js{3-7}
function NumberDescriber(props) {
  let description;
  if (props.number % 2 == 0) {
    description = <strong>even</strong>;
  } else {
    description = <i>odd</i>;
  }
  return <div>{props.number} is an {description} number</div>;
}
```

你可以在相关部分中了解有关 [条件渲染](/docs/conditional-rendering.html) 和 [循环](/docs/lists-and-keys.html) 的更多信息。

### 字符串常量

你可以将字符串常量作为属性值传递。下面这两个 JSX 表达式是等价的：

```js
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

当传递一个字符串常量时，该值会被解析为HTML非转义字符串，所以下面两个 JSX 表达式是相同的：

```js
<MyComponent message="&lt;3" />

<MyComponent message={'<3'} />
```

这种行为通常是无意义的，提到它只是为了完整性。

### 默认为 True

如果你没有给属性传值，它默认为 `true`。因此下面两个 JSX 是等价的：

```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

一般情况下，我们不建议这样使用，因为它会与 [ES6 对象简洁表示法](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015) 混淆。比如 `{foo}` 是 `{foo: foo}` 的简写，而不是 `{foo: true}`。这里能这样用，是因为它符合 HTML 的做法。

### 扩展属性

如果你已经有了个 `props` 对象，并且想在 JSX 中传递它，你可以使用 `...` 作为扩展操作符来传递整个属性对象。下面两个组件是等效的：

```js{7}
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```

当你构建通用容器时，扩展属性会非常有用。然而，这样做也可能让很多不相关的属性，传递到不需要它们的组件中使代码变得混乱。我们建议你谨慎使用此语法。

## 子代

在包含开始和结束标签的 JSX 表达式中，标记之间的内容作为特殊的参数传递：`props.children`。有几种不同的方法来传递子代：

### 字符串常量

你可以在开始和结束标签之间放入一个字符串，则 `props.children` 就是那个字符串。这对于许多内置 HTML 元素很有用。例如：

```js
<MyComponent>Hello world!</MyComponent>
```

这是有效的 JSX，并且 `MyComponent` 的 `props.children` 值将会直接是 `"hello world!"`。因为 HTML 未转义，所以你可以像写 HTML 一样写 JSX：

```html
<div>This is valid HTML &amp; JSX at the same time.</div>
```

JSX 会移除空行和开始与结尾处的空格。标签邻近的新行也会被移除，字符串常量内部的换行会被压缩成一个空格，所以下面这些都等价：

```js
<div>Hello World</div>

<div>
  Hello World
</div>

<div>
  Hello
  World
</div>

<div>

  Hello World
</div>
```

### JSX

你可以通过子代嵌入更多的 JSX 元素，这对于嵌套显示组件非常有用：

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

你可以混合不同类型的子元素，同时用字符串常量和 JSX 子元素，这是 JSX 类似 HTML 的另一种形式，这在 JSX 和 HTML 中都是有效的：
```html
<div>
  Here is a list:
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

React 组件也可以通过数组的形式返回多个元素：

```js
render() {
  // 不需要使用额外的元素包裹数组中的元素
  return [
    // 不要忘记 key :)
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```

### JavaScript 表达式

你可以将任何 `{}` 包裹的 JavaScript 表达式作为子代传递。例如，下面这些表达式是等价的：

```js
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```

这对于渲染任意长度的 JSX 表达式的列表很有用。例如，下面将会渲染一个 HTML 列表：

```js{2,9}
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ['finish doc', 'submit pr', 'nag dan to review'];
  return (
    <ul>
      {todos.map((message) => <Item key={message} message={message} />)}
    </ul>
  );
}
```

JavaScript 表达式可以与其他类型的子代混合使用。这通常对于字符串模板非常有用：

```js{2}
function Hello(props) {
  return <div>Hello {props.addressee}!</div>;
}
```

### 函数

通常情况下，插入 JSX 中的 JavaScript 表达式将被认作字符串、React 元素或这些内容的列表。然而，`props.children` 可以像其它属性一样传递任何数据，而不仅仅是 React 元素。例如，如果你使用自定义组件，则可以将调用 `props.children` 来获得传递的子代：

```js{4,13}
// Calls the children callback numTimes to produce a repeated component
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>This is item {index} in the list</div>}
    </Repeat>
  );
}
```

传递给自定义组件的子代可以是任何元素，只要该组件在 React 渲染前将其转换成 React 能够理解的东西。这个用法并不常见，但当你想扩展 JSX 时可以使用。

### 布尔值、Null 和 Undefined 被忽略

`false`、`null`、`undefined` 和 `true` 都是有效的子代，但它们不会直接被渲染。下面的表达式是等价的：

```js
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

这在根据条件来确定是否渲染React元素时非常有用。以下的JSX只会在`showHeader`为`true`时渲染`<Header />`组件。

```js{2}
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

值得注意的是，JavaScript 中的一些 ["falsy" 值](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)(比如数字`0`)，它们依然会被渲染。例如，下面的代码不会像你预期的那样运行，因为当 `props.message` 为空数组时，它会打印`0`:

```js{2}
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

要解决这个问题，请确保 `&&` 前面的表达式始终为布尔值：

```js{2}
<div>
  {props.messages.length > 0 &&
    <MessageList messages={props.messages} />
  }
</div>
```

相反，如果你想让类似 `false`、`true`、`null` 或 `undefined` 出现在输出中，你必须先把它[转换成字符串](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#String_conversion) :

```js{2}
<div>
  My JavaScript variable is {String(myVariable)}.
</div>
```
