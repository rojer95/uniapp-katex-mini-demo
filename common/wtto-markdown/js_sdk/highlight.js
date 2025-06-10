/**
 * @typedef {import('shiki').TokensResult} TokensResult
 */

/**
 * @param {import('markdown-it/index')} md
 * @param {{codeToTokens:(code:string,lang:string) => TokensResult}} options
 */
export function highlightPlugin(md, options) {
  const originalFence = md.block.ruler.__rules__.find((rule) => rule.name === "fence").fn;

  md.block.ruler.at("fence", function highlight(state, startLine, endLine, silent) {
    // 调用原始的 fence 解析逻辑
    const result = originalFence(state, startLine, endLine, silent);

    if (result) {
      const lastToken = state.tokens[state.tokens.length - 1]; // 获取最后一个生成的 token

      if (lastToken && lastToken.type === "fence" && lastToken.tag === "code" && lastToken) {
        const res = options.codeToTokens(lastToken.content, lastToken.info.trim());
        /** @type {import('@uni-helper/uni-types').RichTextNode[]} */
        const nodes = [];
        for (let i = 0; i < res.tokens.length; i++) {
          if (
            i === res.tokens.length - 1 &&
            (res.tokens[i].length === 0 || (res.tokens[i].length === 1 && !res.tokens[i][0].content))
          )
            continue;
          nodes.push({
            name: "span",
            attrs: { class: "md_code_line" },
            children: res.tokens[i].map((item) => {
              const style = [];
              if (item.color) style.push(`--shiki-light:${item.color};`);
              if (item.htmlStyle) {
                for (const styleName in item.htmlStyle) {
                  if (styleName === "color") style.push(`--shiki-light:${item.htmlStyle[styleName]};`);
                  else style.push(`${styleName}:${item.htmlStyle[styleName]};`);
                }
              }
              return {
                name: "span",
                attrs: { class: "md_code_token", ...item.htmlAttrs, style: style.join("") },
                children: [{ type: "text", text: item.content }],
              };
            }),
          });
        }
        lastToken.type = "highlight";
        const preStyle = [];
        const colors = [res.bg, res.fg];
        for (let i = 0; i < colors.length; i++) {
          const c = colors[i];
          if (!c) continue;
          const list = c.split(";");
          for (const item of list) {
            const [name, value] = item.split(":");
            if (!value) {
              preStyle.push(`--shiki-light${i === 0 ? "-bg" : ""}:${name};`);
            } else {
              preStyle.push(`${name}:${value};`);
            }
          }
        }
        lastToken.content = JSON.stringify({
          name: "pre",
          attrs: { class: "md_pre", style: preStyle.join("") },
          children: [
            {
              name: "code",
              attrs: { class: "md_code" },
              children: nodes,
            },
          ],
        });
      }
    }

    return result;
  });
}
