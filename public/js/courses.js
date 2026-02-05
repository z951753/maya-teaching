// 课程管理功能
function initCourseManagement() {
    // 初始化DOM元素
    const addCourseBtn = document.getElementById('add-course-btn');
    const courseSearch = document.getElementById('course-search');
    const courseCategory = document.getElementById('course-category');
    const courseSort = document.getElementById('course-sort');
    const coursesContainer = document.getElementById('courses-container');
    const coursePagination = document.getElementById('course-pagination');
    
    // 模态框元素
    const createCourseModal = document.getElementById('create-course-modal');
    const editCourseModal = document.getElementById('edit-course-modal');
    const courseDetailModal = document.getElementById('course-detail-modal');
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    
    // 表单元素
    const createCourseForm = document.getElementById('create-course-form');
    const editCourseForm = document.getElementById('edit-course-form');
    const addOutlineItemBtn = document.getElementById('add-outline-item');
    const outlineItems = document.getElementById('outline-items');
    const courseCover = document.getElementById('course-cover');
    const coverPreview = document.getElementById('cover-preview');
    
    // 按钮元素
    const submitCreateCourse = document.getElementById('submit-create-course');
    const cancelCreateCourse = document.getElementById('cancel-create-course');
    const submitEditCourse = document.getElementById('submit-edit-course');
    const cancelEditCourse = document.getElementById('cancel-edit-course');
    const closeDetailModal = document.getElementById('close-detail-modal');
    const editDetailCourse = document.getElementById('edit-detail-course');
    const deleteDetailCourse = document.getElementById('delete-detail-course');
    const confirmDelete = document.getElementById('confirm-delete');
    const cancelDelete = document.getElementById('cancel-delete');
    
    // 全局变量
    let currentCourseId = null;
    let courses = [];
    
    // 初始化
    function init() {
        loadCourses();
        bindEvents();
    }
    
    // 绑定事件
    function bindEvents() {
        // 新建课程按钮
        addCourseBtn.addEventListener('click', openCreateModal);
        
        // 搜索和筛选
        courseSearch.addEventListener('input', handleSearch);
        courseCategory.addEventListener('change', handleFilter);
        courseSort.addEventListener('change', handleSort);
        
        // 大纲编辑器
        addOutlineItemBtn.addEventListener('click', addOutlineItem);
        
        // 文件上传预览
        courseCover.addEventListener('change', handleFileUpload);
        
        // 模态框控制
        cancelCreateCourse.addEventListener('click', closeCreateModal);
        submitCreateCourse.addEventListener('click', createCourse);
        cancelEditCourse.addEventListener('click', closeEditModal);
        submitEditCourse.addEventListener('click', updateCourse);
        closeDetailModal.addEventListener('click', closeDetailModalFn);
        editDetailCourse.addEventListener('click', () => {
            closeDetailModalFn();
            openEditModal(currentCourseId);
        });
        deleteDetailCourse.addEventListener('click', () => {
            closeDetailModalFn();
            openDeleteModal(currentCourseId);
        });
        confirmDelete.addEventListener('click', deleteCourse);
        cancelDelete.addEventListener('click', closeDeleteModal);
        
        // 模态框关闭按钮
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // 点击模态框外部关闭
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }
    
    // 加载课程数据
    function loadCourses() {
        apiCall('/courses')
            .then(data => {
                if (data && data.success) {
                    courses = data.data;
                    renderCourses(courses);
                } else {
                    // 使用模拟数据
                    useMockData();
                }
            })
            .catch(() => {
                // 使用模拟数据
                useMockData();
            });
    }
    
    // 使用模拟数据
    function useMockData() {
        courses = [
            {
                id: 'course_1',
                title: 'Maya建模基础',
                description: '掌握多边形建模的基本技巧和工作流程，包括顶点、边、面的编辑方法',
                category: '建模',
                tags: ['多边形建模', '硬表面建模', '拓扑优化'],
                created_at: '2026-02-01T00:00:00Z',
                updated_at: '2026-02-01T00:00:00Z',
                duration: 10,
                outline: [
                    { title: '1. 课程介绍', duration: '15分钟' },
                    { title: '2. Maya界面熟悉', duration: '30分钟' },
                    { title: '3. 多边形基本操作', duration: '45分钟' },
                    { title: '4. 硬表面建模技巧', duration: '60分钟' },
                    { title: '5. 拓扑优化方法', duration: '45分钟' }
                ],
                materials: [
                    { id: 'mat_1', name: 'Maya建模基础教程.pdf', type: 'pdf' },
                    { id: 'mat_2', name: '多边形建模技巧.mp4', type: 'video' }
                ],
                notes: [
                    { id: 'note_1', title: '多边形建模常见问题', content: '整理了学生在多边形建模过程中常见的问题和解决方案' }
                ]
            },
            {
                id: 'course_2',
                title: 'Maya动画基础',
                description: '学习关键帧动画和角色动画的基本原理，掌握动画曲线编辑技巧',
                category: '动画',
                tags: ['关键帧动画', '角色动画', '动画曲线'],
                created_at: '2026-01-28T00:00:00Z',
                updated_at: '2026-01-28T00:00:00Z',
                duration: 8,
                outline: [
                    { title: '1. 动画基础概念', duration: '20分钟' },
                    { title: '2. 关键帧设置', duration: '30分钟' },
                    { title: '3. 动画曲线编辑', duration: '45分钟' },
                    { title: '4. 角色动画基础', duration: '60分钟' }
                ],
                materials: [],
                notes: []
            },
            {
                id: 'course_3',
                title: 'Maya材质与渲染',
                description: '掌握PBR材质和Arnold渲染的高级技巧，创建真实感的材质效果',
                category: '材质/渲染',
                tags: ['PBR材质', 'Arnold渲染', '真实感渲染'],
                created_at: '2026-01-25T00:00:00Z',
                updated_at: '2026-01-25T00:00:00Z',
                duration: 12,
                outline: [
                    { title: '1. 材质基础', duration: '30分钟' },
                    { title: '2. PBR材质原理', duration: '45分钟' },
                    { title: '3. Arnold渲染器介绍', duration: '30分钟' },
                    { title: '4. 渲染设置优化', duration: '60分钟' },
                    { title: '5. 材质库创建', duration: '45分钟' }
                ],
                materials: [],
                notes: []
            }
        ];
        
        renderCourses(courses);
    }
    
    // 渲染课程列表
    function renderCourses(coursesToRender) {
        coursesContainer.innerHTML = '';
        
        if (coursesToRender.length === 0) {
            coursesContainer.innerHTML = '<p class="no-courses">暂无课程，请点击「新建课程」按钮创建</p>';
            return;
        }
        
        coursesToRender.forEach(course => {
            const courseCard = createCourseCard(course);
            coursesContainer.appendChild(courseCard);
        });
    }
    
    // 创建课程卡片
    function createCourseCard(course) {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <div class="course-image">
                <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=3D%20${encodeURIComponent(course.category)}%20tutorial%20concept%2C%20Maya%20software%20interface%2C%20professional%203D%20workflow&image_size=square" alt="${course.title}">
            </div>
            <div class="course-content">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="course-meta">
                    <span class="category">${course.category}</span>
                    <span class="date">${new Date(course.created_at).toLocaleDateString()}</span>
                </div>
                <div class="course-actions">
                    <button class="btn btn-sm btn-primary view-course" data-id="${course.id}">
                        <i class="fas fa-eye"></i> 查看
                    </button>
                    <button class="btn btn-sm btn-secondary edit-course" data-id="${course.id}">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="btn btn-sm btn-danger delete-course" data-id="${course.id}">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            </div>
        `;
        
        // 绑定事件
        card.querySelector('.view-course').addEventListener('click', () => viewCourse(course.id));
        card.querySelector('.edit-course').addEventListener('click', () => openEditModal(course.id));
        card.querySelector('.delete-course').addEventListener('click', () => openDeleteModal(course.id));
        
        return card;
    }
    
    // 查看课程详情
    function viewCourse(courseId) {
        const course = courses.find(c => c.id === courseId);
        if (!course) return;
        
        currentCourseId = courseId;
        
        // 填充详情模态框
        document.getElementById('detail-course-title').textContent = course.title;
        document.getElementById('detail-course-description').textContent = course.description;
        
        // 打开模态框
        courseDetailModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // 打开创建课程模态框
    function openCreateModal() {
        // 重置表单
        createCourseForm.reset();
        outlineItems.innerHTML = `
            <div class="outline-item">
                <input type="text" placeholder="章节标题">
                <input type="text" placeholder="时长 (如：45分钟)">
                <button type="button" class="btn btn-sm btn-danger remove-outline-item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        coverPreview.querySelector('img').src = '';
        coverPreview.querySelector('img').style.display = 'none';
        
        // 绑定大纲项删除事件
        bindOutlineItemEvents();
        
        // 打开模态框
        createCourseModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // 关闭创建课程模态框
    function closeCreateModal() {
        createCourseModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // 打开编辑课程模态框
    function openEditModal(courseId) {
        const course = courses.find(c => c.id === courseId);
        if (!course) return;
        
        currentCourseId = courseId;
        
        // 填充表单
        editCourseForm.innerHTML = `
            <div class="form-group">
                <label for="edit-course-title">课程名称 *</label>
                <input type="text" id="edit-course-title" required placeholder="输入课程名称" value="${course.title}">
            </div>
            
            <div class="form-group">
                <label for="edit-course-description">课程描述 *</label>
                <textarea id="edit-course-description" rows="4" required placeholder="输入课程描述">${course.description}</textarea>
            </div>
            
            <div class="form-row">
                <div class="form-group col-md-6">
                    <label for="edit-course-category">课程分类 *</label>
                    <select id="edit-course-category" required>
                        <option value="">选择分类</option>
                        <option value="建模" ${course.category === '建模' ? 'selected' : ''}>建模</option>
                        <option value="动画" ${course.category === '动画' ? 'selected' : ''}>动画</option>
                        <option value="材质" ${course.category === '材质' ? 'selected' : ''}>材质</option>
                        <option value="灯光" ${course.category === '灯光' ? 'selected' : ''}>灯光</option>
                        <option value="渲染" ${course.category === '渲染' ? 'selected' : ''}>渲染</option>
                        <option value="特效" ${course.category === '特效' ? 'selected' : ''}>特效</option>
                    </select>
                </div>
                
                <div class="form-group col-md-6">
                    <label for="edit-course-duration">课时数</label>
                    <input type="number" id="edit-course-duration" placeholder="输入课时数" value="${course.duration || ''}">
                </div>
            </div>
            
            <div class="form-group">
                <label for="edit-course-tags">课程标签</label>
                <input type="text" id="edit-course-tags" placeholder="输入标签，用逗号分隔" value="${course.tags ? course.tags.join(', ') : ''}">
            </div>
            
            <div class="form-group">
                <label for="edit-course-outline">课程大纲</label>
                <div class="outline-editor">
                    <div class="outline-header">
                        <h4>课程大纲</h4>
                        <button type="button" class="btn btn-sm btn-primary" id="edit-add-outline-item">
                            <i class="fas fa-plus"></i> 添加章节
                        </button>
                    </div>
                    <div class="outline-items" id="edit-outline-items">
                        ${course.outline ? course.outline.map(item => `
                            <div class="outline-item">
                                <input type="text" placeholder="章节标题" value="${item.title}">
                                <input type="text" placeholder="时长 (如：45分钟)" value="${item.duration}">
                                <button type="button" class="btn btn-sm btn-danger remove-outline-item">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `).join('') : `
                            <div class="outline-item">
                                <input type="text" placeholder="章节标题">
                                <input type="text" placeholder="时长 (如：45分钟)">
                                <button type="button" class="btn btn-sm btn-danger remove-outline-item">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `}
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <label for="edit-course-cover">课程封面</label>
                <div class="file-upload">
                    <input type="file" id="edit-course-cover" accept="image/*">
                    <label for="edit-course-cover" class="file-upload-label">
                        <i class="fas fa-upload"></i>
                        <span>选择图片</span>
                    </label>
                    <div class="file-preview" id="edit-cover-preview">
                        <img src="" alt="封面预览" style="display: none;">
                    </div>
                </div>
            </div>
        `;
        
        // 绑定大纲编辑器事件
        document.getElementById('edit-add-outline-item').addEventListener('click', () => {
            const editOutlineItems = document.getElementById('edit-outline-items');
            const newItem = document.createElement('div');
            newItem.className = 'outline-item';
            newItem.innerHTML = `
                <input type="text" placeholder="章节标题">
                <input type="text" placeholder="时长 (如：45分钟)">
                <button type="button" class="btn btn-sm btn-danger remove-outline-item">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            editOutlineItems.appendChild(newItem);
            bindOutlineItemEvents(editOutlineItems);
        });
        
        // 绑定大纲项删除事件
        bindOutlineItemEvents(document.getElementById('edit-outline-items'));
        
        // 绑定文件上传事件
        document.getElementById('edit-course-cover').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.getElementById('edit-cover-preview').querySelector('img');
                    img.src = e.target.result;
                    img.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
        
        // 打开模态框
        editCourseModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // 关闭编辑课程模态框
    function closeEditModal() {
        editCourseModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // 关闭详情模态框
    function closeDetailModalFn() {
        courseDetailModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // 打开删除确认模态框
    function openDeleteModal(courseId) {
        const course = courses.find(c => c.id === courseId);
        if (!course) return;
        
        currentCourseId = courseId;
        document.querySelector('.delete-course-name').textContent = `课程名称：${course.title}`;
        
        deleteConfirmModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // 关闭删除确认模态框
    function closeDeleteModal() {
        deleteConfirmModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // 添加大纲项
    function addOutlineItem() {
        const newItem = document.createElement('div');
        newItem.className = 'outline-item';
        newItem.innerHTML = `
            <input type="text" placeholder="章节标题">
            <input type="text" placeholder="时长 (如：45分钟)">
            <button type="button" class="btn btn-sm btn-danger remove-outline-item">
                <i class="fas fa-trash"></i>
            </button>
        `;
        outlineItems.appendChild(newItem);
        bindOutlineItemEvents();
    }
    
    // 绑定大纲项事件
    function bindOutlineItemEvents(container = outlineItems) {
        const removeButtons = container.querySelectorAll('.remove-outline-item');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                if (container.children.length > 1) {
                    this.closest('.outline-item').remove();
                }
            });
        });
    }
    
    // 处理文件上传
    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = coverPreview.querySelector('img');
                img.src = e.target.result;
                img.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }
    
    // 创建课程
    function createCourse() {
        // 获取表单数据
        const title = document.getElementById('course-title').value;
        const description = document.getElementById('course-description').value;
        const category = document.getElementById('course-category').value;
        const duration = document.getElementById('course-duration').value;
        const tags = document.getElementById('course-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
        
        // 获取大纲
        const outline = [];
        const outlineInputs = outlineItems.querySelectorAll('.outline-item');
        outlineInputs.forEach(item => {
            const title = item.querySelector('input:nth-child(1)').value;
            const duration = item.querySelector('input:nth-child(2)').value;
            if (title) {
                outline.push({ title, duration });
            }
        });
        
        // 验证
        if (!title || !description || !category) {
            alert('请填写必填字段');
            return;
        }
        
        // 创建课程对象
        const newCourse = {
            id: `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title,
            description,
            category,
            tags,
            duration: parseInt(duration) || null,
            outline,
            materials: [],
            notes: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        // 添加到课程列表
        courses.unshift(newCourse);
        
        // 重新渲染
        renderCourses(courses);
        
        // 关闭模态框
        closeCreateModal();
        
        // 显示成功消息
        showMessage('课程创建成功', 'success');
    }
    
    // 更新课程
    function updateCourse() {
        // 获取表单数据
        const title = document.getElementById('edit-course-title').value;
        const description = document.getElementById('edit-course-description').value;
        const category = document.getElementById('edit-course-category').value;
        const duration = document.getElementById('edit-course-duration').value;
        const tags = document.getElementById('edit-course-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
        
        // 获取大纲
        const outline = [];
        const editOutlineItems = document.getElementById('edit-outline-items');
        const outlineInputs = editOutlineItems.querySelectorAll('.outline-item');
        outlineInputs.forEach(item => {
            const title = item.querySelector('input:nth-child(1)').value;
            const duration = item.querySelector('input:nth-child(2)').value;
            if (title) {
                outline.push({ title, duration });
            }
        });
        
        // 验证
        if (!title || !description || !category) {
            alert('请填写必填字段');
            return;
        }
        
        // 更新课程
        const courseIndex = courses.findIndex(c => c.id === currentCourseId);
        if (courseIndex !== -1) {
            courses[courseIndex] = {
                ...courses[courseIndex],
                title,
                description,
                category,
                tags,
                duration: parseInt(duration) || null,
                outline,
                updated_at: new Date().toISOString()
            };
            
            // 重新渲染
            renderCourses(courses);
            
            // 关闭模态框
            closeEditModal();
            
            // 显示成功消息
            showMessage('课程更新成功', 'success');
        }
    }
    
    // 删除课程
    function deleteCourse() {
        // 从列表中删除
        courses = courses.filter(c => c.id !== currentCourseId);
        
        // 重新渲染
        renderCourses(courses);
        
        // 关闭模态框
        closeDeleteModal();
        
        // 显示成功消息
        showMessage('课程删除成功', 'success');
    }
    
    // 处理搜索
    function handleSearch() {
        const searchTerm = courseSearch.value.toLowerCase();
        const filteredCourses = courses.filter(course => {
            return course.title.toLowerCase().includes(searchTerm) ||
                   course.description.toLowerCase().includes(searchTerm) ||
                   course.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        });
        renderCourses(filteredCourses);
    }
    
    // 处理筛选
    function handleFilter() {
        const category = courseCategory.value;
        const searchTerm = courseSearch.value.toLowerCase();
        
        let filteredCourses = courses;
        
        if (category) {
            filteredCourses = filteredCourses.filter(course => course.category === category);
        }
        
        if (searchTerm) {
            filteredCourses = filteredCourses.filter(course => {
                return course.title.toLowerCase().includes(searchTerm) ||
                       course.description.toLowerCase().includes(searchTerm);
            });
        }
        
        renderCourses(filteredCourses);
    }
    
    // 处理排序
    function handleSort() {
        const sortBy = courseSort.value;
        const sortedCourses = [...courses].sort((a, b) => {
            if (sortBy === 'created_at') {
                return new Date(b.created_at) - new Date(a.created_at);
            } else if (sortBy === 'title') {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });
        renderCourses(sortedCourses);
    }
    
    // 显示消息
    function showMessage(text, type) {
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        document.body.appendChild(message);
        message.style.position = 'fixed';
        message.style.top = '20px';
        message.style.right = '20px';
        message.style.zIndex = '10000';
        message.style.maxWidth = '300px';
        
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 3000);
    }
    
    // 初始化
    init();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initCourseManagement);