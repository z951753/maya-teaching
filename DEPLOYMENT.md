# Maya教学平台部署指南

本指南将帮助你免费部署Maya教学平台到Render.com，这是一个提供免费Web服务的云平台。

## 部署准备

### 1. 创建GitHub仓库

1. 登录你的GitHub账户
2. 点击右上角的「+」按钮，选择「New repository」
3. 填写仓库信息：
   - **Repository name**: maya-teaching
   - **Description**: Maya三维动画讲课网站，用于整理备课资料
   - **Visibility**: Public（必须设置为公开，以便Render.com访问）
   - 勾选「Add a README file」
   - 点击「Create repository」

### 2. 推送代码到GitHub

1. **复制仓库URL**：在新创建的仓库页面，点击「Code」按钮，复制HTTPS URL（类似 `https://github.com/yourusername/maya-teaching.git`）

2. **打开命令行工具**（PowerShell或Git Bash），执行以下命令：

```bash
# 进入项目目录
cd C:\Users\24142\Desktop\wwzq\maya-teaching

# 初始化Git仓库（如果尚未初始化）
git init

# 添加远程仓库
git remote add origin https://github.com/yourusername/maya-teaching.git

# 检查状态
git status

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: Maya teaching platform"

# 推送到GitHub
git push -u origin main
```

## Render.com部署

### 1. 注册Render.com账户

1. 访问 [Render.com](https://render.com)
2. 点击「Sign Up」按钮
3. 使用GitHub账户登录（推荐，便于后续连接仓库）

### 2. 创建Web服务

1. 登录后，点击「New」按钮，选择「Web Service」
2. 在「Connect a Repository」页面：
   - 找到并选择你的「maya-teaching」仓库
   - 点击「Connect」按钮

### 3. 配置服务

在「Create Web Service」页面，填写以下配置：

- **Name**: maya-teaching
- **Region**: Oregon (US)（选择靠近你的地区）
- **Branch**: main
- **Root Directory**: 留空（默认为仓库根目录）
- **Runtime**: Node
- **Build Command**: npm install
- **Start Command**: npm start
- **Environment Variables**: 点击「Add Environment Variable」添加：
  - Key: NODE_ENV, Value: production
  - Key: PORT, Value: 3001

### 4. 配置持久化存储

1. 向下滚动到「Persistent Disk」部分
2. 勾选「Add Persistent Disk」
3. **Mount Path**: /app/data
4. **Size**: 1 GB（免费计划的最大限制）

### 5. 部署服务

1. 点击页面底部的「Create Web Service」按钮
2. Render.com将开始构建和部署你的应用
3. 等待部署完成（通常需要1-3分钟）

## 部署验证

### 1. 检查部署状态

- 部署完成后，你会看到「Deploy successful」的提示
- 服务状态应该显示为「Live」

### 2. 访问应用

- 在服务页面，复制「Service URL」（类似 `https://maya-teaching.onrender.com`）
- 在浏览器中打开这个URL，你应该能看到Maya教学平台的首页

### 3. 测试功能

- **API测试**：访问 `https://maya-teaching.onrender.com/api/courses`，应该返回 `{"success":true,"data":[]}`
- **页面测试**：点击导航栏的各个链接，确保页面能正常加载
- **数据测试**：尝试创建一个课程，确保数据能正常保存

## 常见问题排查

### 1. 部署失败

- **检查构建日志**：在Render.com的服务页面，点击「Deployments」标签，查看详细的构建日志
- **常见错误**：
  - 依赖安装失败：确保package.json文件正确
  - 端口占用：确保PORT环境变量设置为3001
  - 目录权限：确保代码中没有硬编码的绝对路径

### 2. 服务无法访问

- **检查服务状态**：确保服务状态为「Live」
- **检查日志**：点击「Logs」标签，查看服务运行日志
- **检查防火墙**：确保Render.com的IP地址没有被防火墙阻止

### 3. 数据存储问题

- **检查磁盘挂载**：确保持久化磁盘已正确挂载
- **检查目录权限**：服务日志中应该显示「Created directory」的消息
- **检查备份功能**：访问 `https://maya-teaching.onrender.com/api/data?action=backup` 测试备份功能

## 环境变量配置

如果需要修改部署环境的配置，可以在Render.com的服务页面：

1. 点击「Environment」标签
2. 修改或添加环境变量
3. 点击「Save Changes」后，服务会自动重启

## 自动部署

Render.com配置为自动部署，当你向GitHub仓库推送新代码时：

1. Render.com会自动检测到代码变更
2. 触发新的构建和部署过程
3. 部署完成后，新代码会立即生效

## 备份和恢复

### 手动备份

访问 `https://maya-teaching.onrender.com/api/data?action=backup` 可以手动创建备份

### 查看备份列表

访问 `https://maya-teaching.onrender.com/api/data?action=list-backups` 可以查看所有备份

### 下载备份

访问 `https://maya-teaching.onrender.com/api/backups/{backup_filename}` 可以下载指定的备份文件

## 性能优化建议

1. **启用CDN**：考虑使用Cloudflare等CDN服务加速静态资源
2. **数据库优化**：对于大型应用，考虑使用MongoDB Atlas等托管数据库服务
3. **缓存策略**：为静态资源设置适当的缓存头
4. **日志管理**：定期检查服务日志，确保没有异常错误

## 技术支持

如果遇到部署问题，可以：

1. 查看Render.com的[官方文档](https://render.com/docs)
2. 检查GitHub仓库的[Issues](https://github.com/yourusername/maya-teaching/issues)页面
3. 联系Render.com的[支持团队](https://render.com/support)

---

部署完成后，你就可以通过Render.com提供的URL访问和使用Maya教学平台了！
