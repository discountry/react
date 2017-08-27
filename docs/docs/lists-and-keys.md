---
id: lists-and-keys
title: 列表 & Keys
permalink: docs/lists-and-keys.html
prev: conditional-rendering.html
next: forms.html
---

首先，让我们看下在Javascript中如何转化列表

如下代码，我们使用[`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)函数让数组中的每一项翻倍,我们得到了一个新的数列`doubled`

```javascript{2}
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
```

代码打印出`[2, 4, 6, 8, 10]`

在React中，把数组转化为数列[元素](/react/docs/rendering-elements.html)的过程是相似的

### 渲染多样的组件

你可以通过使用`{}`在JSX内构建一个[元素集合](/react/docs/introducing-jsx.html#embedding-expressions-in-jsx)

下面，我们使用Javascript中的[`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)方法循遍历`numbers`数组。对数组中的每个元素返回`<li>`标签，最后我们得到一个数组`listItems`

```javascript{2-4}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```

我们把整个`listItems`插入到`ul`元素中，然后[渲染进DOM](/react/docs/rendering-elements.html#rendering-an-element-into-the-dom):

```javascript{2}
ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);
```

[在 CodePen 上试试。](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)

这段代码生成了一个1到5的数字列表

### 基础列表组件

通常你需要渲染一个列表到[组件](/react/docs/components-and-props.html)中

我们可以把前面的例子重构成一个组件。这个组件接收`numbers`数组作为参数，输出一个无序列表。


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

当我们运行这段代码，将会看到一个警告`a key should be provided for list items`,意思是当你创建一个元素时，必须包括一个特殊的`key`属性。我们将在下一节讨论这是为什么。

让我们来给每个列表元素分配一个`key`来解决上面的那个警告

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

[在 CodePen 上试试。](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)

## Keys

Keys可以在DOM中的某些元素被增加或删除的时候帮助React识别哪些元素发生了变化。因此你应当给数组中的每一个元素赋予一个确定的标识。

```js{3}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```
一个元素的key最好是这个元素在列表中拥有的一个独一无二的字符串。通常，我们使用来自数据的id作为元素的key:

```js{2}
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

当元素没有确定的id时，你可以使用他的序列号索引index作为key

```js{2,3}
const todoItems = todos.map((todo, index) =>
  // Only do this if items have no stable IDs
  <li key={index}>
    {todo.text}
  </li>
);
```


如果列表可以重新排序，我们不建议使用索引来进行排序，因为这会导致渲染变得很慢。如果你想要了解更多，请点击[深度解析key的必要性](/react/docs/reconciliation.html#recursing-on-children)

### 用keys提取组件

元素的key只有在它和它的兄弟节点对比时才有意义。

比方说，如果你提取出一个`ListItem`组件，你应该把key保存在数组中的这个`<ListItem />`元素上，而不是放在`ListItem`组件中的`<li>`元素上。

**错误的示范**

```javascript{4,5,14,15}
function ListItem(props) {
  const value = props.value;
  return (
    // 错啦！你不需要在这里明确key:
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    //错啦！元素的key应该在这里明确：
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
  // 对啦！这里不需要明确出key:
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // 又对啦！key应该在数组中被明确出来
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

[在 CodePen 上试试。](https://codepen.io/rthor/pen/QKzJKG?editors=0010)

当你在`map()`方法内部调用的元素时，你最好随时记得为每一个元素加上一个独一无二的`key`。

### 元素的key在他的兄弟元素之间应该唯一

数组元素中使用的key在其兄弟之间应该是独一无二的。然而，它们不需要是全局唯一的。当我们生成两个不同的数组时，我们可以使用相同的键

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

[在 CodePen 上试试。](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)

key会作为给React的提示，但不会传递给你的组件。如果您的组件中需要使用和`key`相同的值，请将其作为属性传递：

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

[在 CodePen 上试试。](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)

这么做有时可以使你的代码更清晰，但有时这种风格也会被滥用。就像在JavaScript中一样，何时需要为了可读性提取出一个变量，这完全取决于你。但请记住，如果一个`map()`嵌套了太多层级，那可能就是你[提取出组件](/reactions / docs / components-and-props.html＃extract-components)的一个好时机。
