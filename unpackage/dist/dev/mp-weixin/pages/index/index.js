"use strict";
require("../../common/wtto-markdown/js_sdk/mhchem.js");
const common_wttoMarkdown_js_sdk_index = require("../../common/wtto-markdown/js_sdk/index.js");
const common_wttoMarkdown_js_sdk_katex = require("../../common/wtto-markdown/js_sdk/katex.js");
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      nodes: []
    };
  },
  onLoad() {
    const markdownIt = common_wttoMarkdown_js_sdk_index.MarkdownIt({
      typographer: true,
      linkify: true
    });
    markdownIt.use(common_wttoMarkdown_js_sdk_katex.katexPlugin, { throwOnError: true });
    const tokens = markdownIt.parse("# Markdown content\n $$\\ce{CO2 + C -> 2 CO}$$ \n $$\\ce{Hg^2+ ->[I-] HgI2 ->[I-] [Hg^{II}I4]^2-}$$", {});
    this.nodes = common_wttoMarkdown_js_sdk_index.parseTokens(tokens, markdownIt.options);
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.nodes
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
