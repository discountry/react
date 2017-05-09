---
layout: hero
title: 用于构筑用户界面的 JavaScript 框架
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
        React components implement a `render()` method that takes input data and
        returns what to display. This example uses an XML-like syntax called
        JSX. Input data that is passed into the component can be accessed by
        `render()` via `this.props`.
      </p>
      <p>
        <strong>JSX is optional and not required to use React.</strong> Try
        clicking on "Compiled JS" to see the raw JavaScript code produced by
        the JSX compiler.
      </p>
      <div id="helloExample"></div>
    </div>
    <div class="example">
      <h3>有状态组件</h3>
      <p>
        In addition to taking input data (accessed via `this.props`), a
        component can maintain internal state data (accessed via `this.state`).
        When a component's state data changes, the rendered markup will be
        updated by re-invoking `render()`.
      </p>
      <div id="timerExample"></div>
    </div>
    <div class="example">
      <h3>应用</h3>
      <p>
        Using `props` and `state`, we can put together a small Todo application.
        This example uses `state` to track the current list of items as well as
        the text that the user has entered. Although event handlers appear to be
        rendered inline, they will be collected and implemented using event
        delegation.
      </p>
      <div id="todoExample"></div>
    </div>
    <div class="example">
      <h3>在组件中使用第三方库</h3>
      <p>
        React is flexible and provides hooks that allow you to interface with
        other libraries and frameworks. This example uses **remarkable**, an
        external Markdown library, to convert the textarea's value in real time.
      </p>
      <div id="markdownExample"></div>
    </div>
  </div>
  <script src="https://unpkg.com/remarkable@1.7.1/dist/remarkable.min.js"></script>
  <script src="/react/js/examples/hello.js"></script>
  <script src="/react/js/examples/timer.js"></script>
  <script src="/react/js/examples/todo.js"></script>
  <script src="/react/js/examples/markdown.js"></script>
</section>
<hr class="home-divider" />
<section class="home-bottom-section">
  <div class="buttons-unit">
    <a href="docs/hello-world.html" class="button">Get Started</a>
    <a href="tutorial/tutorial.html" class="button">Take the Tutorial</a>
  </div>
</section>
