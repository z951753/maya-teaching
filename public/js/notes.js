// 笔记管理页面功能

// 全局变量
let notes = [];
let currentNote = null;
let quill = null;
let notesList = null;
let noteTitleInput = null;
let noteCategorySelect = null;
let createNoteModal = null;
let shareNoteModal = null;
let exportNoteModal = null;
let deleteNoteModal = null;

// 初始化
function initNotesPage() {
    // 初始化元素
    notesList = document.getElementById('notes-list');
    noteTitleInput = document.getElementById('note-title');
    noteCategorySelect = document.getElementById('note-category-select');
    createNoteModal = document.getElementById('create-note-modal');
    shareNoteModal = document.getElementById('share-note-modal');
    exportNoteModal = document.getElementById('export-note-modal');
    deleteNoteModal = document.getElementById('delete-note-modal');
    
    // 绑定事件
    bindEvents();
    
    // 初始化富文本编辑器
    initEditor();
    
    // 加载笔记数据
    loadNotes();
    
    // 初始化搜索和筛选
    initSearchAndFilter();
}

// 绑定事件
function bindEvents() {
    // 新建笔记按钮
    const createBtn = document.getElementById('create-note-btn');
    if (createBtn) {
        createBtn.addEventListener('click', openCreateNoteModal);
    }
    
    // 保存笔记按钮
    const saveBtn = document.getElementById('save-note-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveNote);
    }
    
    // 分享笔记按钮
    const shareBtn = document.getElementById('share-note-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', openShareNoteModal);
    }
    
    // 导出笔记按钮
    const exportBtn = document.getElementById('export-note-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', openExportNoteModal);
    }
    
    // 打印笔记按钮
    const printBtn = document.getElementById('print-note-btn');
    if (printBtn) {
        printBtn.addEventListener('click', printNote);
    }
    
    // 提交新建笔记
    const submitCreateBtn = document.getElementById('submit-create-note');
    if (submitCreateBtn) {
        submitCreateBtn.addEventListener('click', handleCreateNote);
    }
    
    // 取消新建笔记
    const cancelCreateBtn = document.getElementById('cancel-create-note');
    if (cancelCreateBtn) {
        cancelCreateBtn.addEventListener('click', closeCreateNoteModal);
    }
    
    // 关闭分享模态框
    const closeShareBtn = document.getElementById('close-share-modal');
    if (closeShareBtn) {
        closeShareBtn.addEventListener('click', closeShareNoteModal);
    }
    
    // 复制分享链接
    const copyShareBtn = document.getElementById('copy-share-link');
    if (copyShareBtn) {
        copyShareBtn.addEventListener('click', copyShareLink);
    }
    
    // 取消导出
    const cancelExportBtn = document.getElementById('cancel-export');
    if (cancelExportBtn) {
        cancelExportBtn.addEventListener('click', closeExportNoteModal);
    }
    
    // 确认导出
    const confirmExportBtn = document.getElementById('confirm-export');
    if (confirmExportBtn) {
        confirmExportBtn.addEventListener('click', handleExportNote);
    }
    
    // 取消删除
    const cancelDeleteBtn = document.getElementById('cancel-delete-note');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteNoteModal);
    }
    
    // 确认删除
    const confirmDeleteBtn = document.getElementById('confirm-delete-note');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', handleDeleteNote);
    }
    
    // 关闭模态框
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // 平台分享按钮
    document.querySelectorAll('.platform-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.dataset.platform;
            shareNoteToPlatform(platform);
        });
    });
    
    // 格式导出按钮
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const format = this.dataset.format;
            selectExportFormat(format);
        });
    });
}

// 初始化富文本编辑器
function initEditor() {
    const editorElement = document.getElementById('editor');
    if (editorElement) {
        quill = new Quill(editorElement, {
            theme: 'snow',
            placeholder: '开始编写笔记...',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'header': 1 }, { 'header': 2 }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'direction': 'rtl' }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'font': [] }],
                    [{ 'align': [] }],
                    ['clean'],
                    ['link', 'image', 'video']
                ]
            }
        });
        
        // 编辑器内容变化时自动保存
        quill.on('text-change', function() {
            if (currentNote) {
                currentNote.content = quill.root.innerHTML;
                currentNote.updatedAt = new Date().toISOString();
                updateNoteMetaInfo();
            }
        });
    }
}

