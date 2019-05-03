---
id: faq-ajax
title: AJAX 和 API
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### 怎样发送 AJAX 请求?

任何你喜欢的 AJAX 库都可以与React一起使用。例如一些流行的库 [Axios](https://github.com/axios/axios)，[jQuery AJAX](https://api.jquery.com/jQuery.ajax/) 和浏览器内置的 [window.fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)。

### 我应该在组件的哪个生命周期调用 AJAX?

你用AJAX调用填充数据应该是在 [`componentDidMount`](/docs/react-component.html#mounting) 生命周期方法内。这样你才能在收到数据时使用 `setState` 更新组件。

### 示例: 使用 AJAX 的结果设置局部状态

下方的组件展示了如何在 `componentDidMount` 方法内使用 AJAX 请求来填充组件的局部状态。

示例的 API 返回的 JSON 对象结构如下：

```
{
  items: [
    { id: 1, name: 'Apples', price: '$2' },
    { id: 2, name: 'Peaches', price: '$5' }
  ]
}
```

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul>
          {items.map(item => (
            <li key={item.name}>
              {item.name} {item.price}
            </li>
          ))}
        </ul>
      );
    }
  }
}
```
