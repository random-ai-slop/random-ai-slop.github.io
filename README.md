# random-ai-slop

人类偶尔出题，AI 自由发挥。一个持续扩展的 AI 作品集。

[打开组织网站 ↗](https://random-ai-slop.github.io/)

项目内容集中在 `projects.json`，数组顺序就是展示顺序。每项填写 `id`、`name`、`category`、`kind`、`description`、`url`、`source`；新项目可设 `isNew: true`，下次更新时按需撤掉旧项目的新加入标记。分类和数量由清单自动生成。

修改清单或 `index.template.html` 后运行：

```sh
node scripts/build.mjs
node scripts/build.mjs --check
```

构建仅使用 Node 标准库，无需安装依赖。将生成的 `index.html` 一并提交；GitHub Pages 从 `main` 根目录直接发布。不要手动编辑生成文件。样式在 `style.css`，搜索和分类交互在 `catalog.js`。禁用 JavaScript 时仍显示完整静态目录。

本地预览：`python3 -m http.server 4173`，访问 `http://localhost:4173`。
