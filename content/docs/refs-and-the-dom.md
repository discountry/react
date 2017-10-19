---
id: refs-and-the-dom
title: Refs & DOM
redirect_from:
  - "docs/working-with-the-browser.html"
  - "docs/more-about-refs.html"
  - "docs/more-about-refs-ko-KR.html"
  - "docs/more-about-refs-zh-CN.html"
  - "tips/expose-component-functions.html"
  - "tips/children-undefined.html"
permalink: docs/refs-and-the-dom.html
---

在典型的 React 数据流中, [属性（props）](/docs/components-and-props.html)是父组件与子代交互的唯一方式。要修改子组件，你需要通用新的 props 重新渲染它。但是，某些情况下你需要在典型数据流外强制修改子代。要修改的子代可以是 React 组件实例，也可以是 DOM 元素。对于这两种情况，React 提供了解决办法。

### 何时使用 Refs

下面是几个适合使用 refs 的情况：

* 处理焦点、文本选择或媒体控制。
* 触发强制动画。
* 集成第三方 DOM 库

如果可以通过声明式实现，则尽量避免使用 refs。

例如，不要在 `Dialog` 组件上直接暴露 `open()` 和 `close()` 方法，最好传递 `isOpen` 属性。

### 不要过度使用 Refs

你可能首先会想到在你的应用程序中使用 refs 来更新组件。如果是这种情况，请花一点时间，更多的关注在组件层中使用 state。在组件层中，通常较高级别的 state 更为清晰。有关示例，请参考[状态提升](/docs/lifting-state-up.html).

### 为 DOM 元素添加 Ref

React 支持给任意组件添加特殊属性。`ref` 属性接受一个回调函数，它在组件被加载或卸载时会立即执行。

当给 HTML 元素添加 `ref` 属性时，`ref` 回调接收了底层的 DOM 元素作为参数。例如，下面的代码使用 `ref` 回调来存储 DOM 节点的引用。

```javascript{8,9,19}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.focus = this.focus.bind(this);
  }

  focus() {
    // 直接使用原生 API 使 text 输入框获得焦点
    this.textInput.focus();
  }

  render() {
    // 使用 `ref` 的回调将 text 输入框的 DOM 节点存储到 React 
    // 实例上（比如 this.textInput）
    return (
      <div>
        <input
          type="text"
          ref={(input) => { this.textInput = input; }} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focus}
        />
      </div>
    );
  }
}
```

React 组件在加载时将 DOM 元素传入 `ref` 的回调函数，在卸载时则会传入 `null`。

为了在类上设置一个属性使用 `ref` 回调是访问 DOM 元素的常见模式。首先的方法就如上面的例子中一样设置 `ref`。甚至还有更简短的写法： `ref={input => this.textInput = input}`。

### 为类组件添加 Ref

当 `ref` 属性用于使用 class 声明的自定义组件时，`ref` 的回调接收的是已经加载的 React 实例。例如，如果我们想修改 `CustomTextInput` 组件，实现它在加载后立即点击的效果：

```javascript{3,9}
class AutoFocusTextInput extends React.Component {
  componentDidMount() {
    this.textInput.focus();
  }

  render() {
    return (
      <CustomTextInput
        ref={(input) => { this.textInput = input; }} />
    );
  }
}
```

需要注意的是，这种方法仅对 `class` 声明的 `CustomTextInput` 有效：

```js{1}
class CustomTextInput extends React.Component {
  // ...
}
```

### Refs 与函数式组件

**你不能在函数式组件上使用 `ref` 属性**，因为它们没有实例：

```javascript{1,7}
function MyFunctionalComponent() {
  return <input />;
}

class Parent extends React.Component {
  render() {
    // 这里 `ref` 无效！
    return (
      <MyFunctionalComponent
        ref={(input) => { this.textInput = input; }} />
    );
  }
}
```

如果你想使用 `ref`，就像你想使用生命周期方法或者 state 一样，应该将其转换为 `class` 组件。

但是，你可以在函数式组件内部使用 `ref`，只要它指向一个 DOM 元素或者 class 组件：