// 加载笔记数据
function loadNotes() {
    // 从本地存储加载或使用默认数据
    const storedNotes = localStorage.getItem('mayaNotes');
    
    if (storedNotes) {
        notes = JSON.parse(storedNotes);
    } else {
        // 默认数据
        notes = [
            {
                id: 'note_1',
                title: 'Maya建模课程笔记',
                content: '<h2>多边形建模基础</h2><p>1. 基本几何体创建</p><p>2. 顶点、边、面编辑</p><p>3. 挤出、倒角等常用工具</p>',
                category: '课程笔记',
                tags: ['建模', '基础'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'note_2',
                title: '材质与渲染备课',
                content: '<h2>PBR材质设置</h2><p>1. 金属度和粗糙度参数</p><p>2. 纹理贴图准备</p><p>3. Arnold渲染器参数调整</p>',
                category: '备课资料',
                tags: ['材质', '渲染'],
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                updatedAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 'note_3',
                title: '动画原理教学反思',
                content: '<h2>学生常见问题</h2><p>1. 关键帧设置不规范</p><p>2. 动画曲线调整不当</p><p>3. 物理运动规律理解不足</p>',
                category: '教学反思',
                tags: ['动画', '教学反思'],
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                updatedAt: new Date(Date.now() - 172800000).toISOString()
            }
        ];
        saveNotes();
    }
    
    renderNotesList();
    
    // 加载第一个笔记
    if (notes.length > 0) {
        loadNote(notes[0]);
    }
}

// 保存笔记数据
function saveNotes() {
    localStorage.setItem('mayaNotes', JSON.stringify(notes));
}

// 渲染笔记列表
function renderNotesList() {
    if (notesList) {
        notesList.innerHTML = '';
        
        notes.forEach(note => {
            const noteItem = createNoteItem(note);
            notesList.appendChild(noteItem);
        });
    }
}

// 创建笔记项
function createNoteItem(note) {
    const noteItem = document.createElement('div');
    noteItem.className = `note-item ${currentNote && currentNote.id === note.id ? 'active' : ''}`;
    
    const contentText = stripHtml(note.content);
    const shortContent = contentText.substring(0, 100) + (contentText.length > 100 ? '...' : '');
    
    noteItem.innerHTML = `
        <div class="note-info">
            <h3>${note.title}</h3>
            <p>${shortContent}</p>
            <div class="note-meta">
                <span class="category">${note.category}</span>
                <span class="date">${formatDate(note.updatedAt)}</span>
                <span class="time">${formatTime(note.updatedAt)}</span>
            </div>
        </div>
        <div class="note-actions">
            <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete-btn"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    // 绑定事件
    noteItem.addEventListener('click', function(e) {
        if (!e.target.closest('.action-btn')) {
            loadNote(note);
        }
    });
    
    const editBtn = noteItem.querySelector('.edit-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            loadNote(note);
        });
    }
    
    const deleteBtn = noteItem.querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openDeleteNoteModal(note);
        });
    }
    
    return noteItem;
}

// 加载笔记
function loadNote(note) {
    currentNote = note;
    
    // 更新界面
    if (noteTitleInput) {
        noteTitleInput.value = note.title;
    }
    
    if (noteCategorySelect) {
        noteCategorySelect.value = note.category;
    }
    
    if (quill) {
        quill.root.innerHTML = note.content;
    }
    
    // 更新笔记列表选中状态
    document.querySelectorAll('.note-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const noteItem = document.querySelector(`.note-item[data-id="${note.id}"]`) || 
                    Array.from(document.querySelectorAll('.note-item')).find(item => 
                        item.querySelector('h3').textContent === note.title
                    );
    
    if (noteItem) {
        noteItem.classList.add('active');
    }
    
    // 更新元信息
    updateNoteMetaInfo();
}

// 更新笔记元信息
function updateNoteMetaInfo() {
    if (currentNote) {
        const createdElement = document.getElementById('note-created');
        const updatedElement = document.getElementById('note-updated');
        
        if (createdElement) {
            createdElement.textContent = `创建于：${formatDateTime(currentNote.createdAt)}`;
        }
        
        if (updatedElement) {
            updatedElement.textContent = `更新于：${formatDateTime(currentNote.updatedAt)}`;
        }
    }
}

// 保存笔记
function saveNote() {
    if (currentNote) {
        // 更新笔记内容
        currentNote.title = noteTitleInput.value || '无标题';
        currentNote.category = noteCategorySelect.value;
        currentNote.content = quill.root.innerHTML;
        currentNote.updatedAt = new Date().toISOString();
        
        // 保存到本地存储
        saveNotes();
        
        // 更新笔记列表
        renderNotesList();
        
        // 显示保存成功
        showNotification('笔记已保存', 'success');
    }
}

// 打开新建笔记模态框
function openCreateNoteModal() {
    createNoteModal.style.display = 'flex';
    setTimeout(() => {
        createNoteModal.querySelector('.modal-content').classList.add('show');
    }, 10);
}

// 关闭新建笔记模态框
function closeCreateNoteModal() {
    const modalContent = createNoteModal.querySelector('.modal-content');
    modalContent.classList.remove('show');
    setTimeout(() => {
        createNoteModal.style.display = 'none';
    }, 300);
}

// 打开分享笔记模态框
function openShareNoteModal() {
    if (currentNote) {
        // 生成分享链接
        const shareLink = generateShareLink(currentNote.id);
        const linkInput = document.getElementById('note-share-link');
        if (linkInput) {
            linkInput.value = shareLink;
        }
        
        shareNoteModal.style.display = 'flex';
        setTimeout(() => {
            shareNoteModal.querySelector('.modal-content').classList.add('show');
        }, 10);
    }
}

// 关闭分享笔记模态框
function closeShareNoteModal() {
    const modalContent = shareNoteModal.querySelector('.modal-content');
    modalContent.classList.remove('show');
    setTimeout(() => {
        shareNoteModal.style.display = 'none';
    }, 300);
}

// 打开导出笔记模态框
function openExportNoteModal() {
    exportNoteModal.style.display = 'flex';
    setTimeout(() => {
        exportNoteModal.querySelector('.modal-content').classList.add('show');
    }, 10);
}

// 关闭导出笔记模态框
function closeExportNoteModal() {
    const modalContent = exportNoteModal.querySelector('.modal-content');
    modalContent.classList.remove('show');
    setTimeout(() => {
        exportNoteModal.style.display = 'none';
    }, 300);
}

// 打开删除笔记模态框
function openDeleteNoteModal(note) {
    currentNote = note;
    const noteTitleElement = document.querySelector('.delete-note-title');
    if (noteTitleElement) {
        noteTitleElement.textContent = `笔记标题：${note.title}`;
    }
    
    deleteNoteModal.style.display = 'flex';
    setTimeout(() => {
        deleteNoteModal.querySelector('.modal-content').classList.add('show');
    }, 10);
}

// 关闭删除笔记模态框
function closeDeleteNoteModal() {
    const modalContent = deleteNoteModal.querySelector('.modal-content');
    modalContent.classList.remove('show');
    setTimeout(() => {
        deleteNoteModal.style.display = 'none';
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

// 处理新建笔记
function handleCreateNote() {
    const title = document.getElementById('new-note-title').value;
    const category = document.getElementById('new-note-category').value;
    const tags = document.getElementById('new-note-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
    const content = document.getElementById('new-note-content').value;
    
    if (!title) {
        alert('请输入笔记标题');
        return;
    }
    
    // 创建新笔记
    const newNote = {
        id: 'note_' + Date.now(),
        title: title,
        content: content || '<p></p>',
        category: category,
        tags: tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // 添加到笔记列表
    notes.push(newNote);
    saveNotes();
    
    // 关闭模态框
    closeCreateNoteModal();
    
    // 加载新笔记
    loadNote(newNote);
    
    // 更新笔记列表
    renderNotesList();
    
    // 显示成功消息
    showNotification('笔记创建成功', 'success');
}

// 处理删除笔记
function handleDeleteNote() {
    if (currentNote) {
        // 从列表中删除
        notes = notes.filter(note => note.id !== currentNote.id);
        saveNotes();
        
        // 关闭模态框
        closeDeleteNoteModal();
        
        // 清空编辑器
        if (noteTitleInput) {
            noteTitleInput.value = '';
        }
        
        if (quill) {
            quill.root.innerHTML = '';
        }
        
        if (noteCategorySelect) {
            noteCategorySelect.value = '课程笔记';
        }
        
        // 更新笔记列表
        renderNotesList();
        
        // 加载第一个笔记（如果有）
        if (notes.length > 0) {
            loadNote(notes[0]);
        } else {
            currentNote = null;
            updateNoteMetaInfo();
        }
        
        // 显示成功消息
        showNotification('笔记已删除', 'success');
    }
}

// 分享笔记到平台
function shareNoteToPlatform(platform) {
    if (currentNote) {
        const shareLink = generateShareLink(currentNote.id);
        
        switch(platform) {
            case 'wechat':
                showNotification('请使用微信扫描二维码分享', 'info');
                break;
            case 'qq':
                window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(shareLink)}&title=${encodeURIComponent(currentNote.title)}`);
                break;
            case 'email':
                window.location.href = `mailto:?subject=${encodeURIComponent(currentNote.title)}&body=${encodeURIComponent(shareLink)}`;
                break;
            case 'copy':
                copyToClipboard(shareLink);
                showNotification('链接已复制到剪贴板', 'success');
                break;
        }
    }
}

