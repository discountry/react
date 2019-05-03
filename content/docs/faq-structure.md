---
id: faq-structure
title: 文件结构
permalink: docs/faq-structure.html
layout: docs
category: FAQ
---

### 是否有推荐的方式来组织 React 项目？

React 在对于你如何将文件放入文件夹中不持有意见。也就是说，你也许想考虑生态系统中的一些常用方法。

#### 按照功能或者路由来分组

组织项目的一种常见方法是将 CSS，JS 和测试文件一起放入按功能或路由分组的文件夹中。

```
common/
  Avatar.js
  Avatar.css
  APIUtils.js
  APIUtils.test.js
feed/
  index.js
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  FeedAPI.js
profile/
  index.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
  ProfileAPI.js
```

“功能”的定义不是通用的，它取决于你选择的划分粒度。如果你不能想出一个顶级文件夹的列表，你可以询问用户你的产品主要由哪些部分组成，并使用他们的心智模型作为蓝图。

#### 按照文件类型来分组

组织项目的另一个流行的方式是将相似的文件分到一起，比如说：

```
api/
  APIUtils.js
  APIUtils.test.js
  ProfileAPI.js
  UserAPI.js
components/
  Avatar.js
  Avatar.css
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
```

有些人会喜欢进一步深入，根据组件在应用中所扮演的角色将他们分到不同的文件夹中。举个例子， [Atomic Design](http://bradfrost.com/blog/post/atomic-web-design/) 是一个基于该原则构建的设计方法论.请记住，将这些方法看成有用的案例而不是严格的规则来处理，往往更有成效。

#### 避免太多嵌套

JavaScript 项目中的深层目录嵌套会有许多痛点。在目录之间书写相对的 import 以及在移动文件时更新这些 import 都变得更加困难。除非你有一个非常有说服力的理由来使用深层文件夹结构，否则请考虑将项目自身限制为单个项目中最多嵌套三到四层文件夹。当然，这只是一个建议，它可能与您的项目无关。

#### 不要过度思考这个问题

如果你刚开始一个项目，[不要花超过五分钟](https://en.wikipedia.org/wiki/Analysis_paralysis)在选择一个文件结构上。从以上方法（或者你自己想到的）中任意挑一个然后开始编程吧！在写完一些真实的代码之后，你可能会想重新考虑它。

如果感觉完全卡住，请将所有文件保存在一个单一的文件夹中。最终它会变得足够大，以至于你会想要从其他文件中分离出一些文件。 到那个时候，你将有足够的知识去分辨你最经常编辑的文件。 一般来说，保持经常变化的文件彼此靠近是一个好主意。 这个原则被称为“托管”。

随着项目规模越来越大，在实践中往往会混合使用上述几种方法。所以在一开始选择“正确”的方法并不是很重要。
