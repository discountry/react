---
id: web-components
title: Web Components
permalink: docs/web-components.html
redirect_from: "docs/webcomponents.html"
---

React 和 [web组件](https://developer.mozilla.org/en-US/docs/Web/Web_Components) 被用以解决不同问题。Web组件为可重用组件提供了强大的封装能力，而React则是提供了保持DOM和数据同步的声明式库。二者目标互补。作为开发者，你可以随意地在Web组件里使用React，或者在React里使用Web组件，或都有。

大部分使用 React 的开发者并不使用Web组件，但你可能想要，尤其若你正在使用那些用 Web组件编写的第三方UI组件。

## 在React中使用Web组件

```javascript
class HelloMessage extends React.Component {
  render() {
    return <div>Hello <x-search>{this.props.name}</x-search>!</div>;
  }
}
```

>注意：
>
> Web组件通常暴露一个必要的API，例如，一个`video`Web组件可能会暴露`play()`和`pause()`方法。为访问组件的必要 API，你需要使用一个引用以能够直接和DOM节点交互。若你正在使用第三方Web组件，其最好的解决方案是编写一个 React组件，以包装该 Web组件。
>
> 由Web组件触发的事件可能无法通过React渲染树来正确冒泡。
>
> 你需要手动捕获事件处理器以处理那些在React组件里的事件。 

一个普遍的困扰是 Web组件 使用 "class" 而非 "className"。

```javascript
function BrickFlipbox() {
  return (
    <brick-flipbox class="demo">
      <div>front</div>
      <div>back</div>
    </brick-flipbox>
  );
}
```

## 在Web组件中使用React

```javascript
const proto = Object.create(HTMLElement.prototype, {
  attachedCallback: {
    value: function() {
      const mountPoint = document.createElement('span');
      this.createShadowRoot().appendChild(mountPoint);

      const name = this.getAttribute('name');
      const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
      ReactDOM.render(<a href={url}>{name}</a>, mountPoint);
    }
  }
});
document.registerElement('x-search', {prototype: proto});
```
