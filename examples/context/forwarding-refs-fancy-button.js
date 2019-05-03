class FancyButton extends React.Component {
  focus() {
    // ...
  }

  // ...
}

// 使用 context 传递当前的 "theme" 给 FancyButton.
// 使用 forwardRef 传递 refs 给 FancyButton 也是可以的.
// highlight-range{1,3}
export default React.forwardRef((props, ref) => (
  <ThemeContext.Consumer>
    {theme => (
      <FancyButton {...props} theme={theme} ref={ref} />
    )}
  </ThemeContext.Consumer>
));
