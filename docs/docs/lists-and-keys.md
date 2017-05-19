---
id: lists-and-keys
title: 列表 & Keys
permalink: docs/lists-and-keys.html
prev: conditional-rendering.html
next: forms.html
---

首先，让我们看下在Javascript中如何转化列表

如下代码，我们使用[`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)函数让数组中的每一项翻倍,我们得到了一个新的数列`doubled`

```
javascript{2}
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
```

This code logs `[2, 4, 6, 8, 10]` to the console.
代码打印出`[2, 4, 6, 8, 10]`

在React中，把数组转化为数列[元素](/react/docs/rendering-elements.html)是相似的

### 渲染多样的组件

你可以构建一个元素集合[包括在JSX内](/react/docs/introducing-jsx.html#embedding-expressions-in-jsx)通过使用`{}`

下面，我们使用Javascript中的[`map()``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)方法循遍历`numbers`数组。对数组中的每个元素返回`<li>`标签，最后我们得到一个数组`listItems`

```javascript{2-4}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```

我们把整个`listTtems`数组插入到`ul`元素中，然后[渲染进DOM](/react/docs/rendering-elements.html#rendering-an-element-into-the-dom):

```javascript{2}
ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)

这段代码显示了1到5之间的数字列表

### 基础列表组件

通常你需要渲染一个列表到[组件](/react/docs/components-and-props.html)中

前面的例子我们可以重构成一个组件,接受`numbers`,输出数组元素的无序列表。


```javascript{3-5,7,13}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

当我们运行这段代码，将会看到一个警告`a key should be provided for list items`,意思是当你创建一个元素时，必须包括一个特殊的`key`属性。我们将在下一节讨论这是为什么？

让我们来给每个列表元素分配一个`key`来解决是上面那个警告

```javascript{4}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)

## Keys

Keys帮助React识别哪个元素变化了，被增加或删除。Key应该被赋予数组内的元素一个稳定的标识

```js{3}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

选择key的最佳方法是使用一个字符串，该字符串在其兄弟节点中唯一。通常，会使用来自数据的id作为key:

```js{2}
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

当元素没有确定的Ids，你可以使用他的序列号索引index作为key

```js{2,3}
const todoItems = todos.map((todo, index) =>
  // Only do this if items have no stable IDs
  <li key={index}>
    {todo.text}
  </li>
);
```


如果项目可以重新排序，我们不建议使用索引来进行排序，因为那样会很慢。感兴趣戳这里[深度解析key的必要性](/react/docs/reconciliation.html#recursing-on-children)

### 用keys提取组件

keys只有在周围数组的上下文中才有意义

举例，如果你[取出](/react/docs/components-and-props.html#extracting-components)包括一个`listItem`组件，那么应该将该键保存在数组中的`<ListItem />`元素中而不是`ListItem`本身的根元素

**不正确的使用方式**

```javascript{4,5,14,15}
function ListItem(props) {
  const value = props.value;
  return (
    // Wrong! There is no need to specify the key here:
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Wrong! The key should have been specified here:
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```


**key的正确使用方式**

```javascript{2,3,9,10}
function ListItem(props) {
  // Correct! There is no need to specify the key here:
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Correct! Key should be specified inside the array.
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/rthor/pen/QKzJKG?editors=0010)

一个好的经验法则是,`map()`内部的元素调用需要key

### keys必须唯一

数组中使用的key在其兄弟之间应该是独一无二的。然而，它们不需要是全局唯一的。当我们生成两个不同的数组时，我们可以使用相同的键

```js{2,5,11,12,19,21}
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
  {id: 2, title: 'Installation', content: 'You can install React from npm.'}
];
ReactDOM.render(
  <Blog posts={posts} />,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)

key作为React的提示，但不会传递给你的组件。如果您的组件中需要相同的值，请将其作为属性传递：

```js{3,4}
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);
```

上面例子中，`Post`组件可以读出`props.id`，但是不能读出`props.key`

### 在jsx中嵌入map()

在上面的例子中，我们声明了一个单独的`listItems`变量并将其包含在JSX中

```js{3-6}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

JSX允许在大括号中[嵌入任何表达式](/ reactions / docs / introduction-jsx.html＃embedding-expressions-in-jsx)，所以我们可以在`map()`中这样使用：
```js{5-8}
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)

有时这会导致更清晰的代码，但这种风格也可能被滥用。像JavaScript一样，由你决定是否值得提取可变性的变量。请记住，如果`map()`主体太嵌套，那么可能是[提取组件](/ reactions / docs / components-and-props.html＃extract-components)的好时机。





