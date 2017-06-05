---
id: optimizing-performance
title: 性能优化
permalink: docs/optimizing-performance.html
redirect_from: "docs/advanced-performance.html"
---

在底层，React使用了几个灵活的技术来减少要求更新UI时DOM操作带来的开销。对于大多数应用来说，使用React会得到一个快速的用户界面而无须过多处理特定地优化工作。然而，还有些方法可以加速你的React应用。

## 使用生产版本（Use the Production Build）

若你在进行基准测试或在你的React应用中遇到性能问题，确保你在测试的是压缩过的生产构建版本。

默认情况，React包含很多有用的警告。这些警告在开发环境下非常有用。然而，他们使得React变得更大和更慢，因此你应该确保在开发应用时使用的是生产版本。

若你不是很确定你的构建环节是否正确配置，你可以通过安装[React Developer Tools for Chorme](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)进行检查。若你访问一个使用React生产模式的页面，图标会有一个黑背景色：

<img src="/react/img/docs/devtools-prod.png" style="max-width:100%" alt="React DevTools on a website with production version of React" />

若你访问的是一个使用React开发模式的页面，则图标会有一个红色背景：

<img src="/react/img/docs/devtools-dev.png" style="max-width:100%" alt="React DevTools on a website with development version of React" />

最好是在开发应用时使用开发者模式，而当部署应用提给用户时使用生产模式。

你可以在下面找到构建生产版本应用的说明。

### Create React App

