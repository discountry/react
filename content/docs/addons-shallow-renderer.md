---
id: shallow-renderer
title: 浅层渲染
permalink: docs/shallow-renderer.html
layout: docs
category: Reference
---

**Importing**

```javascript
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
var ShallowRenderer = require('react-test-renderer/shallow'); // ES5 with npm
```

## 概述

当为 React 写单元测试时, 浅渲染会变得十分有用。浅渲染使您渲染组件的“第一层”，并且对组件的 render 方法的返回值进行断言，不用担心子组件的行为，组件并没有实例化或被渲染。浅渲染并不需要 DOM。

例如，如果您有如下的组件：

```javascript
function MyComponent() {
  return (
    <div>
      <span className="heading">Title</span>
      <Subcomponent foo="bar" />
    </div>
  );
}
```

你可以断言(assert)：

```javascript
import ShallowRenderer from 'react-test-renderer/shallow';

// in your test:
const renderer = new ShallowRenderer();
renderer.render(<MyComponent />);
const result = renderer.getRenderOutput();

expect(result.type).toBe('div');
expect(result.props.children).toEqual([
  <span className="heading">Title</span>,
  <Subcomponent foo="bar" />
]);
```

浅测试（Shallow testing）当前还有一些局限, 即不支持 refs。

> 注意：
>
> 我们还建议看看 Enzyme [Shallow Rendering API](http://airbnb.io/enzyme/docs/api/shallow.html)。它在相同的功能上提供了一个更棒的高级 API。

## 参考

### `shallowRenderer.render()`

你可以把 shallowRenderer 想象成一个用来渲染你正在测试的组件的“地方”，并且你可以从那里取到该组件的输出。

`shallowRenderer.render()` 和 [`ReactDOM.render()`](/docs/react-dom.html#render)很像。但是它不需要 DOM 并且只渲染一层。这就意味着你可以测试与子组件行为隔离的组件。

### `shallowRenderer.getRenderOutput()`

在 `shallowRenderer.render()` 被调用后, 你可以调用 `shallowRenderer.getRenderOutput()` 来获取浅渲染的输出.

然后，您就可以开始开始对输出进行断言了。
