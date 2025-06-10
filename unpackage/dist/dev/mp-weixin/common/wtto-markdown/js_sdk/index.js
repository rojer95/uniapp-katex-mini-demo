"use strict";
const common_vendor = require("../../vendor.js");
const MarkdownIt = common_vendor.MarkdownIt;
function getNodeAttr(token) {
  const attrs = {};
  for (const attr of token.attrs || []) {
    const [key, value] = attr;
    attrs[key] = value;
  }
  if (token.type === "softbreak")
    return attrs;
  attrs.class = `md_${token.tag}`;
  if (token.type === "container_warning_open")
    attrs.class += ` md_container_${token.info.trim()}`;
  return attrs;
}
function parseTokens(tokens, options) {
  var _a;
  const res = [];
  let nesting = 0;
  for (const token of tokens) {
    if (token.hidden)
      continue;
    let target = res;
    for (let i = 0; i < nesting; i++) {
      target = ((_a = target[target.length - 1]) == null ? void 0 : _a.children) ?? [];
    }
    nesting += token.nesting;
    if (token.tag) {
      if (token.nesting > 0) {
        target.push({
          name: token.tag,
          attrs: getNodeAttr(token),
          children: []
        });
        continue;
      }
      if (token.nesting === 0) {
        if (token.type === "softbreak" && !(options == null ? void 0 : options.breaks)) {
          target.push({ type: "text", text: " " });
          continue;
        }
        if (token.type === "highlight") {
          try {
            target.push(JSON.parse(token.content));
          } catch (error) {
          }
          continue;
        }
        const node = {
          name: token.tag,
          attrs: getNodeAttr(token),
          children: token.content ? [{ type: "text", text: token.content }] : []
        };
        if (token.tag === "code" && token.block) {
          target.push({
            name: "pre",
            attrs: { ...token.attrs, class: "md_pre" },
            children: [node]
          });
          continue;
        }
        target.push(node);
      }
      continue;
    }
    if (token.type === "inline") {
      if (token.children) {
        target.push(...parseTokens(token.children));
      }
      continue;
    }
    if (token.type === "text" || token.type === "emoji") {
      if (token.content)
        target.push({ type: "text", text: token.content });
      continue;
    }
    if (token.type === "katex") {
      try {
        const nodes = JSON.parse(token.content);
        target.push(...nodes);
      } catch (error) {
      }
    }
    if (token.type === "footnote_ref") {
      const text = `${token.meta.id + 1}${token.meta.subId ? `:${token.meta.subId}` : ""}`;
      target.push({
        name: "sup",
        attrs: { class: "md_sup" },
        children: [
          {
            name: "a",
            attrs: { class: "md_a", href: `#fn${token.meta.id + 1}`, id: `fnref${text}` },
            children: [{ type: "text", text: `[${text}]` }]
          }
        ]
      });
    }
    if (token.type === "footnote_block_open") {
      target.push({ name: "hr", attrs: { class: "md_hr" } });
      target.push({ name: "ol", attrs: { class: "md_ol" }, children: [] });
      continue;
    }
    if (token.type === "footnote_open") {
      target.push({ name: "li", attrs: { class: "md_li", id: `fn${token.meta.id + 1}` }, children: [] });
      continue;
    }
    if (token.type === "footnote_anchor") {
      const text = `${token.meta.id + 1}${token.meta.subId ? `:${token.meta.subId}` : ""}`;
      target.push({
        name: "a",
        attrs: { class: "md_a", href: `#fnref${text}` },
        children: [{ type: "text", text: "↩︎" }]
      });
    }
  }
  return res;
}
exports.MarkdownIt = MarkdownIt;
exports.parseTokens = parseTokens;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/common/wtto-markdown/js_sdk/index.js.map
