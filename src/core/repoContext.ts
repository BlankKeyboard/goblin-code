import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

export interface RepoContextFile {
  path: string;
  content: string;
  truncated: boolean;
}

export interface RepoContext {
  root: string;
  files: RepoContextFile[];
  filesSkipped: number;
  chars: number;
}

const ignoredDirectories = new Set([
  ".git",
  ".next",
  "coverage",
  "dist",
  "node_modules"
]);

const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".txt",
  ".yml",
  ".yaml"
]);

const importantFiles = new Set([
  "README.md",
  "package.json",
  "tsconfig.json",
  "LICENSE"
]);

export function collectRepoContext(root: string, maxFiles = 24, maxChars = 36000): RepoContext {
  const files: RepoContextFile[] = [];
  let filesSkipped = 0;
  let chars = 0;

  for (const filePath of listCandidateFiles(root)) {
    if (files.length >= maxFiles || chars >= maxChars) {
      filesSkipped += 1;
      continue;
    }

    const remaining = maxChars - chars;
    const raw = readFileSync(join(root, filePath), "utf8");
    const content = raw.slice(0, remaining);
    files.push({
      path: filePath,
      content,
      truncated: content.length < raw.length
    });
    chars += content.length;
  }

  return {
    root,
    files,
    filesSkipped,
    chars
  };
}

export function formatRepoContext(context: RepoContext): string {
  const parts = [
    `Repo root: ${context.root}`,
    `Files included: ${context.files.length}`,
    `Characters included: ${context.chars}`,
    `Files skipped because of limits: ${context.filesSkipped}`
  ];

  for (const file of context.files) {
    const truncated = file.truncated ? " [truncated]" : "";
    parts.push(`\n--- ${file.path}${truncated} ---\n${file.content}`);
  }

  return parts.join("\n");
}

function listCandidateFiles(root: string): string[] {
  const files: string[] = [];

  walk(root, root, files);

  return files.sort((left, right) => {
    const leftImportant = importantFiles.has(left) ? 0 : 1;
    const rightImportant = importantFiles.has(right) ? 0 : 1;

    if (leftImportant !== rightImportant) {
      return leftImportant - rightImportant;
    }

    return left.localeCompare(right);
  });
}

function walk(root: string, current: string, files: string[]): void {
  for (const dirent of readdirSync(current, { withFileTypes: true })) {
    if (dirent.isDirectory() && ignoredDirectories.has(dirent.name)) {
      continue;
    }

    const fullPath = join(current, dirent.name);

    if (dirent.isDirectory()) {
      walk(root, fullPath, files);
      continue;
    }

    if (!dirent.isFile()) {
      continue;
    }

    const displayPath = relative(root, fullPath);
    const extension = extname(dirent.name);
    const stats = statSync(fullPath);

    if (!importantFiles.has(displayPath) && !textExtensions.has(extension)) {
      continue;
    }

    if (stats.size > 120_000) {
      continue;
    }

    files.push(displayPath);
  }
}
