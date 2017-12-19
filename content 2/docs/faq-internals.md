---
id: faq-internals
title: Virtual DOM and Internals
permalink: docs/faq-internals.html
layout: docs
category: FAQ
---

### 什么是虚拟DOM（Virtual DOM）

虚拟DOM（VDOM）是一种编程概念，是指虚拟的视图被保存在内存中，并通过诸如ReactDOM这样的库与“真实”的DOM保持同步。这个过程被称为[和解](/docs/reconciliation.html)。

这种编程方法使用了React的声明式API：你需要告诉React你想让视图处于什么状态，React则负责确保DOM与该状态相匹配。因此你在构建你的应用时不必自己去完成属性操作、事件处理、DOM更新，React会替你完成这一切。

由于“虚拟DOM”更像一种模式而不是特定的技术，有时候我们也会用它表示其他的意思。在React的世界中，由于 “虚拟DOM” 和 [React元素](/docs/rendering-elements.html) 都是用于表示视图的对象，因此常常被关联在一起。然而React也使用被称为“fibers”的对象来存放组件树的附加信息。在React中，它们也被认为是“虚拟DOM”实现的一部分。

### 影子DOM（Shadow DOM）和虚拟DOM（Virtual DOM）是相同的概念吗？

不，它们并不是相同的概念。影子DOM是一种浏览器技术，主要被设计用来为Web组件中的变量和CSS提供封装。虚拟DOM是由JavaScript库在浏览器API之上实现的一种概念。

### 什么是“React Fiber”？

fiber是React 16中新的和解引擎。它的主要目的是使虚拟DOM能够进行增量渲染。[了解更多](https://github.com/xxn520/react-fiber-architecture-cn)。
