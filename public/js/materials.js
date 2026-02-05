// 资料管理页面功能

// 全局变量
let materials = [];
let currentPage = 1;
const itemsPerPage = 12;
let selectedMaterialId = null;
let dragDropArea = null;
let fileInput = null;
let materialsContainer = null;
let uploadModal = null;
let detailModal = null;
let editModal = null;
let deleteModal = null;
let progressModal = null;

// 初始化
function initMaterialsPage() {
    // 初始化元素
    dragDropArea = document.getElementById('drag-drop-area');
    fileInput = document.getElementById('file-input');
    materialsContainer = document.getElementById('materials-container');
    uploadModal = document.getElementById('upload-material-modal');
    detailModal = document.getElementById('material-detail-modal');
    editModal = document.getElementById('edit-material-modal');
    deleteModal = document.getElementById('delete-confirm-modal');
    progressModal = document.getElementById('upload-progress-modal');
    
    // 绑定事件
    bindEvents();
    
    // 加载资料数据
    loadMaterials();
    
    // 初始化搜索和筛选
    initSearchAndFilter();
}

// 绑定事件
function bindEvents() {
    // 拖拽上传事件
    if (dragDropArea) {
        dragDropArea.addEventListener('dragover', handleDragOver);
        dragDropArea.addEventListener('dragleave', handleDragLeave);
        dragDropArea.addEventListener('drop', handleDrop);
        dragDropArea.addEventListener('click', handleBrowseClick);
    }
    
    // 文件输入事件
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // 上传按钮
    const uploadBtn = document.getElementById('upload-material-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', openUploadModal);
    }
    
    // 浏览文件按钮
    const browseBtn = document.getElementById('browse-files-btn');
    if (browseBtn) {
        browseBtn.addEventListener('click', handleBrowseClick);
    }
    
    // 提交上传
    const submitUploadBtn = document.getElementById('submit-upload');
    if (submitUploadBtn) {
        submitUploadBtn.addEventListener('click', handleSubmitUpload);
    }
    
    // 取消上传
    const cancelUploadBtn = document.getElementById('cancel-upload');
    if (cancelUploadBtn) {
        cancelUploadBtn.addEventListener('click', closeUploadModal);
    }
    
    // 关闭模态框
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // 关闭详情模态框
    const closeDetailBtn = document.getElementById('close-detail-modal');
    if (closeDetailBtn) {
        closeDetailBtn.addEventListener('click', closeDetailModal);
    }
    
    // 编辑资料按钮
    const editDetailBtn = document.getElementById('edit-detail-material');
    if (editDetailBtn) {
        editDetailBtn.addEventListener('click', openEditModal);
    }
    
    // 删除资料按钮
    const deleteDetailBtn = document.getElementById('delete-detail-material');
    if (deleteDetailBtn) {
        deleteDetailBtn.addEventListener('click', openDeleteModal);
    }
    
    // 取消删除
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    }
    
    // 确认删除
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', handleDeleteMaterial);
    }
    
    // 取消编辑
    const cancelEditBtn = document.getElementById('cancel-edit');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', closeEditModal);
    }
    
    // 提交编辑
    const submitEditBtn = document.getElementById('submit-edit');
    if (submitEditBtn) {
        submitEditBtn.addEventListener('click', handleSubmitEdit);
    }
}

// 拖拽事件处理
function handleDragOver(e) {
    e.preventDefault();
    dragDropArea.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    dragDropArea.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    dragDropArea.classList.remove('drag-over');
    
    if (e.dataTransfer.files.length) {
        handleFiles(e.dataTransfer.files);
        openUploadModal();
    }
}

// 浏览文件
function handleBrowseClick() {
    fileInput.click();
}

// 文件选择
function handleFileSelect(e) {
    if (e.target.files.length) {
        handleFiles(e.target.files);
    }
}

// 处理文件
function handleFiles(files) {
    const uploadPreview = document.getElementById('upload-preview');
    uploadPreview.innerHTML = '';
    
    Array.from(files).forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-preview-item';
        
        const fileIcon = document.createElement('i');
        fileIcon.className = getFileIcon(file.type);
        
        const fileInfo = document.createElement('div');
        fileInfo.className = 'file-preview-info';
        
        const fileName = document.createElement('div');
        fileName.className = 'file-preview-name';
        fileName.textContent = file.name;
        
        const fileSize = document.createElement('div');
        fileSize.className = 'file-preview-size';
        fileSize.textContent = formatFileSize(file.size);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-file-btn';
        removeBtn.textContent = '移除';
        removeBtn.addEventListener('click', function() {
            fileItem.remove();
        });
        
        fileInfo.appendChild(fileName);
        fileInfo.appendChild(fileSize);
        fileItem.appendChild(fileIcon);
        fileItem.appendChild(fileInfo);
        fileItem.appendChild(removeBtn);
        uploadPreview.appendChild(fileItem);
    });
}

