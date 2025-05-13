# 每天一个组件小技巧 🧩

这是一个练习型项目，每天实现一个小型前端组件，涵盖 HTML、CSS、TypeScript 的组合应用，旨在提升 Web 开发的基础能力与组件拆解能力。

每个组件都是一个独立的子文件夹，包含：

- `index.html`：组件展示页面
- `style.css`：基础样式文件
- `script.ts`：使用 TypeScript 编写的逻辑代码
- `dist/script.js`：TypeScript 编译生成的 JavaScript 文件
- `README.md`：当日组件说明文档

---

## 📦 使用方式

### 1. 安装 Node.js 与 TypeScript（只需一次）
确保你已安装 [Node.js](https://nodejs.org/)

并且确认安装了 TypeScript 全局编译器：

```bash
npm install -g typescript 
```

### 2. TypeScript || JavaScript
进入项目根目录，执行：

```bash
tsc -w
```

即可通过ts代码自动更新dist文件夹中的js文件

记得更新tsconfig.json文件中include指向位置更新正确js代码

代码中直接调用了dist中的js文件进行渲染

如果对ts不了解可以直接删除，使用dist文件夹中js文件进行编辑

---

## 🗂️ 组件目录索引（持续更新）

| 日期       | 名称                     | 简介                               |
|------------|--------------------------|------------------------------------|
| Day 01     | [双滑块范围选择器](https://github.com/JasonZhang2k/daily-ui-components/tree/main/day01-range-slider) | 实现双滑块选择范围并实时显示范围 |
| Day 02     | 🔜 Coming Soon           | 即将发布...                        |
