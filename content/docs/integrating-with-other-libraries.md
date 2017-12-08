---
id: integrating-with-other-libraries
title: 与第三方库协同
permalink: docs/integrating-with-other-libraries.html
---

我们可以在任何网页应用中使用 React。不仅可以把 React 添加到其他应用里，而且只要稍作改动，我们也可以把其他应用添加到 React 项目里。本文将着重介绍如何将 React 与 [jQuery](https://jquery.com/) 以及 [Backbone](http://backbonejs.org/) 结合使用。当然，类似的思路同样可以应用与其他场景。

## 与 DOM 节点操作类插件结合

对于 React 之外的 DOM 节点操作，React 是不会去处理的，因为 React 内部有自己的渲染逻辑。当相同的 DOM 节点被外部的代码改变时，React 就会很迷茫，并不知道发生了什么。

但这也不意味着 React 无法与其他操作 DOM 节点的库一起使用，你只要清楚他们分别在做什么就可以了。

最简单的方式就是阻止 React 更新外部在操作的节点，那么你可以通过生成一个 React 根本不会去更新的元素来实现，比如空的 `<div />`。

### 进一步的解释

为了解释得更清楚，我们先来封装一个通用的 jQuery 插件吧。

在这里，我们给 DOM 的根节点元素加了一个 [ref](/docs/refs-and-the-dom.html)。在 `componentDidMount` 中，我们会调用这个 ref，并把它传给 jQuery 插件。

为了防止 React 在 DOM 加载后修改节点，我们先要在 `render()` 中返回一个空的 `<div />`。这个空的 `<div />` 既没有属性也没有子元素，这样一来，React 就不会更新它了。那么，我们封装的 jQuery 插件就可以随意地更新这个节点。

```js{3,4,8,12}
class SomePlugin extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.somePlugin();
  }

  componentWillUnmount() {
    this.$el.somePlugin('destroy');
  }

  render() {
    return <div ref={el => this.el = el} />;
  }
}
```

值得注意的是，我们既调用了 `componentDidMount` 也调用了 `componentWillUnmount` [生命周期函数](/docs/react-component.html#the-component-lifecycle)。由于很多 jQuery 的插件都会在 DOM 上挂载事件监听器，因此我们必须要在 `componentWillUnmount` 的时候把这个监听器删掉。如果某个插件没有提供“删除监听器”这类的方法，那你很可能需要自己写一个。为了防止内存泄漏，请务必在生命周期函数中移除插件挂载的事件监听器。

### 集成 jQuery Chosen 插件

为了进一步解释上面提到的内容，我们来封装一个 [Chosen](https://harvesthq.github.io/chosen/) 插件，这是一个可以扩充 `<select>` 功能的 jQuery 插件。

> **注：**
>
> 尽管以下的做法是可以实现的，但这样处理，并不是最佳的解决方案。更好的方式，显然是使用 React 组件。不仅因为在 React 应用中组件的可复用性强，而且通常来说，组件的行为及外观也是更容易控制的。

首先，我们先来看一下 Chosen 插件是如何操作 DOM 节点的。

如果你在 `<select>` 节点中调用 Chosen 插件，首先它会读取节点中原本存在的属性，然后通过添加行内样式，把 `<select>` 这个节点隐藏起来。接下来，Chosen 插件会在隐藏起来的这个 `<select>` 节点之后添加它自己定义的节点。最后，调用 jQuery，并告知我们节点已经被它改变了。

那么，我们就需要把上面提到的这个节点封装成 React 组件。在这里我们把它封装成 `<Chosen>`：

```js
function Example() {
  return (
    <Chosen onChange={value => console.log(value)}>
      <option>vanilla</option>
      <option>chocolate</option>
      <option>strawberry</option>
    </Chosen>
  );
}
```

为了方便，我么先把它写成一个 [不可控组件](/docs/uncontrolled-components.html)。

首先，我们来创建一个带有 `render()` 方法的空组件，这个组件返回用 `<div>` 包着的 `<select>`：

```js{4,5}
class Chosen extends React.Component {
  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

需要注意，这里我们必须用一个 `<div>` 包着 `<select>`，因为 Chosen 插件会在 `<select>` 之后添加 DOM 元素。对于 React 来说，`<div>` 就应该只有一个子级元素，因此这样做就可以让 React 忽略 Chosen 插件添加的 DOM 元素，也就不会存在冲突了。请记住，如果你想让其他插件修改某一个 DOM 节点，那你一定要保证 React 不会同时修改这个节点。


接下来，我们需要添加生命周期函数。在 Chosen 插件初始化节点的时候，我们需要在 `componentDidMount` 里面给 `<select>` 节点设置一个 ref，然后在 `componentWillUnmount` 的时候删掉它：

```js{2,3,7}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();
}

componentWillUnmount() {
  this.$el.chosen('destroy');
}
```

[CodePen 上的示例](http://codepen.io/gaearon/pen/qmqeQx?editors=0010)

React 不会给 `this.el` 加上什么特殊的意义，因为我们是在 `render` 方法中，通过 `ref` 来赋值的：

```js
<select className="Chosen-select" ref={el => this.el = el}>
```

现在我们的组件就可以加载了，但我们还需要处理一下值改变的情况。首先，我们需要在 Chosen 插件的 `<select>` 元素中"订阅" jQuery 的 `change` 事件。

我们不需要直接给 Chosen 传入 `this.props.onChange`，因为组件的 props 会随时发生变化，而且我们还需要一个处理 jQuery 事件的方法。在这里，我们定义了一个 `handleChange` 方法，这个方法会调用 `this.props.onChange`。然后，我们就用方法来订阅 jQuery 的 `change` 事件：

```js{5,6,10,14-16}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();

  this.handleChange = this.handleChange.bind(this);
  this.$el.on('change', this.handleChange);
}

componentWillUnmount() {
  this.$el.off('change', this.handleChange);
  this.$el.chosen('destroy');
}

handleChange(e) {
  this.props.onChange(e.target.value);
}
```

[CodePen 上的示例](http://codepen.io/gaearon/pen/bWgbeE?editors=0010)

最后，我们还剩下一件事要做。正如上面提到的，在 React 中，props 可以随时改变。举个例子，如果 `<Chosen>` 组件父级元素的 state 改变了，那么 `<Chosen>` 组件里面的 DOM 节点也很可能发生变化。这也就意味着，在集成插件的时候，如果 props 发生了改变，那我们就需要手动更新 DOM 元素，这是因为我们之前已经保证过 React 不会去处理这个节点。

Chosen 插件的文档中提到，我们可以用 jQuery 的 `trigger()` 方法来更新 Chosen 中的 DOM 元素。那么，我们可以让 React 负责处理 `<select>` 中的 `this.props.children`，然后用 `componentDidUpdate()` 来通知 Chosen 去更新节点的 DOM 元素：

```js{2,3}
componentDidUpdate(prevProps) {
  if (prevProps.children !== this.props.children) {
    this.$el.trigger("chosen:updated");
  }
}
```

这样一来，Chosen 插件就可以在 React 获取到 `<select>` 子元素变化的时候去更新 DOM 元素了。

我们把上面提到的内容结合起来，`Chosen` 组件的最终代码如下：

```js
class Chosen extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.chosen();

    this.handleChange = this.handleChange.bind(this);
    this.$el.on('change', this.handleChange);
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.$el.trigger("chosen:updated");
    }
  }

  componentWillUnmount() {
    this.$el.off('change', this.handleChange);
    this.$el.chosen('destroy');
  }
  
  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

