"use strict";
const common_vendor = require("../../vendor.js");
const delimiters = [
  {
    left: "\\[",
    right: "\\]",
    display: true
  },
  {
    left: "\\(",
    right: "\\)",
    display: false
  },
  {
    left: "$$",
    right: "$$",
    display: false
  }
];
function katexEscapedRule(options) {
  return (state, silent) => {
    const max = state.posMax;
    const start = state.pos;
    for (const { left, right, display } of delimiters) {
      if (!state.src.slice(start).startsWith(left))
        continue;
      let pos = start + left.length;
      while (pos < max) {
        if (state.src.slice(pos).startsWith(right)) {
          break;
        }
        pos++;
      }
      if (pos >= max)
        continue;
      if (!silent) {
        const content = state.src.slice(start + left.length, pos);
        const token = state.push("katex", "", 0);
        try {
          token.content = JSON.stringify(common_vendor.parse(content, options));
        } catch (error) {
          token.content = "[]";
        }
        token.block = display;
      }
      state.pos = pos + right.length;
      return true;
    }
    return false;
  };
}
function katexPlugin(md, options) {
  md.inline.ruler.after("text", "katex_escaped", katexEscapedRule(options));
}
exports.katexPlugin = katexPlugin;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/common/wtto-markdown/js_sdk/katex.js.map
