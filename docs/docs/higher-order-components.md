---
id: higher-order-components
title: 高阶组件
permalink: docs/higher-order-components.html
---

高阶组件（HOC）是react中对组件逻辑进行重用的高级技术。但高阶组件本身并不是React API。它们只是一种模式。这种模式是由react自身的组合性质必然产生的。

具体而言，**高阶组件就是一个函数，且该函数接受一个组件作为参数，并返回一个新的组件**
```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

对比组件将props属性转变成UI，高阶组件则是将一个组件转换成另一个新组件。

高阶组件在第三方React库中很常见，比如Redux的[`connect`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)方法和Relay的[`createContainer`](https://facebook.github.io/relay/docs/api-reference-relay.html#createcontainer-static-method).

在本文档中，我们将会讨论为什么高阶组件很有作用，以及该如何实现一个高阶组件。
## 使用高阶组件（HOC）解决交叉问题

> **注意**
>
> 我们曾经介绍了混入（mixins）技术来解决交叉问题。现在我们意识到混入（mixins）技术产生的问题要比带来的价值大。[更多资料](/react/blog/2016/07/13/mixins-considered-harmful.html)介绍了为什么我们要移除混入（mixins）技术以及如何转换你已经使用了混入（mixins）技术的组件。

在React中，组件是代码复用的主要单元。然而你会发现，一些模式并不适用传统的组件。

例如，假设你有一个`CommentList`组件，该组件从外部数据源订阅数据并渲染评论列表：

```js
class CommentList extends React.Component {
  constructor() {
    super();
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

`CommentList` 和 `BlogPost` 组件并不相同 —— 他们调用了 `DataSource` 的不同方法获取数据，并且他们渲染的输出结果也不相同。但是，他们的大部分实现逻辑是一样的：

- 挂载组件时， 向 `DataSource` 添加一个监听函数。
- 在监听函数内, 每当数据源发生变化，都是调用 `setState`函数设置新数据。
- 卸载组件时, 移除监听函数。

设想一下，在一个大型的应用中，这种从 `DataSource` 订阅数据并调用 `setState` 的模式将会一次又一次的发生。我们就可以抽象出一个模式，该模式允许我们在一个地方定义逻辑并且能在所有的组件共享使用。这就是高阶组件的精华所在。

我们写一个函数，该函数创建出从 `DataSource`订阅数据的组件，比如 `CommonList` 和 `BlogPost`。该函数接受一个子组件作为其中的一个参数，子组件会将订阅的数据作为props属性传入。我们称该函数为 `withSubscription`：

```js
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
});
```

第一个参数是包裹组件，第二个参数从 `DataSource`和当前props属性中检索应用需要的数据。

当 `CommentListWithSubscription` 和 `BlogPostWithSubscription` 渲染时, 会向`CommentList` 和 `BlogPost` 传递一个 `data` props属性，该 `data`属性的数据包含了从 `DataSource` 检索的最新数据：

```js
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

注意，高阶组件即不会修改原组件，也不会使用继承复制原组件的行为。相反，高阶组件是通过将原组件 *包裹（wrapping）* 在容器组件里面的方式来 *组合（composes）* 使用原组件。高阶组件就是一个没有副作用的纯函数。

就是这样！被包裹的组件接受容器组件的所有props属性以及一个新的 `data`属性，并用 `data` 属性渲染输出内容。高阶组件并不关心数据是如何以及为什么被使用，而被包裹组件也不关心数据来自何处。

因为 `withSubscription` 就是一个普通函数，你可以添加任意数量的参数。例如，你或许会想使 `data` 属性可配置化，使高阶组件和被包裹组件进一步隔离开。或者你想要接收一个参数用于配置 `shouldComponentUpdate` 函数，或配置数据源的参数。这些都可以实现，因为高阶组件可以完全控制组件的定义。

和普通组件一样，`withSubscription` 和被包裹组件之间的关联是完全基于props属性的。只要高级组件向被包裹组件提供相同的props属性，就可以轻松的讲一个高阶组件转换成不同的高级组件。例如，如果要改变数据获取库，这就非常有用。

## 不要改变原始组件，使用组合

不要在高阶组件内部修改原组件的原型属性（或以其它方式修改）。

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentWillReceiveProps(nextProps) {
    console.log('Current props: ', this.props);
    console.log('Next props: ', nextProps);
  }
  // The fact that we're returning the original input is a hint that it has
  // been mutated.
  return InputComponent;
}

// EnhancedComponent will log whenever props are received
const EnhancedComponent = logProps(InputComponent);
```

上面的示例有一些问题。首先就是，input组件不能够脱离增强型组件被重用。更关键的一点是，如果你用另一个高级组件作用到 `EnhancedComponent` 上，同样的也去改变 `componentWillReceiveProps` 函数时，第一个高阶组件（即EnhancedComponent）的功能就会被覆盖。这样的高阶组件（修改原型的高级组件）对没有生命周期函数的无状态函数式组件也是无效的。

更改型高阶组件（mutating HOCs）泄露了组件的抽象性 —— 使用者必须知道他们的具体实现，才能避免与其他高级组件的冲突。

不应该修改原组件，高阶组件应该通过将input组件包含到容器组件中，使用组合技术：

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentWillReceiveProps(nextProps) {
      console.log('Current props: ', this.props);
      console.log('Next props: ', nextProps);
    }
    render() {
      // Wraps the input component in a container, without mutating it. Good!
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

这个组合型高阶组件和那个更改型高阶组件实现了同样的功能，但组合型高阶组件却避免了发生冲突的可能。组合型高阶组件对类组件和无状态函数式组件适用性同样好。而且，因为它是一个纯函数，它和其它高阶组件，甚至他自身也是可组合的。

你可能发现了高阶组件和 **容器组件**的相似之处。容器组件是策略的一部分，该策略将责任在高层次和低层次关注点之间进行划分。容器组件会处理诸如数据订阅和状态管理等事情，并传递props属性给常规组件。而常规组件则负责处理渲染UI等事情。高阶组件使用容器组件作为实现的一部分。你也可以认为高阶组件就是参数化的容器组件定义。

## 约定：将不相关的props属性传递给包裹的组件

高阶组件给组件添加新特性。他们不应该大幅修改组件的接口（个人理解就是props属性）。预期，从高阶组件返回的组件应该与原包裹的组件具有类似的接口。

高阶组件应该传递与它要实现的功能点无关的props属性。大多数高阶组件都包含一个如下的render函数：

```js
render() {
  // Filter out extra props that are specific to this HOC and shouldn't be
  // passed through
  const { extraProp, ...passThroughProps } = this.props;

  // Inject props into the wrapped component. These are usually state values or
  // instance methods.
  const injectedProp = someStateOrInstanceMethod;

  // Pass props to wrapped component
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

这种约定能够确保高阶组件最大程度的灵活性和可重用性。

## 约定：最大化使用组合

并不是所有的高阶组件看起来都一样的。有时，它们仅仅接收一个参数，即包裹的组件：

```js
const NavbarWithRouter = withRouter(Navbar);
```

一般而言，高阶组件会接收额外的参数。在下面这个来自Relay的示例中，可配置对象用于指定组件的数据依赖：

```js
const CommentWithRelay = Relay.createContainer(Comment, config);
```

大部分常见高阶组件的函数签名如下所示：

```js
// React Redux's `connect`
const ConnectedComment = connect(commentSelector, commentActions)(Comment);
```

*这是什么？！* 如果你把它剥开，你就很容易看明白到底是怎么回事了。

```js
// connect is a function that returns another function
const enhance = connect(commentListSelector, commentListActions);
// The returned function is an HOC, which returns a component that is connected
// to the Redux store
const ConnectedComment = enhance(CommentList);
```
换句话说，`connect` 是一个返回高阶组件的高阶函数！

这种形式有点让人迷惑，有点多余，但是它有一个有用的属性。类似 `connect` 函数返回的单参数的高阶组件有着这样的签名格式， 'Component => Component'。输入和输出类型相同的函数真的很容易组合在一起。

```js
// Instead of doing this...
const EnhancedComponent = connect(commentSelector)(withRouter(WrappedComponent))

// ... you can use a function composition utility
// compose(f, g, h) is the same as (...args) => f(g(h(...args)))
const enhance = compose(
  // These are both single-argument HOCs
  connect(commentSelector),
  withRouter
)
const EnhancedComponent = enhance(WrappedComponent)
```

(This same property also allows `connect` and other enhancer-style HOCs to be used as decorators, an experimental JavaScript proposal.)

The `compose` utility function is provided by many third-party libraries including lodash (as [`lodash.flowRight`](https://lodash.com/docs/#flowRight)), [Redux](http://redux.js.org/docs/api/compose.html), and [Ramda](http://ramdajs.com/docs/#compose).

## Convention: Wrap the Display Name for Easy Debugging

The container components created by HOCs show up in the [React Developer Tools](https://github.com/facebook/react-devtools) like any other component. To ease debugging, choose a display name that communicates that it's the result of an HOC.

The most common technique is to wrap the display name of the wrapped component. So if your higher-order component is named `withSubscription`, and the wrapped component's display name is `CommentList`, use the display name `WithSubscription(CommentList)`:

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


## Caveats

Higher-order components come with a few caveats that aren't immediately obvious if you're new to React.

### Don't Use HOCs Inside the render Method

React's diffing algorithm (called reconciliation) uses component identity to determine whether it should update the existing subtree or throw it away and mount a new one. If the component returned from `render` is identical (`===`) to the component from the previous render, React recursively updates the subtree by diffing it with the new one. If they're not equal, the previous subtree is unmounted completely.

Normally, you shouldn't need to think about this. But it matters for HOCs because it means you can't apply an HOC to a component within the render method of a component:

```js
render() {
  // A new version of EnhancedComponent is created on every render
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // That causes the entire subtree to unmount/remount each time!
  return <EnhancedComponent />;
}
```

The problem here isn't just about performance — remounting a component causes the state of that component and all of its children to be lost.

Instead, apply HOCs outside the component definition so that the resulting component is created only once. Then, its identity will be consistent across renders. This is usually what you want, anyway.

In those rare cases where you need to apply an HOC dynamically, you can also do it inside a component's lifecycle methods or its constructor.

### Static Methods Must Be Copied Over

Sometimes it's useful to define a static method on a React component. For example, Relay containers expose a static method `getFragment` to facilitate the composition of GraphQL fragments.

When you apply an HOC to a component, though, the original component is wrapped with a container component. That means the new component does not have any of the static methods of the original component.

```js
// Define a static method
WrappedComponent.staticMethod = function() {/*...*/}
// Now apply an HOC
const EnhancedComponent = enhance(WrappedComponent);

// The enhanced component has no static method
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

To solve this, you could copy the methods onto the container before returning it:

```js
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // Must know exactly which method(s) to copy :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

However, this requires you to know exactly which methods need to be copied. You can use [hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics) to automatically copy all non-React static methods:

```js
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

Another possible solution is to export the static method separately from the component itself.

```js
// Instead of...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ...export the method separately...
export { someFunction };

// ...and in the consuming module, import both
import MyComponent, { someFunction } from './MyComponent.js';
```

### Refs Aren't Passed Through

While the convention for higher-order components is to pass through all props to the wrapped component, it's not possible to pass through refs. That's because `ref` is not really a prop — like `key`, it's handled specially by React. If you add a ref to an element whose component is the result of an HOC, the ref refers to an instance of the outermost container component, not the wrapped component.

If you find yourself facing this problem, the ideal solution is to figure out how to avoid using `ref` at all. Occasionally, users who are new to the React paradigm rely on refs in situations where a prop would work better.

That said, there are times when refs are a necessary escape hatch — React wouldn't support them otherwise. Focusing an input field is an example where you may want imperative control of a component. In that case, one solution is to pass a ref callback as a normal prop, by giving it a different name:

```js
function Field({ inputRef, ...rest }) {
  return <input ref={inputRef} {...rest} />;
}

// Wrap Field in a higher-order component
const EnhancedField = enhance(Field);

// Inside a class component's render method...
<EnhancedField
  inputRef={(inputEl) => {
    // This callback gets passed through as a regular prop
    this.inputEl = inputEl
  }}
/>

// Now you can call imperative methods
this.inputEl.focus();
```

This is not a perfect solution by any means. We prefer that refs remain a library concern, rather than require you to manually handle them. We are exploring ways to solve this problem so that using an HOC is unobservable.
