---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

此参考指南文档化`SyntheticEvent`包裹器，构成React事件系统的一部分。请参阅[事件处理](/docs/handling-events.html)指南了解更多。

## 概述
你的事件处理器将会接收`SyntheticEvent`的实例，一个基于浏览器原生事件的跨浏览器实现。它拥有和浏览器原生事件一样的接口，包括`stopPropagation()`和`preventDefault()`，期望事件的行为跨浏览器是相同的。

如果你发现由于某些原因需要使用一些底层的浏览器事件，只需用`nativeEvent`的属性来得到它。每个`SyntheicEvent`对象都有如下属性：

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

> 注意
> 从v0.14版本，从事件处理器返回`false`将不再阻止事件传播，代替，应该手动触发`e.stopPropagation()`和`e.preventDefault()`。

### 事件池

`SyntheticEvent`是被池化的。这意味着`SyntheticEvent`对象将会被重用，并且在调用事件回调之后所有属性将会被废弃。这是出于性能因素考虑的。
因此，你访问事件不能以异步的方式。

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

> 注意
>
> 如果你想以异步的方式访问事件的属性值，你必须在事件回调中调用`event.persist()`方法，这样会在池中删除合成事件，并且允许用户代码保留对事件的引用。

## 支持的事件

React标准化了事件，使其跨不同的浏览器拥有一致的属性。

下面的事件处理器由冒泡阶段的事件触发。欲注册一个捕获阶段的事件处理器，附加`Capture`到事件名后面。举个例子，你可以使用`onClickCapture`代替`onClick`在事件捕获阶段来处理点击事件。

- [Clipboard Events](#clipboard-events)
- [Composition Events](#composition-events)
- [Keyboard Events](#keyboard-events)
- [Focus Events](#focus-events)
- [Form Events](#form-events)
- [Mouse Events](#mouse-events)
- [Pointer Events](#pointer-events)
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

The `key` property can take any of the values documented in the [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#named-key-attribute-values).

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

关于onChange事件的更多细节，查阅[表单](/docs/forms.html)

* * *

### Mouse Events

事件名:

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

 `onMouseEnter` 和 `onMouseLeave` 事件从离开的元素传播到进入的元素，并不是普通的冒泡，也没有捕获阶段。

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

### Pointer Events

Event names:

```
onPointerDown onPointerMove onPointerUp onPointerCancel onGotPointerCapture
onLostPointerCapture onPointerEnter onPointerLeave onPointerOver onPointerOut
```

The `onPointerEnter` and `onPointerLeave` events propagate from the element being left to the one being entered instead of ordinary bubbling and do not have a capture phase.

Properties:

As defined in the [W3 spec](https://www.w3.org/TR/pointerevents/), pointer events extend [Mouse Events](#mouse-events) with the following properties:

```javascript
number pointerId
number width
number height
number pressure
number tangentialPressure
number tiltX
number tiltY
number twist
string pointerType
boolean isPrimary
```

A note on cross-browser support:

Pointer events are not yet supported in every browser (at the time of writing this article, supported browsers include: Chrome, Firefox, Edge, and Internet Explorer). React deliberately does not polyfill support for other browsers because a standard-conform polyfill would significantly increase the bundle size of `react-dom`.

If your application requires pointer events, we recommend adding a third party pointer event polyfill.

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

