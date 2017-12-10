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

如果你的项目是使用 [Create React App](https://github.com/facebookincubator/create-react-app) 建立的，恭喜！ Flow 朱时已经被默认剥离，所以在这一步你不需要做任何事情。

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

Typically it is placed at the top of a file. Try adding it to some files in your project and run `yarn flow` or `npm run flow` to see if Flow already found any issues.

There is also [an option](https://flow.org/en/docs/config/options/#toc-all-boolean) to force Flow to check *all* files regardless of the annotation. This can be too noisy for existing projects, but is reasonable for a new project if you want to fully type it with Flow.

Now you're all set! We recommend to check out the following resources to learn more about Flow:

* [Flow Documentation: Type Annotations](https://flow.org/en/docs/types/)
* [Flow Documentation: Editors](https://flow.org/en/docs/editors/)
* [Flow Documentation: React](https://flow.org/en/docs/react/)
* [Linting in Flow](https://medium.com/flow-type/linting-in-flow-7709d7a7e969)

## TypeScript

[TypeScript](https://www.typescriptlang.org/) is a programming language developed by Microsoft. It is a typed superset of JavaScript, and includes its own compiler. Being a typed language, Typescript can catch errors and bugs at build time, long before your app goes live. You can learn more about using TypeScript with React [here](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter).

To use TypeScript, you need to:
* Add Typescript as a dependency to your project
* Configure the TypeScript compiler options
* Use the right file extensions
* Add definitions for libraries you use

Let's go over these in detail.

### Adding TypeScript to a Project
It all begins with running one command in your terminal.

If you use [Yarn](https://yarnpkg.com/), run:

```bash
yarn add --dev typescript
```

If you use [npm](https://www.npmjs.com/), run:

```bash
npm install --save-dev typescript
```

Congrats! You've installed the latest version of TypeScript into your project. Installing TypeScript gives us access to the `tsc` command. Before configuration, let's add `tsc` to the "scripts" section in our `package.json`:

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

### Configuring the TypeScript Compiler
The compiler is of no help to us until we tell it what to do. In TypeScript, these rules are defined in a special file called `tsconfig.json`. To generate this file run:

```bash
tsc --init
```

Looking at the now generated `tsconfig.json`, you can see that there are many options you can use to configure the compiler. For a detailed description of all the options, check [here](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

Of the many options, we'll look at `rootDir` and `outDir`. In its true fashion, the compiler will take in typescript files and generate javascript files. However we don't want to get confused with our source files and the generated output.

We'll address this in two steps:
* Firstly, let's arrange our project structure like this. We'll place all our source code in the `src` directory.

```
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

* Next, we'll tell the compiler where our source code is and where the output should go.

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

Great! Now when we run our build script the compiler will output the generated javascript to the `build` folder. The [TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter/blob/master/tsconfig.json) provides a `tsconfig.json` with a good set of rules to get you started.

Generally, you don't want to keep the generated javascript in your source control, so be sure to add the build folder to your `.gitignore`.

### File extensions
In React, you most likely write your components in a `.js` file. In TypeScript we have 2 file extensions:

`.ts` is the default file extension while `.tsx` is a special extension used for files which contain `JSX`.

### Running TypeScript

If you followed the instructions above, you should be able to run TypeScript for the first time.

```bash
yarn build
```

If you use npm, run:

```bash
npm run build
```

If you see no output, it mean's that it completed successfully.


### Type Definitions
To be able to show errors and hints from other packages, the compiler relies on declaration files. A declaration file provides all the type information about a library. This enables us to use javascript libraries like those on npm in our project. 

There are two main ways to get declarations for a library:

__Bundled__ - The library bundles it's own declaration file. This is great for us, since all we need to do is install the library, and we can use it right away. To check if a library has bundled types, look for an `index.d.ts` file in the project. Some libraries will have it specified in their `package.json` under the `typings` or `types` field.

__[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)__ - DefinitelyTyped is a huge repository of declarations for libraries that don't bundle a declaration file. The declarations are crowd-sourced and managed by Microsoft and open source contributors. React for example doesn't bundle it's own declaration file. Instead we can get it from DefinitelyTyped. To do so enter this command in your terminal.

```bash
# yarn
yarn add --dev @types/react

# npm
npm i --save-dev @types/react
```

__Local Declarations__
Sometimes the package that you want to use doesn't bundle declarations nor is it available on DefinitelyTyped. In that case, we can have a local declaration file. To do this, create a `declarations.d.ts` file in the root of your source directory. A simple declaration could look like this:

```typescript
declare module 'querystring' {
  export function stringify(val: object): string
  export function parse(val: string): object
}
```

### Using TypeScript with Create React App

[react-scripts-ts](https://www.npmjs.com/package/react-scripts-ts) automatically configures a `create-react-app` project to support TypeScript. You can use it like this:

```bash
create-react-app my-app --scripts-version=react-scripts-ts
```

Note that it is a **third party** project, and is not a part of Create React App.

You can also try [typescript-react-starter](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter).

You are now ready to code! We recommend to check out the following resources to learn more about Typescript:

* [TypeScript Documentation: Basic Types](https://www.typescriptlang.org/docs/handbook/basic-types.html)
* [TypeScript Documentation: Migrating from Javascript](http://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
* [TypeScript Documentation: React and Webpack](http://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

## Reason

[Reason](https://reasonml.github.io/) is not a new language; it's a new syntax and toolchain powered by the battle-tested language, [OCaml](http://ocaml.org/). Reason gives OCaml a familiar syntax geared toward JavaScript programmers, and caters to the existing NPM/Yarn workflow folks already know.

Reason is developed at Facebook, and is used in some of its products like Messenger. It is still somewhat experimental but it has [dedicated React bindings](https://reasonml.github.io/reason-react/) maintained by Facebook and a [vibrant community](https://reasonml.github.io/community/).

## Kotlin

[Kotlin](https://kotlinlang.org/) is a statically typed language developed by JetBrains. Its target platforms include the JVM, Android, LLVM, and [JavaScript](https://kotlinlang.org/docs/reference/js-overview.html). 

JetBrains develops and maintains several tools specifically for the React community: [React bindings](https://github.com/JetBrains/kotlin-wrappers) as well as [Create React Kotlin App](https://github.com/JetBrains/create-react-kotlin-app). The latter helps you start building React apps with Kotlin with no build configuration.

## Other Languages

Note there are other statically typed languages that compile to JavaScript and are thus React compatible. For example, [F#/Fable](http://fable.io) with [elmish-react](https://fable-elmish.github.io/react). Check out their respective sites for more information, and feel free to add more statically typed languages that work with React to this page!
