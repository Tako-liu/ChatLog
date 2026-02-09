# Contributing to Silent AI Archiver

First off, thank you for considering contributing to Silent AI Archiver! It's people like you that make this tool better for everyone.

## 🌟 Ways to Contribute

- 🐛 **Report bugs** — Found a bug? Let us know!
- 💡 **Suggest features** — Have an idea? We'd love to hear it
- 📝 **Improve documentation** — Help others understand the project
- 🌐 **Add platform support** — Extend to Claude, Poe, etc.
- 🔧 **Fix issues** — Pick up an open issue and send a PR

---

## 📋 Code of Conduct

This project adheres to a simple principle: **Be respectful and constructive**. We're all here to build something useful together.

---

## 🚀 Getting Started

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/silent-ai-archiver.git
   cd silent-ai-archiver
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run in development mode**
   ```bash
   cd src
   python main.py
   ```

4. **Test your changes**
   ```bash
   python test_api.py
   ```

---

## 🛠️ Development Guidelines

### Project Structure

```
AI_Saver/
├── src/                    # Backend source code
│   ├── main.py            # FastAPI server + system tray
│   └── icon_generator.py  # Tray icon utility
├── userscript/            # Frontend browser scripts
│   └── silent_archiver.user.js
├── test_api.py            # API integration tests
├── requirements.txt       # Python dependencies
└── build.bat             # Windows build script
```

### Code Style

#### Python (Backend)
- **PEP 8** compliance
- **Type hints** for function signatures
- **Docstrings** for all public functions
- **F-strings** for string formatting

**Example**:
```python
def save_conversation(req: SaveRequest) -> dict:
    """
    Save conversation to local Markdown file.
    
    Args:
        req: SaveRequest containing platform, title, content
        
    Returns:
        dict with status, filepath, timestamp
    """
    # Implementation here
```

#### JavaScript (Frontend)
- **ES6+** syntax
- **Descriptive variable names**
- **JSDoc comments** for complex functions
- **Consistent indentation** (4 spaces)

**Example**:
```javascript
/**
 * Extract ChatGPT conversation content from DOM
 * @returns {Object} Object with title and content properties
 */
function extractChatGPTContent() {
    // Implementation here
}
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Add support for Claude.ai platform
fix: Resolve debounce timer memory leak
docs: Update installation instructions
refactor: Simplify content extraction logic
test: Add unit tests for file saving
```

---

## 🌐 Adding New Platforms

Want to add support for a new AI platform? Here's how:

### 1. Update Userscript Metadata

Edit `userscript/silent_archiver.user.js`:

```javascript
// @match        https://chatgpt.com/*
// @match        https://gemini.google.com/*
// @match        https://claude.ai/*  // ADD THIS
```

### 2. Create Content Extractor

Add a new extraction function:

```javascript
/**
 * Extract Claude conversation content
 */
function extractClaudeContent() {
    const title = document.querySelector('title')?.textContent || 'Untitled Chat';
    const messages = [];
    
    // Find Claude-specific message containers
    const messageElements = document.querySelectorAll('.claude-message-selector');
    
    messageElements.forEach(el => {
        const role = el.getAttribute('data-role');
        const textContent = el.innerText.trim();
        const prefix = role === 'user' ? '**User:**' : '**Claude:**';
        messages.push(`${prefix}\n${textContent}\n`);
    });
    
    return {
        title: title.replace(' - Claude', '').trim(),
        content: messages.join('\n---\n\n')
    };
}
```

### 3. Update Platform Detection

Modify the `extractContent()` function:

```javascript
function extractContent() {
    if (window.location.hostname.includes('chatgpt')) {
        return extractChatGPTContent();
    } else if (window.location.hostname.includes('gemini')) {
        return extractGeminiContent();
    } else if (window.location.hostname.includes('claude')) {
        return extractClaudeContent();  // ADD THIS
    }
}
```

### 4. Update DOM Observer

Ensure the observer detects new messages:

```javascript
const observer = new MutationObserver((mutations) => {
    const isRelevant = mutations.some(mutation => {
        return Array.from(mutation.addedNodes).some(node =>
            node.nodeType === 1 && (
                node.querySelector('[data-message-author-role]') || // ChatGPT
                node.querySelector('message-content') || // Gemini
                node.querySelector('.claude-message-selector') // ADD THIS
            )
        );
    });
    // ...
});
```

### 5. Testing Checklist

Before submitting your PR:

- [ ] Conversations save correctly
- [ ] File naming follows `{Platform}_{Title}.md` format
- [ ] Status indicator updates properly
- [ ] Debounce works (waits 5s after typing stops)
- [ ] Page close saves conversation
- [ ] URL change (conversation switch) saves conversation
- [ ] YAML frontmatter includes correct platform name

---

## 🐛 Reporting Bugs

### Before Submitting

1. **Search existing issues** — Your bug might already be reported
2. **Test with latest version** — Update and see if bug persists
3. **Check browser console** — Look for JavaScript errors (F12)

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Python Version: [e.g. 3.11]
- Backend Running: [Yes/No]

**Console Logs**
Paste any relevant browser console errors.
```

---

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Any other context or screenshots.
```

---

## 🔄 Pull Request Process

### Before Submitting

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Follow code style guidelines
   - Add/update tests as needed
   - Update documentation

3. **Test thoroughly**
   ```bash
   python test_api.py
   ```

4. **Commit with meaningful messages**
   ```bash
   git commit -m "feat: Add Claude.ai support"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

### PR Template

When opening a PR, please include:

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tested locally
- [ ] Tests pass (`python test_api.py`)
- [ ] Tested in browser (ChatGPT/Gemini)

## Screenshots
If applicable, add screenshots.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed my code
- [ ] Commented complex logic
- [ ] Updated documentation
- [ ] No new warnings/errors
```

### Review Process

1. Maintainer will review within 48 hours
2. Address any feedback
3. Once approved, PR will be merged
4. Your contribution will be acknowledged in release notes!

---

## 🧪 Testing Guidelines

### Manual Testing Checklist

- [ ] Backend starts without errors
- [ ] System tray icon appears
- [ ] Status dot appears in browser
- [ ] Status dot turns green when backend connected
- [ ] Conversation saves after 5s idle
- [ ] Conversation saves on tab close
- [ ] Conversation saves on URL change
- [ ] File has correct format with YAML frontmatter
- [ ] Same conversation overwrites previous file
- [ ] Tray menu "Open Folder" works
- [ ] Tray menu "Exit" closes application

### Automated Testing

Currently, `test_api.py` covers:
- Health check endpoint
- Save endpoint
- File creation

**We need help adding**:
- Unit tests for content extraction
- Integration tests for debounce logic
- E2E tests with Selenium

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Tampermonkey API](https://www.tampermonkey.net/documentation.php)
- [MutationObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
- [PyInstaller Manual](https://pyinstaller.org/en/stable/)

---

## 🎉 Recognition

All contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

---

## 📧 Questions?

If you have questions not covered here:
- Open a [Discussion](https://github.com/yourusername/silent-ai-archiver/discussions)
- Comment on relevant issues

---

**Thank you for contributing to Silent AI Archiver!** 🙏
