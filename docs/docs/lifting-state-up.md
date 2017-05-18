---
id: lifting-state-up
title: 状态提升
permalink: docs/lifting-state-up.html
prev: state-and-lifecycle.html
next: composition-vs-inheritance.html
redirect_from:
  - "docs/flux-overview.html"
  - "docs/flux-todo-list.html"
---

使用react经常会遇到的情况，几个组件需要*reflect*同样的变化数据。我们推荐将共享的数据提升到离它们最近的公共祖先组件。让我们看看实际操作中是怎么做的。

在这一节，我们将会做一个温度计算器来计算水是否在给定的温度下烧开。

我们将会从一个叫做`BoilingVerdict`的组件开始。它会接受`celsius`这个prop属性作为温度变量，然后打印出是否能烧开水：


```js{3,5}
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>水会烧开</p>;
  }
  return <p>水不会烧开</p>;
}
```



下一步，我们写一个叫做`Calculator`的组件。它会渲染一个`<input>`原生HTML元素，让你能够输入温度数据，然后在`this.state.temperature`中保存它的值。

此外，它会为目前输入框中的值渲染出`BoilingVerdict`这个组件。




```js{5,9,13,17-21}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    return (
      <fieldset>
        <legend>输入一个摄氏温度</legend>
        <input
          value={temperature}
          onChange={this.handleChange} />
        <BoilingVerdict
          celsius={parseFloat(temperature)} />
      </fieldset>
    );
  }
}
```

