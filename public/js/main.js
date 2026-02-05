// 主题切换功能
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // 从localStorage加载主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// 模态框功能
function initModals() {
    const addContentBtn = document.getElementById('add-content');
    const addContentModal = document.getElementById('add-content-modal');
    const modalClose = addContentModal.querySelector('.modal-close');
    const modalOptions = addContentModal.querySelectorAll('.modal-option');
    
    // 打开模态框
    addContentBtn.addEventListener('click', () => {
        addContentModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // 关闭模态框
    function closeModal() {
        addContentModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    modalClose.addEventListener('click', closeModal);
    
    // 点击模态框外部关闭
    addContentModal.addEventListener('click', (e) => {
        if (e.target === addContentModal) {
            closeModal();
        }
    });
    
    // 模态框选项点击
    modalOptions.forEach(option => {
        option.addEventListener('click', () => {
            const type = option.getAttribute('data-type');
            handleModalOption(type);
            closeModal();
        });
    });
    
    function handleModalOption(type) {
        // 根据选择的类型跳转到相应的页面或打开相应的表单
        console.log(`选择了: ${type}`);
        
        // 这里可以根据需要添加不同的处理逻辑
        switch (type) {
            case 'course':
                alert('新建课程功能开发中...');
                break;
            case 'material':
                alert('上传资料功能开发中...');
                break;
            case 'note':
                alert('新建笔记功能开发中...');
                break;
        }
    }
}

// 导航功能
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const quickAccessItems = document.querySelectorAll('.quick-access-item');
    const featureLinks = document.querySelectorAll('.feature-link');
    const viewAllLinks = document.querySelectorAll('.view-all');
    const heroButtons = document.querySelectorAll('.hero-buttons button');
    
    // 导航链接点击
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            handleNavigation(section, link);
        });
    });
    
    // 快速访问项点击
    quickAccessItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            handleNavigation(section);
        });
    });
    
    // 功能链接点击
    featureLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            handleNavigation(section);
        });
    });
    
    // 查看全部链接点击
    viewAllLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            handleNavigation(section);
        });
    });
    
    // 英雄按钮点击
    heroButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.getAttribute('data-section');
            handleNavigation(section);
        });
    });
    
    function handleNavigation(section, activeLink) {
        // 更新导航链接状态
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        if (activeLink) {
            activeLink.classList.add('active');
        } else {
            const correspondingLink = document.querySelector(`.nav-link[data-section="${section}"]`);
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
        
        // 这里可以根据section加载不同的内容
        console.log(`导航到: ${section}`);
        
        // 模拟页面切换
        switch (section) {
            case 'home':
                // 显示首页内容
                break;
            case 'courses':
                // 加载课程管理页面
                alert('课程管理页面开发中...');
                break;
            case 'materials':
                // 加载资料管理页面
                alert('资料管理页面开发中...');
                break;
            case 'notes':
                // 加载笔记管理页面
                alert('教学笔记页面开发中...');
                break;
            case 'maya':
                // 加载Maya工具页面
                alert('Maya工具页面开发中...');
                break;
        }
    }
}

// 课程卡片交互
function initCourseCards() {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        card.addEventListener('click', () => {
            // 这里可以添加课程详情页面跳转
            const courseTitle = card.querySelector('h3').textContent;
            alert(`查看课程: ${courseTitle}`);
        });
    });
}

// 资料项交互
function initMaterialItems() {
    const materialItems = document.querySelectorAll('.material-item');
    
    materialItems.forEach(item => {
        item.addEventListener('click', () => {
            // 这里可以添加资料详情或下载功能
            const materialName = item.querySelector('h4').textContent;
            alert(`查看资料: ${materialName}`);
        });
    });
}

