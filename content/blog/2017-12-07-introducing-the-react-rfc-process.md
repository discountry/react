---
title: "Introducing the React RFC Process"
author: [acdlite]
---

我们正在采用一个 RFC（“征求意见（request for comments）”）  的流程为 React 提供意见。

受到  [Yarn](https://github.com/yarnpkg/rfcs)、 [Ember](https://github.com/emberjs/rfcs) 和 [Rust](https://github.com/rust-lang/rfcs) 社区的激励，目标是能够让 React 核心团队成员和社区成员共同来设计新特性。这也是打算为参加这一项目的成员提供一个明确的路径：

- 创建一个 RFC 文档详细描述你的建议。
- 提交一个 PR 到 [RFC 仓库](https://github.com/reactjs/rfcs)。
- 将反馈合并到提案中。
- 在经过讨论之后，核心团队可能会或可能不会采纳该 RFC。
- 若该 RFC 被采纳，则 PR 会被合并。

当 RFC 被同意在 React 中实现时则会被采纳。关于这一流程更为全面的描述可以查看该仓库的 [README](https://github.com/reactjs/rfcs/blob/master/README.md)。具体细节可能会在之后有所改善。

## 谁能提交 RFC？ {#who-can-submit-rfcs}

任何人！没有必须要求了解 React 的内部机制，也不期望你自己来实现这个提案。

和我们其他的仓库一样，我们会在接受你的 PR 前要求你完成[贡献者许可协议（Contributor License Agreement）](https://github.com/reactjs/rfcs#contributor-license-agreement-cla)。

## 什么类型的改变应作为 RFC 提交?{#what-types-of-changes-should-be-submitted-as-rfcs}

通常来讲，在实现前任何额外的评审或设计对于 RFC 来说都是不错的选择。根据过往经验，这意味着任何增加、改变，或移除一个 React API 类型的提案都可以。

并不是每个变更都必须经过 RFC 的流程。Bug 修复或性能提升等不会修改 API 的提案将会直接被提交到主代码库中。

我们现在有几个你可以参与为 React 贡献的仓库：

- **问题，bug 修复和代码变更提交到主仓库** : [facebook/react](https://github.com/facebook/react)
- **官网及文档**：[reactjs/reactjs.org](https://github.com/reactjs/reactjs.org)
- **需要在实现前进行额外评审的想法**：[reactjs/rfcs](https://github.com/reactjs/rfcs)

## 关于新 API 的 RFC {#rfc-for-a-new-context-api}

结合我们刚发布的 RFC 流程，我们已经提交了一份[关于新版本背景的提案](https://github.com/reactjs/rfcs/pull/2)。该提案已受到了许多来自社区的有价值的反馈，我们已将这些意见采纳到新设计的 API 中。

该提案是一个如何组织 RFC 的好例子。我们期待收到你的提案！