[Try it on CodePen.](http://codepen.io/valscion/pen/VpZJRZ?editors=0010)

## 添加第二个输入框

我们新的一个需求，就是在提供摄氏度输入的情况下，再提供一个华氏温度输入，并且它们能保持同步。

我们可以通过从`Calculator`组件中抽离一个`TemperatureInput`组件出来。我们也会给它添加一个值为字符串`c`或`f`的`scale`属性。

```js{1-4,19,22}
const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

我们现在可以对`Calculator`稍作修改，来渲染两种独立的温度输入框。

```js{5,6}
class Calculator extends React.Component {
  render() {
    return (
      <div>
        <TemperatureInput scale="c" />
        <TemperatureInput scale="f" />
      </div>
    );
  }
}
```

[Try it on CodePen.](http://codepen.io/valscion/pen/GWKbao?editors=0010)


我们现在有两个输入框，但是当你在其中一个输入时，另一个并不会更新。这与我们想要让它们保持同步的需求发生了矛盾。

另一个需要看到的是，我们此时也不能从`Calculator`组件中显示出`BoilingVerdict`组件来。`Calculator`不知道目前的温度是因为
它在`TemperatureInput`中被隐藏了。（这句有拗口）

（个人理解）另一个需要看到的是，我们此时也不能从`Calculator`组件中显示出`BoilingVerdict`组件来。`Calculator`不知道目前的温度是否烧开是因为它没有写在上一步的`TemperatureInput`示例中（其实就是`TemperatureInput`组件中没有`BoilingVerdict`组件）。

## 写转换函数

首先，我们写两个可以将摄氏度和华氏度互相转换的函数。

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```


这两个函数只是单纯转换数字。我们会写另外一个函数，它有两个参数，一个接收字符串`temperature`变量，另一个接收`convert`转换函数。整个函数会返回一个字符串。我们会使用它来计算与另一个输入有关联的当前输入框中的值。

这个函数输出的精度为小数点后三位，而一旦`temperature`是无效的时候（不满足parseFloat()的转换要求），这个函数则会返回空字符串。

```js
function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}
```


举两个例子，`tryConvert('abc', toCelsius)`会返回空字符串，而`tryConvert('10.22', toFahrenheit)`会返回`'50.396'`。

## 状态提升

到这一步为止，两个`TemperatureInput`组件都是在组件自身state中独立保存它们的值。

```js{5,9,13}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
```
但是，我们想要的是这两个输入能同步。当我们更新摄氏输入（Celsius）时，华氏度（Fahrenheit ）这个框应该能反应转换后的的温度数值，反之亦然。

在React中，状态分享是通过将state数据提升至离需要这些数据的组件最近的公共祖先组件来完成的。这就是所谓的**状态提升**。我们会将`TemperatureInput`组件自身保存的state移到`Calculator`中。

如果`Calculator`组件拥有了提升上来共享的数据，那它就会成为两个温度输入组件的“数据之源”（"source of truth" ???）。它会传递给下面温度输入组件一致的数据。由于两个`TemperatureInput`温度组件的props属性都是来源于共同的父组件`Calculator`，它们的数据总是会保持同步。

让我们一步一步来分析这个是怎么做的。

首先，我们在`TemperatureInput`组件中将`this.state.temperature`替换为`this.props.temperature`。从现在开始，我们假定`this.props.temperature`属性已经存在了，尽管我们在之后仍然需要将数据从`Calculator`组件中传进去。

```js{3}
  render() {
    // 之前的代码: const temperature = this.state.temperature;
    const temperature = this.props.temperature;
```



我们首先知道[props属性是只读的](/react/docs/components-and-props.html#props-are-read-only)
这么一个事实。而之前`temperature`变量是被保存在本地state中的，`TemperatureInput`组件只能调用`this.setState()`来改变它。但现在，`temperature`是作为prop属性从父组件传递下来的，`TemperatureInput`组件是没有控制权的。

在React中，这个问题通常是通过“被控组件”的方式来解决。就像原生DOM组件`<input>`接受`value`和`onChange`这两个prop属性值，自定义组件`TemperatureInput`也能接受来自`Calculator`父组件的`temperature`变量和`onTemperatureChange`方法作为props属性值。

做完这些，当`TemperatureInput`组件更新它的温度数值时，它会调用`this.props.onTemperatureChange`方法。

```js{3}
  handleChange(e) {
    // 之前的代码: this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
```


值得注意的是，对于在自定义组件中`temperature`和`onTemperatureChange`这些prop属性的命名没有特殊含义，我们也可以叫其他任何名字，像是`value`和`onChange`这些经常约定的惯例。

props属性`onTemperatureChange`会和`temperature`一起由父组件`Calculator`提供。这个方法会通过修改自身的状态来处理变化（？？），从而会用新值来重渲染。我们很快就会看到新的`Calculator`组件。

在我们进一步分析`Calculator`组件的变化前，我们先花点时间总结下`TemperatureInput`组件所发生的改变。我们将本地state从组件中移除，使用`this.props.temperature`替代`this.state.temperature`，当我们想要数据发生改变时，使用父组件提供的`this.props.onTemperatureChange()`而不是`this.setState()`方法：


```js{8,12}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>在{scaleNames[scale]}:中输入温度数值</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

现在让我们转向`Calculator`组件。

我们将会在本地state中存储当前输入的`temperature`和`scale`值，这是从输入组件中“提升”上来的state，将会作为“数据源”提供给两个输入组件。这是我们所需要知道的渲染两个输入组件最少的数据展示。

比如，如果我们在摄氏度输入框中输入37，那么`Calculator`的state会是：

```js
{
  temperature: '37',
  scale: 'c'
}
```

如果我们之后编辑华氏度输入框为212，那么`Calculator`的状态就会是：

```js
{
  temperature: '212',
  scale: 'f'
}
```

照理来说我们本应该都要保存两个输入的值，但这么做似乎没有必要。保存最近
改变的值和所需标识的温标单位就足够了。进一步我们可以只需基于当前的`temperature`和`scale`就可以推断出另一个输入框中的值。

这两个输入框中的值能保持同步是因为这些经过计算的值都是来源于同样的state。



```js{6,10,14,18-21,27-28,31-32,34}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}
```

[Try it on CodePen.](http://codepen.io/valscion/pen/jBNjja?editors=0010)

现在，无论你编辑哪一个输入框，`Calculator`组件中`this.state.temperature`和`this.state.scale`会更新。其中之一的输入框得到用户原样输入的值，另一个输入框总是显示基于这个值计算出的结果。

让我们梳理下编辑输入框时所发生的一系列活动：


* React在DOM原生组件`<input>`上调用指定的`onChange`函数。在本例中，指的是`TemperatureInput`组件上的`handleChange`函数。

* `TemperatureInput`组件的`handleChange`函数会在值发生变化时调用`this.props.onTemperatureChange()`函数。这些props属性，像`onTemperatureChange`都是由父组件`Calculator`提供的。

* 当最开始渲染时，`Calculator`组件把内部的`handleCelsiusChange`方法指定给摄氏输入组件`TemperatureInput`的`onTemperatureChange`方法，并且把`handleFahrenheitChange`方法指定给华氏输入组件`TemperatureInput`的`onTemperatureChange`。两个`Calculator`内部的方法都会在相应输入框被编辑时被调用。

* 在这些方法内部，`Calculator`组件会让React使用编辑输入的新值和当前输入框的温标来调用`this.setState()`方法来重渲染自身。

* React会调用`Calculator`组件的`render`方法来识别UI界面的样子。基于当前温度和温标，两个输入框的值会被重新计算。温度转换就是在这里被执行的。

* 接着React会使用`Calculator`指定的新props来分别调用`TemperatureInput`组件.React也会识别出子组件的UI界面。

* React DOM 会更新DOM来匹配对应的值。我们编辑的输入框获取新值，而另一个输入框则更新经过转换的温度值。

一切更新都是经过同样的步骤，因而输入框能保持同步的。

## 学到的课程（？？ ？）

在React应用中，对应任何可变数据理应只有一个单一“数据源”。通常，状态都是首先添加在需要渲染数据的组件中。此时，如果另一个组件也需要这些数据，你可以将数据提升至离它们最近的公共祖先组件中。或许你应该读一读 [top-down data flow](/react/docs/state-and-lifecycle.html#the-data-flows-down).而不是尝试在不同组件中同步状态。

状态提升比双向绑定方式要写更多的“模版代码”，但带来的好处是，这种方式带来更少的寻找和定位bug的工作。由于所有状态都保存在一些特定组件中，并且只有这些特定组件才能改变状态，潜在的发生bug的地方会被极大的减少。此外，你可以增强自定义逻辑来拒绝或者转变用户输入。



如果某些数据可以由props或者state提供，那么它很有可能不应该在state中。举个例子，我们仅仅保存最新的编辑过的`temperature`和`scale`值，而不是都保存`celsiusValue`和`fahrenheitValue`。另一个输入框中的值总是可以在`render()`函数中由这些保存的数据计算出来。这可以让我们处理用户输入的时无需损失精度就能清除或者四舍五入到另一个数值域。（？？？）


当你看到在UI界面上出问题时，你可以使用 [React Developer Tools](https://github.com/facebook/react-devtools)来检查props属性，并且可以点击查看组件树，直到你找到与状态更新相关的组件。这能让你到追踪
bug知道问题源头。


<img src="/react/img/docs/react-devtools-state.gif" alt="Monitoring State in React DevTools" width="100%">
