---
id: render-props
title: Render Props
permalink: docs/render-props.html
---

术语 ["render prop"](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) 是指一种在 React 组件之间使用一个值为函数的 prop 在 React 组件间共享代码的简单技术。

带有 render prop 的组件带有一个返回一个 React 元素的函数并调用该函数而不是实现自己的渲染逻辑。

```jsx
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```

使用 render props 的库包括 [React Router](https://reacttraining.com/react-router/web/api/Route/Route-render-methods) 和 [Downshift](https://github.com/paypal/downshift)。

本篇文档，我们将讨论为何 render props 有用，并且如何写一个自己 render props 的组件。

## 在交叉关注点（Cross-Cutting Concerns）使用 render props

组件在 React 是主要的代码复用单元，但如何共享状态或一个组件的行为封装到其他需要相同状态的组件中并不是很明了。

例如，下面的组件在 web 应用追踪鼠标位置：

```js
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
        <h1>Move the mouse around!</h1>
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
```

随着鼠标在屏幕上移动，在一个 `<p>` 的组件上显示它的 (x, y) 坐标。

现在的问题是：我们如何在另一个组件中重用行为？换句话说，若另一组件需要知道鼠标位置，我们能否封装这一行为以让能够容易在组件间共享？

由于组件是 React 中最基础的代码重用单元，现在尝试重构一部分代码能够在`<Mouse>` 组件中封装我们需要在其他地方的行为。

```js
// The <Mouse> component encapsulates the behavior we need...
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/* ...but how do we render something other than a <p>? */}
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse />
      </div>
    );
  }
}
```

现在 `<Mouse>` 组件封装了所有关于监听 `mousemove` 事件和存储鼠标 (x, y) 位置的行为，但其仍不是真正的可重用。

例如，假设我们现在有一个在屏幕上跟随鼠标渲染一张猫的图片的 `<Cat>` 组件。我们可能使用 `<Cat mouse={{ x, y }}` prop 来告诉组件鼠标的坐标以让它知道图片应该在屏幕哪个位置。

首先，你可能会像这样，尝试在 *`<Mouse>` 的内部的渲染方法*渲染 `<Cat>` 组件：

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class MouseWithCat extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/*
          We could just swap out the <p> for a <Cat> here ... but then
          we would need to create a separate <MouseWithSomethingElse>
          component every time we need to use it, so <MouseWithCat>
          isn't really reusable yet.
        */}
        <Cat mouse={this.state} />
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <MouseWithCat />
      </div>
    );
  }
}
```

这一方法对我们的具体用例来说能够生效，但我们却没法实现真正的将行为封装成可重用的方式的目标。现在，每次我们在不同的用例中想要使用鼠标的位置，我们就不得不创建一个新的针对那一用例渲染不同内容的组件 (如另一个关键的 `<MouseWithCat>`)。

这也是 render prop 的来历：我们可以提供一个带有函数 prop 的 `<Mouse>` 组件，它能够动态决定什么需要渲染的，而不是将 `<Cat>` 硬编码到 `<Mouse>` 组件里，并有效地改变它的渲染结果。

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/*
          Instead of providing a static representation of what <Mouse> renders,
          use the `render` prop to dynamically determine what to render.
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

现在，我们提供了一个 `render` prop 以让 `<Mouse>` 能够动态决定什么需要渲染，而不是克隆 `<Mouse>` 组件并硬编码来解决特定的用例。

更具体地说，**render prop 是一个组件用来了解要渲染什么内容的函数 prop。**

这一技术使得共享代码间变得相当便利。为了实现这一行为，渲染一个带有 `render` prop 的 `<Mouse>` 组件能够告诉它当前鼠标坐标 (x, y) 要渲染什么。

关于 render props 一个有趣的事情是你可以使用一个带有 render props 的常规组件来实现大量的 [高阶组件](/docs/higher-order-components.html) (HOC)。例如，如果你更偏向于使用一个 `withMouse` 的高阶组件而不是一个 `<Mouse>` 组件，你可以轻松的创建一个带有 render prop 的常规  `<Mouse>` 组件的高阶组件。

```js
// If you really want a HOC for some reason, you can easily
// create one using a regular component with a render prop!
function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  }
}
```

所以，使用 render props 是一种可能的使用模式。

## 使用 Props 而非 `render`

记住仅仅是因为这一模式被称为 “render props” 而你*不必为使用该模式而用一个名为 `render` 的 prop*。实际上，[组件能够知道什么需要渲染的*任何*函数 prop 在技术上都是 “render prop” ](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce)。

尽管之前的例子使用了 `render`，我们也可以简单地使用 `children` prop！

```js
<Mouse children={mouse => (
  <p>The mouse position is {mouse.x}, {mouse.y}</p>
)}/>
```

并记住，`children` prop 并不真正需要添加到 JSX 元素的 “attributes” 列表中。相反，你可以直接放置到元素的*内部*！

```js
<Mouse>
  {mouse => (
    <p>The mouse position is {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```

你可以在 [react-motion](https://github.com/chenglou/react-motion) API 里看到这一技术的使用。

由于这一技术有些不寻常，当你在设计一个类似的 API 时，你可能要直接地在你的 `propTypes` 里声明 `children` 应为一个函数类型。

```js
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
```

## 警告

### 在 React.PureComponent 中使用 render props 要注意

如果你在 `render` 方法里创建函数，那么使用 render prop 会抵消使用 [`React.PureComponent`](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) 带来的优势。这是因为浅 prop 比较对于新 props 总会返回 `false`，并且在这种情况下每一个 `render` 对于 render prop 将会生成一个新的值。

例如，继续我们之前使用 `<Mouse>` 组件，如果 `Mouse` 继承自 `React.PureComponent` 而不是 `React.Component`，我们的例子看起来就像这样：

```js
class Mouse extends React.PureComponent {
  // Same implementation as above...
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>

        {/*
          This is bad! The value of the `render` prop will
          be different on each render.
        */}
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

在这样例子中，每次 `<MouseTracker>` 渲染，它会生成一个新的函数作为 `<Mouse render>` 的 prop，因而在同时也抵消了继承自 `React.PureComponent` 的 `<Mouse>` 组件的效果！

为了绕过这一问题，有时你可以定义一个 prop 作为实例方法，类似如下：

```js
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);

    // This binding ensures that `this.renderTheCat` always refers
    // to the *same* function when we use it in render.
    this.renderTheCat = this.renderTheCat.bind(this);
  }

  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

`<Mouse>` 应继承`React.Component`，万一你没法提前在构造函数中绑定实例方法（如因为你可能要掩盖组件的 props 和/或 state)。
