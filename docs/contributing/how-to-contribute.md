---
id: how-to-contribute
title: How to Contribute
layout: contributing
permalink: contributing/how-to-contribute.html
next: codebase-overview.html
redirect_from: "tips/introduction.html"
---

React 是 Facebook 的第一批开源项目，目前社区活跃度很高，框架的更新也会应用到 [facebook.com](https://www.facebook.com) 网站中。我们致力于让 React 的社区贡献流程简单透明，尽管目前我们做的还不够好。希望这篇文档可以讲明 React 代码提交的流程，并解答一些你可能遇到的问题。

### [核心价值观](https://code.facebook.com/codeofconduct)

我们希望项目的参与者遵守 Facebook 一直贯彻的核心价值观，请参考 [这里](https://code.facebook.com/codeofconduct)，这样你就知道什么是可以做的，什么是绝对不允许的。

### 公开透明的开发流程

React 的代码提交一律在 [React GitHub 官方库](https://github.com/facebook/react) 上进行，团队与社区贡献者都需要开 Pull Request (合并请求)，代码审核的过程也是相同的。

### 分支管理

我们需要尽力让 [`master` 分支](https://github.com/facebook/react/tree/master) 保持整洁，这个分支上的所有测试实例都是必须通过的。但为了尽快完成开发任务，我们可能会改一些 API，这些改动可能不会兼容你的项目。因此，我们推荐使用 [React 的最新稳定版](/react/downloads.html)。

如果你打算开合并请求，请不要将合并请求指向 `master` 分支。尽管我们会有稳定的分支去管理主要版本，但我们也不会接受指向这些分支的合并请求。我们的做法是，直接通过 `cherry-pick` 命令，把 `master` 分支中可以向后兼容的改动应用到最新的稳定版本分支。

### 语义化版本

React 采用 [语义化版本](http://semver.org/) 管理。我们会为 bug 修复以及新功能的尝试发布补丁版本，也会为不向后兼容的改动发布主要版本。在引入不向后兼容改动的同时，我们还会在次要版本改动中发布旧代码失效的警示，这样我们的用户就可以在这些不向后兼容的改动发布出来之前提前修改好代码。

我们会给每一个合并请求打上 Label (标签)，意在指示这些合并请求会应用到下一次的 [补丁版本](https://github.com/facebook/react/pulls?q=is%3Aopen+is%3Apr+label%3Asemver-patch)，[次要版本](https://github.com/facebook/react/pulls?q=is%3Aopen+is%3Apr+label%3Asemver-minor) 或者是 [主要版本](https://github.com/facebook/react/pulls?q=is%3Aopen+is%3Apr+label%3Asemver-major) 的发布。

所有重要改动都需要写到 [改动历史记录](https://github.com/facebook/react/blob/master/CHANGELOG.md) 中。

### Bugs

#### 如何找到已知 bug

我们采用 [GitHub Issues](https://github.com/facebook/react/issues) 管理公开的 bug。我们一直在关注这些 bug，如果我们有内部修复的打算，也会第一时间在这里告诉大家。在开新的 issue 之前，请先确认你的问题是否已经存在。

#### 提交新的 issue

汇报 bug 的最好方式就是，提供一份简化版的测试实例。如果你需要模板，可以考虑使用 [这份 JSFiddle 上的模板](https://jsfiddle.net/84v837e9/)。

#### 安全相关的 bug

Facebook 有一个 [白帽项目](https://www.facebook.com/whitehat/)，这里可以提交一些涉及隐私或者安全性的 bug。请注意，这里不是填写公开 issue 的地方，详情请参考链接里的流程大纲。

### 联系我们

* IRC频道：[freenode 上的 #reactjs](https://webchat.freenode.net/?channels=reactjs)
* 官方论坛：[discuss.reactjs.org](https://discuss.reactjs.org/)

此外，还有 [Discord 平台上的 React 用户活跃社区](http://www.reactiflux.com/)。

### 提议改动

如果你打算更改公有的 API (接口)，或者有意做一些可能影响很大的更改，我们建议你 [先开一个 issue](https://github.com/facebook/react/issues/new)。在你做出重大更改之前，我们需要先达成一致，因为我们不想浪费每位贡献者的个人时间。

如果你只是修复一个 bug，那么你可以直接提交合并请求，但我们还是建议你先开一个 issue，讲明你要修复什么，以及修复的思路和细节。有时候，尽管出于一些原因，我们可能不接受某一个合并请求，但你开的 issue 会极大地方便我们的管理。

### 你的第一个合并请求

如果你正在试着创建第一个合并请求，建议你花一点时间，先看一下这些视频：

**[如何为 GitHub 开源项目贡献代码](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)**

如果你是第一次为开源项目贡献代码，或者还不太熟悉提交流程，可以参考一下 **[React 中的这些 issue](https://github.com/facebook/react/issues?q=is%3Aopen+is%3Aissue+label%3A%22Difficulty%3A+beginner%22)**，这些都是相对容易修复的。

在你决定要修复一个 issue 之前，请仔细看完 issue 的评论，先确定没有其他人要修复再开始你的工作。如果目前确实没有人在修复这个 issue，请在 issue 中评论一下，让别人知道你正在修复。这样可以有效地避免重复的合并请求。

如果有人说要修复当前 issue，但是过了两周都没有任何更新，那你可以接手过来，但依然要在 issue 下方留言表示你要修复。

### 提交合并请求

React 的核心团队一直在关注代码库中的合并请求。对于每一个合并请求，我们要么合并，要么要求发起者做一些改动，要么会在解释原因的前提下关闭合并请求。对于 API 改动，我们可能需要在 Facebook.com 上更新一下，因此可能会多花一些时间处理。我们会尽最大努力，保证每一个合并请求都能及时反馈和处理。

**在开合并请求之前**，请先执行以下步骤：

1. Fork [React 官方代码库](https://github.com/facebook/react)，然后基于 `master` 分支新建你的工作分支。
2. 如果你添加了需要测试的代码，请把测试也写进去！
3. 如果你改动了 API，请把改动更新到文档中。
4. 确保 `npm test` 中的所有测试都可以通过。
5. 记得通过 `npm run lint` 检查代码风格。
6. 使用 [prettier](https://github.com/prettier/prettier) 格式化代码，只需要执行一下 `npm run prettier`。
7. 通过命令 `npm run flow`，使用 [Flow](https://flowtype.org/) 进行类型检查。
8. 如果你添加或删除了任何测试，请在提交合并请求之前运行 `./scripts/fiber/record-tests`，同时提交执行结果的变化。
9. 如果你还没有签署协议，请先参考下面的链接完成协议签署。

### 贡献者协议 (CLA)

为了我们可以处理你的合并请求，请点开下面的链接，先签署我们的贡献者协议。如果你在为 Facebook 其他开源项目贡献代码时已经签署过，那就不需要再签一次了。如果你是第一次贡献代码，请记得在签署协议的时候加上你的 GitHub 用户名，这样我们可以验证你是否已经签署过。

**[在这里签署贡献者协议](https://code.facebook.com/cla)**。

### 环境搭建

* 你需要安装版本号为 `4.0.0` 之后的 `node`，以及版本号为 `2.0.0` 之后的 `npm`。
* 你可能会需要安装 `gcc`，至少要确保你的环境是允许安装编译器的。我们的某些 `npm` 依赖是需要搭建编译环境的。在 OS X 系统中，你只需要安装 Xcode Command Line Tools 就可以了。在 Ubuntu 系统中，你可以执行 `apt-get install build-essential` 来安装所需要的包，在 Linux 的发行版中执行类似的命令也可以安装。在 Windows 系统中，你需要一些额外的步骤，请参考这个链接：[`node-gyp` installation instructions](https://github.com/nodejs/node-gyp#installation)。
* 熟悉 `npm` 的使用，而且你应该了解，在本地安装 `npm` 包的时候，该不该使用 `sudo`。
* 熟悉 `git` 的使用。

### 开发流程

在把 React 源码 clone 到本地之后，请在文件夹中执行 `npm install`，获取相关的依赖
然后，你就可以运行以下的命令：

* `npm run lint` 检查代码风格。
* `npm test` 运行所有的测试。
* `npm test -- --watch` 运行测试，并监听文件改动。如果有文件发生变化，会重新运行测试。
* `npm test <pattern>` 运行测试，并监听 `<pattern>` 中匹配到文件的改动。
* `npm run flow` 运行 [Flow](https://flowtype.org/) 类型检查。
* `npm run build` 根据目前的依赖包创建一个 `build` 文件夹。

为了保证你的改动不会影响到其他功能，请记得要执行 `npm test`，或者上面列出的相关命令。当然，你也可以把改动后的代码放到一个真实项目中来测试。

首先，执行 `npm run build` 命令。这个命令会把一些前置依赖包放到 `build` 文件夹中。同时，也会在 `build/packages` 文件夹中添加一些 npm 包。

如果你想测试一下你的改动，最简单的方式就是先执行 `npm run build` 命令，然后打开 `fixtures/packaging/babel-standalone/dev.html` 文件。这个文件已经引用了 `build` 文件夹中的 `react.js`，因此这里面会包含你的改动。

如果你想在一个真实的 React 项目中测试你改动后的代码，你可以把 `build/dist/react.development.js`、`build/dist/react-dom.development.js` 或者其他打包好的文件复制出来，替换掉项目中对应的稳定版本。如果你的项目使用了 npm 中的 React，那你可以直接删除 `react` 和 `react-dom` 两个依赖，然后通过 `npm link` 命令把它们的指向设置成本地的 `build` 文件夹：

```sh
cd your_project
npm link ~/path_to_your_react_clone/build/packages/react
npm link ~/path_to_your_react_clone/build/packages/react-dom
```

这样，每次你需要在 React 文件夹中执行 `npm run build` 命令，就可以更新你的项目 `node_modules` 文件夹中的依赖了。之后，你可以重新构建一下你的项目来测试更改。

如果你打算添加新的方法，请务必添加单元测试。这样我们才能确保今后的代码改动不会破坏你写的这个功能。

### 代码格式

我们的代码风格检查器可以检查出大部分的格式问题。
你只需要执行 `npm run lint` 就可以进行格式检查了。

然而，还是有一些格式问题是通过我们的代码风格检查器发现不了的。如果你对自己写的代码有格式方面的疑问，请参考 [Airbnb's 的 JavaScript 代码格式建议](https://github.com/airbnb/javascript)。

### 一些我们采用的习惯

* 使用分号 `;`
* 在列举的最后一个项目之后也需要加逗号 `,`
* 2 个空格缩进（不使用 tab）
* 情况允许的条件下，更推荐使用单引号 `'` 而不是双引号 `"`
* 加上 `'use strict';`
* 每行长度不得超过 120 个字符（**文档除外**）
* 我们喜欢看 "吸引人" 的代码
* 不要使用 `setTimeout` 和 `setInterval` 中的可选参数（译者注：就是后面的时间）

### 介绍视频

如果你有兴趣，可以看一下 [这个 26 分钟的视频](https://www.youtube.com/watch?v=wUpPsEcGsg8)，内容是介绍如何给 React 贡献代码。

### 会议记录

React 团队每周都有例会，会议内容主要有 React 项目的开发进度、未来规划以及目前开发任务的优先级。你可以在这里查看 [会议记录](https://github.com/reactjs/core-notes/)。

### 许可证

给 React 提交代码，意味着你同意自己提交的代码以及 React 项目的代码都是基于 BSD 协议的。

### 接下来做什么？

请继续阅读 [下一章节](/react/contributing/codebase-overview.html)，了解一下 React 代码库的结构。
