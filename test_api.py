"""
Silent AI Archiver - API 测试脚本
测试 /save 和 /health 端点
"""
import requests
import json
from datetime import datetime

API_URL = "http://localhost:4321"

def test_health():
    """测试健康检查端点"""
    print("[测试] /health 端点...")
    try:
        response = requests.get(f"{API_URL}/health", timeout=5)
        if response.status_code == 200:
            print("[成功] 后端服务运行正常")
            print(f"   响应: {response.json()}")
            return True
        else:
            print(f"[失败] 健康检查失败: HTTP {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"[错误] 无法连接到后端: {e}")
        print("   请确保 SilentArchiver.exe 正在运行！")
        return False

def test_save():
    """测试保存对话端点"""
    print("\n[测试] /save 端点...")
    
    # 准备测试数据
    test_data = {
        "platform": "ChatGPT",
        "title": "API Test Conversation",
        "content": """**User:**
这是一个测试对话，用于验证 API 功能。

---

**Assistant:**
收到！这个测试对话将被保存到本地文件。

---

**User:**
太好了，防抖机制正常工作吗？

---

**Assistant:**
是的！当对话停止变化 5 秒后，内容会自动保存。
"""
    }
    
    try:
        response = requests.post(
            f"{API_URL}/save",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=5
        )
        
        if response.status_code == 200:
            result = response.json()
            print("[成功] 保存成功")
            print(f"   文件路径: {result.get('filepath')}")
            print(f"   更新时间: {result.get('timestamp')}")
            return True
        else:
            print(f"[失败] 保存失败: HTTP {response.status_code}")
            print(f"   错误: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"[错误] 请求失败: {e}")
        return False

def main():
    print("=" * 60)
    print("Silent AI Archiver - API 测试")
    print("=" * 60)
    print()
    
    # 测试健康检查
    if not test_health():
        print("\n[警告] 请先启动 SilentArchiver.exe，然后重新运行此测试脚本")
        return
    
    # 测试保存功能
    test_save()
    
    print("\n" + "=" * 60)
    print("测试完成！请检查:")
    print("  C:\\Users\\<用户名>\\Documents\\AI_Memory_Archive\\")
    print("  查看是否生成了测试文件")
    print("=" * 60)

if __name__ == "__main__":
    main()
