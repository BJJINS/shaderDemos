import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import wasm from "vite-plugin-wasm";
import glsl from 'vite-plugin-glsl';
import fs from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 自动扫描 pages 目录下的所有 index.html 文件
function scanPages() {
    const pagesDir = resolve(__dirname, 'pages');
    const input = {};

    // 读取 pages 目录下的所有子目录
    fs.readdirSync(pagesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .forEach(dirent => {
            const pageName = dirent.name;
            const indexPath = resolve(pagesDir, pageName, 'index.html');

            // 检查 index.html 文件是否存在
            if (fs.existsSync(indexPath)) {
                input[pageName] = indexPath;
            }
        });

    return input;
}


export default defineConfig({
    plugins: [glsl(), wasm(),],
    build: {
        rollupOptions: {
            input: scanPages()
        },
    },
});