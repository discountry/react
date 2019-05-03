// 主题上下文, 默认light
// highlight-next-line
const ThemeContext = React.createContext('light');

// 登陆用户上下文
// highlight-next-line
const UserContext = React.createContext();

// 一个依赖于两个上下文的中间组件
function Toolbar(props) {
  // highlight-range{2-10}
  return (
    <ThemeContext.Consumer>
      {theme => (
        <UserContext.Consumer>
          {user => (
            <ProfilePage user={user} theme={theme} />
          )}
        </UserContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
}

class App extends React.Component {
  render() {
    const {signedInUser, theme} = this.props;

    // App组件提供上下文的初始值
    // highlight-range{2-3,5-6}
    return (
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={signedInUser}>
          <Toolbar />
        </UserContext.Provider>
      </ThemeContext.Provider>
    );
  }
}
