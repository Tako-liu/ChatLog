@echo off
REM ============================================
REM Silent AI Archiver - 打包脚本 (Windows)
REM ============================================
REM 功能:
REM 1. 检查 Python 环境
REM 2. 安装依赖
REM 3. 使用 PyInstaller 打包为无控制台 EXE
REM ============================================

echo [1/4] 检查 Python 环境...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 Python，请先安装 Python 3.10+
    pause
    exit /b 1
)

echo [2/4] 安装依赖...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ 错误: 安装依赖失败
    pause
    exit /b 1
)

echo [3/4] 执行 PyInstaller 打包...
pyinstaller ^
    --onefile ^
    --noconsole ^
    --name="SilentArchiver" ^
    --icon=NONE ^
    --add-data "src/icon_generator.py;." ^
    src/main.py

if %errorlevel% neq 0 (
    echo ❌ 错误: 打包失败
    pause
    exit /b 1
)

echo [4/4] 清理临时文件...
rmdir /s /q build
del /q SilentArchiver.spec

echo.
echo ✅ 打包成功！
echo 📦 输出位置: dist\SilentArchiver.exe
echo.
echo 使用说明:
echo 1. 双击运行 dist\SilentArchiver.exe
echo 2. 检查系统托盘是否出现灰色图标
echo 3. 安装 Tampermonkey 脚本: userscript\silent_archiver.user.js
echo 4. 访问 ChatGPT 或 Gemini，对话将自动保存
echo.
pause
