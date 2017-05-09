# React 中文文档翻译计划

我们使用 [Jekyll](http://jekyllrb.com/) 静态站点生成器，使用 ([mostly](http://zpao.com/posts/adding-line-highlights-to-markdown-code-fences/)) 处理 Markdown, 文档部署在 [GitHub Pages](http://pages.github.com/).

## 安装

如果你想要参与文档的翻译，首先需要在本地部署文档的jkeyll站点。

### 依赖

在使用jkeyll之前，我们需要先安装好ruby

 - [Ruby](http://www.ruby-lang.org/) (version >= 1.8.7)
 - [RubyGems](http://rubygems.org/) (version >= 1.3.7)
 - [Bundler](http://gembundler.com/) (使用 `gem install bundler`)


```sh
$ cd react/docs
$ bundle install # Might need sudo.
$ npm install
```

如果你收到国内糟糕的网络环境影响，请将ruby源切换至国内镜像[ruby-china](http://gems.ruby-china.org/).

### 构建文档

先跑一下 `grunt` 确保项目依被构建。

使用 Jekyll 在本地运行站点 (默认端口路由为： `http://localhost:4000`):

```sh
$ cd react/docs
$ bundle exec rake
$ bundle exec jekyll serve -w
$ open http://localhost:4000/react/index.html
```

### 生成文档

通过如下命令，我们可以和react存放的统一路径下名为 `react-gh-pages` 文件夹中的文档。

```sh
$ bundle exec rake release
```

### 发布文档

切换至本项目的 `gh-pages` 分支下，复制 `react-gh-pages` 文件夹中的所有内容。提交并同步至项目中。

```sh
git checkout gh-pages
git add .
git commit -m 'update docs'
git push origin gh-pages
```
