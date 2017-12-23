---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

此参考指南记录了构成React事件系统的一部分的`SyntheticEvent`封装器。请参阅[事件处理](/docs/handling-events.html)指南了解更多。

## 概述
您的事件处理函数将会接收`SyntheticEvent`的实例，一个基于浏览器原生事件的跨浏览器实现。它拥有和浏览器原生事件一样的接口，包括`stopPropagation()`和`preventDefault()`，除了那些所有浏览器功能一样的事件。

如果由于某些原因，你得使用一些底层的浏览器事件，只需用`nativeEvent`的属性就能找到。每个`SyntheicEvent`对象都有如下属性：

```javascript
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
DOMEventTarget target
number timeStamp
string type
```

> 敲黑板：
> 由于在v0.14版本中，事件处理函数返回`false`不会再阻止事件传播, 所以必须得手动触发`e.stopPropagation()`和`e.preventDefault()` 方法。

### 事件池

`SyntheticEvent`是共享的。那就意味着在调用事件回调之后，`SyntheticEvent`对象将会被重用，并且所有属性会被置空。这是出于性能因素考虑的。
因此，您无法以异步方式访问事件。

```javascript
function onClick(event) {
  console.log(event); // => nullified object.
  console.log(event.type); // => "click"
  const eventType = event.type; // => "click"

  setTimeout(function() {
    console.log(event.type); // => null
    console.log(eventType); // => "click"
  }, 0);

  // Won't work. this.state.clickEvent will only contain null values.
  this.setState({clickEvent: event});

  // You can still export event properties.
  this.setState({eventType: event.type});
}
```

> 敲黑板：
> 
> 如果您想以异步的方式访问事件的属性值，你必须在事件回调中调用`event.persist()`方法，这样会在池中删除合成事件，并且在用户代码中保留对事件的引用。

## 支持的事件

React标准化了事件，使其在不同的浏览器中拥有一致的属性。

下面的事件处理函数由冒泡阶段的事件触发。在事件名后面加`Capture`就能在事件捕获阶段注册事件处理函数。举个例子，你可以使用`onClickCapture`代替`onClick`在事件捕获阶段来处理点击事件。

- [Clipboard Events](#clipboard-events)
- [Composition Events](#composition-events)
- [Keyboard Events](#keyboard-events)
- [Focus Events](#focus-events)
- [Form Events](#form-events)
- [Mouse Events](#mouse-events)
- [Selection Events](#selection-events)
- [Touch Events](#touch-events)
- [UI Events](#ui-events)
- [Wheel Events](#wheel-events)
- [Media Events](#media-events)
- [Image Events](#image-events)
- [Animation Events](#animation-events)
- [Transition Events](#transition-events)
- [Other Events](#other-events)

***
## 参考

### Clipboard Events

事件名:

```
onCopy onCut onPaste
```

属性:

```javascript
DOMDataTransfer clipboardData
```

* * *

### Composition Events

事件名:

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

属性:

```javascript
string data

```

* * *

### Keyboard Events

事件名:

```
onKeyDown onKeyPress onKeyUp
```

属性:

```javascript
boolean altKey
number charCode
boolean ctrlKey
boolean getModifierState(key)
string key
number keyCode
string locale
number location
boolean metaKey
boolean repeat
boolean shiftKey
number which
```

* * *

### Focus Events

事件名:

```
onFocus onBlur
```

这些焦点事件适用于React DOM中的所有元素，而不仅仅是表单元素。

属性:

```javascript
DOMEventTarget relatedTarget
```

* * *

### Form Events

事件名:

```
onChange onInput onSubmit
```

查阅[表单](/docs/forms.html)了解关于onChange事件的更多细节.

* * *

### Mouse Events

事件名:

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

 `onMouseEnter` 和 `onMouseLeave` 事件由失去焦点的元素到正在输入的元素传播，并不是普通的冒泡，也没有捕获阶段。

属性:

```javascript
boolean altKey
number button
number buttons
number clientX
number clientY
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
number pageX
number pageY
DOMEventTarget relatedTarget
number screenX
number screenY
boolean shiftKey
```

* * *

### Selection Events

事件名:

```
onSelect
```

* * *

### Touch Events

事件名:

```
onTouchCancel onTouchEnd onTouchMove onTouchStart
```

属性:

```javascript
boolean altKey
DOMTouchList changedTouches
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
boolean shiftKey
DOMTouchList targetTouches
DOMTouchList touches
```

* * *

### UI Events

事件名:

```
onScroll
```

属性:

```javascript
number detail
DOMAbstractView view
```

* * *

### Wheel Events

事件名:

```
onWheel
```

属性:

```javascript
number deltaMode
number deltaX
number deltaY
number deltaZ
```

* * *

### Media Events

事件名:

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted 
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay 
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend 
onTimeUpdate onVolumeChange onWaiting
```

* * *

### Image Events

事件名:

```
onLoad onError
```

* * *

### Animation Events

事件名:

```
onAnimationStart onAnimationEnd onAnimationIteration
```

属性:

```javascript
string animationName
string pseudoElement
float elapsedTime
```

* * *

### Transition Events

事件名:

```
onTransitionEnd
```

属性:

```javascript
string propertyName
string pseudoElement
float elapsedTime
```

* * *

### Other Events

事件名:

```
onToggle
```

