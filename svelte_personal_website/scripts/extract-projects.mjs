import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// Transpile TypeScript source to CommonJS JavaScript using the 'typescript' package (sync)
function transpileTsSync(source, fileName) {
  const ts = require('typescript');
  const result = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2019,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      moduleResolution: ts.ModuleResolutionKind.Node10
    },
    fileName
  });
  return result.outputText;
}

// Minimal TS-aware require that transpiles .ts files on the fly (sync)
function requireTsSync(entryPath, contextCache = new Map()) {
  const resolvedPath = entryPath.endsWith('.ts') ? entryPath : `${entryPath}.ts`;
  const absPath = path.resolve(resolvedPath);

  if (contextCache.has(absPath)) return contextCache.get(absPath).exports;

  const src = readFileSync(absPath, 'utf8');
  const js = transpileTsSync(src, absPath);

  const module = { exports: {} };
  const exports = module.exports;

  function localRequire(spec) {
    if (spec.startsWith('./') || spec.startsWith('../')) {
      const candidateTs = path.resolve(path.dirname(absPath), `${spec}.ts`);
      const candidateJs = path.resolve(path.dirname(absPath), `${spec}.js`);
      const candidateJson = path.resolve(path.dirname(absPath), `${spec}.json`);
      return requireDynamicSync(candidateTs, candidateJs, candidateJson);
    }
    throw new Error(`External require not supported in extractor: ${spec}`);
  }

  function requireDynamicSync(tsPath, jsPath, jsonPath) {
    try {
      return requireTsSync(tsPath, contextCache);
    } catch {}
    try {
      const srcJs = readFileSync(jsPath, 'utf8');
      const mod = { exports: {} };
      vm.runInNewContext(srcJs, { module: mod, exports: mod.exports, require: localRequire, __dirname: path.dirname(jsPath), __filename: jsPath });
      return mod.exports;
    } catch {}
    try {
      const json = readFileSync(jsonPath, 'utf8');
      return JSON.parse(json);
    } catch {}
    throw new Error(`Cannot resolve import: ${tsPath}`);
  }

  const sandbox = {
    module,
    exports,
    require: localRequire,
    __dirname: path.dirname(absPath),
    __filename: absPath,
    console
  };

  contextCache.set(absPath, module);
  vm.runInNewContext(js, sandbox, { filename: absPath });
  return module.exports;
}

function main() {
  const root = path.resolve(process.cwd(), 'src', 'lib', 'data');
  const projectsTsPath = path.join(root, 'projects.ts');
  const outputDir = path.join(root, 'projects');

  mkdirSync(outputDir, { recursive: true });

  const exportsObj = requireTsSync(projectsTsPath);
  const projects = exportsObj.projects || [];
  if (!Array.isArray(projects)) {
    throw new Error('Failed to load projects array from projects.ts');
  }

  for (const project of projects) {
    if (!project || typeof project !== 'object') continue;
    const slug = project.slug;
    if (!slug) continue;

    // Create deterministic JSON without functions or undefined
    const replacer = (_key, value) => {
      if (typeof value === 'function' || typeof value === 'undefined') return undefined;
      return value;
    };
    const json = JSON.stringify(project, replacer, 2);

    const outPath = path.join(outputDir, `${slug}.json`);
    writeFileSync(outPath, `${json}\n`, 'utf8');
    console.log(`✓ Wrote ${path.relative(process.cwd(), outPath)}`);
  }

  // Optional: write an index.json with all slugs for quick reference
  const files = readdirSync(outputDir);
  const slugs = files.filter((f) => f.endsWith('.json')).map((f) => path.basename(f, '.json'));
  writeFileSync(path.join(outputDir, 'index.json'), JSON.stringify(slugs, null, 2) + '\n', 'utf8');
  console.log(`✓ Wrote src/lib/data/projects/index.json (${slugs.length} entries)`);
}

try {
  main();
} catch (err) {
  console.error(err);
  process.exit(1);
}


