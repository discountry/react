---
id: handling-events
title: 事件处理
permalink: docs/handling-events.html
prev: state-and-lifecycle.html
next: conditional-rendering.html
redirect_from:
  - "docs/events-ko-KR.html"
---

React 元素的事件处理和 DOM元素的很相似。但是有一点语法上的不同:

* React事件绑定属性的命名采用驼峰式写法，而不是小写。
* 如果采用 JSX 的语法你需要传入一个函数作为事件处理函数，而不是一个字符串(DOM元素的写法)

例如，传统的 HTML：

```html
<button onclick="activateLasers()">
  Activate Lasers
</button>
```

React 中稍稍有点不同：

```js{1}
<button onClick={activateLasers}>
  Activate Lasers
</button>
```

在 React 中另一个不同是你不能使用返回 `false` 的方式阻止默认行为。你必须明确的使用 `preventDefault`。例如，传统的 HTML 中阻止链接默认打开一个新页面，你可以这样写：

```html
<a href="#" onclick="console.log('The link was clicked.'); return false">
  Click me
</a>
```

在 React，应该这样来写：

```js{2-5,8}
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}
```

在这里，`e` 是一个合成事件。React 根据 [W3C spec](https://www.w3.org/TR/DOM-Level-3-Events/) 来定义这些合成事件，所以你不需要担心跨浏览器的兼容性问题。查看 [SyntheticEvent](/docs/events.html) 参考指南来了解更多。

使用 React 的时候通常你不需要使用 `addEventListener` 为一个已创建的 DOM 元素添加监听器。你仅仅需要在这个元素初始渲染的时候提供一个监听器。

当你使用 [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) 语法来定义一个组件的时候，事件处理器会成为类的一个方法。例如，下面的 `Toggle` 组件渲染一个让用户切换开关状态的按钮：

```js{6,7,10-14,18}
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

[在 CodePen 上试试。](http://codepen.io/gaearon/pen/xEmzGg?editors=0010)

你必须谨慎对待 JSX 回调函数中的 `this`，类的方法默认是不会[绑定](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind) `this` 的。如果你忘记绑定 `this.handleClick` 并把它传入 `onClick`, 当你调用这个函数的时候 `this` 的值会是 `undefined`。

这并不是 React 的特殊行为；它是[函数如何在 JavaScript 中运行](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/)的一部分。通常情况下，如果你没有在方法后面添加 `()` ，例如 `onClick={this.handleClick}`，你应该为这个方法绑定 `this`。

如果使用 `bind` 让你很烦，这里有两种方式可以解决。如果你正在使用实验性的[属性初始化器语法](https://babeljs.io/docs/plugins/transform-class-properties/)，你可以使用属性初始化器来正确的绑定回调函数：

```js{2-6}
class LoggingButton extends React.Component {
  // This syntax ensures `this` is bound within handleClick.
  // Warning: this is *experimental* syntax.
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```

这个语法在 [Create React App](https://github.com/facebookincubator/create-react-app) 中默认开启。

如果你没有使用属性初始化器语法，你可以在回调函数中使用 [箭头函数](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions)：

```js{7-9}
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // This syntax ensures `this` is bound within handleClick
    return (
      <button onClick={(e) => this.handleClick(e)}>
        Click me
      </button>
    );
  }
}
```

使用这个语法有个问题就是每次 `LoggingButton` 渲染的时候都会创建一个不同的回调函数。在大多数情况下，这没有问题。然而如果这个回调函数作为一个属性值传入低阶组件，这些组件可能会进行额外的重新渲染。我们通常建议在构造函数中绑定或使用属性初始化器语法来避免这类性能问题。

## 向事件处理程序传递参数

通常我们会为事件处理程序传递额外的参数。例如，若是 `id` 是你要删除那一行的 id，以下两种方式都可以向事件处理程序传递参数：

```js
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

上述两种方式是等价的，分别通过 [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) 和 [`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind) 来为事件处理函数传递参数。

上面两个例子中，参数 `e` 作为 React 事件对象将会被作为第二个参数进行传递。通过箭头函数的方式，事件对象必须显式的进行传递，但是通过 `bind` 的方式，事件对象以及更多的参数将会被隐式的进行传递。

值得注意的是，通过 `bind` 方式向监听函数传参，在类组件中定义的监听函数，事件对象 `e` 要排在所传递参数的后面，例如:

```js{7-9,17}
class Popper extends React.Component{
    constructor(){
        super();
        this.state = {name:'Hello world!'};
    }
    
    preventPop(name, e){    //事件对象e要放在最后
        e.preventDefault();
        alert(name);
    }
    
    render(){
        return (
            <div>
                <p>hello</p>
                {/* Pass params via bind() method. */}
                <a href="https://reactjs.org" onClick={this.preventPop.bind(this,this.state.name)}>Click</a>
            </div>
        );
    }
}
```
