<div align="center">

# 🧠 ChatLog

### ✨ _Markdown Is All You Need_ ✨

**Zero-Interaction AI Conversation Archiver**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)](https://github.com/yourusername/chatlog)
[![Status](https://img.shields.io/badge/status-stable-green.svg)]()

*Automatically archive your ChatGPT and Gemini conversations to local Markdown files — completely hands-free.*

[Features](#-features) • [Installation](#-installation) • [Usage Guide](#-usage-guide) • [How It Works](#-how-it-works) • [Contributing](#-contributing)

</div>

---

## 🎯 The Problem

You have brilliant brainstorming sessions with AI, but:
- ❌ **Manual Copying** breaks your flow.
- ❌ **Cloud History** is hard to search and manage.
- ❌ **Privacy Risk**: You don't truly own your data if it's only on their servers.

## 💡 The Solution: ChatLog

**ChatLog** runs invisibly in the background. It automatically syncs your conversations to your local hard drive as **Markdown** files.

> **"Set it and forget it."** Your second brain, safely archived locally.

---

## ✨ Features

### 🔇 Zero-Interaction Design
- **Fully Automated** — Conversations are captured as you type.
- **Smart Debouncing** — Waits 3-5 seconds after typing stops to ensure completeness.
- **Lifecycle Hooks** — Triggers save on tab close or conversation switch.
- **Invisible Operation** — No annoying popups, just a tiny status indicator.

### 🚀 Technical Highlights
- **📝 Markdown Export** — Clean, formatted files with YAML frontmatter (perfect for Obsidian/Notion).
- **🛡️ Smart Deduplication** — Uses **Y-axis coordinate sorting** to perfectly reconstruct dialogue order, even when DOM is obfuscated.
- **⚡ Native Performance** — Lightweight Chrome Extension + Python FastAPI backend.
- **🔒 Privacy First** — All data stays on your machine. 0% data sent to the cloud.

### 🌐 Platform Support
- ✅ **ChatGPT** (chatgpt.com)
- ✅ **Gemini** (gemini.google.com)
- 🔜 **Claude** (Coming soon)

---


## 📦 Installation

### Prerequisites
- Windows OS (macOS/Linux support planned)
- Chrome, Edge, or Brave Browser

---

### Step 1: Install the Backend (The Brain)

**Option A: For Users (Recommended)**
1. Go to the [Releases](https://github.com/yourusername/chatlog/releases) page.
2. Download **`ChatLog_v1.0.exe`**.
3. Run it. You will see a small icon in your system tray.
   *(Note: Windows might show a "PC protected" warning because this is a new open-source app. Click "More info" -> "Run anyway".)*

**Option B: For Developers (Source Code)**
```bash
git clone [https://github.com/yourusername/chatlog.git](https://github.com/yourusername/chatlog.git)
cd chatlog/backend
pip install -r requirements.txt
python main.py

```

---

### Step 2: Install the Extension (The Eyes)

**Option A: For Users (Recommended)**

1. Go to the [Releases](https://www.google.com/url?sa=E&source=gmail&q=https://github.com/yourusername/chatlog/releases) page.
2. Download **`ChatLog_v1.0.zip`** and **unzip** it.
3. Open your browser and go to `chrome://extensions` (or `edge://extensions`).
4. Toggle on **Developer mode** (top right).
5. Click **Load unpacked**.
6. Select the unzipped folder.

**Option B: For Developers**

1. Follow the steps above, but select the `extension/` folder from the cloned repository.

---
