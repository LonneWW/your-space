// scripts/gen-env.js
const { writeFileSync, existsSync, mkdirSync } = require("fs");
const { join } = require("path");

// 1) Assicura che src/environments esista
const envDir = join(__dirname, "../src/environments");
if (!existsSync(envDir)) {
  mkdirSync(envDir, { recursive: true });
}

// 2) Prendi API_URL da process.env
const apiUrl = process.env.API_URL || "";
const targetPath = join(envDir, "environment.prod.ts");

// 3) Genera il file environment.prod.ts
const content = `// *** GENERATED FILE. DO NOT COMMIT ***
export const environment = {
  production: true,
  apiUrl: '${apiUrl}'
};
`;

writeFileSync(targetPath, content, "utf8");
console.log(`✔ Wrote ${targetPath} with apiUrl=${apiUrl}`);
