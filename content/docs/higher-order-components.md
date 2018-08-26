---
id: higher-order-components
title: 高阶组件
permalink: docs/higher-order-components.html
---

高阶组件（HOC）是react中对组件逻辑进行重用的高级技术。但高阶组件本身并不是React API。它只是一种模式，这种模式是由react自身的组合性质必然产生的。

具体而言，**高阶组件就是一个函数，且该函数接受一个组件作为参数，并返回一个新的组件**

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

对比组件将props属性转变成UI，高阶组件则是将一个组件转换成另一个新组件。

高阶组件在React第三方库中很常见，比如Redux的[`connect`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)方法和Relay的[`createContainer`](https://facebook.github.io/relay/docs/api-reference-relay.html#createcontainer-static-method).

在本文档中，我们将会讨论为什么高阶组件很有作用，以及该如何实现一个高阶组件。

## 使用高阶组件（HOC）解决交叉问题

> **注意**
>
> 我们曾经介绍了混入（mixins）技术来解决交叉问题。现在我们意识到混入（mixins）技术产生的问题要比带来的价值大。[更多资料](/blog/2016/07/13/mixins-considered-harmful.html)介绍了为什么我们要移除混入（mixins）技术以及如何转换你已经使用了混入（mixins）技术的组件。

在React中，组件是代码复用的主要单元。然而你会发现，一些模式并不适用传统的组件。

例如，假设你有一个`CommentList`组件，该组件从外部数据源订阅数据并渲染评论列表：

```js
class CommentList extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" 就是全局的数据源
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // 添加事件处理函数订阅数据
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // 清除事件处理函数
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // 任何时候数据发生改变就更新组件
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
- 在监听函数内， 每当数据源发生变化，都是调用 `setState`函数设置新数据。
- 卸载组件时， 移除监听函数。

设想一下，在一个大型的应用中，这种从 `DataSource` 订阅数据并调用 `setState` 的模式将会一次又一次的发生。我们就可以抽象出一个模式，该模式允许我们在一个地方定义逻辑并且能对所有的组件使用，这就是高阶组件的精华所在。

我们写一个函数，该函数能够创建类似 `CommonList` 和 `BlogPost` 从 `DataSource` 数据源订阅数据的组件 。该函数接受一个子组件作为其中的一个参数，并从数据源订阅数据作为props属性传入子组件。我们把这个函数取个名字 `withSubscription`：

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

第一个参数是包裹组件（wrapped component），第二个参数会从 `DataSource`和当前props（译者注：根据代码示例，这里应该是高阶组件的props属性）属性中检索应用需要的数据。

当 `CommentListWithSubscription` 和 `BlogPostWithSubscription` 渲染时, 会向`CommentList` 和 `BlogPost` 传递一个 `data` props属性，该 `data`属性的数据包含了从 `DataSource` 检索的最新数据：

```js{31}
// 函数接受一个组件参数……
function withSubscription(WrappedComponent, selectData) {
  // ……返回另一个新组件……
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ……注意订阅数据……
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
      // ……使用最新的数据渲染组件
      // 注意此处将已有的props属性传递给原组件
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

注意，高阶组件既不会修改input原组件，也不会使用继承复制input原组件的行为。相反，高阶组件是通过将原组件 *包裹（wrapping）* 在容器组件（container component）里面的方式来 *组合（composes）* 使用原组件。高阶组件就是一个没有副作用的纯函数。

就是这样！包裹组件接收容器组件的所有props属性以及一个新的 `data`属性，并用 `data` 属性渲染输出内容。高阶组件并不关心数据是如何以及为什么被使用，而包裹组件也不关心数据来自何处。

因为 `withSubscription` 就是一个普通函数，你可以添加任意数量的参数。例如，你或许会想使 `data` 属性可配置化，使高阶组件和包裹组件进一步隔离开。或者你想要接收一个参数用于配置 `shouldComponentUpdate` 函数，或配置数据源的参数。这些都可以实现，因为高阶组件可以完全控制新组件的定义。

和普通组件一样，`withSubscription` 和包裹组件之间的关联是完全基于 props 属性的。这就使为组件切换一个 HOC 变得非常轻松，只要保证备选的几种高阶组件向包裹组件提供是相同类型的 props 属性即可。就像上述这个例子中，在为组件切换数据源时，就会显得非常有用。

## 不要改变原始组件，使用组合

不要在高阶组件内部修改（或以其它方式修改）原组件的原型属性。

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentWillReceiveProps(nextProps) {
    console.log('Current props: ', this.props);
    console.log('Next props: ', nextProps);
  }
  // 我们返回的原始组件实际上已经
  // 被修改了。
  return InputComponent;
}

// EnhancedComponent会记录下所有的props属性
const EnhancedComponent = logProps(InputComponent);
```

上面的示例有一些问题。首先就是，input组件不能够脱离增强型组件（enhanced component）被重用。更关键的一点是，如果你用另一个高阶组件来转变 `EnhancedComponent` ，同样的也去改变 `componentWillReceiveProps` 函数时，第一个高阶组件（即EnhancedComponent）转换的功能就会被覆盖。这样的高阶组件（修改原型的高阶组件）对没有生命周期函数的无状态函数式组件也是无效的。

更改型高阶组件（mutating HOCs）泄露了组件的抽象性 —— 使用者必须知道他们的具体实现，才能避免与其它高阶组件的冲突。

不应该修改原组件，高阶组件应该使用组合技术，将input组件包含到容器组件中：

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentWillReceiveProps(nextProps) {
      console.log('Current props: ', this.props);
      console.log('Next props: ', nextProps);
    }
    render() {
      // 用容器组件组合包裹组件且不修改包裹组件，这才是正确的打开方式。
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

这个组合型高阶组件（译者注：即上面示例高阶组件）和那个更改型高阶组件实现了同样的功能，但组合型高阶组件却避免了发生冲突的可能。组合型高阶组件对类组件和无状态函数式组件适用性同样好。而且，因为它是一个纯函数，它和其它高阶组件，甚至它自身也是可组合的。

你可能发现了高阶组件和 **容器组件**的相似之处。容器组件是专注于在高层次和低层次关注点之间进行责任划分的策略的一部分。容器组件会处理诸如数据订阅和状态管理等事情，并传递props属性给展示组件。而展示组件则负责处理渲染UI等事情。高阶组件使用容器组件作为实现的一部分。你也可以认为高阶组件就是参数化的容器组件定义。

## 约定：将不相关的props属性传递给包裹组件

高阶组件给组件添加新特性。他们不应该大幅修改原组件的接口（译者注：应该就是props属性）。预期，从高阶组件返回的组件应该与原包裹的组件具有类似的接口。

高阶组件应该传递与它要实现的功能点无关的props属性。大多数高阶组件都包含一个如下的render函数：

```js
render() {
  // 过滤掉与高阶函数功能相关的props属性，
  // 不再传递
  const { extraProp, ...passThroughProps } = this.props;

  // 向包裹组件注入props属性，一般都是高阶组件的state状态
  // 或实例方法
  const injectedProp = someStateOrInstanceMethod;

  // 向包裹组件传递props属性
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

并不是所有的高阶组件看起来都是一样的。有时，它们仅仅接收一个参数，即包裹组件：

```js
const NavbarWithRouter = withRouter(Navbar);
```

一般而言，高阶组件会接收额外的参数。在下面这个来自Relay的示例中，可配置对象用于指定组件的数据依赖关系：

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
// connect是一个返回函数的函数（译者注：就是个高阶函数）
const enhance = connect(commentListSelector, commentListActions);
// 返回的函数就是一个高阶组件，该高阶组件返回一个与Redux store
// 关联起来的新组件
const ConnectedComment = enhance(CommentList);
```

换句话说，`connect` 是一个返回高阶组件的高阶函数！

这种形式有点让人迷惑，有点多余，但是它有一个有用的属性。那就是，类似 `connect` 函数返回的单参数的高阶组件有着这样的签名格式， `Component => Component`.输入和输出类型相同的函数是很容易组合在一起。

<!-- 对以下代码的个人理解：第一段代码对初始组件进行了两次包装；第二段代码就是函数的柯里化 -->

```js
// 不要这样做……
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))

