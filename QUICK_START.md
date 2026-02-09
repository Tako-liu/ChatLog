# Silent AI Archiver - 使用指南

## 快速开始（三步启动）

### 步骤 1：启动后端程序

**方式 A：直接运行 EXE（推荐）**
```
双击运行：dist\SilentArchiver.exe
```
- 程序会在后台运行，系统托盘会出现灰色圆点图标
- 不会弹出控制台窗口

**方式 B：从源码运行（开发模式）**
```bash
cd src
pythonw main.py
```

### 步骤 2：安装 Tampermonkey 脚本

1. **安装 Tampermonkey 扩展**
   - Chrome: https://chrome.google.com/webstore/detail/tampermonkey/
   - Edge: https://microsoftedge.microsoft.com/addons/detail/tampermonkey/

2. **导入用户脚本**
   - 打开 Tampermonkey 管理面板
   - 点击 "创建新脚本"
   - 复制 `userscript\silent_archiver.user.js` 的全部内容并粘贴
   - 保存（Ctrl+S）

3. **启用脚本**
   - 确保脚本已启用（开关为绿色）

### 步骤 3：开始使用

1. 访问 ChatGPT (chatgpt.com) 或 Gemini (gemini.google.com)
2. 正常与 AI 对话
3. **无需任何操作**，对话会在以下时机自动保存：
   - 停止输入 5 秒后
   - 关闭浏览器标签页时
   - 切换到其他对话时

---

## 状态指示器

右上角的 **3px 小圆点**颜色含义：

- 🟢 **绿色**：上次保存成功
- 🟡 **黄色**：等待中/正在发送
- 🔴 **红色**：后端未启动（请检查 EXE 是否运行）

---

## 文件位置

所有对话保存在：
```
C:\Users\<你的用户名>\Documents\AI_Memory_Archive\
├── 2026-02-06\
│   ├── ChatGPT_如何学习 Python.md
│   └── Gemini_数据分析技巧.md
└── 2026-02-07\
    └── ...
```

**文件格式示例**：
```markdown
---
platform: ChatGPT
title: 如何学习 Python
last_updated: 2026-02-06 20:00:48
---

**User:**
如何快速学习 Python?

---

**Assistant:**
学习 Python 的建议...
```

---

## 系统托盘功能

右键点击托盘图标：
- **打开存放目录** → 快速访问存档文件夹
- **退出** → 关闭程序

---

## 常见问题

**Q: 状态点一直是红色？**
A: 确保 `SilentArchiver.exe` 正在运行，检查系统托盘图标

**Q: 文件没有保存？**
A: 
1. 打开浏览器控制台 (F12) 查看是否有错误
2. 确认 Tampermonkey 脚本已启用
3. 检查后端是否运行（访问 http://localhost:4321/health）

**Q: 能支持其他 AI 网站吗？**
A: 可以修改 `silent_archiver.user.js` 中的：
- `@match` 规则（添加新网站）
- 内容提取逻辑（根据新网站的 DOM 结构调整）

**Q: 如何修改保存路径？**
A: 编辑 `src/main.py` 中的 `ARCHIVE_ROOT` 变量

**Q: 如何调整防抖时间？**
A: 编辑 `silent_archiver.user.js` 中的 `DEBOUNCE_DELAY` 常量（单位：毫秒）

---

## 测试验证

使用提供的测试脚本验证 API：
```bash
python test_api.py
```

应该看到：
```
[测试] /health 端点...
[成功] 后端服务运行正常
   响应: {'status': 'running'}

[测试] /save 端点...
[成功] 保存成功
   文件路径: C:\Users\11\Documents\AI_Memory_Archive\...
```

---

## 技术支持

- 项目地址：`d:\work\2026年_2月\2_6\AI_Saver`
- 文档：`README.md`
- 完整演练：`C:\Users\11\.gemini\antigravity\brain\...\walkthrough.md`

**享受零交互的自动存档体验！** 🎉
