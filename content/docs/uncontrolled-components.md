---
id: uncontrolled-components
title: 非受控组件
permalink: docs/uncontrolled-components.html
---

在大多数情况下，我们推荐使用 [受控组件](/docs/forms.html) 来实现表单。 在受控组件中，表单数据由 React 组件处理。如果让表单数据由 DOM 处理时，替代方案为使用非受控组件。

要编写一个非受控组件，而非为每个状态更新编写事件处理程序，你可以 [使用 ref](/docs/refs-and-the-dom.html) 从 DOM 获取表单值。

例如，下面的代码在非受控组件中接收单个属性。

```javascript{8,17}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={(input) => this.input = input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[在 CodePen 上尝试。](https://codepen.io/gaearon/pen/WooRWa?editors=0010)

由于非受控组件将真实数据保存在 DOM 中，因此在使用非受控组件时，更容易同时集成 React 和非 React 代码。如果你想快速而随性，这样做可以减小代码量。否则，你应该使用受控组件。

如果依然不清楚在哪种特定情况下选择哪种类型的组件，那么你应该阅读 [这篇关于受控和非受控的表单输入](http://goshakkk.name/controlled-vs-uncontrolled-inputs-react/) 了解更多。

### 默认值

在 React 的生命周期中，表单元素上的 `value` 属性将会覆盖 DOM 中的值。使用非受控组件时，通常你希望 React 可以为其指定初始值，但不再控制后续更新。要解决这个问题，你可以指定一个 `defaultValue` 属性而不是 `value`。

```javascript{7}
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Name:
        <input
          defaultValue="Bob"
          type="text"
          ref={(input) => this.input = input} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```

同样，`<input type="checkbox">` 和 `<input type="radio">` 支持 `defaultChecked`，`<select>` 和 `<textarea>` 支持 `defaultValue`.
