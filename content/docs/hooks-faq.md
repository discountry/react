---
id: hooks-faq
title: Hooks FAQ
permalink: docs/hooks-faq.html
prev: hooks-reference.html
---

*Hooks* 是一项新功能提案，可让你在不编写类的情况下使用状态(state)和其他React功能。它们目前处于React v16.7.0-alpha中，并在[此RFC中](https://github.com/reactjs/rfcs/pull/68)进行讨论。

此页面回答了一些有关[Hooks](https://react.docschina.org/docs/hooks-overview.html)的常见问题。

<!--
  if you ever need to regenerate this, this snippet in the devtools console might help:

  $$('.anchor').map(a =>
    `${' '.repeat(2 * +a.parentNode.nodeName.slice(1))}` +
    `[${a.parentNode.textContent}](${a.getAttribute('href')})`
  ).join('\n')
-->

- [采用策略](#%E9%87%87%E7%94%A8%E7%AD%96%E7%95%A5)
  - [我是否需要重写所有类组件？](#%E6%88%91%E6%98%AF%E5%90%A6%E9%9C%80%E8%A6%81%E9%87%8D%E5%86%99%E6%89%80%E6%9C%89%E7%B1%BB%E7%BB%84%E4%BB%B6)
  - [我的现有React知识中有多少能保持相关性？](#%E6%88%91%E7%9A%84%E7%8E%B0%E6%9C%89react%E7%9F%A5%E8%AF%86%E4%B8%AD%E6%9C%89%E5%A4%9A%E5%B0%91%E8%83%BD%E4%BF%9D%E6%8C%81%E7%9B%B8%E5%85%B3%E6%80%A7)
  - [我应该使用Hooks，Class还是两者兼而有之？](#%E6%88%91%E5%BA%94%E8%AF%A5%E4%BD%BF%E7%94%A8hooksclass%E8%BF%98%E6%98%AF%E4%B8%A4%E8%80%85%E5%85%BC%E8%80%8C%E6%9C%89%E4%B9%8B)
  - [Hooks涵盖了Class的所有用例吗？](#hooks%E6%B6%B5%E7%9B%96%E4%BA%86class%E7%9A%84%E6%89%80%E6%9C%89%E7%94%A8%E4%BE%8B%E5%90%97)
  - [Hooks会替换render props和高阶组件吗？](#hooks%E4%BC%9A%E6%9B%BF%E6%8D%A2render-props%E5%92%8C%E9%AB%98%E9%98%B6%E7%BB%84%E4%BB%B6%E5%90%97)
  - [Hook对流行框架的API来说意味着什么（Redux的`connect()`和React Router等）？](#hook%E5%AF%B9%E6%B5%81%E8%A1%8C%E6%A1%86%E6%9E%B6%E7%9A%84api%E6%9D%A5%E8%AF%B4%E6%84%8F%E5%91%B3%E7%9D%80%E4%BB%80%E4%B9%88redux%E7%9A%84connect%E5%92%8Creact-router%E7%AD%89)
  - [Hooks可以使用静态类型吗？](#hooks%E5%8F%AF%E4%BB%A5%E4%BD%BF%E7%94%A8%E9%9D%99%E6%80%81%E7%B1%BB%E5%9E%8B%E5%90%97)
  - [如何测试使用Hooks的组件？](#%E5%A6%82%E4%BD%95%E6%B5%8B%E8%AF%95%E4%BD%BF%E7%94%A8hooks%E7%9A%84%E7%BB%84%E4%BB%B6)
  - [lint规则究竟强制执行了什么？](#lint%E8%A7%84%E5%88%99%E7%A9%B6%E7%AB%9F%E5%BC%BA%E5%88%B6%E6%89%A7%E8%A1%8C%E4%BA%86%E4%BB%80%E4%B9%88)
- [从 Classes 过渡到 Hooks](#%E4%BB%8E-classes-%E8%BF%87%E6%B8%A1%E5%88%B0-hooks)
  - [Class中的生命周期与Hook的对应情况](#class%E4%B8%AD%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E4%B8%8Ehook%E7%9A%84%E5%AF%B9%E5%BA%94%E6%83%85%E5%86%B5)
  - [是否有类似实例变量的东西？](#%E6%98%AF%E5%90%A6%E6%9C%89%E7%B1%BB%E4%BC%BC%E5%AE%9E%E4%BE%8B%E5%8F%98%E9%87%8F%E7%9A%84%E4%B8%9C%E8%A5%BF)
  - [我应该使用一个还是多个状态变量？](#%E6%88%91%E5%BA%94%E8%AF%A5%E4%BD%BF%E7%94%A8%E4%B8%80%E4%B8%AA%E8%BF%98%E6%98%AF%E5%A4%9A%E4%B8%AA%E7%8A%B6%E6%80%81%E5%8F%98%E9%87%8F)
  - [我可以仅在更新时运行Effect吗？](#%E6%88%91%E5%8F%AF%E4%BB%A5%E4%BB%85%E5%9C%A8%E6%9B%B4%E6%96%B0%E6%97%B6%E8%BF%90%E8%A1%8Ceffect%E5%90%97)
  - [如何获得以前的props或state？](#%E5%A6%82%E4%BD%95%E8%8E%B7%E5%BE%97%E4%BB%A5%E5%89%8D%E7%9A%84props%E6%88%96state)
  - [我该如何实现`getDerivedStateFromProps`？](#%E6%88%91%E8%AF%A5%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0getderivedstatefromprops)
  - [我可以对函数组件进行引用吗？](#%E6%88%91%E5%8F%AF%E4%BB%A5%E5%AF%B9%E5%87%BD%E6%95%B0%E7%BB%84%E4%BB%B6%E8%BF%9B%E8%A1%8C%E5%BC%95%E7%94%A8%E5%90%97)
  - [`const [thing, setThing] = useState()`是什么意思？](#const-thing-setthing--usestate%E6%98%AF%E4%BB%80%E4%B9%88%E6%84%8F%E6%80%9D)
- [性能优化](#%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96)
  - [我可以在更新的时候跳过一个effect吗？](#%E6%88%91%E5%8F%AF%E4%BB%A5%E5%9C%A8%E6%9B%B4%E6%96%B0%E7%9A%84%E6%97%B6%E5%80%99%E8%B7%B3%E8%BF%87%E4%B8%80%E4%B8%AAeffect%E5%90%97)
  - [我该如何实现`shouldComponentUpdate`？](#%E6%88%91%E8%AF%A5%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0shouldcomponentupdate)
  - [如何记忆计算？](#%E5%A6%82%E4%BD%95%E8%AE%B0%E5%BF%86%E8%AE%A1%E7%AE%97)
  - [由于在渲染中创建函数，Hooks是否会变慢？](#%E7%94%B1%E4%BA%8E%E5%9C%A8%E6%B8%B2%E6%9F%93%E4%B8%AD%E5%88%9B%E5%BB%BA%E5%87%BD%E6%95%B0hooks%E6%98%AF%E5%90%A6%E4%BC%9A%E5%8F%98%E6%85%A2)
  - [如何避免传递回调？](#%E5%A6%82%E4%BD%95%E9%81%BF%E5%85%8D%E4%BC%A0%E9%80%92%E5%9B%9E%E8%B0%83)
  - [如何从`useCallback`读取经常变化的值？](#%E5%A6%82%E4%BD%95%E4%BB%8Eusecallback%E8%AF%BB%E5%8F%96%E7%BB%8F%E5%B8%B8%E5%8F%98%E5%8C%96%E7%9A%84%E5%80%BC)
- [底层实现（Under the Hood）](#%E5%BA%95%E5%B1%82%E5%AE%9E%E7%8E%B0under-the-hood)
  - [React如何将Hook调用与组件相关联？](#react%E5%A6%82%E4%BD%95%E5%B0%86hook%E8%B0%83%E7%94%A8%E4%B8%8E%E7%BB%84%E4%BB%B6%E7%9B%B8%E5%85%B3%E8%81%94)
  - [Hooks的现有技术是什么？](#hooks%E7%9A%84%E7%8E%B0%E6%9C%89%E6%8A%80%E6%9C%AF%E6%98%AF%E4%BB%80%E4%B9%88)

## 采用策略

### 我是否需要重写所有类组件？

不需要，我们[没有计划](https://react.docschina.org/docs/hooks-intro.html#gradual-adoption-strategy)在React中删除Class——我们都需要保持出货的产品（ keep shipping products ），不可能承受重写的成本。我们建议你在新代码中尝试使用Hook。

### 我的现有React知识中有多少能保持相关性？

Hooks给你提供了一种更加直接使用React相关功能——例如状态，生命周期，上下文和引用的方式。但它们并没有从根本上改变React的工作方式，因此你对组件，Props和自上而下数据流的了解也同样重要。

Hooks确实有自己的学习曲线。如果本文档中缺少某些内容，请[提出issue](https://github.com/reactjs/reactjs.org/issues/new)，我们会尽力提供帮助。

### 我应该使用Hooks，Class还是两者兼而有之？

当你准备好了，我们鼓励你开始尝试在你新组件中使用Hooks。请确保团队中的每个人都使用它们并熟悉本文档。我们不建议将现有Class重写为Hooks，除非你计划重写它们（例如修复bugs）。

你不能在类组件*中*使用Hooks ，但你绝对可以在一棵组件树中将Class组件和使用Hooks的函数组件混合在一起。无论一个组件是Class还是使用Hook的函数，这只是该组件的实现细节。**当然从长远来看，我们希望Hooks成为人们编写React组件的主要方式。**

### Hooks涵盖了Class的所有用例吗？

我们的目标是让Hooks尽快涵盖Class的所有用例。对于不常见`getSnapshotBeforeUpdate`和`componentDidCatch`生命周期目前还没有对应的Hook，但我们计划会很快添加上。

对于Hook来说，现在还是一个非常早的时期，因此一些方面的集成（如DevTools支持，或Flow/TypeScript类型）可能还没有准备好。某些第三方库也可能与Hook不兼容。

### Hooks会替换render props和高阶组件吗？

通常，render props和高阶组件只渲染一个children。我们认为使用Hooks实现这种用例将会更加简单。就目前而言，这两种模式仍然有其立足之地（例如，虚拟滚动组件可能具有`renderItem`prop，或者可视容器组件可能具有其自己的DOM结构）。但在大多数情况下，使用Hooks就足够了，它可以帮助你减少组件树中的嵌套。

### Hook对流行框架的API来说意味着什么（Redux的`connect()`和React Router等）？

首先，你还可以继续像以往一样使用这些API，没有任何影响。（毕竟函数组件和Class组件本质上没太多区别）

其次，这些库的新版本也可能导出自定义Hook，例如，`useRedux()`或者`useRouter()`允许你使用相同的功能而不需要包装器组件。

###  Hooks可以使用静态类型吗？

Hooks的设计考虑了静态类型。因为它们是函数，所以它们比高阶组件之类的模式更容易正确键入。我们已提前与Flow和TypeScript团队联系，他们计划在未来包含React Hooks的定义。

重要的是，如果你想以某种方式更严格地键入React API，则可以考虑使用自定义Hook，它可以让你有权限制React API。React为你提供了原语，但你可以采用与我们提供的开箱即用方式所不同的方式将它们组合在一起。

### 如何测试使用Hooks的组件？

从React的角度来看，使用Hooks的组件也只是一个普通的组件。如果你的测试解决方案不依赖于React内部，则测试使用了Hooks的组件应与你正常测试组件的方式相同。

如果你需要测试自定义Hook，可以通过在测试中创建一个组件并使用自定义Hook来实现。然后，你就可以测试你所编写的组件。

### [lint规则](https://www.npmjs.com/package/eslint-plugin-react-hooks)究竟强制执行了什么？

我们提供了一个[ESLint插件](https://www.npmjs.com/package/eslint-plugin-react-hooks)，它强制执行[Hooks规则](https://react.docschina.org/docs/hooks-rules.html)以避免错误。它假设任何以“ `use`” 开头的函数和紧跟在它之后的大写字母是一个Hook。我们认识到这种启发式方法并不完美，可能存在一些误报，但如果没有整个生态系统的约定，就没有办法让Hooks良好的运作 —— 更长的名字会阻止人们采用Hooks或遵循其惯例。

特别是，该规则强制执行：

- 对Hooks的调用要么在*Pascal*命名法（PascalCase）的函数内部（假设是一个组件），要么是另一个`useSomething`函数（假定为自定义Hook）。
- 在每个渲染上以相同的顺序调用Hook。

还有一些启发式方法，它们可能会随着时间的推移而改变，因为我们会对规则进行微调以寻求在发现错误和避免误报之间的平衡。

## 从 Classes 过渡到 Hooks

### Class中的生命周期与Hook的对应情况

- `constructor`：函数组件不需要构造函数。你可以通过调用[`useState`](https://react.docschina.org/docs/hooks-reference.html#usestate)进行初始化。如果计算成本很高，你可以传递一个函数给`useState`。
- `getDerivedStateFromProps`：改为[在渲染时](https://react.docschina.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops)安排更新。
- `shouldComponentUpdate`：通过 `React.memo` ，[下文](https://react.docschina.org/docs/hooks-faq.html#how-do-i-implement-shouldcomponentupdate)会介绍
- `render`:就是函数本身。
- `componentDidMount`，`componentDidUpdate`，`componentWillUnmount`：[`useEffect` Hook](https://react.docschina.org/docs/hooks-reference.html#useeffect)可表示所有这些组合（包括[不怎么常见](https://react.docschina.org/docs/hooks-faq.html#can-i-skip-an-effect-on-updates) 、[常见](https://react.docschina.org/docs/hooks-faq.html#can-i-run-an-effect-only-on-updates)用例）。
- `componentDidCatch` and `getDerivedStateFromError`: 暂无，后续会加上。

### 是否有类似实例变量的东西？

有的! [`useRef()`](https://react.docschina.org/docs/hooks-reference.html#useref)Hook不只是可以用在DOM上。“ref”对象实际上是一个通用容器，其`current`属性是可变的，可以保存任何值，类似于类上的实例属性。

你可以从`useEffect`从修改它：

```js{2,8}
function Timer() {
  const intervalRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      // ...
    });
    intervalRef.current = id;
    return () => {
      clearInterval(intervalRef.current);
    };
  });

  // ...
}
```

如果我们只是想设置一个间隔，我们就不需要ref（`id`可以作为effect的local变量），但如果我们想从事件处理程序中清除间隔，它会很有用：

```js{3}
  // ...
  function handleCancelClick() {
    clearInterval(intervalRef.current);
  }
  // ...
```

从概念上讲，你可以将refs视为类中的实例变量。但是，请避免在渲染过程中设置引用 —— 这可能会导致出乎意料的行为。相反，你应该只在事件处理程序和Effect中的修改引用。

### 我应该使用一个还是多个状态变量？

如果你来自Class模式，你可能总是想要在`useState()`一次调用的时就候将所有状态放入一个对象中。如果你愿意，你可以这样做。以下是鼠标移动后的组件示例。我们在local保持其position和size：

```js
function Box() {
  const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
  // ...
}
```

现在我们想写当用户移动鼠标的的时候，改变`left`以及`top`的逻辑。请注意，我们必须**手动**将这些字段合并到以前的状态对象中：

```js{4,5}
  // ...
  useEffect(() => {
    function handleWindowMouseMove(e) {
      // Spreading "...state" ensures we don't "lose" width and height
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
    // Note: this implementation is a bit simplified
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
```

这是因为当我们更新状态变量时，我们会*替换*它的值。这是不同于`this.setState`的一点，它会自动*合并*了更新的字段到对象。

如果你怀念自动合并的方式，则可以编写自动合并对象状态更新的自定义Hook`useLegacyState`。但是，**我们建议根据哪些值趋于一同更改将状态拆分为多个状态变量。**

例如，我们可以将组件状态拆分为`position`和`size`对象，并始终替换`position`而不需要合并

```js{2,7}
function Box() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [size, setSize] = useState({ width: 100, height: 100 });

  useEffect(() => {
    function handleWindowMouseMove(e) {
      setPosition({ left: e.pageX, top: e.pageY });
    }
    // ...
```

分离独立的状态变量也有另一个好处。稍后可以轻松地将一些相关逻辑提取到自定义Hook中，例如：

```js{2,7}
function Box() {
  const position = useWindowPosition();
  const [size, setSize] = useState({ width: 100, height: 100 });
  // ...
}

function useWindowPosition() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  useEffect(() => {
    // ...
  }, []);
  return position;
}
```

请注意我们如何在不更改代码的情况下，将与`position`状态变量相关的`useStateh`和Effect移动到自定义Hook中。如果所有状态都在单个对象中，提取它们将更加困难。

将所有状态都放在一次`useState`调用中，亦或是将每个字段都使用一次`useState`调用，这两种方式都行的通。当你能在这两个极端之间找到平衡，将组相关状态分组为几个独立的状态变量时，组件往往最具可读性。如果状态逻辑变得复杂，我们建议[用reducer的方式](https://react.docschina.org/docs/hooks-reference.html#usereducer)或自定义Hook 管理它。

### 我可以仅在更新时运行Effect吗？

这是一个罕见的用例。如果需要，可以[使用手动操作ref](https://react.docschina.org/docs/hooks-faq.html#is-there-something-like-instance-variables)的方式，手动存储一个布尔值，该值对应于你是第一次还是后续渲染做判断，然后在Effect中检查该标志。（如果你发现自己经常这样做，可以为它创建一个自定义Hook。）

### 如何获得以前的props或state？

目前，你可以[使用ref](https://react.docschina.org/docs/hooks-faq.html#is-there-something-like-instance-variables)手动执行此操作：

```js{6,8}
function Counter() {
  const [count, setCount] = useState(0);

  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  });
  const prevCount = prevCountRef.current;

  return <h1>Now: {count}, before: {prevCount}</h1>;
}
```

这可能有点复杂，但你可以将其提取到自定义Hook中：

```js{3,7}
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return <h1>Now: {count}, before: {prevCount}</h1>;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

注意这种方式如何用在props，state或任何其他计算值。

```js{5}
function Counter() {
  const [count, setCount] = useState(0);

  const calculation = count * 100;
  const prevCalculation = usePrevious(calculation);
  // ...
```

未来React可能会提供`usePrevious`开箱即用的Hook，因为它是一个相对常见的用例。

另请参见[派生状态的推荐模式](https://react.docschina.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops)。

### 我该如何实现`getDerivedStateFromProps`？

虽然你可能[不需要它](https://react.docschina.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)，但在极少数情况下（例如实现`<Transition>`组件），你可以在渲染期间更新状态。在退出第一个渲染后，React将立即重新运行具有更新状态的组件，因此它不会很昂贵。

在这里，我们将`row`prop 的先前值存储在状态变量中，以便我们可以比较：

```js
function ScrollView({row}) {
  let [isScrollingDown, setIsScrollingDown] = useState(false);
  let [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // Row changed since last render. Update isScrollingDown.
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `Scrolling down: ${isScrollingDown}`;
}
```

这看起来可能很奇怪，但其渲染过程中的更新过程正是与`getDerivedStateFromProps`在概念上一致的。

### 我可以对函数组件进行引用吗？

虽然你不应需要经常这样做，但你可以通过使用[`useImperativeMethods`](https://react.docschina.org/docs/hooks-reference.html#useimperativemethods)Hook 向父组件暴露一些命令性方法。

### `const [thing, setThing] = useState()`是什么意思？

如果你不熟悉这个语法，可以查看State Hook文档中的这个[解释](https://react.docschina.org/docs/hooks-state.html#tip-what-do-square-brackets-mean)。

## 性能优化

### 我可以在更新的时候跳过一个effect吗？

是。请参阅[有条件地触发Effect](https://react.docschina.org/docs/hooks-reference.html#conditionally-firing-an-effect)。请注意，忘记处理更新通常会[引入错误](https://react.docschina.org/docs/hooks-effect.html#explanation-why-effects-run-on-each-update)，这就是为什么这不是一个默认行为。

### 我该如何实现`shouldComponentUpdate`？

你可以用`React.memo`包装一个函数组件，进而来浅显比较它的props：

```js
const Button = React.memo((props) => {
  // your component
});
```

它不是一个Hook，因为它不像Hooks那样构成。`React.memo`相当于`PureComponent`，但它只比较props。（你还可以添加第二个参数来指定采用旧props和新props的自定义比较函数。如果它返回true，则跳过更新。）

`React.memo`不比较状态，因为没有单个状态对象可以进行比较。但是你也可以让children变得纯粹(pure)，甚至可以[通过`useMemo`优化个别children](https://react.docschina.org/docs/hooks-faq.html#how-to-memoize-calculations)。

### 如何记忆计算？

[`useMemo`](https://react.docschina.org/docs/hooks-reference.html#usememo) Hook就可以让你在多次渲染的时候，缓存之前的计算结果

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

这段代码会调用`computeExpensiveValue(a, b)`。但是如果`[a, b]`自上一个值以来一直没有改变，则`useMemo`会跳过第二次调用它并简单地重用它返回的最后一个值。

方便的是，它也允许你跳过重渲染一个代价昂贵的child：

```js
function Parent({ a, b }) {
  // Only re-rendered if `a` changes:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // Only re-rendered if `b` changes:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```

**请注意，**这种方法在循环中不起作用，因为Hook调用[不能](https://react.docschina.org/docs/hooks-rules.html)放在循环中。但是你可以为列表项提取单独的组件，然后在那里调用`useMemo`。

### 由于在渲染中创建函数，Hooks是否会变慢？

答案是否定的，在现代浏览器中，除了极端情况之外，与类相比，使用闭包的原始性能并没有显着差异。

此外，考虑到Hooks的设计在以下几个方面更有效：

- Hooks避免了类所需的大量开销，例如在构造函数中创建类实例和绑定（binding）事件处理程序的成本。
- **使用Hooks的惯用代码不需要深层组件树嵌套**，而这种嵌套在使用高阶组件，render props和Context的代码库中很常见。使用较小的组件树，React的工作量也会较少。

传统上，React中内联函数的性能问题与每次渲染上传递新的回调会中断子组件中的`shouldComponentUpdate`优化有关。Hooks从三个方面解决了这个问题。

- [`useCallback`](https://react.docschina.org/docs/hooks-reference.html#usecallback) Hook 可以让你在重渲染的时候依然保持对同一回调的引用，这样`shouldComponentUpdate`就能继续工作：

```js{2}
// Will not change unless `a` or `b` changes
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

* 当个别children更新时，通过使用[`useMemo`Hook](https://react.docschina.org/docs/hooks-faq.html#how-to-memoize-calculations)使得它更容易控制，同时也减少了对pure components的需求。
* 最后，`useReducer`Hook减少了深度传递回调的需要，接下来会介绍。

### 如何避免传递回调？

我们发现大多数人不喜欢手动在组件树的每一层进行回调的传递。虽然它更明确，但它可能感觉做了很多“脏活累活（plumping）”。

在大型组件树中，我们建议的另一种方法是通过从context的[`useReducer`](https://react.docschina.org/docs/hooks-reference.html#usereducer) Hook 中传递一个`dispatch`函数：

```js{4,5}
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // Tip: `dispatch` won't change between re-renders
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

`TodosApp`树里面的任何一个孩子都可以使用`dispatch`函数传递action到`TodosApp`：

```js{2,3}
function DeepChild(props) {
  // If we want to perform an action, we can get dispatch from context.
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```

从维护的角度来看这更方便（不需要保持转发回调），并且完全避免了回调问题。在深度更新`dispatch`像这样向下传递是深度更新的推荐模式。

请注意，你仍然可以选择是将应用程序*状态*作为props（更明确）或是作为上下文传递（对于非常深的更新更方便）。如果你同时也使用上下文传递状态，请使用不同的上下文类型 —— `dispatch`的上下文永远不会更改，因此读取它的组件不需要重新渲染，除非它们还需要应用程序状态。

### 如何从`useCallback`读取经常变化的值？

>Also note that this pattern might cause problems in the [concurrent mode](/blog/2018/03/27/update-on-async-rendering.html). We plan to provide more ergonomic alternatives in the future, but the safest solution right now is to always invalidate the callback if some value it depends on changes.
>
>注意
>
>我们建议[从Context向下传递`dispatch`](https://react.docschina.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down)而不是在props中传单个回调。下面的方法仅在此处提及只是为了完整性和预留逃生舱口（escape hatch）。
>
>另请注意，此模式可能会导致[并发模式](https://react.docschina.org/blog/2018/03/27/update-on-async-rendering.html)出现问题。我们计划在未来提供更符合人体工程学的替代方案，但现在最安全的解决方案是，如果某些值依赖于更改，则始终使回调无效。

在极少数情况下，你可能需要使用[`useCallback`](https://react.docschina.org/docs/hooks-reference.html#usecallback)去memoize一个回调，但是因为内部函数必须经常重新创建，因此memoization不能很好地工作。如果你要记忆的函数是事件处理程序并且它在渲染期间并未使用，则可以使用[ref作为实例变量](https://react.docschina.org/docs/hooks-faq.html#is-there-something-like-instance-variables)，并将最后提交的值手动保存到其中：

```js{6,10}
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useMutationEffect(() => {
    textRef.current = text; // Write it to the ref
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // Read it from the ref
    alert(currentText);
  }, [textRef]); // Don't recreate handleSubmit like [text] would do

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

这是一个相当复杂的模式，它表明如果你需要的话你依然可以执行此逃逸舱口优化（escape hatch optimization）。当然，如果将其提取到自定义Hook就会更好点：

```js{4,16}
function Form() {
  const [text, updateText] = useState('');
  // Will be memoized even if `text` changes:
  const handleSubmit = useEventCallback(() => {
    alert(text);
  }, [text]);

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}

function useEventCallback(fn, dependencies) {
  const ref = useRef(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useMutationEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
```

在任何一种情况下，我们**都不建议使用此模式**，仅在此处显示完整性。相反，你最好[避免向深处传递回调](https://react.docschina.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down)。

## 底层实现（Under the Hood）

### React如何将Hook调用与组件相关联？

React跟踪当前渲染组件。由于[Hooks规则](https://react.docschina.org/docs/hooks-rules.html)，我们知道Hook只能从React组件（或自定义Hooks调用 ——它们也只能从React组件中调用）。

每个组件都有一个与之相关联的“存储器单元（memory cells）”的内部列表（list）。它们只是一些可以放置一些数据的JavaScript对象。当你调用Hook时`useState()`，它会读取当前单元格（或在第一次渲染期间初始化它），然后将指针移动到下一个单元格。这就是多个`useState()`调用各自获得独立本地状态的方式。可以[参考](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)

### Hooks的现有技术是什么？

Hooks综合了几个不同来源的想法：

- 我们旧的实验性的功能API在[react-future](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State)仓库中。
- 与render props API 相关的React社区的实验，包括[Ryan Florence](https://github.com/ryanflorence)的[Reactions Component](https://github.com/reactions/component)。
- [Dominic Gannaway](https://github.com/trueadm)提出了一个render props糖语法的[`adopt`关键字](https://gist.github.com/trueadm/17beb64288e30192f3aa29cad0218067)提案。
- [DisplayScript中的](http://displayscript.org/introduction.html)状态变量和状态单元（ state cells ）。
- ReasonReact中的[Reducer组件](https://reasonml.github.io/reason-react/docs/en/state-actions-reducer.html)。
- Rx中的[Subscriptions](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html)。
- 多核OCaml中的[代数效应(Algebraic effects)](https://github.com/ocamllabs/ocaml-effects-tutorial#2-effectful-computations-in-a-pure-setting)。

[SebastianMarkbåge](https://github.com/sebmarkbage)提出了Hooks的原创设计，后来由[Andrew Clark](https://github.com/acdlite)，[Sophie Alpert](https://github.com/sophiebits)，[Dominic Gannaway](https://github.com/trueadm)以及React团队的其他成员完善。

