---
id: accessibility
title: Accessibility
permalink: docs/accessibility.html
---

## 为何要需要可访问性？

Web可访问性（也被称为 [**a11y**](https://en.wiktionary.org/wiki/a11y)）是让网站对所有人群可用的的设计和发明。通过辅助技术来与页面交互对于可访问性支持是必要的。

React完全支持构建可访问性的页面， 通常通过使用标准的 HTML 技术。

## 标准和指导

### WCAG

[网络内容可访问性指南](https://www.w3.org/WAI/intro/wcag) 为创建可访问性站点提供了指导。

下列的WCAG列表提供了概览：

- [WCAG checklist from Wuhcag](https://www.wuhcag.com/wcag-checklist/)
- [WCAG checklist from WebAIM](http://webaim.org/standards/wcag/checklist)
- [Checklist from The A11Y Project](http://a11yproject.com/checklist.html)

### WAI-ARIA

[网络可访问倡议 - 可访问性富网络应用](https://www.w3.org/WAI/intro/aria) 文档涵盖了构建完整的可访问JavaScript工具技术。

注意JSX完全支持所有的`aria-*` HTML属性。然而，在React中大部分DOM属性和特性采用小驼峰命名规则，这些特性应该采用小写：

```javascript{3,4}
<input
  type="text" 
  aria-label={labelText}
  aria-required="true"
  onChange={onchangeHandler}
  value={inputValue}
  name="name"
/>
```

## 可访问表单

### 标签

每个HTML表单控件，例如`<input>` 和 `<textarea>`，都需要被标记上的可访问的标签。我们需要提供描述性的标签同时也展示给屏幕阅读器。

下列资源展示了如何使用标签：

- [W3C关于如何标记元素的说明](https://www.w3.org/WAI/tutorials/forms/labels/)
- [WebAIM关于如何标记元素的说明](http://webaim.org/techniques/forms/controls)
- [Paciello小组关于可访问性名称的说明](https://www.paciellogroup.com/blog/2017/04/what-is-an-accessible-name/)

尽管这些标准的HTML实践可以直接用于React，但需要注意在JSX中，`for`特性被写作`htmlFor`:

```javascript{1}
<label htmlFor="namedInput">Name:</label>
<input id="namedInput" type="text" name="name"/>
```

### 告知用户异常

异常环境需要所有用户理解。下列链接也说明了如何显示错误文案给屏幕阅读器：

- [W3C演示用户提醒](https://www.w3.org/WAI/tutorials/forms/notifications/)
- [WebAIM检查表单验证](http://webaim.org/techniques/formvalidation/)

## 焦点控件

确保你的网络应用可以完全仅通过键盘来操作：

- [WebAIM 关于键盘可访问性的演讲](http://webaim.org/techniques/keyboard/)

### 键盘焦点和焦点边框

键盘焦点涉及DOM中被键盘选中用于接受输入的当前元素。我们可以在每一处地方看见如下图所示的类似的焦点边框：

<img src="/images/docs/keyboard-focus.png" alt="Blue keyboard focus outline around a selected link." />

仅能使用CSS来移除这一边框，若你要用其他边框来替换他，例如可以设置`outline: 0`。

### 定位到期望内容的机制

在应用中提供一种机制用以允许用户跳过之前的导航部分来帮助和加速键盘导航。

Skiplinks 或 Skip Navigation Links 隐藏在导航链接中，仅当用户用键盘与页面进行交互时可见。他们非常容易通过页面内部锚点和一些样式来实现：

- [WebAIM - Skip Navigation Links](http://webaim.org/techniques/skipnav/)

也可使用路标元素和角色作为辅助技术，例如`<main>` 和 `<aside>`，来将页面划分区域以允许用户快速导航到这些部分。

阅读更多了解关于使用这些元素以提高可访问性：

- [Deque University - HTML 5 and ARIA Landmarks](https://dequeuniversity.com/assets/html/jquery-summit/html5/slides/landmarks.html)

### 编程式地管理焦点

我们的React应用会在运行期间持续地修改HTML DOM元素，有时会导致键盘焦点丢失或定位到未知元素上。为修复该问题，我们需要用代码微调键盘焦点到正确的方向。例如，重设键盘焦点到一个打开模态窗口的按钮上，在模态窗口关闭之后。

Mozilla开发者网络可以查看并描述了我们如何构建[键盘导航的JavaScript工具](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets)。

为在React中设置焦点，我们可使用[Refs to Components](refs-and-the-dom.html)。

为使用它，我们先在组件类的JSX中创建一个元素的ref：

```javascript{2-3,7}
render() {
  // Use the `ref` callback to store a reference to the text input DOM
  // element in an instance field (for example, this.textInput).
  return (
    <input
      type="text"
      ref={(input) => { this.textInput = input; }} />
  );
}
```

而后，当需要时，我们可以在我们组件的其他地方设置焦点：

 ```javascript
 focus() {
   // Explicitly focus the text input using the raw DOM API
   this.textInput.focus();
 }
 ```

一个不错的焦点管理的例子是[react-aria-modal](https://github.com/davidtheclark/react-aria-modal)。这是个相对罕见的完全可访问的模态窗口的例子。不仅将初始焦点设在取消按钮（阻止用户意外地激活成功操作）和在模态对话框内记录键盘焦点，其还重置焦点回到最初触发对话框的元素上。

>注意：

> 尽管这对于可访问性特性非常重要，其也应该审慎地应用。当被中断时使用其来修复键盘的焦点，而不是尝试和期望用户如何使用应用。

## 更为复杂的工具

更为复杂的用户体验并不意味着更少的可访问性特性。反之，可访问性能够通过将其尽可能编码到HTML中而非常容易实现，即使最为复杂的工具也能够进行可访问性编码。

这里我们要求具备 [ARIA 角色](https://www.w3.org/TR/wai-aria/roles) 以及 [ARIA 声明和属性](https://www.w3.org/TR/wai-aria/states_and_properties)的相关知识。这些工具箱涵盖了所有JSX支持的同时能够支持构建完整的可访问性高阶函数式的React组件的HTML特性。

每一类型的工具都具有特定的设计模式，并由用户和用户代理以某些方式生效：

- [WAI-ARIA 开发实践 - 设计模式和工具](https://www.w3.org/TR/wai-aria-practices/#aria_ex)
- [Heydon Pickering - ARIA 例子](http://heydonworks.com/practical_aria_examples/)
- [包含性组件](https://inclusive-components.design/)

## 其他要点的考量

### 设置语言

在页面中声明语言类型以让屏幕阅读器软件能够使用其来选择正确的发音设置：

- [WebAIM - 文档语言](http://webaim.org/techniques/screenreader/#language)

### 设置文档标题

我们可以在React中使用[React文档标题组件](https://github.com/gaearon/react-document-title)来进行设置。

### 颜色对比

确保页面上所有可读的文本都有丰富的颜色对比以让低视力用户能够最大程度的可读：

- [WCAG - 理解必要的颜色对比](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)
- [关于颜色对比以及为何需要重新思考它](https://www.smashingmagazine.com/2014/10/color-contrast-tips-and-tools-for-accessibility/)
- [A11yProject - 什么是颜色对比](http://a11yproject.com/posts/what-is-color-contrast/)

手动地计算页面上所有合适的颜色组合十分无趣，替代地，你可以[通过Colorable来计算整个可访问性颜色](http://jxnblk.com/colorable/)。

之前提到的aXe和WAVE也包含了颜色对比测试并会报告颜色对比错误。

若你想扩展你的对比测试能力，可以使用如下工具：

- [WebAIM - Color Contrast Checker](http://webaim.org/resources/contrastchecker/)

- [The Paciello Group - Color Contrast Analyzer](https://www.paciellogroup.com/resources/contrastanalyser/)

## 开发及测试工具

在创建可访问性网路应用时，有大量工具可以协助我们完成该工作。

### 键盘

目前最简单也是最重要的检查是通过键盘来整个页面是否达标和使用。做法如下：

1. 拔掉鼠标。
2. 使用`Tab`和`Shift+Tab`切换到浏览器。
3. 使用`Enter`激活元素。
4. 当满足要求后，使用键盘的方向键与一些元素进行交互，例如菜单和下拉列表。

### 开发助手

我们可以在JSX代码里直接查看一些可访问性特性。通常在一些识别JSX语法的集成开发环境中（IDE）已经提供了为ARIA用户（roles），声明和属性的智能检查。我们也可采用如下工具：

#### eslint-plugin-jsx-a11y

 基于ESLint的[eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) 插件提供了在JSX代码中关于可访问性问题的抽象语法树检查反馈。大部分IDE能够直接在代码分析和源码窗口中直接集成这些发现。

[Create React App](https://github.com/facebookincubator/create-react-app)包含了带有部分激活规则的这一插件。若想要支持更多的可访问性规则，你可以在项目的根目录下创建一个`.eslintrc`文件并包含如下内容：

  ```json
  {
    "extends": ["react-app", "plugin:jsx-a11y/recommended"],
    "plugins": ["jsx-a11y"]
  }
  ```

### 浏览器的可访问性测试

在浏览器里已有大量工具能够在页面上运行可访问性审计。可以结合之前提到过的其他可访问性检查工具来使用他们，因为他们仅可以测试HTML中技术上的可访问性。

#### aXe, aXe-core and react-axe

双端系统为应用提供了自动化和端到端的可访问性测试[aXe-core](https://www.deque.com/products/axe-core/) 。这一模块包含了Selenium的集成。

[可访问性Engine](https://www.deque.com/products/axe/) 或 aXe，是一款基于`aXe-core`构建的可访问性检测器的浏览器插件。

你也可以在开发和调试环节，使用[react-axe](https://github.com/dylanb/react-axe)模块在控制台中直接报告可访问性问题。

#### WebAIM WAVE

[Web Accessibility Evaluation Tool](http://wave.webaim.org/extension/) 是另外一个可访问性浏览器插件。

#### Accessibility inspectors and the Accessibility Tree

[可访问树（The Accessibility Tree）](https://www.paciellogroup.com/blog/2015/01/the-browser-accessibility-tree/) 是一个DOM结构的子集，其包含每个应暴露给辅助性工具，如屏幕阅读器等DOM元素的可访问性对象。

在一些浏览器我们可以在可访问树中轻松地访问每个元素的可访问性信息：

- [在Chrome浏览器下激活Accessibility Inspector](https://gist.github.com/marcysutton/0a42f815878c159517a55e6652e3b23a)
- [在OS X系统下的Safari浏览器使用Accessibility Inspector](https://developer.apple.com/library/content/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

### 屏幕阅读器

结合屏幕阅读器进行测试应构成可访问性测试的一部分。

注意浏览器 / 屏幕阅读器的结合。建议在浏览器中选择最适合的屏幕阅读器测试应用程序。

#### FireFox下的NVDA

[NonVisual Desktop Access](https://www.nvaccess.org/) 或 NVDA是一款广泛使用的开源的窗口屏幕阅读器。

关于如何更好使用NVDA参考如下指南:

- [WebAIM - 使用 NVDA来计算可访问性](http://webaim.org/articles/nvda/)
- [Deque - NVDA 快捷键介绍](https://dequeuniversity.com/screenreaders/nvda-keyboard-shortcuts)

#### Safari下的VoiceOver

VoiceOver是一款集成在苹果设备的屏幕阅读器。

参考以下指南了解关于如何集合和使用VoiceOver：

- [WebAIM - 使用 VoiceOver 计算可访问性](http://webaim.org/articles/voiceover/)
- [Deque - OSX 上的VoiceOver 快捷键操作](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts)
- [Deque - iOS上的VoiceOver快捷键操作](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts)

#### Internet Explorer下的JAWS

[Job Access With Speech](http://www.freedomscientific.com/Products/Blindness/JAWS) or JAWS，是一款在Windows平台广泛使用的屏幕阅读器。

参考以下链接了解关于更好使用JAWS

- [WebAIM - 使用 JAWS 计算可访问性](http://webaim.org/articles/jaws/)
- [Deque - JAWS 快捷键操作](https://dequeuniversity.com/screenreaders/jaws-keyboard-shortcuts)
