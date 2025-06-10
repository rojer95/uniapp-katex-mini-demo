# wtto-markdown

高性能 `markdown` 解析器，使用原生组件 `rich-text` 的 `nodes` 渲染。支持 katex 数学公式，代码高亮等。

## 使用

```vue
<template>
  <view class="markdown">
    <rich-text :nodes="nodes"></rich-text>
  </view>
</template>

<script>
import { MarkdownIt, parseTokens } from "@/uni_modules/wtto-markdown/js_sdk/index";
import "@/uni_modules/wtto-markdown/js_sdk/markdown.css";

export default {
  data() {
    return {
      nodes: [],
    };
  },
  onLoad() {
    const markdownIt = MarkdownIt({
      typographer: true,
      linkify: true,
    });

    const tokens = markdownIt.parse("# Markdown content", {});
    this.nodes = parseTokens(tokens, this.markdownIt.options);
  },
};
</script>
```

## Api

`MarkdownIt(options)` 中的参数 `options`，参见 [MarkdownIt.new](https://markdown-it.github.io/markdown-it/#MarkdownIt.new)

`markdownIt.parse(content,env)` 中的参数 `env`，参见 [MarkdownIt.parse](https://markdown-it.github.io/markdown-it/#MarkdownIt.parse)

## 插件

已测试并支持插件：

- [subscript](https://github.com/markdown-it/markdown-it-sub)
- [superscript](https://github.com/markdown-it/markdown-it-sup)
- [footnote](https://github.com/markdown-it/markdown-it-footnote)
- [definition list](https://github.com/markdown-it/markdown-it-deflist)
- [abbreviation](https://github.com/markdown-it/markdown-it-abbr)
- [emoji](https://github.com/markdown-it/markdown-it-emoji)
- [custom container](https://github.com/markdown-it/markdown-it-container)
- [insert](https://github.com/markdown-it/markdown-it-ins)
- [mark](https://github.com/markdown-it/markdown-it-mark)

### Katex 数学公式

```js
import { katexPlugin } from "@/uni_modules/wtto-markdown/js_sdk/katex";
import "@/uni_modules/wtto-markdown/js_sdk/katex.css";

markdownIt.use(katexPlugin, { throwOnError: true });
```

其中的参数可参见 [Katex Options](https://katex.org/docs/options)

## 代码高亮

需要自己安装依赖 [shiki](https://www.npmjs.com/package/shiki):

```bash
npm install shiki
```

使用示例：

```js
import { createHighlighterCoreSync } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { bundledLanguages } from "shiki/langs.mjs";
import githubLight from "shiki/themes/github-light.mjs";
import githubDark from "shiki/themes/github-dark.mjs";
import { highlightPlugin } from "@/uni_modules/wtto-markdown/js_sdk/highlight";

// 同步获取所有的语言
const langs = [];
for (const name in bundledLanguages) {
  langs.push((await bundledLanguages[name]()).default);
}

const shiki = createHighlighterCoreSync({
  themes: [githubLight, githubDark],
  langs: langs,
  engine: createJavaScriptRegexEngine(),
});

markdownIt.use(highlightPlugin, {
  codeToTokens: (code, lang) =>
    shiki.codeToTokens(code, {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      lang,
    }),
});
```

其中的参数 `codeToTokens`，需要返回 `shiki.codeToTokens` 方法的结果。其中 `shiki.codeToTokens` 的参数需要传入渲染所使用的主题:

**注意**: 传入的主题 theme 以及语言 lang 必须在 `createHighlighterCoreSync` 中提前注册。

```js
shiki.codeToTokens(code, {
  // 支持亮色和暗色多主题
  themes: {
    light: "github-light",
    dark: "github-dark",
  },
  // 也可以只传入单个的主题
  // theme: 'vitesse-light',
  lang,
});
```

可根据需求引入特定的语言。比如，只需要高亮`javascript`语言:

```js
import js from "shiki/langs/javascript.mjs";

const shiki = createHighlighterCoreSync({
  themes: [githubLight, githubDark],
  langs: [js],
  engine: createJavaScriptRegexEngine(),
});
```

可根据需求选择主题，比如只需要使用主题 `vitesse-light`:

```js
import vitesseLight from "shiki/themes/vitesse-light.mjs";

const shiki = createHighlighterCoreSync({
  themes: [vitesseLight],
  langs: [js],
  engine: createJavaScriptRegexEngine(),
});
```

## CSS 样式

内置 markdown 样式 `@/uni_modules/wtto-markdown/js_sdk/markdown.css`，以及 katext 样式 `@/uni_modules/wtto-markdown/js_sdk/katex.css`。

如果没有用到数学公式的渲染，不需要引入 `katex.css`。

如果样式不满意，可以直接修改对应的 css 文件。

关于 `markdown-it-container` 插件，需要根据自己注册的名称，自己添加对应的样式。比如，注册的 warning 容器:

```css
.md_container_warning {
  background-color: #ff8;
  padding: 40rpx;
  border-radius: 12rpx;
}
```

## QA

1. 怎么处理事点击事件？

   由于 `rich-text` 的限制，渲染后的内容会屏蔽所有节点的事件。

   如果是在 APP 平台，可以使用 `renderjs` + `markdownIt.render(content)`，使用 HTML5 渲染。
