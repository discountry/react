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

React实现了一套与浏览器无关的DOM系统，兼顾了性能和跨浏览器的兼容性。借此机会，我们清理了浏览器DOM实现中一些不一致的问题。

在React中，所有的DOM特性和属性（包括事件处理函数）都是小驼峰命名法命名。比如说，与HTML中的`tabindex`属性对应的React实现命名则是`tabIndex`。`aria-*`和`data-*`属性是例外的，一律使用小写字母命名。

## React和HTML DOM属性的区别

有许多的属性在React和Html之间行为是不一样的：

### checked属性

`<input>`标签type属性值为`checkbox`或`radio`时，支持`checked`属性。这对于构建受控组件很有用。与之相对`defaultChecked`这是非受控组件的属性，用来设定对应组件首次加载时是否选中状态。

### 类名属性

在React中，使用`className`属性指定一个CSS类。这个特性适用于所有的常规DOM节点和SVG元素，比如`<div>`，`<a>`和其它的元素。

如果你在React中使用Web组件（这是一种不常见的使用方式），请使用`class`属性。

### dangerouslySetInnerHTML函数

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

因为在javascript中`for`是一个保留字，所以React元素使用 `htmlFor`代替。

### onChange函数

`onChange`事件处理函数的表现正如你所期望的：无论form表单何时发生变化，这个事件都会被触发。我们特意不使用浏览器已有的默认行为，因为`onChange`在浏览器中的表现和这个名字不相称，而且React真实依靠这个事件实现了对用户输入的实时响应处理。

### selected

The `selected` attribute is supported by `<option>` components. You can use it to set whether the component is selected. This is useful for building controlled components.`<option>`组件支持`selected`属性。你可以使用该属性设定组件是否选中的状态。这对构建受控组件很有用。

### style属性

 `style`属性接受一个键为小驼峰命名法命名的javascript对象作为值，而不是像css字符串。这和DOM中style属性接受javascript对象对象key的命名方式保持一致性，更高效而且能够防止跨站脚本（XSS）的安全漏洞。例如：

```js
const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function HelloWorldComponent() {
  return <div style={divStyle}>Hello World!</div>;
}
```

要注意，样式属性不会自动补齐前缀的。为了支持旧的浏览器，你需要手动支持相关的样式特性：

```js
const divStyle = {
  WebkitTransition: 'all', // note the capital 'W' here
  msTransition: 'all' // 'ms' is the only lowercase vendor prefix
};

function ComponentWithTransition() {
  return <div style={divStyle}>This should work cross-browser</div>;
}
```

样式key使用小驼峰命名法是为了和JS访问DOM特性对对象的处理保持一致性（例如 `node.style.backgroundImage`）。浏览器后缀[除了`ms`](http://www.andismith.com/blog/2012/02/modernizr-prefixed/)以外，都应该以大写字母开头。这就是为什么`WebkitTransition`有一个大写字母`W`。

### suppressContentEditableWarning

一般来说，当一个拥有子节点的元素被标记为`contentEditable`时，React会发出一个警告信息，因为此时`contentEditable`是无效的。这个属性会触发这样的警告信息。一般不要使用这个属性，除非你要构建一个类似[Draft.js](https://facebook.github.io/draft-js/)这样需要手动处理`contentEditable`属性的库。

### value

`<input>` 和 `<textarea>` 组件都支持`value`属性。你可以使用该属性设置组件的值。这对构建受控组件非常有用。`defaultValue`属性对应的是非受控组件的属性，用来设置组件第一次加载时的值。

## 所有受支持的HTML属性

React支持以下所有的属性，同时也支持所有的`data-*` 和 `aria-*`属性：

```
accept acceptCharset accessKey action allowFullScreen allowTransparency alt
async autoComplete autoFocus autoPlay capture cellPadding cellSpacing challenge
charSet checked cite classID className colSpan cols content contentEditable
contextMenu controls coords crossOrigin data dateTime default defer dir
disabled download draggable encType form formAction formEncType formMethod
formNoValidate formTarget frameBorder headers height hidden high href hrefLang
htmlFor httpEquiv icon id inputMode integrity is keyParams keyType kind label
lang list loop low manifest marginHeight marginWidth max maxLength media
mediaGroup method min minLength multiple muted name noValidate nonce open
optimum pattern placeholder poster preload profile radioGroup readOnly rel
required reversed role rowSpan rows sandbox scope scoped scrolling seamless
selected shape size sizes span spellCheck src srcDoc srcLang srcSet start step
style summary tabIndex target title type useMap value width wmode wrap
```

React也支持以下这些RDFa属性（有几个RDFa属性和HTML属性重叠，所以不包含在以下列表中）：

```
about datatype inlist prefix property resource typeof vocab
```

而且，React也支持下列非标准属性：

- `autoCapitalize autoCorrect` for Mobile Safari.
- `color` for `<link rel="mask-icon" />` in Safari.
- `itemProp itemScope itemType itemRef itemID` for [HTML5 microdata](http://schema.org/docs/gs.html).
- `security` for older versions of Internet Explorer.
- `unselectable` for Internet Explorer.
- `results autoSave` for WebKit/Blink input fields of type `search`.

## 所有受支持的SVG属性

React支持以下的SVG属性：

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