// 获取文件图标
function getFileIcon(fileType) {
    if (fileType.includes('pdf')) return 'fas fa-file-pdf';
    if (fileType.includes('video')) return 'fas fa-file-video';
    if (fileType.includes('image')) return 'fas fa-file-image';
    if (fileType.includes('zip') || fileType.includes('rar')) return 'fas fa-file-archive';
    if (fileType.includes('text') || fileType.includes('document')) return 'fas fa-file-alt';
    if (fileType.includes('model') || fileType.includes('3d')) return 'fas fa-cube';
    return 'fas fa-file';
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}

// 打开上传模态框
function openUploadModal() {
    uploadModal.style.display = 'flex';
    setTimeout(() => {
        uploadModal.querySelector('.modal-content').classList.add('show');
    }, 10);
}

// 关闭上传模态框
function closeUploadModal() {
    const modalContent = uploadModal.querySelector('.modal-content');
    modalContent.classList.remove('show');
    setTimeout(() => {
        uploadModal.style.display = 'none';
    }, 300);
}

// 打开详情模态框
function openDetailModal(materialId) {
    selectedMaterialId = materialId;
    const material = materials.find(m => m.id === materialId);
    if (material) {
        // 填充详情
        document.getElementById('detail-material-name').textContent = material.name;
        document.getElementById('detail-material-description').textContent = material.description || '无描述';
        
        // 显示模态框
        detailModal.style.display = 'flex';
        setTimeout(() => {
            detailModal.querySelector('.modal-content').classList.add('show');
        }, 10);
    }
}

// 关闭详情模态框
function closeDetailModal() {
    const modalContent = detailModal.querySelector('.modal-content');
    modalContent.classList.remove('show');
    setTimeout(() => {
        detailModal.style.display = 'none';
    }, 300);
}

// 打开编辑模态框
function openEditModal() {
    if (selectedMaterialId) {
        const material = materials.find(m => m.id === materialId);
        if (material) {
            // 填充表单
            // 显示模态框
            editModal.style.display = 'flex';
            setTimeout(() => {
                editModal.querySelector('.modal-content').classList.add('show');
            }, 10);
        }
    }
}

// 关闭编辑模态框
function closeEditModal() {
    const modalContent = editModal.querySelector('.modal-content');
    modalContent.classList.remove('show');
    setTimeout(() => {
        editModal.style.display = 'none';
    }, 300);
}

// 打开删除模态框
function openDeleteModal() {
    if (selectedMaterialId) {
        const material = materials.find(m => m.id === selectedMaterialId);
        if (material) {
            document.querySelector('.delete-material-name').textContent = `文件名称：${material.name}`;
        }
        deleteModal.style.display = 'flex';
        setTimeout(() => {
            deleteModal.querySelector('.modal-content').classList.add('show');
        }, 10);
    }
}

