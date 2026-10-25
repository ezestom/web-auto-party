import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { spanish } from '../src/components/autoparty/spanish.ts';
import { navigation, steps, questions } from '../src/components/autoparty/content.ts';

test('Spanish covers the landing, navigation, guide and all FAQ answers', async () => {
  const required = new Set();
  for (const row of [...navigation, ...steps, ...questions]) {
    for (const [key, value] of Object.entries(row)) if (key !== 'href') required.add(value);
  }
  for (const file of ['welcome.tsx', 'navigation.tsx', 'getting-started.tsx', 'launch-app.tsx']) {
    const source = await readFile(new URL('../src/components/autoparty/' + file, import.meta.url), 'utf8');
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node) {
      if (ts.isCallExpression(node) && node.expression.getText(ast) === 't' && ts.isStringLiteral(node.arguments[0])) required.add(node.arguments[0].text);
      if (ts.isPropertyAssignment(node) && ['label', 'title'].includes(node.name.getText(ast)) && ts.isStringLiteral(node.initializer)) required.add(node.initializer.text);
      if (ts.isPropertyAssignment(node) && node.name.getText(ast) === 'items' && ts.isArrayLiteralExpression(node.initializer)) {
        for (const item of node.initializer.elements) if (ts.isStringLiteral(item)) required.add(item.text);
      }
      ts.forEachChild(node, visit);
    }
    visit(ast);
  }
  for (const text of required) assert.ok(spanish[text]?.trim(), 'Missing Spanish translation: ' + text);
});