// 平滑滚动
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// API调用函数
function apiCall(endpoint, method = 'GET', data = null) {
    const baseUrl = 'http://localhost:3001/api';
    const url = `${baseUrl}${endpoint}`;
    
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }
    
    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`API错误: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('API调用失败:', error);
            alert('网络请求失败，请检查服务器是否运行');
            return null;
        });
}

// 加载课程数据
function loadCourses() {
    apiCall('/courses')
        .then(data => {
            if (data && data.success) {
                renderCourses(data.data);
            }
        });
}

// 渲染课程列表
function renderCourses(courses) {
    const container = document.getElementById('recent-courses-container');
    if (!container) return;
    
    if (courses.length === 0) {
        container.innerHTML = '<p class="no-data">暂无课程</p>';
        return;
    }
    
    const courseCards = courses.map(course => {
        return `
            <div class="course-card">
                <div class="course-image">
                    <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=3D%20${encodeURIComponent(course.category)}%20tutorial%20concept%2C%20Maya%20software%20interface&image_size=square" alt="${course.title}">
                </div>
                <div class="course-content">
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <div class="course-meta">
                        <span class="category">${course.category}</span>
                        <span class="date">${new Date(course.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = courseCards;
    
    // 重新初始化课程卡片交互
    initCourseCards();
}

// 加载资料数据
function loadMaterials() {
    apiCall('/materials')
        .then(data => {
            if (data && data.success) {
                renderMaterials(data.data);
            }
        });
}

// 渲染资料列表
function renderMaterials(materials) {
    const container = document.getElementById('recent-materials-container');
    if (!container) return;
    
    if (materials.length === 0) {
        container.innerHTML = '<div class="material-item"><p class="no-data">暂无资料</p></div>';
        return;
    }
    
    const materialItems = materials.map(material => {
        // 根据文件类型选择图标
        let iconClass = 'fas fa-file';
        if (material.name.endsWith('.pdf')) {
            iconClass = 'fas fa-file-pdf';
        } else if (material.name.endsWith('.mp4') || material.name.endsWith('.mov')) {
            iconClass = 'fas fa-file-video';
        } else if (material.name.endsWith('.jpg') || material.name.endsWith('.png') || material.name.endsWith('.gif')) {
            iconClass = 'fas fa-file-image';
        } else if (material.name.endsWith('.zip') || material.name.endsWith('.rar')) {
            iconClass = 'fas fa-file-archive';
        } else if (material.name.endsWith('.txt') || material.name.endsWith('.md')) {
            iconClass = 'fas fa-file-alt';
        } else if (material.name.endsWith('.doc') || material.name.endsWith('.docx')) {
            iconClass = 'fas fa-file-word';
        } else if (material.name.endsWith('.xls') || material.name.endsWith('.xlsx')) {
            iconClass = 'fas fa-file-excel';
        } else if (material.name.endsWith('.ppt') || material.name.endsWith('.pptx')) {
            iconClass = 'fas fa-file-powerpoint';
        }
        
        // 格式化文件大小
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        }
        
        return `
            <div class="material-item">
                <div class="material-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="material-info">
                    <h4>${material.name}</h4>
                    <p>${material.description || '无描述'}</p>
                </div>
                <div class="material-meta">
                    <span class="size">${formatFileSize(material.size)}</span>
                    <span class="date">${new Date(material.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = materialItems;
    
    // 重新初始化资料项交互
    initMaterialItems();
}

// 初始化所有功能
function initApp() {
    initThemeToggle();
    initModals();
    initNavigation();
    initCourseCards();
    initMaterialItems();
    initSmoothScroll();
    
    // 加载数据
    loadCourses();
    loadMaterials();
    
    // 添加页面加载动画
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);

// 窗口大小变化时的处理
window.addEventListener('resize', () => {
    // 可以添加响应式处理逻辑
});

// 滚动事件处理
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }
});

// 用户体验优化功能

// 加载动画管理
function LoadingManager() {
    let loadingElement = null;
    let loadingCount = 0;

    function createLoadingElement() {
        if (!loadingElement) {
            loadingElement = document.createElement('div');
            loadingElement.className = 'loading-overlay';
            loadingElement.innerHTML = '<div class="loading-spinner"></div>';
            document.body.appendChild(loadingElement);
        }
    }

    this.show = function() {
        createLoadingElement();
        loadingCount++;
        setTimeout(() => {
            loadingElement.classList.add('active');
        }, 10);
    };

    this.hide = function() {
        if (loadingCount > 0) {
            loadingCount--;
        }
        
        if (loadingCount === 0 && loadingElement) {
            loadingElement.classList.remove('active');
            setTimeout(() => {
                if (loadingElement && loadingCount === 0) {
                    loadingElement.remove();
                    loadingElement = null;
                }
            }, 300);
        }
    };

    this.isLoading = function() {
        return loadingCount > 0;
    };
}

// 全局加载管理器实例
const loadingManager = new LoadingManager();

// 消息显示功能
function showMessage(type, message, duration = 3000) {
    const messageContainer = document.createElement('div');
    messageContainer.className = `${type}-message`;
    messageContainer.innerHTML = `
        <i class="fas ${getIconForType(type)}"></i>
        <div>
            <strong>${getTitleForType(type)}</strong>
            <span>${message}</span>
        </div>
    `;

    // 添加到页面
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(messageContainer, container.firstChild);

    // 自动移除
    setTimeout(() => {
        messageContainer.style.opacity = '0';
        messageContainer.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (messageContainer.parentNode) {
                messageContainer.parentNode.removeChild(messageContainer);
            }
        }, 300);
    }, duration);

    function getIconForType(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    function getTitleForType(type) {
        switch (type) {
            case 'success': return '成功';
            case 'error': return '错误';
            case 'warning': return '警告';
            default: return '提示';
        }
    }
}

// 增强的API调用函数
function enhancedApiCall(endpoint, method = 'GET', data = null, showLoading = true) {
    if (showLoading) {
        loadingManager.show();
    }

    const baseUrl = 'http://localhost:3001/api';
    const url = `${baseUrl}${endpoint}`;

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`API错误: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && !data.success) {
                throw new Error(data.message || '操作失败');
            }
            return data;
        })
        .catch(error => {
            console.error('API调用失败:', error);
            showMessage('error', error.message || '网络请求失败，请检查服务器是否运行');
            return null;
        })
        .finally(() => {
            if (showLoading) {
                loadingManager.hide();
            }
        });
}

