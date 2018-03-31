---
id: legacy-context
title: Legacy Context
permalink: docs/legacy-context.html
---

> 注释：由于React v15.5开始 `React.PropTypes`已经废弃，我们推荐使用[`prop-types`](https://www.npmjs.com/package/prop-types)来定义`contextTypes`。

使用React可以非常轻松地追踪通过React组件的数据流。在React组件中，你可以看到哪些props被传递，这使得你的应用容易理解。

在有些场景中，你不想要向下每层都手动地传递你需要的 props。这就需要强大的 `context` API了。

## 为什么不要使用Context

绝大多数应用程序不需要使用 context.

如果你想让你的应用更稳定，别使用context。因为这是一个实验性的API，在未来的React版本中可能会被更改。

如果你对状态管理库如[Redux](https://github.com/reactjs/redux)或[Mobx](https://github.com/mobxjs/mobx)不太熟悉，那就别用context了。在很多实际应用中，这些库及其React绑定是管理与许多组件相关的state的不错选择。Redux可能是你更好的选择，而不是context。

如果你不是一个有经验的React的开发者，不要使用context，通常仅使用props和state来实现功能是更好的一种方式。

尽管有这些警告，如果你还是坚持要使用context，那么尽量将使用context的代码隔离到一小块地方并避免直接使用context API，这样以后API变更的时候更容易升级。

## 如何使用Context

假设你有如下代码:


```javascript
class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.props.color}}>
        {this.props.children}
      </button>
    );
  }
}

class Message extends React.Component {
  render() {
    return (
      <div>
        {this.props.text} <Button color={this.props.color}>Delete</Button>
      </div>
    );
  }
}

class MessageList extends React.Component {
  render() {
    const color = "purple";
    const children = this.props.messages.map((message) =>
      <Message text={message.text} color={color} />
    );
    return <div>{children}</div>;
  }
}
```

在这个例子中，我们手动传递color这个prop，以适当地设置`Button`和`Message`组件的样式。使用context，我们可以自动地在组件树中传递参数。


```javascript{6,13-15,21,28-30,40-42}
const PropTypes = require('prop-types');

class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.context.color}}>
        {this.props.children}
      </button>
    );
  }
}

Button.contextTypes = {
  color: PropTypes.string
};

class Message extends React.Component {
  render() {
    return (
      <div>
        {this.props.text} <Button>Delete</Button>
      </div>
    );
  }
}

class MessageList extends React.Component {
  getChildContext() {
    return {color: "purple"};
  }

  render() {
    const children = this.props.messages.map((message) =>
      <Message text={message.text} />
    );
    return <div>{children}</div>;
  }
}

MessageList.childContextTypes = {
  color: PropTypes.string
};
```

通过在`MessageList`（context提供者）中添加`childContextTypes`和`getChildContext`，React会向下自动传递参数，任何组件只要在它的子组件中（这个例子中是`Button`），就能通过定义`contextTypes`来获取参数。

如果`contextTypes`没有定义，那么`context`将会是个空对象。

## 父子组件耦合

Context还能让你构建一个父子组件通讯的API。例如[React Router V4](https://reacttraining.com/react-router)就是这么实现的。

```javascript
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />
    </div>
  </Router>
);
```

通过`Router`组件向下传递参数，每个`Link`和`Route`组件就能回传到包含的`Router`组件中。

在使用与此类似的API构建你的组件之前，请考虑下是否有更好的选择。例如，如果你乐意的话，可以将整个React组件当做参数来传递。

## 在生命周期函数中引用Context

如果在一个组件中定义了`contextTypes`，那么下面这些[生命周期函数](/docs/react-component.html#the-component-lifecycle)中将会接收到额外的参数，即`context`对象:


- [`constructor(props, context)`](/docs/react-component.html#constructor)
- [`componentWillReceiveProps(nextProps, nextContext)`](/docs/react-component.html#componentwillreceiveprops)
- [`shouldComponentUpdate(nextProps, nextState, nextContext)`](/docs/react-component.html#shouldcomponentupdate)
- [`componentWillUpdate(nextProps, nextState, nextContext)`](/docs/react-component.html#componentwillupdate)
- [`componentDidUpdate(prevProps, prevState, prevContext)`](/docs/react-component.html#componentdidupdate)

## 在无状态函数组件中引用Context

如果`contextTypes`作为函数参数被定义的话，无状态函数组件也是可以引用`context`。以下代码展示了用无状态函数组件写法的`Button`组件。

```javascript
const PropTypes = require('prop-types');

const Button = ({children}, context) =>
  <button style={{background: context.color}}>
    {children}
  </button>;

Button.contextTypes = {color: PropTypes.string};
```

## 更新Context

千万别这么做。

React有更新context的API，但是基本已经被废除了，你不应该使用。

当state或者props更新时`getChildContext`方法会被调用。为了在context中更新数据，使用 `this.setState`来更新本地state。这将会生成一个新的context，所有的子组件会接收到更新。

```javascript
const PropTypes = require('prop-types');

class MediaQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {type:'desktop'};
  }

  getChildContext() {
    return {type: this.state.type};
  }

  componentDidMount() {
    const checkMediaQuery = () => {
      const type = window.matchMedia("(min-width: 1025px)").matches ? 'desktop' : 'mobile';
      if (type !== this.state.type) {
        this.setState({type});
      }
    };

    window.addEventListener('resize', checkMediaQuery);
    checkMediaQuery();
  }

  render() {
    return this.props.children;
  }
}

MediaQuery.childContextTypes = {
  type: PropTypes.string
};
```

那么问题来了，由于组件更新产生的新的context，如果有一个中间的父组件的`shouldComponentUpdate`返回了`false`,那么接下来的子组件中的context是不会被更新的。这么使用context的话，组件就失控了，所以没有一种可靠的方式来更新context。[这篇博客](https://medium.com/@mweststrate/how-to-safely-use-react-context-b7e343eff076)很好地解释了为什么这是一个问题，以及如何规避它。
