const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// 导入数据管理功能
const { dataManager, autoBackup } = require('../server/utils/dataManager');

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 中间件配置
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 确保必要目录存在
function ensureDirectories() {
  const tempDir = process.env.TMPDIR || process.env.TEMP || process.env.TMP || '/tmp';
  
  const requiredDirs = [
    path.join(tempDir, 'maya-teaching', 'temp'),
    path.join(process.cwd(), 'data'),
    path.join(process.cwd(), 'backups'),
    path.join(process.cwd(), 'public', 'uploads')
  ];

  requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      } catch (error) {
        console.warn(`Failed to create directory ${dir}:`, error.message);
      }
    }
  });
  
  return {
    tempDir: path.join(tempDir, 'maya-teaching', 'temp')
  };
}

// 初始化目录
const dirs = ensureDirectories();

// 文件上传配置
try {
  app.use(fileUpload({
    limits: {
      fileSize: 100 * 1024 * 1024, // 100MB
    },
    useTempFiles: true,
    tempFileDir: dirs.tempDir,
    createParentPath: true,
    safeFileNames: true,
    preserveExtension: true
  }));
} catch (error) {
  console.warn('Failed to initialize file upload:', error.message);
}

// 静态文件服务
app.use('/', express.static(path.join(process.cwd(), 'public')));
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// 路由配置
const routes = {
  courses: require('../server/routes/courses'),
  materials: require('../server/routes/materials'),
  notes: require('../server/routes/notes'),
  maya: require('../server/routes/maya'),
};

app.use('/api/courses', routes.courses);
app.use('/api/materials', routes.materials);
app.use('/api/notes', routes.notes);
app.use('/api/maya', routes.maya);

// 数据管理API路由
app.use('/api/data', (req, res) => {
  const { action, filename } = req.query;
  
  switch (action) {
    case 'backup':
      const backupResult = dataManager.backupAllData();
      res.json(backupResult);
      break;
    
    case 'restore':
      if (!filename) {
        res.json({ success: false, message: '请提供备份文件名' });
        return;
      }
      const restoreResult = dataManager.restoreData(filename);
      res.json(restoreResult);
      break;
    
    case 'export':
      const exportResult = dataManager.exportData();
      res.json(exportResult);
      break;
    
    case 'list-backups':
      const backups = dataManager.getBackupList();
      res.json({ success: true, data: backups });
      break;
    
    case 'delete-backup':
      if (!filename) {
        res.json({ success: false, message: '请提供备份文件名' });
        return;
      }
      const deleteResult = dataManager.deleteBackup(filename);
      res.json(deleteResult);
      break;
    
    default:
      res.json({ success: false, message: '无效的操作' });
  }
});

// 备份文件下载
app.get('/api/backups/:filename', (req, res) => {
  const { filename } = req.params;
  const backupPath = path.join(process.cwd(), 'backups', filename);
  
  if (fs.existsSync(backupPath)) {
    res.download(backupPath, filename, (err) => {
      if (err) {
        res.status(500).json({ success: false, message: '下载失败' });
      }
    });
  } else {
    res.status(404).json({ success: false, message: '备份文件不存在' });
  }
});

// 404处理
app.use((req, res) => {
  // 尝试提供静态文件
  const filePath = path.join(process.cwd(), 'public', req.path);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }
  
  // 如果是API请求，返回JSON错误
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: '接口不存在' });
  }
  
  // 否则，返回index.html（用于单页应用）
  return res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误' });
});

// 导出Vercel Serverless Function
module.exports = app;
