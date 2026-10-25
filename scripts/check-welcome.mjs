import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// Run after npm run build. Guard the exported page, not component internals.
const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");

test("the accessible welcome content stays outside decorative canvases", () => {
  const canvases = [...html.matchAll(/<canvas\b[^>]*>([\s\S]*?)<\/canvas>/g)];
  for (const [, content] of canvases) {
    assert.doesNotMatch(content, /<(?:main|nav|a|button|summary)\b/);
  }
  assert.equal([...html.matchAll(/<main\b/g)].length, 1);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
});

test("every internal welcome link points to an existing section", () => {
  const targets = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  const links = [...html.matchAll(/<a\b[^>]*href="([^"]*)"/g)].map((match) => match[1]);
  assert.ok(links.length > 0);
  for (const href of links) {
    assert.ok(href && href !== "#", "No empty or placeholder links");
    if (href.startsWith("#")) assert.ok(targets.has(href.slice(1)), `Missing target: ${href}`);
    else assert.ok(["https://freeautoparty.vercel.app/", "https://ezestom.is-a.dev/"].includes(href), `Unexpected external destination: ${href}`);
  }
});

test("FAQ remains operable without a JavaScript accordion", () => {
  const details = [...html.matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/g)];
  assert.ok(details.length > 0);
  for (const [, content] of details) {
    assert.match(content, /<summary\b/);
    assert.match(content, /<p\b/);
  }
});