// 表单验证功能
function validateForm(form) {
    const formGroups = form.querySelectorAll('.form-group');
    let isValid = true;

    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        if (input) {
            // 清除之前的错误
            group.classList.remove('error');
            const errorText = group.querySelector('.error-text');
            if (errorText) {
                errorText.remove();
            }

            // 验证必填项
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                showInputError(group, '此字段为必填项');
            }

            // 验证邮箱格式
            if (input.type === 'email' && input.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value.trim())) {
                    isValid = false;
                    showInputError(group, '请输入有效的邮箱地址');
                }
            }

            // 验证最小长度
            if (input.hasAttribute('minlength') && input.value.length < parseInt(input.getAttribute('minlength'))) {
                isValid = false;
                showInputError(group, `最少需要${input.getAttribute('minlength')}个字符`);
            }

            // 验证最大长度
            if (input.hasAttribute('maxlength') && input.value.length > parseInt(input.getAttribute('maxlength'))) {
                isValid = false;
                showInputError(group, `最多允许${input.getAttribute('maxlength')}个字符`);
            }
        }
    });

    return isValid;
}

function showInputError(formGroup, message) {
    formGroup.classList.add('error');
    const errorText = document.createElement('div');
    errorText.className = 'error-text';
    errorText.textContent = message;
    formGroup.appendChild(errorText);
}

// 按钮加载状态管理
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
        button.setAttribute('data-original-text', button.textContent);
        button.textContent = '处理中...';
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        if (button.getAttribute('data-original-text')) {
            button.textContent = button.getAttribute('data-original-text');
        }
    }
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function() {
        const args = arguments;
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// 本地存储封装
function Storage() {
    this.set = function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('本地存储失败:', error);
            return false;
        }
    };

    this.get = function(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.error('本地存储读取失败:', error);
            return defaultValue;
        }
    };

    this.remove = function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('本地存储删除失败:', error);
            return false;
        }
    };

    this.clear = function() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('本地存储清空失败:', error);
            return false;
        }
    };
}

// 全局存储实例
const storage = new Storage();

// 替换现有的API调用函数
window.apiCall = enhancedApiCall;

// 替换现有的加载函数
function loadCourses() {
    loadingManager.show();
    enhancedApiCall('/courses')
        .then(data => {
            if (data && data.success) {
                renderCourses(data.data);
            }
        });
}

function loadMaterials() {
    loadingManager.show();
    enhancedApiCall('/materials')
        .then(data => {
            if (data && data.success) {
                renderMaterials(data.data);
            }
        });
}

// 增强的导航功能
function handleNavigation(section, activeLink) {
    // 更新导航链接状态
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    if (activeLink) {
        activeLink.classList.add('active');
    } else {
        const correspondingLink = document.querySelector(`.nav-link[data-section="${section}"]`);
        if (correspondingLink) {
            correspondingLink.classList.add('active');
        }
    }

    // 页面跳转
    const pageMap = {
        home: '/',
        courses: '/courses.html',
        materials: '/materials.html',
        notes: '/notes.html',
        maya: '/maya.html'
    };

    if (pageMap[section]) {
        loadingManager.show();
        window.location.href = pageMap[section];
    }
}

// 更新初始化函数，确保使用新的加载函数
window.loadCourses = loadCourses;
window.loadMaterials = loadMaterials;
window.handleNavigation = handleNavigation;

// 添加键盘快捷键支持
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K 快速导航
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = '输入页面名称...';
            searchInput.className = 'search-shortcut';
            searchInput.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 15px;
                width: 300px;
                border: 2px solid var(--primary-color);
                border-radius: var(--border-radius);
                font-size: 1rem;
                z-index: 4000;
                background: var(--card-background);
                color: var(--text-primary);
            `;
            document.body.appendChild(searchInput);
            searchInput.focus();

            searchInput.addEventListener('blur', () => {
                searchInput.remove();
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const value = e.target.value.toLowerCase();
                    const pageMap = {
                        '课程': 'courses',
                        '资料': 'materials',
                        '笔记': 'notes',
                        'maya': 'maya',
                        '首页': 'home'
                    };

                    for (const [key, section] of Object.entries(pageMap)) {
                        if (key.includes(value) || section.includes(value)) {
                            handleNavigation(section);
                            break;
                        }
                    }
                    searchInput.remove();
                } else if (e.key === 'Escape') {
                    searchInput.remove();
                }
            });
        }

        // Ctrl/Cmd + / 显示帮助
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            showMessage('info', '快捷键: Ctrl+K 快速导航, Ctrl+/ 显示帮助');
        }
    });
}

// 添加到初始化函数
function initApp() {
    initThemeToggle();
    initModals();
    initNavigation();
    initCourseCards();
    initMaterialItems();
    initSmoothScroll();
    initKeyboardShortcuts();

    // 加载数据
    loadCourses();
    loadMaterials();

    // 添加页面加载动画
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        setTimeout(() => {
            loadingManager.hide();
        }, 500);
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);