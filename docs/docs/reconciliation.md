---
id: reconciliation
title: 协调（Reconciliation）
permalink: docs/reconciliation.html
---

React提供了一组声明式API以让你不必关心每次更新的变化。这使得应用的编写容易了很多，但在React中如何实现并不是很清晰。这篇文章解释了React对比算法的选择以让组件更新可预测并使得高性能应用足够快。

## 目的

当你使用React，在单一时间点你可以考虑`render()`函数作为创建React元素的树。在下一次状态或属性更新，`render()`函数将返回一个不同的React元素的树。React需要算出如何高效更新UI以匹配最为接近的树。

有一些解决将一棵树转换为另一棵树的最小操作数算法问题的通用方案。然而，树中元素个数为n，[最先进的算法](http://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf) 的时间复杂度为O(n<sup>3</sup>) 。

若我们在React中使用，展示1000个元素则需要进行10亿次的比较。这操作太过昂贵，相反，React基于两点假设，实现了一个启发的O(n)算法：

1. 两个不同类型的元素将产生不同的树。
2. 通过渲染器附带`key`属性，开发者可以示意哪些子元素可能是稳定的。

实践中，上述假设适用于大部分应用场景。

## 对比算法

当对比两棵树时，React首先比较两个根节点。根据不同类型的根元素，其行为也不同。

### 元素的不同类型

每当根元素有不同类型，React将卸载旧树并重新构建新树。从`<a>`到`<img>`或从`<Article>`到`<Comment>`，或从`<Button>` 到 `<div>`，任何的调整都会导致全部重建。

当树被卸载，旧的DOM节点将被销毁。组件实例将会接收到`componentWillUnmount()`方法。当构建一棵新树，新的DOM节点被插入到DOM中。组件实例将接收到`componentWillMount()`以及之后的`componentDidMount()`。任何有关旧树的状态都将被丢弃。

下面任何组件的根节点将会被卸载同时他们的状态将销毁。例如，在进行对比：

```xml
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>
```

这将会销毁旧的`Counter`并重装新节点。

### 相同类型的DOM元素

当比较两个相同类型的React DOM元素时，React则会观察二者的属性，保持相同的底层DOM节点，并仅更新变化的属性。例如：

```xml
<div className="before" title="stuff" />

<div className="after" title="stuff" />
```

通过比较两个元素，React知道仅更改底层DOM元素的`className`。

当更新`style`时，React同样知道仅更新变更的属性。例如：

```xml
<div style={{'{{'}}color: 'red', fontWeight: 'bold'}} />

<div style={{'{{'}}color: 'green', fontWeight: 'bold'}} />
```

当在调整两个元素时，React知道仅改变`color`样式而不是`fontWeight`。

在处理完DOM元素后，React递归其子元素。

### 相同类型的组件元素

当组件更新时，实例仍保持一致，以让状态能够在渲染之间保留。React更新底层组件实例的属性以满足新元素，并在底层实例上调用`componentWillReceiveProps()` 和 `componentWillUpdate()` 方法。

接下来，`render()`方法被调用，同时对比算法会递归处理之前的结果和新的结果。

### 递归子节点

默认时。当递归DOM节点的子节点，React仅在同一时间点递归两个子节点列表，并在有不同时产生一个变更。

例如，当在子节点末尾增加一个元素，两棵树的转换效果很好：

```xml
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
```

React将会匹配两棵树的`<li>first</li>`，并匹配两棵树的`<li>second</li>` 节点，并插入`<li>third</li>`节点树。

若原生实现，在开始插入元素会使得性能更棘手。例如，两棵树的转换效果则比较糟糕：

```xml
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```

React会调整每个子节点，而非意识到可以完整保留`<li>Duke</li>` 和 `<li>Villanova</li>`子树。低效成了一个问题。

### Keys

为解决该问题，React支持了一个`key`属性。当子节点有key时，React使用key来匹配原本树的子节点和新树的子节点。例如，增加一个`key`在之前效率不高的样例中能让树的转换变得高效：

```xml
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

现在React知道带有`'2014'`的key的元素是新的，并仅移动带有`'2015'`和`'2016'`的key的元素。

实践中，发现key通常不难。你将展示的元素可能已经带有一个唯一的ID，因此key可以来自于你的数据中：

```js
<li key={item.id}>{item.name}</li>
```

当这已不再是问题，你可以增加一个新的ID属性到数据层或内容的部分哈希值以生成key。key必须在其兄弟节点中是唯一的，而非全局唯一。

万不得已，你可以传递他们在数组中的索引作为key。若元素没有重排，该方法效果不错，但重排会使得其变慢。

## 权衡

牢记协调算法的实现细节非常重要。React可能会在每次操作时渲染整个应用；而结果仍是相同的。为保证大多数场景效率能更快，我们通常提炼启发式的算法。

在目前实现中，可以表明一个事实，即子树在其兄弟节点中移动，但你无法告知其移动到哪。该算法会重渲整个子树。

由于React依赖于该启发式算法，若其背后的假设没得到满足，则其性能将会受到影响：

1. 算法无法尝试匹配不同组件类型的子元素。若你发现两个输出非常相似的组件类型交替出现，你可能希望使其成为相同类型。实践中，我们并非发现这是一个问题。

2. Keys应该是稳定的，可预测的，且唯一的。不稳定的key（类似由`Math.random()`生成的）将使得大量组件实例和DOM节点进行不必要的重建，使得性能下降并丢失子组件的状态。