// 生成分享链接
function generateShareLink(noteId) {
    return `${window.location.origin}/notes.html?note=${noteId}`;
}

// 复制分享链接
function copyShareLink() {
    const linkInput = document.getElementById('note-share-link');
    if (linkInput) {
        linkInput.select();
        document.execCommand('copy');
        showNotification('链接已复制到剪贴板', 'success');
    }
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

// 选择导出格式
function selectExportFormat(format) {
    // 高亮选中的格式
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    const selectedBtn = document.querySelector(`.format-btn[data-format="${format}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
    }
    
    // 存储选中的格式
    localStorage.setItem('exportFormat', format);
}

// 处理导出笔记
function handleExportNote() {
    if (currentNote) {
        const format = localStorage.getItem('exportFormat') || 'html';
        exportNote(currentNote, format);
        closeExportNoteModal();
    }
}

// 导出笔记
function exportNote(note, format) {
    let content = '';
    let fileName = `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.${format}`;
    let mimeType = '';
    
    switch(format) {
        case 'html':
            content = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${note.title}</title></head><body><h1>${note.title}</h1>${note.content}</body></html>`;
            mimeType = 'text/html';
            break;
        case 'markdown':
            content = `# ${note.title}\n\n${htmlToMarkdown(note.content)}`;
            mimeType = 'text/markdown';
            break;
        case 'text':
            content = `${note.title}\n\n${stripHtml(note.content)}`;
            mimeType = 'text/plain';
            break;
    }
    
    // 创建下载链接
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // 显示成功消息
    showNotification('笔记导出成功', 'success');
}

// 打印笔记
function printNote() {
    if (currentNote) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${currentNote.title}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #333; }
                    h2 { color: #555; }
                    p { line-height: 1.6; }
                    ul, ol { margin-left: 20px; }
                </style>
            </head>
            <body>
                <h1>${currentNote.title}</h1>
                <p><strong>分类：</strong>${currentNote.category}</p>
                <p><strong>更新时间：</strong>${formatDateTime(currentNote.updatedAt)}</p>
                <hr>
                ${currentNote.content}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}

// 初始化搜索和筛选
function initSearchAndFilter() {
    const searchInput = document.getElementById('note-search');
    const categorySelect = document.getElementById('note-category');
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchAndFilter);
    }
    
    if (categorySelect) {
        categorySelect.addEventListener('change', handleSearchAndFilter);
    }
}