[CodePen 上的示例](http://codepen.io/gaearon/pen/xdgKOz?editors=0010)

## 在 React 中使用其他引擎加载页面

由于 [`ReactDOM.render()`](/docs/react-dom.html#render) 方法很灵活，因此我们可以将 React 与其他处理页面显示的库结合使用。

通常来说，尽管 React 是在页面加载的时候把一个根组件放到 DOM 里，但 `ReactDOM.render()` 方法也可以被不同的 UI 部件多次调用。这个部件可以仅仅是一个按钮，或者也可以是一个应用。

事实上，Facebook 就是这么使用 React 的。我们可以独立地开发每一个部件，然后把这些部件与服务端创建的模板以及客户端代码结合起来，这样就形成了一个完整的应用。

### 在 React 中使用“字符串替换”类的库

早期的网页应用中，一个常用的方式是先把内容定义成字符串片段，然后插入到 DOM 节点中，就像这样：`$el.html(htmlString)`。采用这种方式写出来的应用，其实非常适合引入 React。只需要把那些字符串定义成 React 组件就可以了。

比如，这一段 jQuery 代码……

```js
$('#container').html('<button id="btn">Say Hello</button>');
$('#btn').click(function() {
  alert('Hello!');
});
```

……可以改写成这样的 React 组件：

```js
function Button() {
  return <button id="btn">Say Hello</button>;
}

ReactDOM.render(
  <Button />,
  document.getElementById('container'),
  function() {
    $('#btn').click(function() {
      alert('Hello!');
    });
  }
);
```

那么现在开始，你就可以在这个组件中应用 React 的思路，加入更多的逻辑代码。比如，习惯上来说组件是不应该依赖 ID 的，因为这一个组件可能会显示很多次。因此，我们需要使用 [React 事件系统](/docs/handling-events.html) 来给 `<button>` 添加点击事件的回调

```js{2,6,9}
function Button(props) {
  return <button onClick={props.onClick}>Say Hello</button>;
}

function HelloButton() {
  function handleClick() {
    alert('Hello!');
  }
  return <Button onClick={handleClick} />;
}

ReactDOM.render(
  <HelloButton />,
  document.getElementById('container')
);
```

[CodePen 上的示例](http://codepen.io/gaearon/pen/RVKbvW?editors=1010)

像这样的独立组件，你可以在页面中尽情使用，数量不限，只需要通过 `ReactDOM.render()` 方法把它放到不同位置就可以了。随着你把越来越多的代码转成 React 组件，你就可以把这些组件合并成更大的组件。这时候你再使用 `ReactDOM.render()` 就会输出更多的元素了。

### 在 React 中使用 Backbone 的视图

[Backbone](http://backbonejs.org/) 的视图是很典型的 HTML 字符串，或者说是通过模板生成 DOM 元素的函数。这个过程同样可以替换成 React 组件中的 render 方法。

现在我们来创建一个叫做 `ParagraphView` 的 Backbone 视图，然后我们要覆盖 Backbone 原有的 `render()` 方法，让 Backbone 中 (`this.el`) 创建的 DOM 元素加载 React 的 `<Paragraph>` 组件：

```js{1,5,8,12}
function Paragraph(props) {
  return <p>{props.text}</p>;
}

const ParagraphView = Backbone.View.extend({
  render() {
    const text = this.model.get('text');
    ReactDOM.render(<Paragraph text={text} />, this.el);
    return this;
  },
  remove() {
    ReactDOM.unmountComponentAtNode(this.el);
    Backbone.View.prototype.remove.call(this);
  }
});
```

[CodePen 上的示例](http://codepen.io/gaearon/pen/gWgOYL?editors=0010)

请注意，我们在 `remove` 中调用了 `ReactDOM.unmountComponentAtNode()`。这样 React 就会在恰当的时候把事件处理器和相关的绑定方法从组件树中删除。

当一个组件被 React 从树中删除，在这个组件上绑定的监听器之类的也会被清除掉。但由于我们是在手动操作这些，因此需要调用相关方法。

## 在 React 中使用其他数据层库和框架

一般来说，推荐大家使用符合单向数据流的框架和库，比如 [React state](/docs/lifting-state-up.html)、[Flux](http://facebook.github.io/flux/) 或 [Redux](http://redux.js.org/)。但 React 的组件也可以支持其他处理数据流的框架和库。

### 在 React 组件中使用 Backbone 处理数据

如果想在 React 中使用 [Backbone](http://backbonejs.org/) 处理数据模型，最简单的实现方式就是监听多个事件，然后手动调用方法，强制更新页面。

负责处理数据模型的组件通常都会监听 `'change'` 事件，但负责处理数据本身的组件还要监听 `'add'` 和 `'remove'` 事件。无论对于哪种，我们都可以通过调用 [`this.forceUpdate()`](/docs/react-component.html#forceupdate) 来强制更新页面显示的数据。

在接下来的例子中，`List` 组件用来显示来自 Backbone 的数据，而 `Item` 组件是负责显示每一条数据的。

```js{1,7-9,12,16,24,30-32,35,39,46}
class Item extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.model.on('change', this.handleChange);
  }

  componentWillUnmount() {
    this.props.model.off('change', this.handleChange);
  }

  render() {
    return <li>{this.props.model.get('text')}</li>;
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange();
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.collection.on('add', 'remove', this.handleChange);
  }

  componentWillUnmount() {
    this.props.collection.off('add', 'remove', this.handleChange);
  }

  render() {
    return (
      <ul>
        {this.props.collection.map(model => (
          <Item key={model.cid} model={model} />
        ))}
      </ul>
    );
  }
}
```

[CodePen 上的示例](http://codepen.io/gaearon/pen/GmrREm?editors=0010)

### 从 Backbone 的数据模型中提取数据

上面的方法需要 React 组件实时获取 Backbone 数据的更新。如果将来你打算迁移到另一个数据管理系统，你肯定不愿意在 Backbone 这里改动太多的代码。

一种解决方案就是在数据变化时，提取出数据模型的属性，并把这个逻辑封装起来。这里有个 [高阶组件](/docs/higher-order-components.html) 的例子，作用就是把 Backbone 数据模型中的属性提取出来成为 state，并把数据传到组件中。

采用这种写法，只有这个高阶组件需要实时获取到 Backbone 数据模型的更新，应用中的其他组件都不需要与 Backbone 互动。

在下面的例子中，我们会把数据模型的属性复制到初始 state 中。然后我们会订阅 `change` 事件（当然，我们也要在组件移除的时候取消订阅）。`change` 事件触发的时候，我们会根据数据模型当前的属性来更新 state。最后，我们还要确认一件事，就是在 `model` 这个 prop 本身发生变化的时候，我们同样要取消原来的订阅，同时订阅更新后的 prop。

请注意，这个例子的目的不在于详细说明如何与 Backbone 集成，而是想给出一些通用的思路，这样你也可以试着与其他库或框架集成。

```js{1,5,10,14,16,17,22,26,32}
function connectToBackboneModel(WrappedComponent) {
  return class BackboneComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = Object.assign({}, props.model.attributes);
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      this.props.model.on('change', this.handleChange);
    }

    componentWillReceiveProps(nextProps) {
      this.setState(Object.assign({}, nextProps.model.attributes));
      if (nextProps.model !== this.props.model) {
        this.props.model.off('change', this.handleChange);
        nextProps.model.on('change', this.handleChange);
      }
    }

    componentWillUnmount() {
      this.props.model.off('change', this.handleChange);
    }

    handleChange(model) {
      this.setState(model.changedAttributes());
    }

    render() {
      const propsExceptModel = Object.assign({}, this.props);
      delete propsExceptModel.model;
      return <WrappedComponent {...propsExceptModel} {...this.state} />;
    }
  }
}
```

为了展示如何调用，我们在 Backbone 模型中引入一个叫做 `NameInput` 的 React 组件。当输入发生变化时更新组件的 `firstName` 属性。

```js{4,6,11,15,19-21}
function NameInput(props) {
  return (
    <p>
      <input value={props.firstName} onChange={props.handleChange} />
      <br />
      My name is {props.firstName}.
    </p>
  );
}

const BackboneNameInput = connectToBackboneModel(NameInput);

function Example(props) {
  function handleChange(e) {
    model.set('firstName', e.target.value);
  }

  return (
    <BackboneNameInput
      model={props.model}
      handleChange={handleChange}
    />
  );
}

const model = new Backbone.Model({ firstName: 'Frodo' });
ReactDOM.render(
  <Example model={model} />,
  document.getElementById('root')
);
```

[CodePen 上的示例](http://codepen.io/gaearon/pen/PmWwwa?editors=0010)

以上提到的内容不局限于 Backbone。对于任何处理数据模型的库或框架，你都可以在 React 中通过生命周期函数订阅它的变化事件。你还可以把这些数据直接复制到 React 组件的 state 中，不过这个步骤不是必须的。
