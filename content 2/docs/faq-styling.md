---
id: faq-styling
title: Styling and CSS
permalink: docs/faq-styling.html
layout: docs
category: FAQ
---

### 怎样给组件添加 CSS 类?

传递一个字符串给 `className` 属性：

```jsx
render() {
  return <span className="menu navigation-menu">Menu</span>
}
```

CSS 类依赖组件的属性或状态很普遍：

```jsx
render() {
  let className = 'menu';
  if (this.props.isActive) {
    className += ' menu-active';
  }
  return <span className={className}>Menu</span>
}
```

如果你经常发现自己在写类似的代码，[classnames](https://www.npmjs.com/package/classnames) 包可以简化它。

### 可以使用行内样式吗？

是的，在[这里](/docs/dom-elements.html#style)查看关于样式的文档。

### 写行内样式不好吗？

CSS 类比起行内样式通常更加高效。

### CSS-in-JS 是什么？

"CSS-in-JS" 代表一个范式，使用 Javascript 组成CSS，而不是在额外的文件里面定义。在[这里](https://github.com/MicheleBertoli/css-in-js)查看 CSS-in-JS 库的比较。

_注意这个功能不是 React 的一部分，而是第三方库提供的。_ React 没有样式应该怎样被定义的主张；如果不信，一个好的起点是项往常一样在一个分离的 `*.css` 文件中定义你的样式，使用[`className`](/docs/dom-elements.html#classname)引用它们。

### 在 React 中如何做动画？

React 可以被用来增强动画。例如：查看 [React Transition Group](https://reactcommunity.org/react-transition-group/) 和 [React Motion](https://github.com/chenglou/react-motion)。
