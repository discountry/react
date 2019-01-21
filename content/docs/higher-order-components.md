---
id: higher-order-components
title: 高阶组件
permalink: docs/higher-order-components.html
---

高阶组件（HOC）是react中的高级技术，用来重用组件逻辑。但高阶组件本身并不是React API。它只是一种模式，这种模式是由react自身的组合性质必然产生的。

具体而言，**高阶组件就是一个函数，且该函数接受一个组件作为参数，并返回一个新的组件。**

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

对比组件将props属性转变成UI，高阶组件则是将一个组件转换成另一个组件。

高阶组件在React第三方库中很常见，比如Redux的[`connect`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)方法和Relay的[`createContainer`](https://facebook.github.io/relay/docs/api-reference-relay.html#createcontainer-static-method).

在本文档中，我们将会讨论为什么高阶组件很有用，以及该如何实现一个自己的高阶组件。

## 使用高阶组件（HOC）解决横切关注点

> **注意**
>
> 我们曾经介绍了混入（mixins）技术来解决横切关注点。现在我们意识到混入（mixins）技术产生的问题要比带来的价值大。[更多资料](/blog/2016/07/13/mixins-considered-harmful.html)介绍了为什么我们要移除混入（mixins）技术以及如何转换你已经使用了混入（mixins）技术的组件。

在React中，组件是代码复用的主要单元。然而你会发现，一些模式用传统的组件并不直白。

例如，假设你有一个`CommentList`组件，该组件从外部数据源订阅数据并渲染评论列表：

```js
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" is some global data source
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // Subscribe to changes
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // Clean up listener
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // Update component state whenever the data source changes
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```

然后，你又写了一个订阅单个博客文章的组件，该组件遵循类似的模式：

```js
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id)
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```

`CommentList` 和 `BlogPost` 组件并不相同——他们调用 `DataSource` 的方法不同，并且他们渲染的输出也不相同。但是，他们有很多实现是相同的：

- 挂载组件时， 向 `DataSource` 添加一个改变监听器。
- 在监听器内， 每当数据源发生改变时，调用`setState`。
- 卸载组件时， 移除改变监听器。

设想一下，在一个大型的应用中，这种从`DataSource`订阅数据并调用`setState`的模式将会一次又一次的发生。我们希望一个抽象允许我们定义这种逻辑，在单个地方，并且许多组件都可以共享它，这就是高阶组件的杰出所在。

我们可以写一个创建组件的函数，创建的组件类似`CommonList`和`BlogPost`一样订阅到`DataSource`。该函数接受它的参数之一作为一个子组件，子组件又接受订阅的数据作为一个属性(prop)。让我们称这个函数为`withSubscription`：

```js
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);
```

第一个参数是被包裹的组件，第二个参数检索所需要的数据，从给定的`DataSource`和当前props属性中。

> 译者注：根据代码示例，这里应该是高阶组件的props属性

当渲染 `CommentListWithSubscription` 和 `BlogPostWithSubscription` 时, 会向`CommentList` 和 `BlogPost` 传递一个 `data` 属性，该 `data`属性带有从 `DataSource` 检索的最新数据：

```js{31}
// This function takes a component...
function withSubscription(WrappedComponent, selectData) {
  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ... that takes care of the subscription...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

注意，高阶组件既不会修改输入组件，也不会使用继承拷贝它的行为。而是，高阶组件 *组合（composes）* 原始组件，通过用一个容器组件 *包裹着（wrapping）* 原始组件。高阶组件就是一个没有副作用的纯函数。

就是这样！被包裹的组件接收容器的所有props属性以及一个新属性`data`用于渲染输出。高阶组件并不关心数据使用的方式和原因，而被包裹的组件也不关心数据来自何处。

因为 `withSubscription` 就是一个普通函数，你可以按需添加可多可少的参数。例如，你或许会想使 `data` 属性的名字是可配置的，以进一步从被包裹的组件隔离高阶组件。或者你想要接收一个参数用于配置 `shouldComponentUpdate`，或配置数据源。所有的这些都是可以的，因为高阶组件充分地控制新组件定义的方式。

和普通组件一样，`withSubscription` 和被包裹的组件之间的合约是完全基于props属性的。这使得易于替换一个高阶组件到另一个，只要他们提供相同的props属性给被包裹的组件即可。这可以用于你改变获取数据的库时，举例来说。

## 不要改变原始组件，使用组合

抵制诱惑，不要在高阶组件内修改一个组件的原型（或以其它方式修改组件）。

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentWillReceiveProps = function(nextProps) {
    console.log('Current props: ', this.props);
    console.log('Next props: ', nextProps);
  };
  // The fact that we're returning the original input is a hint that it has
  // been mutated.
  return InputComponent;
}

// EnhancedComponent will log whenever props are received
const EnhancedComponent = logProps(InputComponent);
```

上面的示例有一些问题。首先就是，输入组件不能独立于增强型组件（enhanced component）被重用。更致命的是，如果你在`EnhancedComponent`上应用另一个高阶组件，同样也去改变`componentWillReceiveProps`，第一个高阶组件的功能就会被覆盖。这样的高阶组件对没有生命周期方法的函数式组件也是无效的。

修改高阶组件泄露了组件的抽象性——使用者必须知道他们的实现方式，才能避免与其它高阶组件的冲突。

与修改组件相反，高阶组件应该使用组合技术，将输入组件包裹到一个容器组件中：

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentWillReceiveProps(nextProps) {
      console.log('Current props: ', this.props);
      console.log('Next props: ', nextProps);
    }
    render() {
      // 用容器包裹输入组件，不要修改它，漂亮！
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

这个高阶组件和那个更改型版本有着同样的功能，但却避免了潜在的冲突。它对类组件和函数式组件适用性同样好。而且，因为它是纯函数，它是可组合的，可以和其它高阶组件，甚至和它自身组合。

你可能发现了高阶组件和**容器组件**模式的相似之处。容器组件是专注于在高层和低层关注之间进行责任分离的策略的一部分。容器管理的事情诸如订阅和状态，传递props属性给某些组件。这些组件处理渲染UI等事情。高阶组件使用容器作为他们实现的一部分。你也可以认为高阶组件就是参数化的容器组件定义。

## 约定：贯穿传递不相关props属性给被包裹的组件

高阶组件添加了一些特性到一个组件，他们不应该大幅修改它的合约。被期待的是，从高阶组件返回的那个组件与被包裹的组件具有类似的接口。

高阶组件应该贯穿传递与它专门关注无关的props属性。大多数高阶组件都包含类似如下的渲染方法：

```js
render() {
  // 过滤掉专用于这个阶组件的props属性，
  // 不应该被贯穿传递
  const { extraProp, ...passThroughProps } = this.props;

  // 向被包裹的组件注入props属性，这些一般都是状态值或
  // 实例方法
  const injectedProp = someStateOrInstanceMethod;

  // 向被包裹的组件传递props属性
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

这个约定帮助确保高阶组件最大程度的灵活性和可重用性。

## 约定：最大化的组合性

并不是所有的高阶组件看起来都是一样的。有时，它们仅接收单独一个参数，即被包裹的组件：

```js
const NavbarWithRouter = withRouter(Navbar);
```

一般而言，高阶组件会接收额外的参数。在下面这个来自Relay的示例中，一个`config`对象用于指定组件的数据依赖：

```js
const CommentWithRelay = Relay.createContainer(Comment, config);
```

高阶组件最常见签名如下所示：

```js
// React Redux's `connect`
const ConnectedComment = connect(commentSelector, commentActions)(Comment);
```

*什么？！* 如果你把它剥开，你就很容易看明白到底是怎么回事了。

```js
// connect是一个返回函数的函数（译者注：就是个高阶函数）
const enhance = connect(commentListSelector, commentListActions);
// 返回的函数就是一个高阶组件，该高阶组件返回一个组件被连接
// 到Redux store
const ConnectedComment = enhance(CommentList);
```

换句话说，`connect` 是一个返回高阶组件的高阶函数！

这种形式有点让人迷惑，有点多余，但是它有一个有用的性质。那就是，单独一个参数的高阶组件，类似 `connect` 函数返回的，签名是`Component => Component`。输入和输出类型相同的函数确实是很容易组合在一起。

<!-- 对以下代码的个人理解：第一段代码对初始组件进行了两次包装；第二段代码就是函数的柯里化 -->

```js
// 不要这样做……
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))

