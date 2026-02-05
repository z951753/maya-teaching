// Maya工具页面功能

// 全局变量
let commands = [];
let currentTab = 'commands';
let addCommandModal = null;
let commandDetailModal = null;

// 初始化
function initMayaPage() {
    // 初始化元素
    addCommandModal = document.getElementById('add-command-modal');
    commandDetailModal = document.getElementById('command-detail-modal');
    
    // 绑定事件
    bindEvents();
    
    // 加载命令数据
    loadCommands();
    
    // 初始化搜索和筛选
    initSearchAndFilter();
}

// 绑定事件
function bindEvents() {
    // 标签切换
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            switchTab(tab);
        });
    });
    
    // 添加命令按钮
    const addCommandBtn = document.getElementById('add-command-btn');
    if (addCommandBtn) {
        addCommandBtn.addEventListener('click', openAddCommandModal);
    }
    
    // 提交添加命令
    const submitAddCommandBtn = document.getElementById('submit-add-command');
    if (submitAddCommandBtn) {
        submitAddCommandBtn.addEventListener('click', handleAddCommand);
    }
    
    // 取消添加命令
    const cancelAddCommandBtn = document.getElementById('cancel-add-command');
    if (cancelAddCommandBtn) {
        cancelAddCommandBtn.addEventListener('click', closeAddCommandModal);
    }
    
    // 关闭命令详情模态框
    const closeCommandDetailBtn = document.getElementById('close-command-detail');
    if (closeCommandDetailBtn) {
        closeCommandDetailBtn.addEventListener('click', closeCommandDetailModal);
    }
    
    // 运行命令详情
    const runCommandDetailBtn = document.getElementById('run-command-detail');
    if (runCommandDetailBtn) {
        runCommandDetailBtn.addEventListener('click', runCommandDetail);
    }
    
    // 关闭模态框
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // 命令卡片操作
    document.addEventListener('click', function(e) {
        if (e.target.closest('.command-card')) {
            const card = e.target.closest('.command-card');
            const commandName = card.querySelector('.command-header h3').textContent;
            const command = commands.find(cmd => cmd.name === commandName);
            if (command) {
                openCommandDetailModal(command);
            }
        }
        
        if (e.target.closest('.btn-sm.btn-outline') && e.target.closest('.command-actions')) {
            e.stopPropagation();
            const card = e.target.closest('.command-card');
            const commandName = card.querySelector('.command-header h3').textContent;
            copyCommand(commandName);
        }
        
        if (e.target.closest('.btn-sm.btn-primary') && e.target.closest('.command-actions')) {
            e.stopPropagation();
            const card = e.target.closest('.command-card');
            const commandName = card.querySelector('.command-header h3').textContent;
            runCommand(commandName);
        }
    });
    
    // 脚本操作
    document.addEventListener('click', function(e) {
        if (e.target.closest('.script-actions .btn-outline')) {
            const scriptItem = e.target.closest('.script-item');
            const code = scriptItem.querySelector('.script-code').textContent;
            copyToClipboard(code);
            showNotification('脚本已复制到剪贴板', 'success');
        }
        
        if (e.target.closest('.script-actions .btn-primary')) {
            const scriptItem = e.target.closest('.script-item');
            const code = scriptItem.querySelector('.script-code').textContent;
            runScript(code);
        }
    });
    
    // 插件操作
    document.addEventListener('click', function(e) {
        if (e.target.closest('.plugin-actions .btn-primary')) {
            const pluginCard = e.target.closest('.plugin-card');
            const pluginName = pluginCard.querySelector('.plugin-header h3').textContent;
            openPluginWebsite(pluginName);
        }
        
        if (e.target.closest('.plugin-actions .btn-outline')) {
            const pluginCard = e.target.closest('.plugin-card');
            const pluginName = pluginCard.querySelector('.plugin-header h3').textContent;
            showPluginDetails(pluginName);
        }
    });
}

