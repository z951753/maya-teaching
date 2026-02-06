const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// 导入数据管理功能
const { dataManager, autoBackup } = require('./server/utils/dataManager');

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 中间件配置
app.use(cors({
  origin: '*', // 生产环境应设置具体域名
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 日志配置
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 确保必要目录存在
function ensureDirectories() {
  // 获取系统临时目录
  const tempDir = process.env.TMPDIR || process.env.TEMP || process.env.TMP || '/tmp';
  
  const requiredDirs = [
    path.join(tempDir, 'maya-teaching', 'temp'),
    path.join(__dirname, 'data'),
    path.join(__dirname, 'backups'),
    path.join(__dirname, 'public', 'uploads')
  ];

  requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      } catch (error) {
        console.warn(`Failed to create directory ${dir}:`, error.message);
        // 继续执行，不阻止应用启动
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
const uploadOptions = {
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  useTempFiles: true,
  tempFileDir: dirs.tempDir,
  createParentPath: true,
  safeFileNames: true,
  preserveExtension: true
};

try {
  app.use(fileUpload(uploadOptions));
  console.log('File upload middleware initialized successfully');
} catch (error) {
  console.warn('Failed to initialize file upload middleware:', error.message);
  // 继续执行，不阻止应用启动
  app.use((req, res, next) => {
    req.files = {};
    next();
  });
}

// 静态文件服务
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// 路由配置
const routes = {
  courses: require('./server/routes/courses'),
  materials: require('./server/routes/materials'),
  notes: require('./server/routes/notes'),
  maya: require('./server/routes/maya'),
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
    
    case 'auto-backup-start':
      autoBackup.start();
      res.json({ success: true, message: '自动备份已启动' });
      break;
    
    case 'auto-backup-stop':
      autoBackup.stop();
      res.json({ success: true, message: '自动备份已停止' });
      break;
    
    case 'auto-backup-status':
      res.json({ 
        success: true, 
        data: {
          running: autoBackup.timer !== null,
          interval: autoBackup.interval
        }
      });
      break;
    
    default:
      res.json({ success: false, message: '无效的操作' });
  }
});

// 备份文件下载
app.get('/api/backups/:filename', (req, res) => {
  const { filename } = req.params;
  const backupPath = path.join(__dirname, 'backups', filename);
  
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
  res.status(404).json({ message: '接口不存在' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误' });
});

// 启动服务器
app.listen(PORT, () => {
  const serverUrl = NODE_ENV === 'production' 
    ? `服务器运行在端口 ${PORT}` 
    : `Maya教学服务器运行在 http://localhost:${PORT}`;
  
  console.log(serverUrl);
  console.log(`环境: ${NODE_ENV}`);
  console.log(`数据目录: ${path.join(__dirname, 'data')}`);
  console.log(`备份目录: ${path.join(__dirname, 'backups')}`);
  
  // 启动自动备份
  console.log('启动自动备份服务...');
  autoBackup.start();
  
  // 执行初始备份
  console.log('执行初始备份...');
  setTimeout(() => {
    const initialBackup = dataManager.backupAllData();
    if (initialBackup.success) {
      console.log('初始备份成功:', initialBackup.filename);
    } else {
      console.error('初始备份失败:', initialBackup.message);
    }
  }, 2000); // 延迟执行，确保目录已创建
});

module.exports = app;