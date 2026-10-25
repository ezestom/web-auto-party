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

test("the hero launch action replaces the navbar CTA and keeps a no-script destination", () => {
  const header = html.match(/<header\b[^>]*>([\s\S]*?)<\/header>/)?.[1];
  assert.ok(header);
  assert.doesNotMatch(header, /Open AutoParty/);
  const hero = html.match(/<section\b[^>]*aria-labelledby="hero-title"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(hero);
  assert.match(hero, /<button\b[^>]*class="flying-button__craft"/);
  assert.match(hero, /<noscript><a href="https:\/\/freeautoparty\.vercel\.app\/"/);
});

test("English is the default and both app actions use Flying Button", () => {
  assert.match(html, /<html[^>]*lang="en"/);
  assert.equal([...html.matchAll(/class="flying-button__craft"/g)].length, 2);
  assert.match(html, /<button[^>]*role="combobox"[^>]*aria-haspopup="listbox"[^>]*aria-label="Language"/);
  const footer = html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/)?.[1];
  assert.ok(footer);
  assert.doesNotMatch(footer, /autoparty-logo\.png/);
  assert.match(footer, /e-developer-logo\.webp/);
});

test("the first console keeps its screenshot outside the decorative Hyperspeed layer", () => {
  const section = html.match(/<section\b[^>]*aria-labelledby="hero-title"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(section);
  assert.match(section, /class="ap-hero-hyperspeed" aria-hidden="true"/);
  assert.ok(section.indexOf('class="ap-hero-hyperspeed"') < section.indexOf('<h1'));
  const hero = html.match(/<figure class="ap-hero-console">([\s\S]*?)<\/figure>/)?.[1];
  assert.ok(hero);
  assert.doesNotMatch(hero, /ap-hero-hyperspeed/);
  assert.doesNotMatch(hero, /ap-console-hex/);
  assert.match(hero, /src="\/autoparty-console.jpg"/);
  assert.doesNotMatch(html, /class="ap-fire-border/);
});
