---
id: faq-functions
title: 传递函数给组件
permalink: docs/faq-functions.html
layout: docs
category: FAQ
---

### 如何将事件处理器（比如onClick）传递给组件？
可以将事件处理器和其他函数作为props传递给子组件：

```jsx
<button onClick={this.handleClick}>
```

如果需要在事件处理器中访问父组件，还需要把该函数绑定到组件实例（参见下文）。

### 如何绑定一个函数到一个组件实例？

有以下几种方式可以确保函数可以访问组件属性，比如像`this.props`和`this.state`，取决于使用的语法和构建步骤。

#### 在构造函数中绑定（ES2015）

```jsx
class Foo extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <button onClick={this.handleClick}>Click Me</button>;
  }
}
```
#### 类属性（第三阶段提案）

```jsx
class Foo extends Component {
  // Note: this syntax is experimental and not standardized yet.
  handleClick = () => {
    console.log('Click happened');
  }
  render() {
    return <button onClick={this.handleClick}>Click Me</button>;
  }
}
```
#### 在Render中的绑定

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>Click Me</button>;
  }
}
```
>**注意：**
>
>在render方法中使用`Function.prototype.bind`会在每次组件渲染时创建一个新的函数，可能会影响性能（参见下文）。

#### 在Render中的箭头函数

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <button onClick={() => this.handleClick()}>Click Me</button>;
  }
}
```

>**注意：**
>
>在render方法中使用箭头函数也会在每次组件渲染时创建一个新的函数，可能会影响性能（参见下文）。

### 可以在render方法中使用箭头函数吗？

一般来说是可以的，并且直接箭头函数是向回调函数传递参数的最简单的办法。

但是如果遇到了性能问题，一定要进行优化！

### 为什么绑定是必要的？
在JavaScript中，以下两种写法是**不**等价的：

```js
obj.method();
```

```js
var method = obj.method;
method();
```
`bind`方法确保了第二种写法与第一种写法相同。

使用React，通常只需要绑定*传递*给其他组件的方法。例如，`<button onClick={this.handleClick}>`是在传递`this.handleClick`，所以需要绑定它。但是，没有必要绑定`render`方法或生命周期方法：我们并没有将它们传递给其他的组件。

[This post by Yehuda Katz](http://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/)详细解释了什么是绑定，和函数在JavaScript中怎么起作用。

### 为什么我的函数每次组件渲染时都会被调用？

确保你_没有调用函数_，在你传递函数给组件时：

```jsx
render() {
  // Wrong: handleClick is called instead of passed as a reference!
  return <button onClick={this.handleClick()}>Click Me</button>
}
```

正确做法是，*传递函数本身*（不带括号）：

```jsx
render() {
  // Correct: handleClick is passed as a reference!
  return <button onClick={this.handleClick}>Click Me</button>
}
```

### 如何传递参数给事件处理器或回调？

可以使用箭头函数包裹事件处理器，并传递参数：

```jsx
<button onClick={() => this.handleClick(id)} />
```

以上代码和调用`.bind`是等价的：

```jsx
<button onClick={this.handleClick.bind(this, id)} />
```

#### 示例：通过箭头函数传递参数

```jsx
const A = 65 // ASCII character code

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i)).
    };
  }
  handleClick(letter) {
    this.setState({ justClicked: letter });
  }
  render() {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} onClick={() => this.handleClick(letter)}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

#### 示例：通过data-属性传递参数

同样的，也可以使用DOM API来存储事件处理器需要的数据。如果需要优化大量元素或使用依赖于`React.PureComponent`相等性检查的渲染树，请考虑使用此方法。

```jsx
const A = 65 // ASCII character code

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }

  handleClick(e) {
    this.setState({
      justClicked: e.target.dataset.letter
    });
  }

  render() {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} data-letter={letter} onClick={this.handleClick}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

### 怎样阻止函数被调用太快或者太多次？

如果你有一个`onClick`或者`onScroll`这样的事件处理器，想要阻止回调被触发的太快，那么可以限制执行回调的速度，可以通过以下几种方式做到这点：

