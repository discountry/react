---
id: dom-elements
title: DOM Elements
layout: docs
category: Reference
permalink: docs/dom-elements.html
redirect_from:
  - "docs/tags-and-attributes.html"
  - "docs/dom-differences.html"
  - "docs/special-non-dom-attributes.html"
  - "docs/class-name-manipulation.html"
  - "tips/inline-styles.html"
  - "tips/style-props-value-px.html"
  - "tips/dangerously-set-inner-html.html"
---

React实现了一套与浏览器无关的DOM系统，兼顾了性能和跨浏览器的兼容性。借此机会，我们清理了浏览器DOM实现中一些粗糙的棱角。

在React中，所有的DOM特性和属性（包括事件处理函数）都应该是小驼峰命名法命名。比如说，与HTML中的`tabindex`属性对应的React的属性是`tabIndex`。`aria-*`和`data-*`属性是例外的，一律使用小写字母命名。For example, you can keep `aria-label` as `aria-label`.

## 属性的不同

在React和Html之间有许多属性的行为是不同的：

### checked

`checked`属性受类型为`checkbox`或`radio`的`<input>`组件的支持。你可以用它来设定是否组件是被选中的。这对于构建受控组件很有用。与之相对`defaultChecked`这是非受控组件的属性，用来设定对应组件首次装载时是否选中状态。

### className

使用`className`属性指定一个CSS类。这个特性适用于所有的常规DOM节点和SVG元素，比如`<div>`，`<a>`和其它的元素。

如果你在React中使用Web组件（这是一种不常见的使用方式），请使用`class`属性来代替。

### dangerouslySetInnerHTML

