---
layout: hero
title: 用于构建用户界面的 JavaScript 库
id: home
---

<section class="light home-section">
  <div class="marketing-row">
    <div class="marketing-col">
      <h3>声明式</h3>
      <p>React 可以非常轻松地创建用户交互界面。为你应用的每一个状态设计简洁的视图，在数据改变时 React 也可以高效地更新渲染界面。</p>
      <p>以声明式编写UI，可以让你的代码更加可靠，且方便调试。</p>
    </div>
    <div class="marketing-col">
      <h3>组件化</h3>
      <p>创建好拥有各自状态的组件，再由组件构成更加复杂的界面。</p>
      <p>无需再用模版代码，通过使用JavaScript编写的组件你可以更好地传递数据，将应用状态和DOM拆分开来。</p>
    </div>
    <div class="marketing-col">
      <h3>一次学习，随处编写</h3>
      <p>无论你现在正在使用什么技术栈，你都可以随时引入 React 开发新特性。</p>
      <p>React 也可以用作开发原生应用的框架 <a href="https://facebook.github.io/react-native/">React Native</a>.</p>
    </div>
  </div>
</section>
<hr class="home-divider" />
<section class="home-section">
  <div id="examples">
    <div class="example">
      <h3>组件</h3>
      <p>
        React 组件使用一个名为 `render()` 的方法， 接收数据作为输入，输出页面中对应展示的内容。 下面这个示例中类似XML的写法被称为JSX. 输入的数据通过 `this.props` 传入 `render()` 方法。
      </p>
      <p>
        <strong>使用 React 的时候也可以不使用 JSX 语法</strong>
        你可以在
        <a href="http://babeljs.io/repl#?babili=false&browsers=&build=&builtIns=false&code_lz=MYGwhgzhAEASCmIQHsCy8pgOb2vAHgC7wB2AJjAErxjCEB0AwsgLYAOyJph0A3gFABIAE6ky8YQAoAlHyEj4hAK7CS0ADxkAlgDcAfAiTI-hABZaI9NsORtLJMC3gBfdQHpt-gNxDn_P_zUtIQAIgDyqPSi5BKS6oYo6Jg40A5OALwARCHwOlokmdBuegA00CzISiSEAHLI4tJeQA&debug=false&circleciRepo=&evaluate=false&lineWrap=false&presets=react&prettier=true&targets=&version=6.26.0">Babel REPL</a>
        JSX 是如何被渲染成原生 JavaScript 代码的。
      </p>
      <div id="helloExample"></div>
    </div>
    <div class="example">
      <h3>有状态组件</h3>
      <p>
        除了使用外部传入的数据以外 (通过 `this.props` 访问传入数据), 组件还可以拥有其内部的状态数据 (通过 `this.state` 访问状态数据)。
        当组件的状态数据改变时， 组件会调用 `render()` 方法重新渲染。
      </p>
      <div id="timerExample"></div>
    </div>
    <div class="example">
      <h3>应用</h3>
      <p>
        使用 `props` 和 `state`, 我们可以创建一个简易的 Todo 应用。
        下面这个示例中，我们使用 `state` 来保存现有的待办事项列表及用户的输入。 与此同时，我们也使用了内联的方法添加了事件处理函数，它们将通过事件代理被收集和调用。
      </p>
      <div id="todoExample"></div>
    </div>
    <div class="example">
      <h3>在组件中使用第三方库</h3>
      <p>
        React 的使用非常灵活，并且提供了可以调用其他第三方框架或库的接口。下面这个示例就使用了一个用来渲染markdown语法，名为 **remarkable** 的库。
      </p>
      <div id="markdownExample"></div>
    </div>
  </div>
  <script src="https://cdn.bootcss.com/remarkable/1.7.1/remarkable.min.js"></script>
</section>