// ……你可以使用一个函数组合工具
// compose(f, g, h) 和 (...args) => f(g(h(...args)))是一样的
const enhance = compose(
  // 这些都是单独一个参数的高阶组件
  withRouter,
  connect(commentSelector)
)
const EnhancedComponent = enhance(WrappedComponent)
```

（这个同样的性质也允许`connect`函数和其它增强型高阶组件被用作装饰器，这是一个试验JavaScript建议。）

包括lodash（比如说[`lodash.flowRight`](https://lodash.com/docs/#flowRight)）, [`Redux`](http://redux.js.org/docs/api/compose.html) 和 [`Ramda`](http://ramdajs.com/docs/#compose)在内的许多第三方库都提供了类似`compose`功能的函数。

## 约定：包装显示名字以便于调试

高阶组件创建的容器组件在[`React Developer Tools`](https://github.com/facebook/react-devtools)中的表现和其它的普通组件是一样的。为了便于调试，可以选择一个显示名字，传达它是一个高阶组件的结果。

最常用的技术是包裹显示名字给被包裹的组件。所以，如果你的高阶组件名字是 `withSubscription`，且被包裹的组件的显示名字是 `CommentList`，那么就是用 `WithSubscription(CommentList)`这样的显示名字：

```js
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {/* ... */}
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```

## 告诫

如果你是React新手，你要知道高阶组件自身也有一些不是太明显的告诫。

### 不要在render方法内使用高阶组件

React的差分算法（称为协调）使用组件标识确定是否更新现有的子树或扔掉它并重新挂载一个新的。如果`render`方法返回的组件和前一次渲染返回的组件是完全相同的(`===`)，React就递归地更新子树，这是通过差分它和新的那个完成。如果它们不相等，前一个子树被完全卸载掉。

一般而言，你不需要考虑差分算法的原理。但是它和高阶函数有关。因为它意味着你不能在组件的`render`方法之内应用高阶函数到组件：

```js
render() {
  // 每一次渲染，都会创建一个新的EnhancedComponent版本
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // 那引起每一次都会使子对象树完全被卸载/重新加载
  return <EnhancedComponent />;
}
```

这里产生的问题不仅仅是性能问题——还有，重新加载一个组件会引起原有组件的状态和它的所有子组件丢失。

相反，应用高阶组件在组件定义的外面，可以使结果组件只创建一次。那么，它的标识将都是一致的遍及多次渲染。这通常是你想要的，无论如何。

在很少的情况下，你可能需要动态的应用高阶组件。你也可以在组件的生命周期方法或构造函数中操作。

### 必须将静态方法做拷贝

有时，在React组件上定义静态方法是十分有用的。例如，Relay容器就暴露一个静态方法`getFragment`便于组合GraphQL的代码片段。

当你应用一个高阶组件到一个组件时，尽管，原始组件被包裹于一个容器组件内，也就意味着新组件会没有原始组件的任何静态方法。

```js
// 定义静态方法
WrappedComponent.staticMethod = function() {/*...*/}
// 使用高阶组件
const EnhancedComponent = enhance(WrappedComponent);

// 增强型组件没有静态方法
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

为解决这个问题，在返回之前，将原始组件的方法拷贝给容器：

```js
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // 必须得知道要拷贝的方法 :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

这样做，就需要你清楚的知道都有哪些静态方法需要拷贝。你可以使用[hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics)来帮你自动处理，它会自动拷贝所有非React的静态方法：

```js
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

另外一个可能的解决方案就是分别导出组件自身的静态方法。

```js
// Instead of...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ...export the method separately...
export { someFunction };

// ...and in the consuming module, import both
import MyComponent, { someFunction } from './MyComponent.js';
```

### Refs属性不能贯穿传递

一般来说，高阶组件可以传递所有的props属性给包裹的组件，但是不能传递refs引用。因为并不是像`key`一样，refs是一个伪属性，React对它进行了特殊处理。如果你向一个由高阶组件创建的组件的元素添加ref应用，那么ref指向的是最外层容器组件实例的，而不是被包裹的组件。

现在我们提供一个名为 `React.forwardRef` 的 API 来解决这一问题（在 React 16.3 版本中）。[在 refs 传递章节中了解详情](/docs/forwarding-refs.html)。
