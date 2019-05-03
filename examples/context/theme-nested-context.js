// 确保默认值按类型传递
// createContext() 匹配的属性是 Consumers 所期望的
export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});
