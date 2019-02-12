---
id: getting-started
title: Getting Started
permalink: docs/getting-started.html
next: add-react-to-a-website.html
redirect_from:
  - "docs/"
  - "docs/index.html"
  - "docs/getting-started-ko-KR.html"
  - "docs/getting-started-zh-CN.html"
  - "docs/installation.html"
  - "download.html"
  - "downloads.html"
  - "docs/try-react.html"
  - "docs/tooling-integration.html"
  - "docs/package-management.html"
  - "docs/language-tooling.html"
  - "docs/environments.html"
---

此页面是React文档和相关资源的概述。

**React**是一个用于构建用户界面的JavaScript库。在[我们的主页](/)或[教程](/tutorial/tutorial.html)中了解React的全部内容。

---

- [初探 React](#try-react)
- [学习 React](#learn-react)
- [相关补充](#staying-informed)
- [版本化文档](#versioned-documentation)
- [有遗漏?](#something-missing)

## 初探 React

React从一开始就被设计为渐进采用，**你可以根据需要或多或少的使用React。** 无论你是想在简单的HTML页面中添加一些交互性，简单体验一下React，或者创建一个复杂的React驱动的应用程序，本节中的链接都将帮助您入门。

### 在线编辑平台

If you're interested in playing around with React, you can use an online code playground. Try a Hello World template on [CodePen](codepen://hello-world) or [CodeSandbox](https://codesandbox.io/s/new).

If you prefer to use your own text editor, you can also [download this HTML file](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html), edit it, and open it from the local filesystem in your browser. It does a slow runtime code transformation, so we'd only recommend using this for simple demos.

### 将React添加到网站

You can [add React to an HTML page in one minute](/docs/add-react-to-a-website.html). You can then either gradually expand its presence, or keep it contained to a few dynamic widgets.

### 创建一个新的React应用

When starting a React project, [a simple HTML page with script tags](/docs/add-react-to-a-website.html) might still be the best option. It only takes a minute to set up!

As your application grows, you might want to consider a more integrated setup. There are [several JavaScript toolchains](/docs/create-a-new-react-app.html) we recommend for larger applications. Each of them can work with little to no configuration and lets you take full advantage of the rich React ecosystem.

## 学习 React

People come to React from different backgrounds and with different learning styles. Whether you prefer a more theoretical or a practical approach, we hope you'll find this section helpful.

* If you prefer to **learn by doing**, start with our [practical tutorial](/tutorial/tutorial.html).
* If you prefer to **learn concepts step by step**, start with our [guide to main concepts](/docs/hello-world.html).

Like any unfamiliar technology, React does have a learning curve. With practice and some patience, you *will* get the hang of it.

### 第一个案例

The [React homepage](/) contains a few small React examples with a live editor. Even if you don't know anything about React yet, try changing their code and see how it affects the result.

### 初学者必读

If you feel that the React documentation goes at a faster pace than you're comfortable with, check out [this overview of React by Tania Rascia](https://www.taniarascia.com/getting-started-with-react/). It introduces the most important React concepts in a detailed, beginner-friendly way. Once you're done, give the documentation another try!

### 设计师资源

If you're coming from a design background, [these resources](http://reactfordesigners.com/) are a great place to get started.

### JavaScript资源

The React documentation assumes some familiarity with programming in the JavaScript language. You don't have to be an expert, but it's harder to learn both React and JavaScript at the same time.

We recommend going through [this JavaScript overview](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) to check your knowledge level. It will take you between 30 minutes and an hour but you will feel more confident learning React.

>小提示
>
>Whenever you get confused by something in JavaScript, [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript) and [javascript.info](http://javascript.info/) are great websites to check. There are also [community support forums](/community/support.html) where you can ask for help.

### 实用教程

If you prefer to **learn by doing,** check out our [practical tutorial](/tutorial/tutorial.html). In this tutorial, we build a tic-tac-toe game in React. You might be tempted to skip it because you're not building games -- but give it a chance. The techniques you'll learn in the tutorial are fundamental to building *any* React apps, and mastering it will give you a much deeper understanding.

### 循序渐进的指南

If you prefer to **learn concepts step by step,** our [guide to main concepts](/docs/hello-world.html) is the best place to start. Every next chapter in it builds on the knowledge introduced in the previous chapters so you won't miss anything as you go along.

### Thinking in React

Many React users credit reading [Thinking in React](/docs/thinking-in-react.html) as the moment React finally "clicked" for them. It's probably the oldest React walkthrough but it's still just as relevant.

### 推荐课程

Sometimes people find third-party books and video courses more helpful than the official documentation. We maintain [a list of commonly recommended resources](/community/courses.html), some of which are free.

### 高级概念

Once you're comfortable with the [main concepts](#main-concepts) and played with React a little bit, you might be interested in more advanced topics. This section will introduce you to the powerful, but less commonly used React features like [context](/docs/context.html) and [refs](/docs/refs-and-the-dom.html).

### API 参考

This documentation section is useful when you want to learn more details about a particular React API. For example, [`React.Component` API reference](/docs/react-component.html) can provide you with details on how `setState()` works, and what different lifecycle hooks are useful for.

### 词汇表和常见问题FAQ

The [glossary](/docs/glossary.html) contains an overview of the most common terms you'll see in the React documentation. There is also a FAQ section dedicated to short questions and answers about common topics, including [making AJAX requests](/docs/faq-ajax.html), [component state](/docs/faq-state.html), and [file structure](/docs/faq-structure.html).

## 相关参考信息

The [React blog](/blog/) is the official source for the updates from the React team. Anything important, including release notes or deprecation notices, will be posted there first.

You can also follow the [@reactjs account](https://twitter.com/reactjs) on Twitter, but you won't miss anything essential if you only read the blog.

Not every React release deserves its own blog post, but you can find a detailed changelog for every release [in the `CHANGELOG.md` file in the React repository](https://github.com/facebook/react/blob/master/CHANGELOG.md), as well as on the [Releases](https://github.com/facebook/react) page.

## 版本化文档

This documentation always reflects the latest stable version of React. Since React 16, you can find older versions of the documentation [on a separate page](/versions). Note that documentation for past versions is snapshotted at the time of the release, and isn't being continuously updated.

## 有遗漏?

If something is missing in the documentation or if you found some part confusing, please [file an issue for the documentation repository](https://github.com/reactjs/reactjs.org/issues/new) with your suggestions for improvement, or tweet at the [@reactjs account](https://twitter.com/reactjs). We love hearing from you!