- **节流**：基于时间的频率来进行抽样更改 (例如 [`_.throttle`](https://lodash.com/docs#throttle))
- **防抖**：一段时间的不活动之后发布更改 (例如  [`_.debounce`](https://lodash.com/docs#debounce))
- **`requestAnimationFrame`节流**:基于[`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)的抽样更改 (例如 [`raf-schd`](https://github.com/alexreardon/raf-schd))

可以看这个比较`throttle`和`debounce`的[可视化页面](http://demo.nimius.net/debounce_throttle/)

> 注意：
>
> `_.debounce` , `_.throttle`和`raf-schd` 都提供了一个 `cancel`方法来取消延迟回调。 所以要么调用`componentWillUnmount`，否则需要对代码进行检查来保证在延迟函数有效期间内组件始终挂载。

#### 节流

节流阻止函数在给定时间窗口内被调不能超过一次。下面这个例子会节流“click”事件处理器每秒钟的只能调用一次。

```jsx
import throttle from 'lodash.throttle';

class LoadMoreButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickThrottled = throttle(this.handleClick, 1000);
  }

  componentWillUnmount() {
    this.handleClickThrottled.cancel();
  }

  render() {
    return <button onClick={this.handleClickThrottled}>Load More</button>;
  }

  handleClick() {
    this.props.loadMore();
  }
}
```

#### 防抖

防抖确保函数不会在上一次被调用之后一定量的时间内被执行。当必须进行一些昂贵的计算来响应快速派发的事件时（比如鼠标滚动或键盘事件时），防抖是非常有用的。下面这个例子以250ms的延迟来改变文本输入。

```jsx
import debounce from 'lodash.debounce';

class Searchbox extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.emitChangeDebounced = debounce(this.emitChange, 250);
  }

  componentWillUnmount() {
    this.emitChangeDebounced.cancel();
  }

  render() {
    return (
      <input
        type="text"
        onChange={this.handleChange}
        placeholder="Search..."
        defaultValue={this.props.value}
      />
    );
  }

  handleChange(e) {
    // React pools events, so we read the value before debounce.
    // Alternately we could call `event.persist()` and pass the entire event.
    // For more info see reactjs.org/docs/events.html#event-pooling
    this.emitChangeDebounced(e.target.value);
  }

  emitChange(value) {
    this.props.onChange(value);
  }
}
```

#### `requestAnimationFrame`节流
`requestAnimationFrame`是在浏览器中排队等待执行的一种方法，它可以在呈现性能的最佳时间执行。一个函数被`requestAnimationFrame`放入队列后将会在下一帧触发。浏览器会努力确保每秒60帧（60fps）。然而，如果浏览器无法确保，那么自然会限制每秒的帧数。例如，某个设备可能只能处理每秒30帧，所以每秒只能得到30帧。使用`requestAnimationFrame`来节流是一种有用的技术，它可以防止在一秒中进行60帧以上的更新。如果要求一秒钟内完成100次更新，则会为浏览器创建额外的负担，而用户无法看到这些工作（不能区别每秒100帧和60帧的区别）。

>**注意：**
>
> 使用这个方法时只能获取帧中最后发布的值。也可以在[`MDN`](https://developer.mozilla.org/en-US/docs/Web/Events/scroll)中看优化的示例。

```jsx
import rafSchedule from 'raf-schd';

class ScrollListener extends React.Component {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);

    // Create a new function to schedule updates.
    this.scheduleUpdate = rafSchedule(
      point => this.props.onScroll(point)
    );
  }

  handleScroll(e) {
    // When we receive a scroll event, schedule an update.
    // If we receive many updates within a frame, we'll only publish the latest value.
    this.scheduleUpdate({ x: e.clientX, y: e.clientY });
  }

  componentWillUnmount() {
    // Cancel any pending updates since we're unmounting.
    this.scheduleUpdate.cancel();
  }

  render() {
    return (
      <div
        style={{ overflow: 'scroll' }}
        onScroll={this.handleScroll}
      >
        <img src="/my-huge-image.jpg" />
      </div>
    );
  }
}
```

#### 测试速率限制

在测试速率限制的代码是否正确工作的时候，如果可以（对动画或操作）进行快进将会很有帮助。如果正在使用[`jest`](https://facebook.github.io/jest/)，那么可以使用[`mock timers`](https://facebook.github.io/jest/docs/en/timer-mocks.html)来快进。如果正在使用`requestAnimationFrame`节流，那么就会发现[`raf-stub`](https://github.com/alexreardon/raf-stub)是一个控制动画帧的十分有用的工具。
