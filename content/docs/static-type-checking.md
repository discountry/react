---
id: static-type-checking
title: 静态类型检查
permalink: docs/static-type-checking.html
prev: typechecking-with-prototypes.html
next: refs-and-the-dom.html
---

像 [Flow](https://flowtype.org/) 和 [TypeScript](https://www.typescriptlang.org/) 这样的静态类型检查器可以在运行代码之前识别某些类型的问题。 他们还可以通过添加自动完成功能来改善开发人员的工作流程。 出于这个原因，对于更大的代码库我们建议使用 Flow 或者 TypeScript 来替代 `PropTypes`。

## Flow

[Flow](https://flow.org/) 是一个针对 JavaScript 代码的静态类型检查器。它是在Facebook开发的，经常和React一起使用。 它可以让你使用特殊的类型语法来注释变量，函数和React组件，并尽早地发现错误。 您可以阅读 [Flow 介绍](https://flow.org/en/docs/getting-started/) 来了解基本知识。

为了使用 Flow, 你需要：

* 将 Flow 添加到您的项目作为依赖项。
* 确保编译后的代码中去除了 Flow 语法。
* 添加了类型注释并运行 Flow 来检查它们。

我们将在下面详细解释这些步骤。

### 在一个项目中添加 Flow 

首先，在你的终端里进入到项目目录。你需要执行两条命令。

如果你使用 [Yarn](https://yarnpkg.com/), 运行：

```bash
yarn add --dev flow-bin
yarn run flow init
```

如果你使用 [npm](https://www.npmjs.com/), 运行：

```bash
npm install --save-dev flow-bin
npm run flow init
```

第一个命令在你的项目中安装了最新版的 Flow。第二个命令创建一个您需要提交的 Flow 配置文件。

最后，将 `flow` 添加到你的 `package.json`中的 `"scripts"` 部分：

```js{4}
{
  // ...
  "scripts": {
    "flow": "flow",
    // ...
  },
  // ...
}
```

### 从编译过的代码中剥离 Flow 语法

Flow 通过使用特殊的语法为类型注释扩展了 JavaScript 语言。 然而，浏览器并不知道这个语法，所以我们需要确保它不会在发送到浏览器的已编译的 JavaScript 包中结束。

确切的做法取决于你用来编译 JavaScript 的工具。

#### Create React App

如果你的项目是使用 [Create React App](https://github.com/facebookincubator/create-react-app) 建立的，恭喜！ Flow 此时已经被默认剥离，所以在这一步你不需要做任何事情。

#### Babel

>注意：
>
>这些说明*不*适用于使用 Create React App 的用户。即使 Create React App 在底层使用 Babel，它已经被配置为理解 Flow。只有那些*没有*使用 Create React App 的用户才需要跟进下面的步骤。

如果你手动为你的项目配置了 Babel，你将需要为 Flow 安装一个特殊的 preset。

如果你使用 Yarn, 运行：

```bash
yarn add --dev babel-preset-flow
```

如果你使用 npm, 运行：

```bash
npm install --save-dev babel-preset-flow
```

然后将 `flow` preset 加入你的 [Babel 配置](http://babeljs.io/docs/usage/babelrc/)。比如，如果你通过 `.babelrc` 文件配置 Babel，它可能会如下所示：

```js{3}
{
  "presets": [
    "flow",
    "react"
  ]
}
```

这将会让你可以在你的代码中使用 Flow 语法。

>注意：
>
>Flow 不需要 `react` preset，但他们经常在一起使用。 Flow 本身就理解 JSX 语法。

#### 其他生成设置

如果你既不用 Create React App 也不用 Babel，你可以使用 [flow-remove-types](https://github.com/flowtype/flow-remove-types) 来去除类型注释。

### 运行 Flow

如果你遵循了上述的说明，你应该能够在第一次就运行 Flow。

```bash
yarn flow
```

如果你使用 npm, 运行：

```bash
npm run flow
```

你应该会看到一条这样的消息：

```
No errors!
✨  Done in 0.17s.
```

### 添加 Flow 类型注释

默认情况下， Flow 仅检查包含此批注的文件：

```js
// @flow
```

通常它被放置在文件的顶部。 尝试将其添加到项目中的某些文件中，然后运行 `yarn flow` 或 `npm run flow` 来查看 Flow 是否已经发现了一些问题。

也有[一个选择](https://flow.org/en/docs/config/options/#toc-all-boolean)可以强制 Flow 不考虑注释检查*所有*文件。对于现有的项目它可能太繁琐了，但对于一个新项目如果你想完全用 Flow 来组织，那会是合理的。

现在你们都准备好了！ 我们建议查看以下资源以了解有关 Flow 的更多信息：

* [Flow 文档：类型注释](https://flow.org/en/docs/types/)
* [Flow 文档：编辑器](https://flow.org/en/docs/editors/)
* [Flow 文档： React](https://flow.org/en/docs/react/)
* [Linting in Flow](https://medium.com/flow-type/linting-in-flow-7709d7a7e969)

## TypeScript

[TypeScript](https://www.typescriptlang.org/) 是一门由微软开发的编程语言。 它是 JavaScript 的一个类型超集，包含它自己的编译器。 作为一种类型化语言，Typescript 可以早在您的应用程序上线之前在构建时发现错误。 你可以在[这里](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter)了解更多关于在 React 中使用 TypeScript 的知识。

要使用 TypeScript，你需要：
* 将 Typescript 添加为您的项目的依赖项
* 配置 TypeScript 编译器选项
* 使用正确的文件扩展名
* 为你使用的库添加定义

让我们来详细介绍一下。

### 在一个项目中添加 TypeScript 

这一切都始于在终端中运行一个命令。

如果你使用 [Yarn](https://yarnpkg.com/), 运行：

```bash
yarn add --dev typescript
```

如果你使用 [npm](https://www.npmjs.com/), 运行：

```bash
npm install --save-dev typescript
```

恭喜！ 您已经将最新版本的 TypeScript 安装到您的项目中。 安装 TypeScript 让我们可以访问 `tsc` 命令。 在配置之前，让我们将 `tsc` 添加到 `package.json` 中的 "scripts" 部分：

```js{4}
{
  // ...
  "scripts": {
    "build": "tsc",
    // ...
  },
  // ...
}
```

### 配置 TypeScript 编译器

除非我们告诉编译器要做什么，否则它对我们将毫无用处。在 TypeScript 中，这些规则定义在一个叫 `tsconfig.json` 的特殊文件中。运行如下命令生成该文件：

```bash
tsc --init
```

看看现在生成的 `tsconfig.json`，你可以看到有很多选项可以用来配置编译器。 有关所有选项的详细说明，请点击[这里](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。

在许多选项中，我们会看到 `rootDir` 和 `outDir`。编译器将以真实的情况接收 typescript 文件然后生成 javascript 文件。然而我们不想混淆源文件和编译后的输出。

我们将通过两个步骤解决这个问题：
* 首先，让我们像这样安排我们的项目结构。我们将所有的源代码放在 src 目录中。

```
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

* 接下来，我们会告诉编译器源代码在哪以及编译后输出该放哪。

```js{6,7}
// tsconfig.json

{
  "compilerOptions": {
    // ...
    "rootDir": "src",
    "outDir": "build"
    // ...
  },
}
```

非常棒！现在当我们运行构建脚本时编译器将会将生成的 javascript 代码输出到 `build` 文件夹。[TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter/blob/master/tsconfig.json) 提供了一个带有一套配置的 `tsconfig.json` 文件让你上手。

通常，您不希望将生成的JavaScript保留在源代码管理中，因此请确保将生成文件夹添加到 `.gitignore` 中。

### 文件扩展名

在 React 中，你最有可能在 `.js` 文件中编写你的组件。在 TypeScript 中我们有两个文件扩展名：

`.ts` 是默认的文件扩展名， `.tsx` 是一个为包含  `JSX` 代码使用的特殊扩展名。

### 运行 TypeScript

如果你遵循了如上的说明，你应该能够第一次就成功运行 TypeScript。

```bash
yarn build
```

如果你使用 npm, 运行：

```bash
npm run build
```

如果你没有看到输出，这意味着它完全编译成功了。

### 类型定义

为了能够显示来自其他包的错误和提示，编译器依赖于声明文件。 声明文件提供了关于库的所有类型信息。 这使我们能够在我们的项目中使用像那些在 npm 中的 JavaScript 库。

对于一个库来说，主要有两种方式获得声明：

__Bundled__ - 该库捆绑了自己的声明文件。 这对我们来说很好，因为我们所要做的就是安装这个库，我们便可以马上使用它。 要检查一个库是否有 bundled 类型，请在项目中查找 `index.d.ts` 文件。 有些库会在 `package.json` 文件的 `typings` 或者 `types` 属性中指定它。

__[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)__ - DefinitelyTyped 是一个不包含声明文件的库的声明库。这些声明是由微软和开源贡献者提供的。 例如 React 并不捆绑它自己的声明文件。 相反，我们可以从 DefinitelyTyped 中获得。 为此，请在终端中输入此命令。

```bash
# yarn
yarn add --dev @types/react

# npm
npm i --save-dev @types/react
```

__局部声明__
有时你想使用的包不包含声明，也不能在 DefinitelyTyped 上使用。 在这种情况下，我们可以有一个本地声明文件。 为此，请在源目录的根目录中创建一个 `declarations.d.ts` 文件。 一个简单的声明可能是这样的：

```typescript
declare module 'querystring' {
  export function stringify(val: object): string
  export function parse(val: string): object
}
```

### 和 Create React App 一起使用 TypeScript 

[react-scripts-ts](https://www.npmjs.com/package/react-scripts-ts) 自动配置了一个 `create-react-app` 项目支持 TypeScript。你可以像这样使用：

```bash
create-react-app my-app --scripts-version=react-scripts-ts
```

请注意它是一个**第三方**项目，而且不是 Create React App 的一部分。

你也可以尝试 [typescript-react-starter](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter)。

你已经准备好写代码了！我们建议查看以下资源来了解有关 TypeScript 的更多信息：

* [TypeScript 文档：基本类型](https://www.typescriptlang.org/docs/handbook/basic-types.html)
* [TypeScript 文档：从 Javascript 迁徙](http://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
* [TypeScript 文档： React 和 Webpack](http://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

## Reason

[Reason](https://reasonml.github.io/) 不是一种新的语言; 这是一个新的语法和工具链，由测试语言 [OCaml](http://ocaml.org/) 提供支持。 Reason 使 OCaml 成为了面向 JavaScript 程序员的熟悉语法，而且迎合现有已知的 NPM/Yarn 工作流。

Reason 是在 Facebook 开发的，并且在其一些产品如 Messenger 中使用。它仍然具有一定的实验性质，但它有由 Facebook 维护的[专门的 React 绑定](https://reasonml.github.io/reason-react/) 和一个[充满活力的社区](https://reasonml.github.io/community/)。

## Kotlin

[Kotlin](https://kotlinlang.org/) 是由 JetBrains 开发的一门静态类型语言。其目标平台包括 JVM， Android， LLVM 和 [JavaScript](https://kotlinlang.org/docs/reference/js-overview.html)。

JetBrains 专门为 React 社区开发和维护了几个工具： [React bindings](https://github.com/JetBrains/kotlin-wrappers) 以及 [Create React Kotlin App](https://github.com/JetBrains/create-react-kotlin-app)。 后者可以帮助您开始使用Kotlin 构建 React 应用程序，而不需要构建配置。 

## 其他语言

请注意，还有其他静态类型的语言可以编译成 JavaScript，因此是 React 兼容的。 例如，和 [elmish-react](https://fable-elmish.github.io/react) 一起使用的 [F#/Fable](http://fable.io)。查看他们各自的网站以获取更多信息，并欢迎添加更多和与 React 一起工作的静态类型的语言到这个页面！