// 关闭删除模态框
function closeDeleteModal() {
    const modalContent = deleteModal.querySelector('.modal-content');
    modalContent.classList.remove('show');
    setTimeout(() => {
        deleteModal.style.display = 'none';
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

// 处理上传提交
function handleSubmitUpload() {
    const form = document.getElementById('upload-material-form');
    const files = document.getElementById('upload-file').files;
    
    if (files.length === 0) {
        alert('请选择要上传的文件');
        return;
    }
    
    // 显示上传进度
    openProgressModal();
    
    // 模拟上传过程
    simulateUpload(files);
}

// 打开进度模态框
function openProgressModal() {
    progressModal.style.display = 'flex';
    setTimeout(() => {
        progressModal.querySelector('.modal-content').classList.add('show');
    }, 10);
}

// 模拟上传
function simulateUpload(files) {
    let currentFileIndex = 0;
    let totalProgress = 0;
    const totalFiles = files.length;
    
    function uploadNextFile() {
        if (currentFileIndex >= totalFiles) {
            // 上传完成
            setTimeout(() => {
                closeProgressModal();
                closeUploadModal();
                showNotification('上传成功', 'success');
                loadMaterials();
            }, 500);
            return;
        }
        
        const file = files[currentFileIndex];
        let progress = 0;
        
        document.getElementById('progress-file').textContent = `正在上传：${file.name}`;
        
        const interval = setInterval(() => {
            progress += 5;
            totalProgress = ((currentFileIndex * 100) + progress) / totalFiles;
            
            updateProgress(Math.min(progress, 100), Math.min(totalProgress, 100), file.name);
            
            if (progress >= 100) {
                clearInterval(interval);
                currentFileIndex++;
                setTimeout(uploadNextFile, 300);
            }
        }, 100);
    }
    
    uploadNextFile();
}

// 更新进度
function updateProgress(fileProgress, totalProgress, fileName) {
    const progressFill = document.querySelector('.progress-fill');
    const progressPercentage = document.getElementById('progress-percentage');
    const progressFile = document.getElementById('progress-file');
    
    progressFill.style.width = totalProgress + '%';
    progressFill.textContent = Math.round(totalProgress) + '%';
    progressPercentage.textContent = Math.round(totalProgress) + '%';
    progressFile.textContent = `正在上传：${fileName}`;
}

// 关闭进度模态框
function closeProgressModal() {
    const modalContent = progressModal.querySelector('.modal-content');
    modalContent.classList.remove('show');
    setTimeout(() => {
        progressModal.style.display = 'none';
    }, 300);
}

// 处理删除资料
function handleDeleteMaterial() {
    if (selectedMaterialId) {
        // 模拟删除
        materials = materials.filter(m => m.id !== selectedMaterialId);
        saveMaterials();
        closeDeleteModal();
        closeDetailModal();
        showNotification('资料已删除', 'success');
        loadMaterials();
    }
}

// 处理编辑提交
function handleSubmitEdit() {
    if (selectedMaterialId) {
        // 模拟编辑
        closeEditModal();
        showNotification('资料已更新', 'success');
        loadMaterials();
    }
}

// 加载资料数据
function loadMaterials() {
    // 从本地存储加载或使用默认数据
    const storedMaterials = localStorage.getItem('mayaMaterials');
    
    if (storedMaterials) {
        materials = JSON.parse(storedMaterials);
    } else {
        // 默认数据
        materials = [
            {
                id: 'mat_1',
                name: 'Maya建模基础教程.pdf',
                description: '详细介绍Maya多边形建模的基本技巧和工作流程',
                category: '教程',
                type: 'pdf',
                size: '2.5 MB',
                date: '2026-02-05',
                tags: ['建模', '基础'],
                filePath: 'materials/Maya建模基础教程.pdf'
            },
            {
                id: 'mat_2',
                name: '角色绑定教程.mp4',
                description: 'Maya角色绑定的完整工作流程教程',
                category: '视频',
                type: 'video',
                size: '150 MB',
                date: '2026-02-04',
                tags: ['动画', '绑定'],
                filePath: 'materials/角色绑定教程.mp4'
            },
            {
                id: 'mat_3',
                name: '材质参考图片.zip',
                description: '常用PBR材质纹理参考图片集合',
                category: '材质',
                type: 'zip',
                size: '35 MB',
                date: '2026-02-03',
                tags: ['材质', 'PBR'],
                filePath: 'materials/材质参考图片.zip'
            },
            {
                id: 'mat_4',
                name: '科幻场景模型.fbx',
                description: '高质量的科幻场景3D模型',
                category: '模型',
                type: '3d',
                size: '85 MB',
                date: '2026-02-02',
                tags: ['模型', '科幻'],
                filePath: 'materials/科幻场景模型.fbx'
            }
        ];
        saveMaterials();
    }
    
    renderMaterials();
}

// 保存资料数据
function saveMaterials() {
    localStorage.setItem('mayaMaterials', JSON.stringify(materials));
}

// 渲染资料列表
function renderMaterials() {
    const container = document.getElementById('materials-container');
    container.innerHTML = '';
    
    materials.forEach(material => {
        const card = createMaterialCard(material);
        container.appendChild(card);
    });
}

// 创建资料卡片
function createMaterialCard(material) {
    const card = document.createElement('div');
    card.className = 'material-card';
    
    const iconClass = getFileIconByType(material.type);
    
    card.innerHTML = `
        <div class="material-icon">
            <i class="${iconClass}"></i>
        </div>
        <div class="material-content">
            <h3>${material.name}</h3>
            <p>${material.description}</p>
            <div class="material-meta">
                <span class="category">${material.category}</span>
                <span class="size">${material.size}</span>
                <span class="date">${material.date}</span>
            </div>
            <div class="material-tags">
                ${material.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="material-actions">
                ${material.type === 'pdf' ? `
                    <button class="btn btn-sm btn-primary view-material" data-id="${material.id}">
                        <i class="fas fa-eye"></i> 预览
                    </button>
                ` : material.type === 'video' ? `
                    <button class="btn btn-sm btn-primary view-material" data-id="${material.id}">
                        <i class="fas fa-play"></i> 播放
                    </button>
                ` : `
                    <button class="btn btn-sm btn-primary download-material" data-id="${material.id}">
                        <i class="fas fa-download"></i> 下载
                    </button>
                `}
                <button class="btn btn-sm btn-secondary edit-material" data-id="${material.id}">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="btn btn-sm btn-danger delete-material" data-id="${material.id}">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </div>
        </div>
    `;
    
    // 绑定事件
    card.querySelector('.view-material').addEventListener('click', function() {
        openDetailModal(material.id);
    });
    
    card.querySelector('.edit-material').addEventListener('click', function() {
        selectedMaterialId = material.id;
        openEditModal();
    });
    
    card.querySelector('.delete-material').addEventListener('click', function() {
        selectedMaterialId = material.id;
        openDeleteModal();
    });
    
    if (card.querySelector('.download-material')) {
        card.querySelector('.download-material').addEventListener('click', function() {
            simulateDownload(material);
        });
    }
    
    return card;
}

// 根据类型获取文件图标
function getFileIconByType(type) {
    switch(type) {
        case 'pdf': return 'fas fa-file-pdf';
        case 'video': return 'fas fa-file-video';
        case 'image': return 'fas fa-file-image';
        case 'zip': return 'fas fa-file-archive';
        case '3d': return 'fas fa-cube';
        default: return 'fas fa-file';
    }
}

// 模拟下载
function simulateDownload(material) {
    showNotification(`正在下载：${material.name}`, 'info');
    setTimeout(() => {
        showNotification('下载完成', 'success');
    }, 2000);
}

// 初始化搜索和筛选
function initSearchAndFilter() {
    const searchInput = document.getElementById('material-search');
    const categorySelect = document.getElementById('material-category');
    const typeSelect = document.getElementById('material-type');
    const sortSelect = document.getElementById('material-sort');
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchAndFilter);
    }
    
    if (categorySelect) {
        categorySelect.addEventListener('change', handleSearchAndFilter);
    }
    
    if (typeSelect) {
        typeSelect.addEventListener('change', handleSearchAndFilter);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSearchAndFilter);
    }
}

