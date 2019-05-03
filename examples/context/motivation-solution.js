// 创建一个 theme Context,  默认 theme 的值为 light
// highlight-next-line
const ThemeContext = React.createContext('light');

function ThemedButton(props) {
  // highlight-range{1,3-5}
  // ThemedButton 组件从 context 接收 theme
  return (
    <ThemeContext.Consumer>
      {theme => <Button {...props} theme={theme} />}
    </ThemeContext.Consumer>
  );
}

// 中间组件
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class App extends React.Component {
  render() {
    // highlight-range{2,4}
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}
