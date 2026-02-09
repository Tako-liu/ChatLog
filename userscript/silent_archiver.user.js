// ==UserScript==
// @name         Silent AI Archiver
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  零交互 AI 对话自动存档工具 - 支持 ChatGPT 和 Gemini
// @author       You
// @match        https://chatgpt.com/*
// @match        https://chatgpt.com/*
// @match        https://gemini.google.com/*
// @match        https://claude.ai/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    // ========== 配置 ==========
    const API_URL = 'http://localhost:4321/save';
    const DEBOUNCE_DELAY = 5000; // 5秒防抖延迟
    const STATUS_INDICATOR_SIZE = 3; // 状态点大小（像素）

    // ========== 状态管理 ==========
    let debounceTimer = null;
    let lastSavedContent = '';
    let statusIndicator = null;
    let currentPlatform = '';
    if (window.location.hostname.includes('chatgpt')) currentPlatform = 'ChatGPT';
    else if (window.location.hostname.includes('gemini')) currentPlatform = 'Gemini';
    else if (window.location.hostname.includes('claude')) currentPlatform = 'Claude';

    // ========== 状态指示器 UI ==========
    /**
     * 创建微型状态点（固定在右上角）
     * 颜色含义：
     * - 绿色: 保存成功
     * - 黄色: 等待中/正在发送
     * - 红色: 后端未启动
     */
    function createStatusIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'silent-archiver-status';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: ${STATUS_INDICATOR_SIZE}px;
            height: ${STATUS_INDICATOR_SIZE}px;
            border-radius: 50%;
            background-color: #fbbf24; /* 黄色 (初始状态) */
            z-index: 999999;
            transition: background-color 0.3s ease;
        `;
        document.body.appendChild(indicator);
        return indicator;
    }

    /**
     * 更新状态点颜色
     */
    function setStatus(status) {
        if (!statusIndicator) {
            statusIndicator = createStatusIndicator();
        }
        const colors = {
            'waiting': '#fbbf24',  // 🟡 黄色
            'success': '#10b981',  // 🟢 绿色
            'error': '#ef4444'     // 🔴 红色
        };
        statusIndicator.style.backgroundColor = colors[status] || colors.waiting;
    }

    // ========== 内容提取 ==========
    /**
     * 提取 ChatGPT 对话内容
     */
    function extractChatGPTContent() {
        const title = document.querySelector('title')?.textContent || 'Untitled Chat';
        const messages = [];

        // ChatGPT 的消息容器选择器（可能需要根据实际页面调整）
        const messageElements = document.querySelectorAll('[data-message-author-role]');

        messageElements.forEach(el => {
            const role = el.getAttribute('data-message-author-role');
            const textContent = el.querySelector('.markdown')?.innerText || el.innerText;
            const prefix = role === 'user' ? '**User:**' : '**Assistant:**';
            messages.push(`${prefix}\n${textContent.trim()}\n`);
        });

        return {
            title: title.replace(' - ChatGPT', '').trim(),
            content: messages.join('\n---\n\n')
        };
    }

    /**
     * 提取 Gemini 对话内容
     */
    function extractGeminiContent() {
        const title = document.querySelector('title')?.textContent || 'Untitled Chat';
        const messages = [];

        // Gemini 的消息容器选择器（可能需要根据实际页面调整）
        const messageElements = document.querySelectorAll('.conversation-container message-content, .model-response-text, .user-input-text');

        messageElements.forEach(el => {
            const isUser = el.closest('[data-test-id*="user"]') !== null;
            const textContent = el.innerText.trim();
            const prefix = isUser ? '**User:**' : '**Gemini:**';
            if (textContent) {
                messages.push(`${prefix}\n${textContent}\n`);
            }
        });

        return {
            title: title.replace(' - Gemini', '').trim(),
            content: messages.join('\n---\n\n')
        };
    }

    /**
     * 提取 Claude 对话内容
     */
    function extractClaudeContent() {
        const title = document.querySelector('title')?.textContent || 'Untitled Chat';
        const messages = [];

        // Claude 消息选择器 (基于常见类名)
        const messageElements = document.querySelectorAll('.font-user-message, .font-claude-message');

        messageElements.forEach(el => {
            const isUser = el.classList.contains('font-user-message');
            const textContent = el.innerText.trim();
            const prefix = isUser ? '**User:**' : '**Claude:**';
            if (textContent) {
                messages.push(`${prefix}\n${textContent}\n`);
            }
        });

        return {
            title: title.replace(' - Claude', '').trim(),
            content: messages.join('\n---\n\n')
        };
    }

    /**
     * 根据当前平台提取内容
     */
    function extractContent() {
        if (currentPlatform === 'ChatGPT') return extractChatGPTContent();
        if (currentPlatform === 'Gemini') return extractGeminiContent();
        if (currentPlatform === 'Claude') return extractClaudeContent();
        return { title: 'Unknown', content: '' };
    }

    // ========== 防抖保存逻辑 ==========
    /**
     * 发送数据到后端
     */
    async function saveToBackend(title, content) {
        if (content === lastSavedContent) {
            console.log('[Silent Archiver] 内容未变化，跳过保存');
            return;
        }

        try {
            setStatus('waiting');

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    platform: currentPlatform,
                    title: title,
                    content: content
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            console.log('[Silent Archiver] 保存成功:', result.filepath);
            lastSavedContent = content;
            setStatus('success');

        } catch (error) {
            console.error('[Silent Archiver] 保存失败:', error);
            setStatus('error');
        }
    }

    /**
     * 防抖保存（5秒内无变化才触发）
     */
    function debouncedSave() {
        clearTimeout(debounceTimer);
        setStatus('waiting');

        debounceTimer = setTimeout(() => {
            const { title, content } = extractContent();
            if (content.trim()) {
                saveToBackend(title, content);
            }
        }, DEBOUNCE_DELAY);
    }

    /**
     * 立即保存（不等待防抖）
     */
    function immediateSave() {
        clearTimeout(debounceTimer);
        const { title, content } = extractContent();
        if (content.trim()) {
            saveToBackend(title, content);
        }
    }

    // ========== DOM 监听 (MutationObserver) ==========
    /**
     * 监听页面 DOM 变化
     * 当检测到对话流更新时触发防抖保存
     */
    function startObserver() {
        const targetNode = document.body;
        const config = {
            childList: true,
            subtree: true,
            characterData: true
        };

        const observer = new MutationObserver((mutations) => {
            // 检查是否为对话区域的变化
            const isRelevant = mutations.some(mutation => {
                if (mutation.type === 'childList') {
                    // 检查是否添加了新消息节点
                    return Array.from(mutation.addedNodes).some(node =>
                        node.nodeType === 1 && (
                            node.querySelector('[data-message-author-role]') || // ChatGPT
                            node.querySelector('[data-message-author-role]') || // ChatGPT
                            node.querySelector('message-content') || // Gemini
                            node.querySelector('.font-claude-message') // Claude
                        )
                    );
                }
                return false;
            });

            if (isRelevant) {
                console.log('[Silent Archiver] 检测到对话更新，启动防抖');
                debouncedSave();
            }
        });

        observer.observe(targetNode, config);
        console.log('[Silent Archiver] DOM 监听已启动');
    }

    // ========== 页面生命周期钩子 ==========
    /**
     * 页面关闭前强制保存
     */
    window.addEventListener('beforeunload', (event) => {
        console.log('[Silent Archiver] 页面关闭，触发最终保存');
        immediateSave();
    });

    /**
     * URL 变化（切换对话）时强制保存
     */
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            console.log('[Silent Archiver] URL 变化，保存当前对话');
            immediateSave();
            lastUrl = currentUrl;
        }
    }).observe(document, { subtree: true, childList: true });

    // ========== 初始化 ==========
    function init() {
        console.log(`[Silent Archiver] 已加载 (平台: ${currentPlatform})`);

        // 创建状态指示器
        createStatusIndicator();

        // 启动 DOM 监听
        startObserver();

        // 检查后端连接
        fetch('http://localhost:4321/health')
            .then(res => res.json())
            .then(() => {
                console.log('[Silent Archiver] 后端连接正常');
                setStatus('success');
            })
            .catch(() => {
                console.warn('[Silent Archiver] 后端未启动，请运行 EXE 文件');
                setStatus('error');
            });
    }

    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
