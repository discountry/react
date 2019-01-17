---
id: reconciliation
title: 协调（Reconciliation）
permalink: docs/reconciliation.html
---

React提供了一组声明式API以让你不必担心每次更新精确地改变了什么。这使得应用的编写容易了很多，但这是在React中如何实现并不是很明显。这篇文章解释了在React中的“差分(diffing)”算法中我们所做出的选择，以让组件更新是可预测的，并且足够快以适应高性能应用。

>译者注：**diffing**算法用来找出两棵树的所有不同点，类似于游戏“找别扭”。

## 目的

当你使用React，在某一个时间点，你可以认为`render()`函数是在创建React元素树。在下一状态或属性更新时，`render()`函数将返回一个不同的React元素树。React需要算出如何高效更新UI以匹配最新的树。

有一些通用的解决方案，对于生成最小操作数的这个算法问题，以将一棵树转换为另一棵树。然而，在[state of the art algorithms](http://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf) 中有时间复杂度为O(n<sup>3</sup>)，在这里n代表树中元素个数。

若我们在React中使用，展示1000个元素则需要进行10亿次的比较。这太过昂贵。与此不同，React基于两点假设，实现了一个启发的O(n)算法：

1. 两个不同类型的元素将产生不同的树。
2. 开发者可以提示哪些子元素贯穿不同渲染可能是稳定的，使用`key`属性，。

实践中，上述这些假设适用于大部分应用场景。

## 差分算法

当差分两棵树时，React首先比较两个根元素。依赖于根元素的类型不同，其行为也不同。

### 元素的类型不同

每当根元素有不同类型，React将拆除旧树并且从零开始重新构建新树。从`<a>`到`<img>`或从`<Article>`到`<Comment>`，或从`<Button>` 到 `<div>`————这些都会导致充分地重新构建。

当拆除一棵树时，旧的DOM节点被销毁。组件实例收到`componentWillUnmount()`。当构建一棵新树时，新的DOM节点被插入到DOM中。组件实例先收到`componentWillMount()`，然后收到`componentDidMount()`。任何与旧树有关的状态都被丢弃。

这个根下任何组件也都将被卸载，他们的状态被销毁。例如，当定义：

```xml
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>
```

这将销毁旧的`Counter`并重装载一个新的。

### DOM元素的类型相同

当比较两个相同类型的React DOM元素时，React则会观察二者的属性(attributes)，保持相同的底层DOM节点，并仅更新变化的属性。例如：

```xml
<div className="before" title="stuff" />

<div className="after" title="stuff" />
```

通过比较这两个元素，React知道仅更改底层DOM元素的`className`。

当更新`style`时，React同样知道仅更新改变的属性(properties)。例如：

```xml
<div style={{color: 'red', fontWeight: 'bold'}} />

<div style={{color: 'green', fontWeight: 'bold'}} />
```

当在两个元素之间转化时，React知道仅修改`color`样式，而`fontWeight`不用修改。

在处理完DOM元素后，React递归其子代。

### 组件元素的类型相同

当组件更新时，实例保持相同，这样状态跨渲染被维护。React通过更新底层组件实例的属性(props)来匹配新元素，并在底层实例上调用`componentWillReceiveProps()` 和 `componentWillUpdate()`。

下一步，`render()`方法被调用，差分算法递归处理前一次的结果和新的结果。

### 子代上的递归

默认时，当递归DOM节点的子节点时，React就是迭代在同一时间点的两个子节点列表，并在有不同时产生一个变更。

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

如果你的实现方法过于简单，插入元素到列表的开头会使得性能变坏。例如，转换这两棵树工作拙劣地：

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

React将修改每个子节点，而非意识到可以完整保留`<li>Duke</li>` 和 `<li>Villanova</li>`子树。低效成了一个问题。

### Keys

为解决该问题，React支持了一个`key`属性。当子节点有key时，React使用key来匹配原始树的子节点和随后树的子节点。例如，增加一个`key`到上面低效的示例，能让树的转换变得高效：

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

现在React知道带有`'2014'`的key的元素是新的，带有`'2015'`和`'2016'`的key的元素仅需要移动。

实践中，找到一个key通常不难。你将显示的元素可能已经带有一个唯一的ID，因此key可以来自于你的数据中：

```js
<li key={item.id}>{item.name}</li>
```

当不是这种情况时，你可以增加一个新的ID属性给模型，或根据内容的一些部分创建一个哈希值来作为key。key必须是唯一的，只在其兄弟中，不用全局唯一。

作为最后的手段，你可以传递项目在数组中的索引作为key。若元素顺序永远不会改变，该方法效果不错，但重新排序就会很慢。

当索引用作key时，重新排序时也会引起组件状态方面的问题。组件实例进行更新和重用都是基于他们的key。如果key是索引，则移动一个项目改变索引，结果，诸如非受控输入这类的组件状态可能会以意想不到的方式混淆和更新。

[这里](https://reactjs.org/redirect-to-codepen/reconciliation/index-used-as-key)是在CodePen上使用索引作为键可能导致的问题的一个例子，[这里](https://reactjs.org/redirect-to-codepen/reconciliation/no-index-used-as-key)是同一个例子的更新版本，展示了如何不使用索引作为键将解决这些reordering, sorting, 和 prepending的问题。

## 权衡

牢记协调算法的实现细节非常重要。React可能会在每次操作时渲染整个应用；而结果仍是相同的。为保证大多数场景效率能更快，我们通常提炼启发式的算法。

在目前实现中，可以表明一个事实，即子树在其兄弟节点中移动，但你无法告知其移动到哪。该算法会重渲整个子树。

由于React依赖于该启发式算法，若其背后的假设没得到满足，则其性能将会受到影响：

1. 算法无法尝试匹配不同组件类型的子元素。若你发现两个输出非常相似的组件类型交替出现，你可能希望使其成为相同类型。实践中，我们并非发现这是一个问题。

2. Keys应该是稳定的，可预测的，且唯一的。不稳定的key（类似由`Math.random()`生成的）将使得大量组件实例和DOM节点进行不必要的重建，使得性能下降并丢失子组件的状态。