```javascript{2,3,6,13}
function CustomTextInput(props) {
  // 这里必须声明 textInput，这样 ref 回调才可以引用它
  let textInput = null;

  function handleClick() {
    textInput.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={(input) => { textInput = input; }} />
      <input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  );  
}
```

### 对父组件暴露 DOM 节点

在极少数情况下，你可能希望从父组件访问子节点的 DOM 节点。通常不建议这样做，因为它会破坏组件的封装，但偶尔也可用于触发焦点或测量子 DOM 节点的大小或位置。

虽然你可以[向子组件添加 ref](#adding-a-ref-to-a-class-component),但这不是一个理想的解决方案，因为你只能获取组件实例而不是 DOM 节点。并且，它还在函数式组件上无效。

相反，在这种情况下，我们建议在子节点上暴露一个特殊的属性。子节点将会获得一个函数属性，并将其作为 `ref` 属性附加到 DOM 节点。这允许父代通过中间件将 `ref` 回调给子代的 DOM 节点。

适用于类组件和函数式组件。

```javascript{4,13}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```

在上面的例子中，`Parent` 将它的 ref 回调作为一个特殊的 `inputRef` 传递给 `CustomTextInput`，然后 `CustomTextInput` 通过 `ref` 属性将其传递给 `<input>`。最终，`Parent` 中的 `this.inputElement` 将被设置为与 `CustomTextInput` 中的 `<input>` 元素相对应的 DOM 节点。

请注意，上述示例中的 `inputRef` 属性没有特殊的含义，它只是一般的组件属性。然而，使用 `<input>` 本身的 ref 属性很重要，因为它告诉 React 将 ref 附加到它的 DOM 节点。

即使 `CustomTextInput` 是一个函数式组件，它也同样有效。与[只能为 DOM 元素和 class 组件指定的 ref](#refs-and-functional-components) 不同，诸如 `inputRef` 这种自定义的组件属性则没有限制。

这种模式的另一个好处是它能作用很深。假如有个 `Parent` 组件不需要 DOM 节点 A，但是某个渲染 `Parent` 的组件（我们称之为 `Grandparent`）需要通过它访问。这时我们可以让 `Grandparent` 传递 `inputRef` 给 `Parent` 组件，然后让 `Parent` 组件将其转发给 `CustomTextInput`:

```javascript{4,12,22}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

function Parent(props) {
  return (
    <div>
      My input: <CustomTextInput inputRef={props.inputRef} />
    </div>
  );
}


class Grandparent extends React.Component {
  render() {
    return (
      <Parent
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```

上面的例子中，`Grandparent` 首先指定了 ref 回调函数。它通过一个常规的 `inputRef` 属性被传递到 `Parent`，`Parent` 也同样把它传递给了 `CustomTextInput`。最后 `CustomTextInput` 读取了 `inputRef` 属性并将传递的函数作为 `ref` 属性附加到 `<input>`。最终，`Grandparent` 中的 `this.inputElement` 被设置为 `CustomTextInput` 的 `input` 对应的 DOM 节点。

总而言之，我们建议尽可能不暴露 DOM 节点，但这是一个有用的解决方式。请注意，此方法要求您向子组件添加一些代码，如果你无法完全控制子组件，最后的办法是使用 [`findDOMNode()`](/docs/react-dom.html#finddomnode)，但是不推荐这样做。

### 旧版 API：String 类型的 Refs

如果你之前使用过 React ，你可能了解过之前的API中的 string 类型的 ref 属性，比如 "textInput" ，你可以通过 this.refs.textInput 访问DOM节点。我们不建议使用它，因为 String 类型的 refs [存在问题](https://github.com/facebook/pull/8333#issuecomment-271648615)。它已过时并**可能会在未来的版本是移除**。如果你目前还在使用 this.refs.textInput 这种方式访问 refs ，我们建议用回调函数的方式代替。

### 注意

如果 ref 回调以内联函数的方式定义，在更新期间它会被调用两次，第一次参数是 null ，之后参数是 DOM 元素。这是因为在每次渲染中都会创建一个新的函数实例。因此，React 需要清理旧的 ref 并且设置新的。通过将 ref 的回调函数定义成类的绑定函数的方式可以避免上述问题，但是大多数情况下无关紧要。
