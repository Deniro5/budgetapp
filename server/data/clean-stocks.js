const fs = require("fs");
const babelParser = require("@babel/parser");

const inputPath = "sample-stocks.ts";
const outputPath = "sample-stocks.cleaned.ts";

const content = fs.readFileSync(inputPath, "utf-8");

const ast = babelParser.parse(content, {
  sourceType: "module",
  plugins: ["typescript"],
});

let stockArray = [];

for (const node of ast.program.body) {
  if (
    node.type === "ExportNamedDeclaration" &&
    node.declaration?.type === "VariableDeclaration"
  ) {
    const declaration = node.declaration.declarations[0];
    if (
      declaration.id.name === "SampleStocks" &&
      declaration.init?.type === "ArrayExpression"
    ) {
      for (const element of declaration.init.elements) {
        if (element?.type !== "ObjectExpression") continue;

        const stock = {};
        for (const prop of element.properties) {
          if (prop.type === "ObjectProperty") {
            const key = prop.key.name;
            const value = prop.value.value;
            stock[key] = value;
          }
        }
        stockArray.push(stock);
      }
    }
  }
}

// Deduplicate & strip trailing numbers
const seen = new Set();
const cleaned = [];

for (const { symbol, name, exchange } of stockArray) {
  const cleanSymbol = symbol.replace(/\d+$/, "");
  const cleanName = name.replace(/\s\d+$/, "");
  const key = `${cleanSymbol}|${cleanName}|${exchange}`;
  if (!seen.has(key)) {
    seen.add(key);
    cleaned.push({ symbol: cleanSymbol, name: cleanName, exchange });
  }
}

// Write output
const output = `export const SampleStocks = ${JSON.stringify(
  cleaned,
  null,
  2
)};\n`;
fs.writeFileSync(outputPath, output, "utf-8");

console.log(
  `✅ Done. Cleaned ${cleaned.length} unique stocks into ${outputPath}`
);