// 处理搜索和筛选
function handleSearchAndFilter() {
    const searchTerm = document.getElementById('material-search').value.toLowerCase();
    const category = document.getElementById('material-category').value;
    const type = document.getElementById('material-type').value;
    const sortBy = document.getElementById('material-sort').value;
    
    let filteredMaterials = materials.filter(material => {
        const matchesSearch = material.name.toLowerCase().includes(searchTerm) || 
                            material.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || material.category === category;
        const matchesType = !type || material.type === type;
        
        return matchesSearch && matchesCategory && matchesType;
    });
    
    // 排序
    filteredMaterials.sort((a, b) => {
        switch(sortBy) {
            case 'name': return a.name.localeCompare(b.name);
            case 'size': return parseFileSize(a.size) - parseFileSize(b.size);
            case 'created_at':
            default: return new Date(b.date) - new Date(a.date);
        }
    });
    
    // 渲染筛选结果
    const container = document.getElementById('materials-container');
    container.innerHTML = '';
    
    filteredMaterials.forEach(material => {
        const card = createMaterialCard(material);
        container.appendChild(card);
    });
}

// 解析文件大小
function parseFileSize(sizeStr) {
    const parts = sizeStr.split(' ');
    const size = parseFloat(parts[0]);
    const unit = parts[1];
    
    switch(unit) {
        case 'GB': return size * 1024 * 1024 * 1024;
        case 'MB': return size * 1024 * 1024;
        case 'KB': return size * 1024;
        default: return size;
    }
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
    document.addEventListener('DOMContentLoaded', initMaterialsPage);
} else {
    initMaterialsPage();
}