// 处理搜索和筛选
function handleSearchAndFilter() {
    const searchTerm = document.getElementById('note-search').value.toLowerCase();
    const category = document.getElementById('note-category').value;
    
    let filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm) || 
                            stripHtml(note.content).toLowerCase().includes(searchTerm);
        const matchesCategory = !category || note.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    // 更新笔记列表
    if (notesList) {
        notesList.innerHTML = '';
        filteredNotes.forEach(note => {
            const noteItem = createNoteItem(note);
            notesList.appendChild(noteItem);
        });
    }
}

// 工具函数

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
}

// 格式化时间
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

// 格式化日期时间
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
}

// 去除HTML标签
function stripHtml(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
}

// HTML转Markdown
function htmlToMarkdown(html) {
    // 简单的HTML转Markdown
    let markdown = html;
    
    // 标题
    markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n');
    markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n');
    markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n');
    
    // 段落
    markdown = markdown.replace(/<p>(.*?)<\/p>/g, '$1\n\n');
    
    // 列表
    markdown = markdown.replace(/<ul>(.*?)<\/ul>/gs, function(match, content) {
        const items = content.match(/<li>(.*?)<\/li>/g).map(item => {
            return '* ' + stripHtml(item) + '\n';
        }).join('');
        return items + '\n';
    });
    
    markdown = markdown.replace(/<ol>(.*?)<\/ol>/gs, function(match, content) {
        const items = content.match(/<li>(.*?)<\/li>/g).map((item, index) => {
            return (index + 1) + '. ' + stripHtml(item) + '\n';
        }).join('');
        return items + '\n';
    });
    
    // 粗体和斜体
    markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
    markdown = markdown.replace(/<b>(.*?)<\/b>/g, '**$1**');
    markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*');
    markdown = markdown.replace(/<i>(.*?)<\/i>/g, '*$1*');
    
    // 链接
    markdown = markdown.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)');
    
    // 去除其他标签
    markdown = stripHtml(markdown);
    
    return markdown;
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
    document.addEventListener('DOMContentLoaded', initNotesPage);
} else {
    initNotesPage();
}