// ……你可以使用一个功能组合工具
// compose(f, g, h) 和 (...args) => f(g(h(...args)))是一样的
const enhance = compose(
  // 这些都是单参数的高阶组件
  withRouter,
  connect(commentSelector)
)
const EnhancedComponent = enhance(WrappedComponent)
```


（`connect`函数产生的高阶组件和其它增强型高阶组件具有同样的被用作装饰器的能力。）

包括lodash（比如说[`lodash.flowRight`](https://lodash.com/docs/#flowRight)）, [`Redux`](http://redux.js.org/docs/api/compose.html) 和 [`Ramda`](http://ramdajs.com/docs/#compose)在内的许多第三方库都提供了类似`compose`功能的函数。

## 约定：包装显示名字以便于调试

高阶组件创建的容器组件在[`React Developer Tools`](https://github.com/facebook/react-devtools)中的表现和其它的普通组件是一样的。为了便于调试，可以选择一个好的名字，确保能够识别出它是由高阶组件创建的新组件还是普通的组件。

最常用的技术就是将包裹组件的名字包装在显示名字中。所以，如果你的高阶组件名字是 `withSubscription`，且包裹组件的显示名字是 `CommentList`，那么就是用 `WithSubscription(CommentList)`这样的显示名字：

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


## 注意事项

如果你是React新手，你要知道高阶组件自身也有一些不是太明显的使用注意事项。

### 不要在render函数中使用高阶组件

React使用的差异算法（称为协调）使用组件标识确定是否更新现有的子对象树或丢掉现有的子树并重新挂载。如果render函数返回的组件和之前render函数返回的组件是相同的，React就递归地比较新子对象树和旧的子对象树的差异，并更新旧的子对象树。如果它们不相等，就会完全卸载掉旧的子对象树。

一般而言，你不需要考虑这些细节东西。但是它对高阶函数的使用有影响，那就是你不能在组件的render函数中调用高阶函数：

```js
render() {
  // 每一次render函数调用都会创建一个新的EnhancedComponent实例
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // 每一次都会使子对象树完全被卸载或移除
  return <EnhancedComponent />;
}
```

这里产生的问题不仅仅是性能问题 —— 还有，重新加载一个组件会引起原有组件的所有状态和子组件丢失。

相反，在组件定义外使用高阶组件，可以使新组件只出现一次定义。在渲染的整个过程中，保证都是同一个组件。无论在任何情况下，这都是最好的使用方式。

在很少的情况下，你可能需要动态的调用高阶组件。那么你就可以在组件的构造函数或生命周期函数中调用。

### 必须将静态方法做拷贝

有时，给组件定义静态方法是十分有用的。例如，Relay的容器就开放了一个静态方法 `getFragment`便于组合GraphQL的代码片段。

当使用高阶组件包装组件，原始组件被容器组件包裹，也就意味着新组件会丢失原始组件的所有静态方法。

```js
// 定义静态方法
WrappedComponent.staticMethod = function() {/*...*/}
// 使用高阶组件
const EnhancedComponent = enhance(WrappedComponent);

// 增强型组件没有静态方法
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

解决这个问题的方法就是，将原始组件的所有静态方法全部拷贝给新组件：

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
// 替代……
MyComponent.someFunction = someFunction;
export default MyComponent;

// ……分别导出……
export { someFunction };

// ……在要使用的组件中导入
import MyComponent, { someFunction } from './MyComponent.js';
```

### Refs属性不能传递

一般来说，高阶组件可以传递所有的props属性给包裹的组件，但是不能传递refs引用。因为并不是像`key`一样，refs是一个伪属性，React对它进行了特殊处理。如果你向一个由高阶组件创建的组件的元素添加ref应用，那么ref指向的是最外层容器组件实例的，而不是包裹组件。

如果你碰到了这样的问题，最理想的处理方案就是搞清楚如何避免使用 `ref`。有时候，没有看过React示例的新用户在某种场景下使用prop属性要好过使用ref。

现在我们提供一个名为 `React.forwardRef` 的 API 来解决这一问题（在 React 16.3 版本中）。[在 refs 传递章节中了解详情](/docs/forwarding-refs.html)。
