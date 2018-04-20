import FancyButton from './fancy-button';

const ref = React.createRef();

// ref属性将指向 FancyButton 组件,
// ThemeContext.Consumer 没有包裹它
// 这意味着我们可以调用 FancyButton 的方法就像这样 ref.current.focus()
// highlight-next-line
<FancyButton ref={ref} onClick={handleClick}>
  Click me!
</FancyButton>;
