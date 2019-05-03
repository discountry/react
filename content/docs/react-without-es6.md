---
id: react-without-es6
title: 不使用 ES6
permalink: docs/react-without-es6.html
---

通常我们会用 JavaScript 的 `class` 关键字来创建 React 组件：

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

如果你不打算使用 ES6，你也可以使用 `create-react-class` 模块来创建：

```javascript
var createReactClass = require('create-react-class');
var Greeting = createReactClass({
  render: function() {
    return <h1>Hello, {this.props.name}</h1>;
  }
});
```

ES6 中 `class` 相关的接口与 `createReactClass` 方法十分相似，但有以下几个区别值得注意。

## 声明默认属性

如果使用 `class` 关键字创建组件，可以直接把自定义属性对象写到类的 `defaultProps` 属性中：

```javascript
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Mary'
};
```

如果使用 `createReactClass` 方法创建组件，那就需要在参数对象中定义 `getDefaultProps` 方法，并且在这个方法中返回包含自定义属性的对象：

```javascript
var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'Mary'
    };
  },

  // ...

});
```

## 设置初始状态

如果使用 `class` 关键字创建组件，你可以通过在 `constructor` 中给 `this.state` 赋值的方式来定义组件的初始状态：

```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  // ...
}
```

如果使用 `createReactClass` 方法创建组件，你就需要多写一个 `getInitialState` 方法，并让这个方法返回你要定义的初始属性：

```javascript
var Counter = createReactClass({
  getInitialState: function() {
    return {count: this.props.initialCount};
  },
  // ...
});
```

## 自动绑定

对于使用 `class` 关键字创建的 React 组件，组件中的方法是不会自动绑定 `this` 的。类似地，通过 ES6 `class` 生成的实例，实例上的方法也不会绑定 `this`。因此，你需要在 `constructor` 中为方法手动添加 `.bind(this)`：

```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
    // 这一行很关键
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert(this.state.message);
  }

  render() {
    // 由于 `this.handleClick` 已经绑定至实例，因此我们才可以用它来处理点击事件
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

如果使用 `createReactClass` 方法创建组件，组件中的方法会自动绑定至实例，不需要像上面那样加 `.bind(this)`：

```javascript
var SayHello = createReactClass({
  getInitialState: function() {
    return {message: 'Hello!'};
  },

  handleClick: function() {
    alert(this.state.message);
  },

  render: function() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
});
```

这就意味着，如果使用 `class` 关键字创建组件，那在处理事件回调的时候就要多写一点点代码。但对于大型项目来说，这样做可以提升运行效率。

如果你觉得上面这个写法很麻烦，那么可以尝试一下**目前还处于实验性阶段**的 Babel 插件 [Class Properties](https://babeljs.io/docs/plugins/transform-class-properties/)。


```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
  }
  // 警告：这种语法还处于实验性阶段
  // 在这里使用箭头函数就可以把方法绑定给实例：
  handleClick = () => {
    alert(this.state.message);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

请注意，这种语法**目前还处于实验性阶段**。也就意味着，语法随时都可能改变。当然，也存在最终没有被官方批准的可能。

为了保险起见，以下三种做法都是可以的：

* 把方法绑定给构造器 (constructor)
* 使用箭头函数，比如这样写：`onClick={(e) => this.handleClick(e)}`.
* 使用 `createReactClass`.

## Mixin(混入)

>**注：**
>
>ES6 本身是不包含混入支持的。因此，如果你使用 `class` 关键字创建组件，那就不能使用混入功能了。
>
>**我们也发现了很多使用混入然后出现了问题的代码库。[因此，我们并不推荐在 ES6 中使用混入](/blog/2016/07/13/mixins-considered-harmful.html).**
>
>以下内容仅作为参考

如果完全不同的组件有相似的功能，这就会产生 ["横切关注点"问题](https://en.wikipedia.org/wiki/Cross-cutting_concern)。针对这个问题，在使用 [`createReactClass`](/docs/top-level-api.html#react.createclass) 创建 React 组件的时候，引入`混入`功能会是一个很好的解决方案。

一个常见的使用情景是，当一个组件想要每隔一段时间更新，那么最简单的方法就是使用 `setInterval()`。但更重要的是，如果后续代码中不需要这个功能，为了节省内存，你应该把它删除。React 提供了 [生命周期方法](/docs/working-with-the-browser.html#component-lifecycle)，这样你就可以知道某一个组件什么时候要被创建或者什么时候会被销毁。我们先来创建一个使用 `setInterval()` 的混入，它会在组件销毁的时候也销毁。

```javascript
var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.forEach(clearInterval);
  }
};

var createReactClass = require('create-react-class');

var TickTock = createReactClass({
  mixins: [SetIntervalMixin], // 使用混入
  getInitialState: function() {
    return {seconds: 0};
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 1000); // 调用混入的方法
  },
  tick: function() {
    this.setState({seconds: this.state.seconds + 1});
  },
  render: function() {
    return (
      <p>
        React has been running for {this.state.seconds} seconds.
      </p>
    );
  }
});

ReactDOM.render(
  <TickTock />,
  document.getElementById('example')
);
```

如果一个组件有多个混入，且其中几个混入中定义了相同的生命周期方法（比如都会在组件被摧毁的时候执行），那么这些生命周期方法是一定会被调用的。通过混入定义的方法，执行顺序也与定义时的顺序一致，且会在组件上的方法执行之后再执行。