若你的项目是通过 [Create React App](https://github.com/facebookincubator/create-react-app)构建，执行：

```
npm run build
```

这将会在你项目的`build/`文件夹下生成一个应用的生产版本。

记得其仅在部署生产版本之前是必须的。对于正常的开发，使用`npm start`。

### Single-File Builds

我们提供了React 和React DOM的生产就绪版本作为独立文件：

```html
<script src="https://unpkg.com/react@15/dist/react.min.js"></script>
<script src="https://unpkg.com/react-dom@15/dist/react-dom.min.js"></script>
```

记得以`.min.js`结尾的React文件仅适用于生产环境。

### Brunch

对于最高效的Brunch生产构建，安装[`uglify-js-brunch`](https://github.com/brunch/uglify-js-brunch)插件：

```
# If you use npm
npm install --save-dev uglify-js-brunch

# If you use Yarn
yarn add --dev uglify-js-brunch
```

而后，为生成生产构建，在`build`命令中增加参数`-p`：

```
brunch build -p
```

记住你仅需要处理生产构建。你不应该传递`-p`参数或将这插件应用在开发环境中，因为其会隐藏有用的React警告，并使得构建速度变更慢。

### Browserify

最有效的Browserify生产构建，安装一些插件：

```
# If you use npm
npm install --save-dev bundle-collapser envify uglify-js uglifyify 

# If you use Yarn
yarn add --dev bundle-collapser envify uglify-js uglifyify 
```

为生成一个生产构建，确保你添加了这些调整**（顺序很重要）**：

*  [`envify`](https://github.com/hughsk/envify) 确保设置了正确的构建环境。设置为全局模式（`-g`）。
*  [`uglifyify`](https://github.com/hughsk/uglifyify) 移除了开发环境下的引入。将其也设为全局模式（`-g`）。
*  [`bundle-collapser`](https://github.com/substack/bundle-collapser)插件用数字替换长的模块ID。
*  最后，构建结果流向 [`uglify-js`](https://github.com/mishoo/UglifyJS2)以方便压缩（[原因](https://github.com/hughsk/uglifyify#motivationusage)）。

例如:

```
browserify ./index.js \
  -g [ envify --NODE_ENV production ] \
  -g uglifyify \
  -p bundle-collapser/plugin \
  | uglifyjs --compress --mangle > ./bundle.js
```

>**注意：**
>
> 模块包名称为 `uglify-js`，但其提供的二进制称为`uglifyjs`。<br>
> 这并非一个拼写错误。

记住你仅需要为生产构建这么做。你不应该将这些插件应用于开发环境，因为他们会隐藏有用的React信息，并使得构建速度更慢。

### Rollup

最为有效的Rollup生产构建，安装一些插件：

```
# If you use npm
npm install --save-dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-uglify 

# If you use Yarn
yarn add --dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-uglify 
```

为创建一个生产构建，确保你添加了这些插件**（顺序很重要）**：

* [`replace`](https://github.com/rollup/rollup-plugin-replace) 确保设置了正确的构建环境。
*  [`commonjs`](https://github.com/rollup/rollup-plugin-commonjs) 为Rollup提供CommonJS规范的支持。
*  [`uglify`](https://github.com/TrySound/rollup-plugin-uglify) 插件压缩和合并最后的代码包。

```js
plugins: [
  // ...
  require('rollup-plugin-replace')({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  require('rollup-plugin-commonjs')(),
  require('rollup-plugin-uglify')(),
  // ...
]
```

完整的构建例子[查看git](https://gist.github.com/Rich-Harris/cb14f4bc0670c47d00d191565be36bf0)。

记得你仅需为生产构建处理。你不应将带有`'production'`值的`uglify`插件或`replace`插件应用于开发版本，因为他们会隐藏有用的React警告，并使得构建速度更慢。

### Webpack

>**注意：**
>
> 若你正在使用Create React App，请参考[之前的建议](#create-react-app)。<br>
> 若你直接配置Wepback，这一部分才有效。

对于最有效的Webpack生产构建，请确保将这些插件引入你的生产配置：

```js
new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production')
  }
}),
new webpack.optimize.UglifyJsPlugin()
```

你可以在[Webpack文档](https://webpack.js.org/guides/production-build/)了解到更多关于此的内容。

记住你仅需要为生产构建这么处理。你不应将带有`'production'`值的`UglifyJsPlugin` 或 `DefinePlugin`，因为他们回隐藏有用的React警告，并使得构建速度更慢。

## 使用Chrome时间轴分析组件

在**开发**模式下，你可以使用浏览器支持的性能工具直观看到组件如何装载，更新和卸载。例如

<center><img src="/react/img/blog/react-perf-chrome-timeline.png" style="max-width:100%" alt="React components in Chrome timeline" /></center>

在Chrome里处理：

1. 通过在查询字符串带 `?react_perf`加载你的应用（例如，`http://localhost:3000/?react_perf`）。

2. 打开Chrome开发者工具**[Timeline](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool)**面板并点击**记录**

3. 记录你要分析的操作。不要记录超过20秒否则Chrome可能挂起。

4. 停止记录

5. React事件将会被分类在**用户时间**标签。

注意**数字是相对的，因此组件在生产模式下渲染速度更快**。此外，这还能帮助你了解不相关的组件被错误更新，以及组件更新的频率和深度。

目前仅Chrome，Edge和IE浏览器支持这一特性，但我们使用标准的[User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) 因此我们希望更多浏览器能够支持。


## 避免协调

React构建并维护了一套内建的渲染UI表示法。其包含了从你组件返回的React元素。这一方法让React避免创建DOM节点并采用现有节点，因为这可能比JavaScript的操作要慢。有时其被称之为“虚拟DOM”，但其在React Native上也采用同样的方式。

当组件的属性或状态发生改变，React通过对新返回的元素和之前渲染的元素来决定是否需要更新真实DOM。当它们不一致时，React则会更新DOM。

在某些情况，你的组件通过重写在重渲环节开始前触发的生命周期函数`shouldComponentUpdate`来提高性能。默认情况下该函数返回`true`，使React进行更新：

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

若你知道在某些场景你的组件不需要更新，你可以从`shouldComponentUpdate`返回`false`，以忽略整个渲染环节，包括该组件`render()`函数的调用及之后的方法。

## shouldComponentUpdate实战

这是一个带有子树的组件。其中的每一个，`SCU`表示`shouldComponentUpdate`返回类型，`vDOMEq`表示渲染的React元素是否相等。最后，圆的颜色表示组件是否需要被协调。

<figure>
<img src="/react/img/docs/should-component-update.png" style="max-width:100%" />
</figure>

由于`shouldComponentUpdate`整个根子树在C2节点返回`false`，React并不会尝试渲染C2，因此甚至不会调用C4和C5的`shouldComponentUpdate`方法。

对于C1和C3来说，`shouldComponentUpdate` 返回 `true`，因此React会往下遍历叶子节点并检查他们。对于C6， `shouldComponentUpdate` 返回 `true`，由于渲染元素不相等，React不得不更新DOM。

最后一个有趣的例子是C8。React不得不渲染这一组件，但由于返回的React元素和之前渲染的相等，其非需要更新DOM。

注意React仅需要对C6进行必要的DOM操作。对于C8，其通过对比渲染过的React元素来守护，而对于C2的子树和C7来说，其没必要比较我们在`shouldComponentUpdate`保留的元素，同时`render` 方法并不会被调用。

## 举例

若你组件每次更新的唯一方式是当 `props.color` 或 `state.count` 变量改变时，你可以用`shouldComponentUpdate`来检查：

```javascript
class CounterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.color !== nextProps.color) {
      return true;
    }
    if (this.state.count !== nextState.count) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

在这段代码，`shouldComponentUpdate`仅检查`props.color` 或 `state.count`是否有任何的改变。若那些值没发生改变，则组件不会更新。若你的组件更为复杂，你可以使用一个类似的模式，在所有的`props`和`state`字段间进行“浅比较”以决定组件是否应该更新。这种模式很常见，即React提供了一个帮助程序来应用该逻辑 - 仅继承自`React.PureComponent`。因此这段代码是实现同样效果的一种相似的方式：

```js
class CounterButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

大多数时间，你可以使用`React.PureComponent`而不用自己写`shouldComponentUpdate`。其仅能处理浅比较，若属性或状态可能已经被某种浅比较会错过的方式改变，那么你无法使用它。

这对于更为复杂的数据结构来说是个问题。例如，也就是说你想要一个`ListOfWords`组件用来渲染一个以逗号分隔的单词列表，并在你每次点击父组件`WordAdder`的一个按钮时添加一个词到列表里。这段代码*不*一定能正确工作：

```javascript
class ListOfWords extends React.PureComponent {
  render() {
    return <div>{this.props.words.join(',')}</div>;
  }
}

class WordAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: ['marklar']
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // This section is bad style and causes a bug
    const words = this.state.words;
    words.push('marklar');
    this.setState({words: words});
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick} />
        <ListOfWords words={this.state.words} />
      </div>
    );
  }
}
```

问题就在于`PureComponent`仅会在`this.props.words`的新值和就旧值之间做一个简单比较。由于这段代码在`WordAdder`的`handleClick`方法改变了数组`words`，`this.props.words` 的新值和旧值之间比较是相等，即使实际数组中的词已经发生了改变。因此`ListOfWords`并不会更新，即使已经有了新的应该被渲染的词。

## 不可变数据的力量

避免这一问题的最简单的方式是避免改变你用来作为属性或状态的值。例如，之前的`handleClick`方法可以用`concat`来重写为：

```javascript
handleClick() {
  this.setState(prevState => ({
    words: prevState.words.concat(['marklar'])
  }));
}
```

ES 6对数组支持[扩展语法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) 使得其更简单。若你在使用Create React App，默认支持该语法。

```js
handleClick() {
  this.setState(prevState => ({
    words: [...prevState.words, 'marklar'],
  }));
};
```

你也可以以类似的方式重写改变对象的代码以避免更改。例如，我们有一个命名为
`colormap`的对象，同时我们想写一个改变`colormap.right` 为 `'blue'`的函数，我们可以写成：

```js
function updateColorMap(colormap) {
  colormap.right = 'blue';
}
```

为编写一个不改变原始对象的函数，我们可以使用 [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 方法：

```js
function updateColorMap(colormap) {
  return Object.assign({}, colormap, {right: 'blue'});
}
```

`updateColorMap`现在返回一个新对象，而不是改变旧的。`Object.assign`是在ES 6规范的并需要一个兼容实现：

一份用于增加[对象扩展属性](https://github.com/sebmarkbage/ecmascript-rest-spread)的JavaScript规范以使得在不改变的情况下也能够更容易更新对象：

```js
function updateColorMap(colormap) {
  return {...colormap, right: 'blue'};
}
```

若你在使用Create React App，默认情况`Object.assign`和对象扩展语法可用的。

## 使用不可变数据结构

[Immutable.js](https://github.com/facebook/immutable-js) 是解决这一问题的另一种方式。
其通过共享结构提供不可变、持久化的集合：

* *不可变*：一旦创建，该集合不能在其他任何时间点被改变。
* *持久化*：新集合可用通过之前的集合和改变创建，如集合（set）。在新的集合被创建后原本的集合仍然有效。
* *结构共享*：使用尽可能多的与原始结构相同结构创建集合，以将复制减少到最低限度以提升性能。

不可变性使得追踪改变更为容易。一次改变将会产生一次新对象，因此我们仅需要检查对象的引用是否改变。例如，在这段传统JavaScript代码：

```javascript
const x = { foo: 'bar' };
const y = x;
y.foo = 'baz';
x === y; // true
```

尽管`y`被编辑，由于其和`x`引用相同的对象，这一比较返回`true`。你可以通过immutable.js写出类似代码：

```javascript
const SomeRecord = Immutable.Record({ foo: null });
const x = new SomeRecord({ foo: 'bar' });
const y = x.set('foo', 'baz');
x === y; // false
```

在这一情况下，当改变`x`时返回一个新的引用，我们可以安全假定`x`已经改变。

其他两个类库[seamless-immutable](https://github.com/rtfeldman/seamless-immutable) 和 [immutability-helper](https://github.com/kolodny/immutability-helper) 也可以使用不可变数据。

不可变数据结构提供了一种廉价的方式以追踪对象改变，我们所需要的仅是实现`shouldComponentUpdate`。这通常能给你带来可观的性能提升。