// 切换标签
function switchTab(tab) {
    // 更新当前标签
    currentTab = tab;
    
    // 更新导航按钮状态
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`.nav-btn[data-tab="${tab}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // 更新标签内容
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const activeContent = document.getElementById(`${tab}-tab`);
    if (activeContent) {
        activeContent.classList.add('active');
    }
}

// 加载命令数据
function loadCommands() {
    // 从本地存储加载或使用默认数据
    const storedCommands = localStorage.getItem('mayaCommands');
    
    if (storedCommands) {
        commands = JSON.parse(storedCommands);
    } else {
        // 默认数据
        commands = [
            {
                id: 'cmd_1',
                name: 'polyCube',
                category: '建模',
                language: 'MEL',
                description: '创建多边形立方体',
                syntax: 'polyCube [-width #] [-height #] [-depth #] [-subdivisionsWidth #] [-subdivisionsHeight #] [-subdivisionsDepth #] [-axisX #] [-axisY #] [-axisZ #] [-createUVs string] [-name string]',
                usage: 'polyCube -w 10 -h 20 -d 5 -sw 2 -sh 4 -sd 2',
                version: 'Maya 2016+'
            },
            {
                id: 'cmd_2',
                name: 'sphere',
                category: '建模',
                language: 'MEL',
                description: '创建球体',
                syntax: 'sphere [-radius #] [-subdivisionsX #] [-subdivisionsY #] [-axisX #] [-axisY #] [-axisZ #] [-createUVs string] [-name string]',
                usage: 'sphere -r 8 -sx 20 -sy 15',
                version: 'Maya 2016+'
            },
            {
                id: 'cmd_3',
                name: 'setKeyframe',
                category: '动画',
                language: 'MEL',
                description: '设置关键帧',
                syntax: 'setKeyframe [-breakdown boolean] [-controlPoints boolean] [-hierarchy string] [-insert boolean] [-time string] [-value #] [-attribute string] [-channelBox boolean] [-shape boolean] objects',
                usage: 'setKeyframe -attribute "translateX" -time 1 -value 0 pCube1',
                version: 'Maya 2016+'
            },
            {
                id: 'cmd_4',
                name: 'cmds.polySphere',
                category: '建模',
                language: 'Python',
                description: 'Python版本的创建球体命令',
                syntax: 'cmds.polySphere(radius=1.0, subdivisionsX=20, subdivisionsY=20, axis=(0, 1, 0), name=\'sphere1\')',
                usage: 'import maya.cmds as cmds\ncmds.polySphere(r=5, sx=16, sy=12, name=\'mySphere\')',
                version: 'Maya 2016+'
            }
        ];
        saveCommands();
    }
}

// 保存命令数据
function saveCommands() {
    localStorage.setItem('mayaCommands', JSON.stringify(commands));
}

// 初始化搜索和筛选
function initSearchAndFilter() {
    const commandSearch = document.getElementById('command-search');
    const commandCategory = document.getElementById('command-category');
    const commandLanguage = document.getElementById('command-language');
    
    if (commandSearch) {
        commandSearch.addEventListener('input', handleCommandSearch);
    }
    
    if (commandCategory) {
        commandCategory.addEventListener('change', handleCommandFilter);
    }
    
    if (commandLanguage) {
        commandLanguage.addEventListener('change', handleCommandFilter);
    }
}

// 处理命令搜索
function handleCommandSearch() {
    const searchTerm = document.getElementById('command-search').value.toLowerCase();
    const category = document.getElementById('command-category').value;
    const language = document.getElementById('command-language').value;
    
    filterCommands(searchTerm, category, language);
}

// 处理命令筛选
function handleCommandFilter() {
    const searchTerm = document.getElementById('command-search').value.toLowerCase();
    const category = document.getElementById('command-category').value;
    const language = document.getElementById('command-language').value;
    
    filterCommands(searchTerm, category, language);
}

// 筛选命令
function filterCommands(searchTerm, category, language) {
    const filteredCommands = commands.filter(cmd => {
        const matchesSearch = cmd.name.toLowerCase().includes(searchTerm) || 
                            cmd.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || cmd.category === category;
        const matchesLanguage = !language || cmd.language === language;
        
        return matchesSearch && matchesCategory && matchesLanguage;
    });
    
    // 更新命令网格
    updateCommandsGrid(filteredCommands);
}

// 更新命令网格
function updateCommandsGrid(filteredCommands) {
    const commandsGrid = document.getElementById('commands-grid');
    if (commandsGrid) {
        commandsGrid.innerHTML = '';
        
        filteredCommands.forEach(cmd => {
            const card = createCommandCard(cmd);
            commandsGrid.appendChild(card);
        });
    }
}

// 创建命令卡片
function createCommandCard(cmd) {
    const card = document.createElement('div');
    card.className = 'command-card';
    
    card.innerHTML = `
        <div class="command-header">
            <h3>${cmd.name}</h3>
            <span class="command-category-badge">${cmd.category}</span>
        </div>
        <div class="command-content">
            <div class="command-language">
                <span class="language-badge">${cmd.language}</span>
            </div>
            <p class="command-description">${cmd.description}</p>
            <div class="command-syntax">
                <h4>语法</h4>
                <code>${cmd.syntax}</code>
            </div>
            <div class="command-usage">
                <h4>示例</h4>
                <code>${cmd.usage}</code>
            </div>
        </div>
        <div class="command-actions">
            <button class="btn btn-sm btn-outline"><i class="fas fa-copy"></i> 复制</button>
            <button class="btn btn-sm btn-primary"><i class="fas fa-play"></i> 运行</button>
        </div>
    `;
    
    return card;
}

// 打开添加命令模态框
function openAddCommandModal() {
    addCommandModal.style.display = 'flex';
    setTimeout(() => {
        addCommandModal.querySelector('.modal-content').classList.add('show');
    }, 10);
}

// 关闭添加命令模态框
function closeAddCommandModal() {
    const modalContent = addCommandModal.querySelector('.modal-content');
    modalContent.classList.remove('show');
    setTimeout(() => {
        addCommandModal.style.display = 'none';
    }, 300);
}

// 打开命令详情模态框
function openCommandDetailModal(command) {
    const content = document.getElementById('command-detail-content');
    content.innerHTML = `
        <h3><i class="fas fa-terminal"></i> ${command.name}</h3>
        <div class="command-detail-section">
            <h4>基本信息</h4>
            <p><strong>分类：</strong>${command.category}</p>
            <p><strong>语言：</strong>${command.language}</p>
            <p><strong>适用版本：</strong>${command.version || '所有版本'}</p>
            <p><strong>描述：</strong>${command.description}</p>
        </div>
        <div class="command-detail-section">
            <h4>语法</h4>
            <code>${command.syntax}</code>
        </div>
        <div class="command-detail-section">
            <h4>示例</h4>
            <code>${command.usage}</code>
        </div>
    `;
    
    commandDetailModal.style.display = 'flex';
    setTimeout(() => {
        commandDetailModal.querySelector('.modal-content').classList.add('show');
    }, 10);
}

// 关闭命令详情模态框
function closeCommandDetailModal() {
    const modalContent = commandDetailModal.querySelector('.modal-content');
    modalContent.classList.remove('show');
    setTimeout(() => {
        commandDetailModal.style.display = 'none';
    }, 300);
}

// 关闭模态框
function closeModal(modal) {
    const modalContent = modal.querySelector('.modal-content');
    modalContent.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// 处理添加命令
function handleAddCommand() {
    const name = document.getElementById('command-name').value;
    const category = document.getElementById('command-category-add').value;
    const language = document.getElementById('command-language-add').value;
    const version = document.getElementById('command-version').value;
    const description = document.getElementById('command-description').value;
    const syntax = document.getElementById('command-syntax').value;
    const usage = document.getElementById('command-usage').value;
    const notes = document.getElementById('command-notes').value;
    
    if (!name || !description || !syntax) {
        alert('请填写命令名称、描述和语法');
        return;
    }
    
    // 创建新命令
    const newCommand = {
        id: 'cmd_' + Date.now(),
        name: name,
        category: category,
        language: language,
        version: version,
        description: description,
        syntax: syntax,
        usage: usage,
        notes: notes
    };
    
    // 添加到命令列表
    commands.push(newCommand);
    saveCommands();
    
    // 关闭模态框
    closeAddCommandModal();
    
    // 更新命令网格
    filterCommands('', '', '');
    
    // 显示成功消息
    showNotification('命令添加成功', 'success');
}

// 复制命令
function copyCommand(commandName) {
    const command = commands.find(cmd => cmd.name === commandName);
    if (command) {
        copyToClipboard(command.syntax);
        showNotification('命令已复制到剪贴板', 'success');
    }
}

// 运行命令
function runCommand(commandName) {
    const command = commands.find(cmd => cmd.name === commandName);
    if (command) {
        showNotification(`正在运行命令：${command.name}`, 'info');
        // 模拟命令运行
        setTimeout(() => {
            showNotification('命令运行成功', 'success');
        }, 1000);
    }
}

// 运行命令详情
function runCommandDetail() {
    const content = document.getElementById('command-detail-content');
    const commandName = content.querySelector('h3').textContent.replace('\n', '').trim();
    runCommand(commandName);
    closeCommandDetailModal();
}

// 复制到剪贴板
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// 运行脚本
function runScript(code) {
    showNotification('正在运行脚本...', 'info');
    // 模拟脚本运行
    setTimeout(() => {
        showNotification('脚本运行成功', 'success');
    }, 1500);
}

// 打开插件官网
function openPluginWebsite(pluginName) {
    let url = '';
    
    switch(pluginName) {
        case 'Arnold':
            url = 'https://www.autodesk.com/products/arnold/overview';
            break;
        case 'Substance Painter':
            url = 'https://www.adobe.com/products/substance3d-painter.html';
            break;
        case 'ZBrush Bridge':
            url = 'https://www.maxon.net/en/zbrush-bridge';
            break;
        case 'Redshift':
            url = 'https://www.redshift3d.com/';
            break;
        default:
            url = 'https://www.autodesk.com/products/maya/overview';
    }
    
    window.open(url, '_blank');
    showNotification(`正在打开${pluginName}官网`, 'info');
}

// 显示插件详情
function showPluginDetails(pluginName) {
    showNotification(`${pluginName}详情页面开发中`, 'info');
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自动关闭
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 初始化页面
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMayaPage);
} else {
    initMayaPage();
}
