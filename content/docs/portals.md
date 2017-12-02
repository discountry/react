---
id: portals
title: Portals
permalink: docs/portals.html
---

Portals 提供了一种很好的将子节点渲染到父组件以外的 DOM 节点的方式。

```js
ReactDOM.createPortal(child, container)
```

第一个参数（`child`）是任何[可渲染的 React 子元素](/docs/react-component.html#render)，例如一个元素，字符串或碎片。第二个参数（`container`）则是一个 DOM 元素。

## 用法

通常讲，当你从组件的 render 方法返回一个元素，该元素仅能装配 DOM 节点中离其最近的父元素：

```js{4,6}
render() {
  // React mounts a new div and renders the children into it
  return (
    <div>
      {this.props.children}
    </div>
  );
}
```

然而，有时候将其插入到 DOM 节点的不同位置也是有用的：

```js{6}
render() {
  // React does *not* create a new div. It renders the children into `domNode`.
  // `domNode` is any valid DOM node, regardless of its location in the DOM.
  return ReactDOM.createPortal(
    this.props.children,
    domNode,
  );
}
```

对于 portal 的一个典型用例是当父组件有 `overflow: hidden` 或 `z-index` 样式，但你需要子组件能够在视觉上“跳出（break out）”其容器。例如，对话框、hovercards以及提示框：

> 注意：
>
> 记住这点非常重要，当在使用 portals时，你需要确保遵循合适的可访问指南。

[在 CodePen 上试一试](https://codepen.io/gaearon/pen/yzMaBd)

## 通过 Portals 进行事件冒泡

尽管 portal 可以被放置在 DOM 树的任何地方，但在其他方面其行为和普通的 React 子节点行为一致。如上下文特性依然能够如之前一样正确地工作，无论其子节点是否是 portal，由于 portal 仍存在于 *React 树*中，而不用考虑其在 DOM 树中的位置。

这包含事件冒泡。一个从 portal 内部会触发的事件会一直冒泡至包含 *React 树* 的祖先。假设如下 HTML 结构：

```html
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>
```

在 `#app-root` 里的 `Parent` 组件能够捕获到未被捕获的从兄弟节点 `#modal-root` 冒泡上来的事件。

```js{20-23,34-41,45,53-55,62-63,66}
// These two containers are siblings in the DOM
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // This will fire when the button in Child is clicked,
    // updating Parent's state, even though button
    // is not direct descendant in the DOM.
    this.setState(prevState => ({
      clicks: prevState.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Number of clicks: {this.state.clicks}</p>
        <p>
          Open up the browser DevTools
          to observe that the button
          is not a child of the div
          with the onClick handler.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  // The click event on this button will bubble up to parent,
  // because there is no 'onClick' attribute defined
  return (
    <div className="modal">
      <button>Click</button>
    </div>
  );
}

ReactDOM.render(<Parent />, appRoot);
```

[在 CodePen 上试一试](https://codepen.io/gaearon/pen/jGBWpE)

在父组件里捕获一个来自 portal 的事件冒泡能够在开发时具有不完全依赖于 portal 的更为灵活的抽象。例如，若你在渲染一个 `<Modal />` 组件，父组件能够捕获其事件而无论其是否采用 portal 实现。
