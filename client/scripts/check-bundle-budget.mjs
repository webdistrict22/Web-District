import { readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";

const assets = resolve(process.cwd(), "dist/assets");
const files = await readdir(assets);
const budgets = { js: 420 * 1024, css: 180 * 1024 };
let failed = false;
for (const file of files) {
  const size = (await stat(resolve(assets, file))).size;
  const type = file.endsWith(".js") ? "js" : file.endsWith(".css") ? "css" : "";
  if (!type) continue;
  console.log(`${file}: ${(size / 1024).toFixed(1)} KiB`);
  if (size > budgets[type]) {
    console.error(`${file} exceeds the ${budgets[type] / 1024} KiB ${type.toUpperCase()} budget.`);
    failed = true;
  }
}
if (failed) process.exitCode = 1;
