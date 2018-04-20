function ThemedButton(props) {
  //highlight-range{1}
  return <Button theme={props.theme} />;
}

// 中间组件
function Toolbar(props) {
  // highlight-range{1-2,5}
  // Toolbar 组件必须添加一个额外的 theme 属性
  // 然后传递它给 ThemedButton 组件
  return (
    <div>
      <ThemedButton theme={props.theme} />
    </div>
  );
}

class App extends React.Component {
  render() {
    // highlight-range{1}
    return <Toolbar theme="dark" />;
  }
}
