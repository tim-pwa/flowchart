// Service Worker 注册
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/flowchart/service-worker.js')
            .then(registration => {
                console.log('Service Worker 注册成功:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker 注册失败:', error);
            });
    });
}

// DOM 元素
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');
const overlay = document.createElement('div');
overlay.className = 'overlay';
document.body.appendChild(overlay);

const navItems = document.querySelectorAll('.nav-item');
const welcomeScreen = document.getElementById('welcomeScreen');
const formBuilder = document.getElementById('formBuilder');
const createFormBtn = document.getElementById('createFormBtn');
const syncBtn = document.getElementById('syncBtn');

// 侧边栏切换
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
});

overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
});

// 导航切换
navItems.forEach(item => {
    item.addEventListener('click', () => {
        // 移除所有活动状态
        navItems.forEach(nav => nav.classList.remove('active'));
        // 添加当前活动状态
        item.classList.add('active');
        
        // 关闭侧边栏（移动端）
        if (window.innerWidth < 768) {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        }
        
        // 根据页面切换内容
        const page = item.dataset.page;
        switchPage(page);
    });
});

// 页面切换函数
function switchPage(page) {
    console.log('切换到页面:', page);
    // 这里可以添加页面切换逻辑
}

// 创建表单
createFormBtn.addEventListener('click', () => {
    welcomeScreen.style.display = 'none';
    formBuilder.style.display = 'block';
});

// 同步按钮
syncBtn.addEventListener('click', async () => {
    syncBtn.disabled = true;
    syncBtn.innerHTML = '<span class="loading"></span>';
    
    try {
        // 模拟同步操作
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('同步完成');
        alert('同步成功！');
    } catch (error) {
        console.error('同步失败:', error);
        alert('同步失败，请稍后重试');
    } finally {
        syncBtn.disabled = false;
        syncBtn.innerHTML = '<span>🔄</span>';
    }
});

// PWA 安装提示
let deferredPrompt;
const installPrompt = document.createElement('div');
installPrompt.className = 'install-prompt';
installPrompt.innerHTML = `
    <span>安装应用以获得更好的体验</span>
    <button id="installBtn">安装</button>
    <button id="dismissBtn" style="background: transparent; color: var(--text-secondary);">稍后</button>
`;
document.body.appendChild(installPrompt);

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installPrompt.classList.add('show');
});

document.getElementById('installBtn').addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('安装结果:', outcome);
        deferredPrompt = null;
        installPrompt.classList.remove('show');
    }
});

document.getElementById('dismissBtn').addEventListener('click', () => {
    installPrompt.classList.remove('show');
});

// 处理在线/离线状态
window.addEventListener('online', () => {
    console.log('网络已连接');
    // 可以显示通知
});

window.addEventListener('offline', () => {
    console.log('网络已断开');
    // 可以显示离线提示
});

// 阻止默认的上下文菜单（移动端长按）
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// 触摸事件优化
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    // 从左侧边缘向右滑动打开侧边栏
    if (touchStartY < 100 && diff < -swipeThreshold) {
        sidebar.classList.add('open');
        overlay.classList.add('show');
    }
    
    // 向左滑动关闭侧边栏
    if (diff > swipeThreshold && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('应用已加载');
    
    // 检查是否已安装
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('应用以独立模式运行');
    }
});
