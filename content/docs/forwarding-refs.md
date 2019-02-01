---
id: forwarding-refs
title: Forwarding Refs
permalink: docs/forwarding-refs.html
---
引用传递是把[引用](/docs/refs-and-the-dom.html)从组件传递到它的后代的方法.这种方法在[高阶组件](/docs/higher-order-components.html)中特别有用.

接下来我们举一个利用高阶组件打印组件属性到控制台的例子：
`embed:forwarding-refs/log-props-before.js`

这个 "logProps"高阶组件把所有属性传递给它包装的组件，所以渲染后的结果将是一样的。例如，我们可以用这个高阶组件记录所有传递到我们的"fancy button" 组件：
`embed:forwarding-refs/fancy-button.js`

上面的例子有个问题：refs属性不会被传递下去。因为`ref`不是一个属性。就像`key`,react用不一样的方式处理它们。
如果你在高阶组件上添加ref属性，ref属性只会指向最外层的容器组件，而不是被包装的组件。

这意味着我们想要ref关联到`FancyButton`组件，但实际上ref被关联到到`LogProps`组件：
`embed:forwarding-refs/fancy-button-ref.js`

幸运的是，我们可以通过使用`React.forwardRef`API指定指向内部`FancyButton`组件的引用.
`React.forwardRef` 接收一个参数为`props`和`ref`并且返回类型是React节点的函数。例如：
`embed:forwarding-refs/log-props-after.js`



