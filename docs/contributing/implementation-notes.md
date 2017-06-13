---
id: implementation-notes
title: Implementation Notes
layout: contributing
permalink: contributing/implementation-notes.html
prev: codebase-overview.html
next: design-principles.html
---
# 实现说明

  这部分来源于完成栈识别算法的笔记。它是一份技术文档并假定读者对react的公共api也包括react如何划分为核心，渲染器，识别算法有很深的理解。如果你还不熟react的[代码库](https://facebook.github.io/react/contributing/codebase-overview.html)，请首先阅读[代码库]
(https://facebook.github.io/react/contributing/codebase-overview.html)。

  栈识别算法驱动着今天所有使用react构建的产品。它位于[src/renderers/shared/reconciler](http://wwww.github.com/facebook/react/src/renderers/shared/reconciler)被React DOM和 React Native使用。
  
## 视频：从零开始构建React
 
 [Paul O'Shannessy](https://www.twitter.com/zpao)关于[如何从零构建react框架](https://www.youtube.com/watch?v=_MAD4Oly9yg)的演讲激发了写这篇文档的动力。
 
 这篇文档和他的演讲简化了真实react的代码库，因此你也许通过熟悉他们两者，可以更好的理解react代码库。
 
##总览

这个识别算法并没有公共的API.渲染器像React DOM和React Native使用它有效地更新用户使用react构建的用户界面。

## 递归装载

让我们思考你第一次装载一个组件:
```javascript
ReactDOM.render(<App />, rootEl);
```
React DOM将传递App给识别算法。 记得App是一个React元素，是一个你要渲染什么的描述,你可以认为它是一个原生对象。
```javascript
console.log(<App />);
// { type: App, props: {} }
```
这个识别算法将检查App是否是一个类或者是一个函数。如果App是一个函数，这个识别算法将调用<code>App(props)</code>返回React元素。如果App是一个类，这个识别算法将通过<code>new App(props)</code>实例化一个App，然后调用componentWillMount生命周期方法。

换句话说，这个识别算法将了解这个元素App将渲染什么。

这个步骤是递归的。App也许渲染一个Greeting组件，Greeting组件也许渲染一个Button组件，等等。这个识别算法将从上之下逐个递归每个用户定义的组件，了解每个组件将渲染什么。

你可以用一下的伪代码思考这个过程：

```javascript
function isClass(type) {
  return （Boolean(type.prototype) && Boolean(type.prototype.isReactComponent);
}
// 这个函数将传入一个React Element（如<App/>),并且返回一个DOM或者Native节点代表一个已装载的树
function mount(element) {
  var type = element.type;
  var props = element.props;

  // 通过识别这个type，调用函数或者调用类创造一个实例，并执行render方法，产生这个待渲染的元素。
  var renderedElement = null;
  if (isClass(type)) {
    // 组件类
    var publicInstance = new type(props);
    // 设置其属性
    publicInstance.props = props;
    //调用必要的声明周期方法
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    // 通过调用render方法得到待渲染的元素
    renderedElement = publicInstance.render();
  } else {
    // 无状态组件
    renderedElement = type(props);
  }
  // 这个步骤是递归的，因为一个组件也许返回另一个包含组件的react元素
  return mount(renderedElement);
  // 注意：这不是全部完成并且这个递归是无限递归的，不能终止。它仅可以处理像<App/>和<Button/>这样的自定义元素
  // 它还尚不能处理像<div/>或者</p>这样的宿主元素
}
var rootEl = document.getElementById('root');
var node = mount(<App/>);
rootEl.appendChild(node);
```

**注意**: 这确实是伪代码。它和真实的完成并不相似。它将导致栈溢出，因为我们还没有讨论如何停止这个递归。

让我们回顾下上面这个例子中的一些关键想法：

1. React Elements是一个普通对象，表示组件的类型(如App)以及组件的一些属性。
2. 用户定义的组件（如App)可能是一个类或者是函数，但是他们都返回React elements
3. 装载是一个递归的过程，在这个过程中，react将使用顶级React元素创造一颗DOM或者Native树

## 装载宿主元素

如果我们不渲染任何东西到屏幕上，那么这个步骤将是无用的。

除了用户定义的组合组件，React Elements也可以表示特定平台（"宿主”）组件。例如，Button可以从它的render方法返回一个div。

如果元素的type属性是一个字符串，我们就把它当宿主元素来处理：
```javascript
console.log(<div/>);
// {type: 'div', props: {}}
```

宿主元素里不包含用户定义的代码。

当识别算法遇到一个宿主元素时，它让渲染器负责装载它。例如，React DOM将创建一个DOM节点。元素如果有子元素，识别算法像按照上班同样的算法依次装载他们。

它并不关心子元素是宿主元素（如div,hr)还是用户定义的组合元素(如Button)。依次递归，通过父节点插入子组件产生DOM节点，形成整个完整DOM结构。

**注意**:

这个识别算法自身并不只是服务于DOM.装载过程的额外结果（在源代码中有时成为装载影像)依赖于渲染器。可能是一个DOM节点，也可能一个字符串（React DOM server）,或者在React Native中是一系列数字代表Native 视图。

我们扩展上面的代码以处理宿主元素，代码如下：

```javascript
function isClass(type) {
  // React.Component这个父类有这个标志。
  return (
    Boolean(type.prototype) && 
    Boolean(type.prototype.isReactComponent)
  );
  // 这个函数将仅处理组合类型的元素，比如，它处理<App/>和<Button/>,但不处理<div/>
}

// 这个函数将传入一个React Element（如<App/>),并且返回一个DOM或者Native节点代表一个已装载的树
function mountComposite(element) {
  var type = element.type;
  var props = element.props;

  // 通过识别这个type，调用函数或者调用类创造一个实例，并执行render方法，产生这个待渲染的元素。
  var renderedElement = null;
  if (isClass(type)) {
    // 组件类
    var publicInstance = new type(props);
    // 设置其属性
    publicInstance.props = props;
    //调用必要的声明周期方法
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    // 通过调用render方法得到待渲染的元素
    renderedElement = publicInstance.render();
  } else if (typeof type === 'function') {
    // 无状态组件
    renderedElement = type(props);
  }
  return mount(renderedElement);
}
// 这个函数仅处理宿主类型元素
// 例如，它处理<div/>和<p/>,但不是<App/>
function mountHost(element) {
  var type = element.type;
  var props = element.props;
  var children = props.children || [];
  if (!Array.isArray(children)) {
    children = [children];
  }
  children = children.filter(Boolean);
  // 这部分应该不在这个识别算法中。
  // 不同的渲染器应该初始化不同的节点
  // 例如，React Native将创建ios或者android视图。
  var node = docuemnt.createElement(type);
  Object.keys(props).forEach(propName => {
    if (propName !== 'children') {
      node.setAttribute(propName,props[propName]);
    }
  });
  // 装载子元素
  children.forEach(childElement => {
    var childNode = mount(childElement);
    node.appendChild(childNode);
  });
  return node;
}

function mount(element) {
  var type = element.type;
  if (typeof type === 'function') {
    return mountComposite(element);
  } else if (typeof type === 'string') {
    return mountHost(element);
  }
}

var rootEl = document.getElemnetById('root');
var  node = mount(<App/>);
rootEl.appendChild(node);
```

上边的代码可以运行，但是离真实的识别算法完成还很远，关键缺乏的特征是不支持更新。

## 内部实例介绍

React框架的核心特点是你可以重用一切并且不需要重建dom或者重置状态。

```javascript
ReactDOM.render(<App />, rootEl);
// 应该重用之前的DOM
ReactDOM.render(<App />, rootEl);
```

然而，我们上面完成的代码仅仅只知道如何装载初始化树。它不可以执行更新,因为它不储存所有必要的信息，例如所有的实例，或者那个DOM节点对应那个组件。

栈识别算法代码库通过在一个类中编写mount方法来解决这个问题。这种方法有许多缺点并且当前我们正在努力地重写这个识别算法。

我们将创造两个类：DOMComponent和CompositeComponent，而不是创造mountHost和mountComponent两个函数。

这两个类都有一个接受元素的构造函数，其mount方法将返回已装载的节点。 我们将用一个对应类实例化的一个工厂函数取代mount方法。

```javascript
function instantiateComponent(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // User-defined components
    return new CompositeComponent(element);
  } else if (typeof type === 'string') {
    // Platform-specific components
    return new DOMComponent(element);
  }  
}
```

首先，让我们思考CompositeComponentd的完成：

```javascript
function isClass(type) {
  return (Boolean(type.prototype) && Boolean(type.prototype.isReactComponent));
}
function instantiateComponent(element) {
  let {type} = element;
  if (typeof type === 'function' ) {
    return new CompositeComponent(element);
  } else if (typeof type === 'string') {
    return new DOMComponent(element);
  }
}
class CompositeComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedComponent = null;
    this.publiceInstance = null;
  }
  getPubliceInstance() {
    return this.publiceInstance;
  }
  mount() {
    let currentElement = this.currentElement;
    let type = currentElement.type;
    let props = currentElement.props;

    // 通过识别这个type，调用函数或者调用类创造一个实例，并执行render方法，产生这个待渲染的元素。
    let renderedElement = null;
    let publicInstance = null;
    let renderedComponent = null;
    if (isClass(type)) {
      // 组件类
      publicInstance = new type(props);
      // 设置其属性
      publicInstance.props = props;
      //调用必要的声明周期方法
      if (publicInstance.componentWillMount) {
        publicInstance.componentWillMount();
      }
      // 通过调用render方法得到待渲染的元素
      renderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // 无状态组件
      publiceInstance = null;
      renderedElement = type(props);
    }
    this.publicInstance = publicInstance;
    renderedComponent = instantiateComponent(renderedElement);
    this.renderedComponent =  renderedComponent;
    return renderedComponent.mount(renderedElement);
  }
}
```

这和之前mountComposite完成没有太多的区别，但是现在我们可以保存一些信息，比如当前元素，当前已渲染返回的组件，以及当前的组件实例用于更新使用。
注意 CompositeComponent的实例和用户定义的类实例不是一回事。CompositeComponent是我们识别算法的一部分，并且从来不暴露给用户。
我们使用这个类通过元素类型来读取用户自定义的类，并且创造它的实例。为了避免困惑，我们把CompositeComponent和DOMComponent的实例称为"内部实例"。
他们存在是为了我们可以关联一些持久数据给他们。只有渲染器和识别算法能够意识到他们的存在。与此相类似，我们叫用户定义的类实例叫"公开实例"。
这个公开实例是你在render方法和其他自定义组件方法中作为this使用的。

这个mountHost函数，重构成DOMComponent的mount方法，看上去相似：

```javascript
class DOMComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedChildren = [];
    this.node = null;
  }
  getPublicInstance() {
    return this.node;
  }
  mount() {
    let element = this.currentElement;
    let type = element.type;
    let props = element.props;
    let children = props.children || [];
    if (!Array.isArray(children)) {
      children = [children];
    }
    let node = document.createElement(type);
    this.node = node;
    Object.keys(props).forEach((propName => {
      if (propName != 'children') {
        node.setAttribute(propName,props[propName]);
      }
    }));
    let renderedChild = children.map(instantiateComponent);
    this.renderedChild = renderedChild;
    let childNodes = renderedChild.map(child => child.mount());
    childNodes.forEach(childN => {
      node.appendChild(childN);
    });
    return node;
  }
}
```
重构mountHost函数之后的主要区别是我们保持this.node和this.renderedChildren和内部DOM Component实例保持关联。我们未来将使用它们进行无痕更新。最后，无论组合还是宿主的内部实例，现在都可以指向它的子内部实例。如果一个App组件渲染一个Button类并且Button类渲染一个div，内部实例树将像下边这样：

```javascript
[object CompositeComponent] {
  currentElement: <App />,
  publicInstance: null,
  renderedComponent: [object CompositeComponent] {
    currentElement: <Button />,
    publicInstance: [object Button],
    renderedComponent: [object DOMComponent] {
      currentElement: <div />,
      node: [object HTMLDivElement],
      renderedChildren: []
    }
  }
}
```
这个内部实例树包含复合类型和宿主类型内部实例。在DOM结构里你将仅看到<div>
这个composite内部实例包含以下内容：

+ 当前元素
+ 元素类型是个类的公开实例
+ 单个待渲染的内部实例。它可能是一个DOMComponent，也可能是CompositeComponent

宿主的内部实例需要储存以下信息：

+  当前元素
+  对应的DOM节点
+  所有的子内部实例。他们既可能是一个DOMComponent也可能是一个CompositeComponent

如果你正在努力想想内部复杂程序中内部实例树是什么样子。[React开发者工具](https://github.com/facebook/react-devtools)可以给你一个直观的印象。它使用灰色高亮宿主实例，使用紫色高亮复合实例。

![](https://facebook.github.io/react/img/docs/implementation-notes-tree.png)

为了完成这次重构，我们将介绍一个函数像ReactDOM.render()来负责装载完整的树到一个容器节点。它也像ReactDOM.render()一样返回一个公开实例。

```javascript
function mountTree(element,containerNode) {
  var rootComponent = instantiateComponent(element);
  var rootNode = rootComponent.mount();
  containerNode.appendChild(rootNode);
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}
var root = document.getElementById('root');
mountTree(<App/>,root);
```

##卸载

现在我们有了可以联系他们孩子和DOM节点的内部实例，我们可以用他们完成卸载。
对于一个复合组件，调用生命周期方法递归卸载。

```javascript
class CompositeComponent {
  unmount() {
    var publicInstance = this.publicInstance;
    if (publicInstance && publicInstance.componentWillUnmount) {
      publicInstance.componentWillUnmount();
    }
    var renderedComponent = this.renderedComponent;
    renderedComponent.unmount();
  }
}
```

对于DOMComponent，卸载时会告诉每个子元素卸载:

```javascript
class DOMComponent {
  unmount() {
    var renderedChild = this.renderedChild;
    renderedChild.forEach(child => child.unmount());
  }
}
```

实际上，卸载DOM组件也需要移除事件监听器和清除一些缓存，但是我们将跳过这些细节。
我们可以增加一个一级函数叫unmountTree(containerNode)，这个函数和ReactDOM.unmountComponentAtNode()类似。

```javascript
function unmountTree(containerNode) {
  var childNode = containerNode.firstChild;
  var rootComponent = childNode._internalInstance;
  rootComponent.unmount();
  containerNode.innerHTML = '';
}
```

为了让上面的代码工作，我们需要从DOM节点中读取一个内部根实例。我们将修改mountTree()增加一个_internalInstance属性给根DOM节点。为了让mountTree可以被调用多次，我们也让mountTree来销毁已存在的DOM树。

```javascript
function mountTree(element,containerNode) {
  if (containerNode.firstChild) {
    unmountTree(containerNode);
  }
  var rootComponent = instantiateComponent(element);
  var rootNode = rootComponent.mount();
  rootNode._internalInstance = rootComponent;
  containerNode.appendChild(rootNode);
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}
```

现在重复运行unmountTree()或者运行mountTree()移除旧的dom树，运行componentWillUnmount()生命周期钩子在组件上。

## 更新

 在前面章节，我们完成了卸载。然而如果当任何属性改变就重新卸载和插入整个DOM树，那么React并没有太大的实用性。识别算法的目标是重用已存在的实例，这些实例保留对应的DOM节点和状态。
 ```javascript
 var rootEl = document.getElementById('root');
 mountTree(<App />, rootEl);
 // 应该重用已存在的DOM树
 mountTree(<App />, rootEl);
 ```

 我们将增加一个或多个方法来扩展内部实例。除了增加mount和unmount方法外,DOMComponent和CompositeComponent将完成一个叫receive(nextElement)的方法。

 <code>
 class CompositeComponent {
  // ...

  receive(nextElement) {
    // ...
  }
}

class DOMComponent {
  // ...

  receive(nextElement) {
    // ...
  }
}
 </code>
 Its job is to do whatever is necessary to bring the component (and any of its children) up to date with the description provided by the nextElement.

This is the part that is often described as "virtual DOM diffing" a
lthough what really happens is that we walk the internal tree recursively and let each internal instance receive an update.

这个函数的职责是将nextElement提供的最新描述给组件或者它的子组件。这部分经常被描述为"虚拟DOM更新"。尽管实际上发生的是我们经常说的内部实例树的递归，同时每个实例树都接受一个更新。

## 更新复合组件

当一个复合组件接受一个新元素时，我们运行componentWillUpdate这个生命周期钩子。

然后我们将用新的属性重新渲染组件并且得到新一个已渲染的元素：

```javascript
class CompositeComponent {
  receive(nextElement) {
    let prevProps = this.currentElement.props;
    let publicInstance = this.publicInstance;
    let prevRenderedComponent = this.renderedComponent;
    let prevRenderedElement = prevRenderedComponent.currentElement;
    this.currentElement = nextElement;
    let type = nextElement.type;
    let nextProps = nextElement.props;
    let renderedElement = null;
    if (isClass(type)) {
      publicInstance = new type(nextProps);
      if (publicInstance.componentWillUpdate) {
        publicInstance.componentWillUpdate(prevProps);
      }
      publicInstance.props = nextProps;
      nextRenderedElement = publicInstance.render();
    } else if (typeof type =='function') {
      nextRenderedElement = type(nextProps);
    }
    if (prevRenderedElement.type == nextRenderedElement.type) {
      prevRenderedComponent.receive(nextRenderedElement);
    }
  }
}
```
接下来，我们看下一渲染元素的类型。如果这个类型从上次渲染至今都没改变过，那么组件接下来就可以保持自身更新，而不是完全替换。

例如，如果你第一次返回的是<**Button** color="red"/>>并且第二次返回的是<**Button** color="blue">，
我们仅可以告诉对应的内部实例通过receive方法来接受下个元素。

然而，如果下一个已渲染的元素和之前已渲染的元素有不同的type，我们不能更新内部实例。一个<**button**>不可能"变成"一个<**input**>。相反，我们必须卸载已存在的内部实例同时按照已渲染元素类型对应装载一个新的内部实例。
例如，这种情况发生在当一个<**button**>要渲染成<**input**/>

```javascript
 else {
   let prevNode = prevRenderedComponent.getHostNode();
   prevRenderedComponent.unmount();
   let nextRenderedComponent = instantiateComponent(nextRenderedElement);
   let nextNode = nextRenderedComponent.mount();
   // 替换掉原来引用的子组件
   this.renderedComponent = nextRenderedComponent;
   // 用新的节点替换到之前的节点
   // 注意这是特殊的渲染器代码，理想情况下，应该把这些代码放在复合组件之外。
   prevNode.parentNode.replaceChild(nextNode, prevNode);
 }
```

综上所述，当一个复合组件接受一个新元素时，如果新元素的类型和之前的元素类型一样，那么就直接调用自身的receive方法进行更新，否则需要卸载掉原来的内部实例，在原来的地方插入一个新的元素。

还有另外一种情况，组件会重新装载而不是接受一个新元素。这种情况是元素的key已经已经变化的时候。因为这个文档已经很复杂了，我们不想在这已经复杂的文档中，在去讨论如何处理元素key。

为了我们可以在更新期间，锁定特定平台代码并且替换掉它，现在我们需要增加在内部实例中增加一个叫getHostNode的方法。它的完成在DOMComponent和CompositeComponent中是一致的。

```javascript
class CompositeComponent {
  getHostNode() {
    // 已渲染的组件会提供它，并且递归向下钻取任何复合组件
    return this.renderedComponent.getHostNode();
  }
}
class DOMComponent {
  getHostNode() {
    return this.node;
  }
}
```
##更新宿主组件

宿主组件的更新方式是不同的，如DOMComponent。当他们接受一个元素时，他们需要更新背后特定平台的视图。
以React DOM为例，这意味着更新DOM节点的属性。
然后，宿主组件需要更新他们的子节点。不像复合组件仅包含最多一个子节点。在下面这个简单的例子中，我们使用一个内部实例数组并不断迭代它。通过判断接受的元素类型和之前的元素类型是否相同来决定是更新还是取代内部实例。
真实的识别算法也考虑元素的key并且通过它来跟踪移动实现元素的插入和删除，但是在这里我们暂时不讨论这个逻辑。

```javascript
class DOMComponent {
  receive(element) {
    let prevProps = this.currentElement.props;
    let nextProps = element.props;
    let prevChildren = prevProps.children  || [];
    let nextChildren = nextProps.children  || [];
    let node = this.node;
    let prevRenderedChildren = this.renderedChildren;
    this.currentElement = element;
    Object.keys(prevProps).forEach(propName => {
      if(propName!='children' && !nextProps.hasOwnProperty(propName)) {
        node.removeAttribute(propName,prevProps[propName]);
      }
    });
    Object.keys(nextProps).forEach(propName => {
      if (propName!='children') {
        node.setAttribute(propName,nextProps[propName]);
      }
    });
    if (!Array.isArray(prevChildren)) {
      prevChildren = [prevChildren];
    }
    if (!Array.isArray(nextChildren)) {
      nextChildren = [nextChildren];
    }
    let nextRenderedChildren = [];
    let operationQueue  = [];
    for (let i = 0; i < nextChildren.length; i++) {
      let prevChild = prevRenderedChildren[i];
      if (!prevChild) {
        let nextChild = instantiateComponent(nextChildren[i]);
        let childNode = nextChild.mount();
        operationQueue.push({type: 'ADD', node});
        nextRenderedChildren.push(nextChild);
        continue;
      }
      var canUpdate = preChildren[i].type === nextChildren[i].type;
      if (!canUpdate) {
        let prevNode = prevChild.node;
        prevChild.unmount();
        let nextChild = instantiateComponent(nextChildren[i]);
        let nextNode = nextChild.mount();
        operationQueue.push({type: 'REPLACE',prevNode:prevNode,nextNode:nextNode});
        nextRenderedChildren.push(nextChild);
        continue;
      }
      prevChild.receive(nextChildren[i]);
      nextRenderedChildren.push(prevChild);
    }
    for (let j = nextChildren.length; j< prevChildren.length;j++) {
      let iprevChild = prevRenderedChildren[j];
      let iprevNode = iprevChild.node;
      iprevNode.unmount();
      operationQueue.push({type:'REMOVE',node:iprevNode});
    }
    this.renderedChildren = nextRenderedChildren;
    // 最后一步，我们执行DOM操作。另外真实的识别算法也处理了移动这种情况，所以其更复杂。
    while(operationQueue.length>0) {
      let operation = operationQueue.shift();
      switch(operation.type) {
        case 'ADD':
          this.node.appendChild(operation.node);
          break;
        case 'REPLACE':
          this.node.replaceChild(operation.prevNode,operation.nextNode);
          break;
        case 'REMOVE':
          this.node.removeChild(operation.node);
          break;
      }
    }
  }
}
```
##更新 

现在包括符合组件和宿主组件都完成了receive方法，我们可以改变以及函数mountTree仅当元素类型和最后一次相同时使用

```javascript
function mountTree(element,containerNode) {
  if (containerNode.firstChild) {
    let prevNode = containerNode.firstChild;
    let prevrootComponent = prevNode._internalInstance;
    let prevElement = prevrootComponent.currentElement;
    if (prevElement.type == element.type) {
      prevrootComponent.receive(element);
      return;
    }
    unmountTree(containerNode);
  }
  let rootComponent = instantiateComponent(element);
  let rootNode = rootComponent.mount();
  let publicInstance = rootComponent.getPublicInstance();
  rootNode._internalInstance = rootComponent;
  containerNode.appendChild(rootNode);
  return publicInstance;
}
```

现在我们使用同样的type调用mountTree两次，第二次直接重用了第一次。

```javascript
let rootEl = document.getElementById('root');
mountTree(<App/>,rootEl);
mountTree(<App/>,rootEl);
```

这些基本展现了react内部是如何运作的。

##我们还没有提什么


这份文档简化了真实的代码库。有一些方面很重要，但是我们并没有提及：

+ 组件可以渲染null,并且识别算法可以处理数组中空的字符并且能够渲染输出结果。

+ 这种识别算法也从元素中读取key并且使用它可以和数组中的元素对应起来，来实现元素的移动。关于这部分真实的React代码完成是很复杂的。

+ 渲染器使用[依赖注入](https://facebook.github.io/react/contributing/codebase-overview.html#dynamic-injection)传宿主内部实例给识别算法。例如，React DOM告诉识别算法使用ReactDOMComponent作为宿主内部实例的完成。

+ 更新子节点列表的逻辑被抽出到一个叫ReactMutiChild的方法集中，被React DOM和React Native使用。

+ 识别算法也完成了在复合组件中进行状态操作。在事件监听器中的多次更新都会被放到一次更新中。

+ 识别算法也负责增加和移除refs给复合组件和宿主节点。

+ 在DOM就绪后如componentDidMount和componentDidUpdate声明周期钩子就会被增加到回调序列中，在一次批处理中被全部执行。

+  React放当前更新到一个叫"transaction'的内部对象中。Transactions在跟踪声明周期钩子队列方面很有用，当前DOM嵌套错误警告，任何特定的全局更新。Transactions也确保React在更新后清空一切。例如，被React DOM提供的事务类将在任何更新后，重新存储输入的东西。

##跳着看代码

+ [ReactMount](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/client/ReactMount.js)处可以发现本章节中提到的mountTree和unmountTree函数。它负责装载和卸载顶级类。[ReactNativeMount](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeMount.js)完成了React Native中同样的功能。

+ [ReactDOMComponent](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/shared/ReactDOMComponent.js)是类同玉本章节中提到的DOMComponent。它完成了供React DOM渲染器使用的宿主组件类。[ReactNativeBaseComponent](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeBaseComponent.js)完成了React Native中同样的功能。

+ [ReactCompositeComponent](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactCompositeComponent.js)是等价于本章节中的CompositeComponent组件。它处理用户定义的组件并维护他们的状态。

+ [instantiateReactComponent](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/instantiateReactComponent.js)负责为元素选择正确的正确的内部实例来初始化。它等同于本章节中的instantiateComponent。

+ [ReactReconciler](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactReconciler.js) 是mountComponent,receiveComponent和unmountComponent方法的一个封装。它是内部实例背后的完成，但也包括一些辅助内部实例完成的一些代码。

+ [ReactChildReconciler](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactChildReconciler.js)实现了根据key来进行装载，更新，卸载的逻辑。

+ [ReactMultiChild](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactMultiChild.js)通过渲染器实来对子元素进行插入，删除和移动的操作队列的处理

+ 由于遗留原因mount,receive,unmount方法在React代码库中被称作mountComponent,receiveComponent和unmountComponent,并且他们也接受元素。

+ 在内部实例的属性像underscore一样带有前置下划线。在整个代码库公开部分，他们被认为是只读的。

## 将来的方向

栈识别算法有其内在的局限性比如其是同步的,不能中断当前操作,也不能将操作分块。新的Fiber识别算法还在开发当中，其架构和栈识别算法完全不同。将来，我们倾向用它取代栈识别算法，但是在那一刻到来前还有许多工作要做。

## 下一步

读下一章节来了解我们在开发React时使用的指导准则。


