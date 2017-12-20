---
id: faq-ajax
title: AJAX and APIs
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### 怎样发送 AJAX 请求?

你可以在 React 中使用任何你喜欢的 AJAX 库，例如很受欢迎的 [Axios](https://github.com/axios/axios)，[jQuery AJAX](https://api.jquery.com/jQuery.ajax/) 和浏览器内置的 [window.fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)。

### 我应该在组件的哪个生命周期发送 AJAX 请求?

你应该在 [`componentDidMount`](/docs/react-component.html#mounting) 生命周期方法内发送 AJAX 请求数据。这样你才能够在请求的数据到达时使用 `setState` 更新你的组件。

### 示例: 使用 AJAX 请求的结果设置组件内状态

下方的组件展示了如何在 `componentDidMount` 方法内使用 AJAX 请求并将结果填入组件内的状态。

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

### 取消 AJAX 请求

需要注意的是，如果组件在 AJAX 请求完成之前被卸载了，那么你会在浏览器的控制面板上看到一条警告：`cannot read property 'setState' of undefined`。如果这对你来说是个问题的话，你可以追踪未完成的 AJAX 请求并在 `componentWillUnmount` 生命周期方法内将它们取消。

```js{19}
class Posts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: []
    }
  }
  
  componentDidMount() {
    this.serverRequest = axios.get('/api')
      .then(posts => {
        this.setState({
          posts
      })
    })
  }
  
  componentWillUnmount() {
    this.serverRequest.abort()
  }
  
  render() {
    return <PostList posts={this.state.posts} />
  }
}
```