`dangerouslySetInnerHTML`是React提供的替换浏览器DOM中的`innerHTML`接口的一个函数。一般而言，使用JS代码设置HTML文档的内容是危险的，因为这样很容易把你的用户信息暴露给[跨站脚本](https://en.wikipedia.org/wiki/Cross-site_scripting)攻击.所以，你虽然可以直接在React中设置html的内容，但你要使用 `dangerouslySetInnerHTML` 并向该函数传递一个含有`__html`键的对象，用来提醒你自己这样做很危险。例如：

```js
function createMarkup() {
  return {__html: 'First &middot; Second'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

### htmlFor

因为`for`是在javascript中的一个保留字，React元素使用 `htmlFor`代替。

### onChange

`onChange`事件的行为正如你所期望的：无论一个表单字段何时发生变化，这个事件都会被触发。我们故意不使用浏览器已有的默认行为，因为`onChange`在浏览器中的行为和名字不相称，React依靠这个事件实时处理用户输入。

### selected

`selected`属性被`<option>`组件支持。你可以使用该属性设定组件是否被选择。这对构建受控组件很有用。

### style

>Note
>
>Some examples in the documentation use `style` for convenience, but **使用`style` 属性作为样式化元素的主要手段一般是不推荐的。**In most cases, [`className`](#classname) should be used to reference classes defined in an external CSS stylesheet. `style` is most often used in React applications to add dynamically-computed styles at render time. See also [FAQ: Styling and CSS](/docs/faq-styling.html).

`style`属性接受一个JavaScript对象，其属性用小驼峰命名法命名，而不是接受CSS字符串。这和DOM中`style` JavaScript 属性是一致性的，是更高效的，而且能够防止XSS的安全漏洞。例如：

```js
const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function HelloWorldComponent() {
  return <div style={divStyle}>Hello World!</div>;
}
```

注意样式不会自动补齐前缀。为了支持旧的浏览器，你需要手动提供相关的样式属性：

```js
const divStyle = {
  WebkitTransition: 'all', // note the capital 'W' here
  msTransition: 'all' // 'ms' is the only lowercase vendor prefix
};

function ComponentWithTransition() {
  return <div style={divStyle}>This should work cross-browser</div>;
}
```

样式key使用小驼峰命名法是为了从JS中访问DOM节点的属性保持一致性（例如 `node.style.backgroundImage`）。供应商前缀[除了`ms`](http://www.andismith.com/blog/2012/02/modernizr-prefixed/)，都应该以大写字母开头。这就是为什么`WebkitTransition`有一个大写字母`W`。

React将自动添加一个"px"后缀到某些数字内联样式属性。如果你希望使用不同于"px"的其他单位，指定值为带渴望单位的字符串。例如：

```js
// Result style: '10px'
<div style={{ height: 10 }}>
  Hello World!
</div>

// Result style: '10%'
<div style={{ height: '10%' }}>
  Hello World!
</div>
```

不是所有样式属性被转化为像素字符串，尽管如此。某些个保持无单位(例如 `zoom`, `order`, `flex`)。A complete list of 无单位属性 can be seen [here](https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59).

### suppressContentEditableWarning

一般来说，当一个拥有子节点的元素被标记为`contentEditable`时，React会发出一个警告信息，因为此时`contentEditable`是无效的。这个属性会触发这样的警告信息。一般不要使用这个属性，除非你要构建一个类似[Draft.js](https://facebook.github.io/draft-js/)这样需要手动处理`contentEditable`属性的库。

### value

`value`属性受到`<input>` 和 `<textarea>` 组件的支持。你可以使用它设置组件的值。这对构建受控组件非常有用。`defaultValue`属性对应的是非受控组件的属性，用来设置组件第一次装载时的值。

## 所有受支持的HTML属性

As of React 16, 任何标准的[或自定义的](/blog/2017/09/08/dom-attributes-in-react-16.html) DOM属性都被充分支持。

React 总是提供一个以 JavaScript为中心的API给DOM。因为React组件对于自定义和DOM相关的属性都经常采用。React使用小驼峰约定，正如DOM API：

```js
<div tabIndex="-1" />      // Just like node.tabIndex DOM API
<div className="Button" /> // Just like node.className DOM API
<input readOnly={true} />  // Just like node.readOnly DOM API
```

这些属性的工作类似于对应的HTML属性，除了上述文档的特例。

Some of the DOM attributes supported by React include:

```
accept acceptCharset accessKey action allowFullScreen alt async autoComplete
autoFocus autoPlay capture cellPadding cellSpacing challenge charSet checked
cite classID className colSpan cols content contentEditable contextMenu controls
controlsList coords crossOrigin data dateTime default defer dir disabled
download draggable encType form formAction formEncType formMethod formNoValidate
formTarget frameBorder headers height hidden high href hrefLang htmlFor
httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list
loop low manifest marginHeight marginWidth max maxLength media mediaGroup method
min minLength multiple muted name noValidate nonce open optimum pattern
placeholder poster preload profile radioGroup readOnly rel required reversed
role rowSpan rows sandbox scope scoped scrolling seamless selected shape size
sizes span spellCheck src srcDoc srcLang srcSet start step style summary
tabIndex target title type useMap value width wmode wrap
```

Similarly, all SVG attributes are fully supported:

```
accentHeight accumulate additive alignmentBaseline allowReorder alphabetic
amplitude arabicForm ascent attributeName attributeType autoReverse azimuth
baseFrequency baseProfile baselineShift bbox begin bias by calcMode capHeight
clip clipPath clipPathUnits clipRule colorInterpolation
colorInterpolationFilters colorProfile colorRendering contentScriptType
contentStyleType cursor cx cy d decelerate descent diffuseConstant direction
display divisor dominantBaseline dur dx dy edgeMode elevation enableBackground
end exponent externalResourcesRequired fill fillOpacity fillRule filter
filterRes filterUnits floodColor floodOpacity focusable fontFamily fontSize
fontSizeAdjust fontStretch fontStyle fontVariant fontWeight format from fx fy
g1 g2 glyphName glyphOrientationHorizontal glyphOrientationVertical glyphRef
gradientTransform gradientUnits hanging horizAdvX horizOriginX ideographic
imageRendering in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength
kerning keyPoints keySplines keyTimes lengthAdjust letterSpacing lightingColor
limitingConeAngle local markerEnd markerHeight markerMid markerStart
markerUnits markerWidth mask maskContentUnits maskUnits mathematical mode
numOctaves offset opacity operator order orient orientation origin overflow
overlinePosition overlineThickness paintOrder panose1 pathLength
patternContentUnits patternTransform patternUnits pointerEvents points
pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits
r radius refX refY renderingIntent repeatCount repeatDur requiredExtensions
requiredFeatures restart result rotate rx ry scale seed shapeRendering slope
spacing specularConstant specularExponent speed spreadMethod startOffset
stdDeviation stemh stemv stitchTiles stopColor stopOpacity
strikethroughPosition strikethroughThickness string stroke strokeDasharray
strokeDashoffset strokeLinecap strokeLinejoin strokeMiterlimit strokeOpacity
strokeWidth surfaceScale systemLanguage tableValues targetX targetY textAnchor
textDecoration textLength textRendering to transform u1 u2 underlinePosition
underlineThickness unicode unicodeBidi unicodeRange unitsPerEm vAlphabetic
vHanging vIdeographic vMathematical values vectorEffect version vertAdvY
vertOriginX vertOriginY viewBox viewTarget visibility widths wordSpacing
writingMode x x1 x2 xChannelSelector xHeight xlinkActuate xlinkArcrole
xlinkHref xlinkRole xlinkShow xlinkTitle xlinkType xmlns xmlnsXlink xmlBase
xmlLang xmlSpace y y1 y2 yChannelSelector z zoomAndPan
```

You may also use custom attributes as long as they're fully lowercase.

