<template>
  <view class="markdown">
    <rich-text :nodes="nodes"></rich-text>
  </view>
</template>

<script>
import {
  MarkdownIt,
  parseTokens,
} from "../../common/wtto-markdown/js_sdk/index";
import "../../common/wtto-markdown/js_sdk/markdown.css";
import { katexPlugin } from "../../common/wtto-markdown/js_sdk/katex";
import "../../common/wtto-markdown/js_sdk/katex.css";

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
    markdownIt.use(katexPlugin, { throwOnError: true });
    const tokens = markdownIt.parse(
      "# Markdown content\n $$\\ce{CO2 + C -> 2 CO}$$ \n $$\\ce{Hg^2+ ->[I-] HgI2 ->[I-] [Hg^{II}I4]^2-}$$",
      {}
    );
    this.nodes = parseTokens(tokens, markdownIt.options);
  },
};
</script>
