const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const roots = ["config", "controllers", "middleware", "models", "routes", "scripts", "services", "utils"];
const files = [];
const collect = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) collect(full);
    else if (entry.name.endsWith(".js")) files.push(full);
  }
};
for (const root of roots) collect(path.resolve(__dirname, "..", root));
files.push(path.resolve(__dirname, "../app.js"), path.resolve(__dirname, "../server.js"));
for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log(`Syntax check passed for ${files.length} JavaScript files.`);
