import "katex/contrib/mhchem/mhchem.js";
import parse from "@rojer/katex-mini";

/**
 * @typedef {import('markdown-it/index')} MarkdownIt
 * @typedef {import('markdown-it/index').StateInline} StateInline
 * @typedef {import('katex').KatexOptions} KatexOptions
 */

const delimiters = [
  {
    left: "\\[",
    right: "\\]",
    display: true,
  },
  {
    left: "\\(",
    right: "\\)",
    display: false,
  },
  {
    left: "$$",
    right: "$$",
    display: false,
  },
];

/**
 * @param {KatexOptions} [options]
 */
function katexEscapedRule(options) {
  return (state, silent) => {
    const max = state.posMax;
    const start = state.pos;

    for (const { left, right, display } of delimiters) {
      // 检查是否以左标记开始
      if (!state.src.slice(start).startsWith(left)) continue;

      // 跳过左标记的长度
      let pos = start + left.length;

      // 寻找匹配的右标记
      while (pos < max) {
        if (state.src.slice(pos).startsWith(right)) {
          break;
        }
        pos++;
      }

      // 没找到匹配的右标记，跳过，进入下个匹配
      if (pos >= max) continue;

      if (!silent) {
        const content = state.src.slice(start + left.length, pos);
        const token = state.push("katex", "", 0);
        try {
          token.content = JSON.stringify(parse(content, options));
        } catch (error) {
          token.content = "[]";
        }
        token.block = display;
      }

      // 更新位置，跳过右标记的长度
      state.pos = pos + right.length;
      return true;
    }
    return false;
  };
}

/**
 * @param {MarkdownIt} md
 * @param {KatexOptions} [options]
 */
export function katexPlugin(md, options) {
  md.inline.ruler.after("text", "katex_escaped", katexEscapedRule(options));
}
