const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

class DataManager {
  constructor() {
    this.dataDir = path.join(__dirname, '../../data');
    this.backupDir = path.join(__dirname, '../../backups');
    this.memoryStorage = {
      courses: [],
      materials: [],
      notes: []
    };
    this.useMemoryStorage = false;
    this.ensureDirectories();
  }

  // 确保目录存在
  ensureDirectories() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
        console.log(`Created data directory: ${this.dataDir}`);
      }
      if (!fs.existsSync(this.backupDir)) {
        fs.mkdirSync(this.backupDir, { recursive: true });
        console.log(`Created backup directory: ${this.backupDir}`);
      }
      this.useMemoryStorage = false;
    } catch (error) {
      console.warn('Failed to create directories:', error.message);
      console.warn('Switching to memory storage mode');
      this.useMemoryStorage = true;
    }
  }

  // 备份所有数据
  backupAllData() {
    try {
      if (this.useMemoryStorage) {
        console.warn('Running in memory storage mode, backup functionality limited');
        return {
          success: true,
          message: '备份成功（内存模式）',
          filename: `backup_memory_${Date.now()}.json`,
          timestamp: new Date().toISOString()
        };
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFilename = `backup_${timestamp}.json.gz`;
      const backupPath = path.join(this.backupDir, backupFilename);

      // 读取所有数据
      const allData = this.getAllData();
      const dataString = JSON.stringify(allData, null, 2);

      // 压缩并写入备份文件
      const compressedData = zlib.gzipSync(dataString);
      fs.writeFileSync(backupPath, compressedData);

      // 清理旧备份（保留最近10个）
      this.cleanupOldBackups();

      return {
        success: true,
        message: '备份成功',
        filename: backupFilename,
        path: backupPath,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('备份失败:', error);
      return {
        success: false,
        message: '备份失败',
        error: error.message
      };
    }
  }

  // 恢复数据
  restoreData(backupFilename) {
    try {
      if (this.useMemoryStorage) {
        return {
          success: false,
          message: '内存存储模式下不支持恢复操作'
        };
      }

      const backupPath = path.join(this.backupDir, backupFilename);

      if (!fs.existsSync(backupPath)) {
        return {
          success: false,
          message: '备份文件不存在'
        };
      }

      // 读取并解压备份文件
      const compressedData = fs.readFileSync(backupPath);
      const dataString = zlib.gunzipSync(compressedData).toString();
      const backupData = JSON.parse(dataString);

      // 写入数据
      this.writeAllData(backupData);

      return {
        success: true,
        message: '恢复成功',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('恢复失败:', error);
      return {
        success: false,
        message: '恢复失败',
        error: error.message
      };
    }
  }

  // 获取所有数据
  getAllData() {
    if (this.useMemoryStorage) {
      return this.memoryStorage;
    }

    const data = {
      courses: this.getData('courses'),
      materials: this.getData('materials'),
      notes: this.getData('notes')
    };
    return data;
  }

  // 写入所有数据
  writeAllData(data) {
    if (this.useMemoryStorage) {
      if (data.courses) this.memoryStorage.courses = data.courses;
      if (data.materials) this.memoryStorage.materials = data.materials;
      if (data.notes) this.memoryStorage.notes = data.notes;
      return;
    }

    if (data.courses) {
      this.writeData('courses', data.courses);
    }
    if (data.materials) {
      this.writeData('materials', data.materials);
    }
    if (data.notes) {
      this.writeData('notes', data.notes);
    }
  }

  // 获取特定类型的数据
  getData(type) {
    if (this.useMemoryStorage) {
      return this.memoryStorage[type] || [];
    }

    const typeDir = path.join(this.dataDir, type);
    if (!fs.existsSync(typeDir)) {
      return [];
    }

    try {
      const files = fs.readdirSync(typeDir);
      return files.map(file => {
        const filePath = path.join(typeDir, file);
        const fileData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileData);
      });
    } catch (error) {
      console.error(`读取${type}数据失败:`, error);
      console.warn(`Switching to memory storage for ${type}`);
      this.useMemoryStorage = true;
      return this.memoryStorage[type] || [];
    }
  }

  // 写入特定类型的数据
  writeData(type, items) {
    if (this.useMemoryStorage) {
      this.memoryStorage[type] = items;
      return;
    }

    try {
      const typeDir = path.join(this.dataDir, type);
      if (!fs.existsSync(typeDir)) {
        fs.mkdirSync(typeDir, { recursive: true });
      }

      // 清空目录
      const files = fs.readdirSync(typeDir);
      files.forEach(file => {
        try {
          fs.unlinkSync(path.join(typeDir, file));
        } catch (error) {
          console.warn(`Failed to delete file ${file}:`, error.message);
        }
      });

      // 写入新数据
      items.forEach(item => {
        if (item.id) {
          try {
            const filePath = path.join(typeDir, `${item.id}.json`);
            fs.writeFileSync(filePath, JSON.stringify(item, null, 2));
          } catch (error) {
            console.warn(`Failed to write file for item ${item.id}:`, error.message);
          }
        }
      });
    } catch (error) {
      console.error(`写入${type}数据失败:`, error);
      console.warn(`Switching to memory storage for ${type}`);
      this.useMemoryStorage = true;
      this.memoryStorage[type] = items;
    }
  }

  // 清理旧备份
  cleanupOldBackups() {
    if (this.useMemoryStorage) return;

    try {
      const files = fs.readdirSync(this.backupDir)
        .map(file => {
          try {
            return {
              name: file,
              time: fs.statSync(path.join(this.backupDir, file)).mtime.getTime()
            };
          } catch (error) {
            console.warn(`Failed to stat file ${file}:`, error.message);
            return null;
          }
        })
        .filter(Boolean)
        .sort((a, b) => b.time - a.time);

      // 保留最近10个备份
      const backupsToDelete = files.slice(10);
      backupsToDelete.forEach(backup => {
        try {
          const backupPath = path.join(this.backupDir, backup.name);
          fs.unlinkSync(backupPath);
        } catch (error) {
          console.warn(`Failed to delete backup ${backup.name}:`, error.message);
        }
      });
    } catch (error) {
      console.error('清理备份失败:', error);
    }
  }

  // 导出数据为JSON文件
  exportData() {
    try {
      if (this.useMemoryStorage) {
        console.warn('Running in memory storage mode, export functionality limited');
        return {
          success: true,
          message: '导出成功（内存模式）',
          filename: `export_memory_${Date.now()}.json`,
          timestamp: new Date().toISOString()
        };
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const exportFilename = `export_${timestamp}.json`;
      const exportPath = path.join(this.backupDir, exportFilename);

      const allData = this.getAllData();
      fs.writeFileSync(exportPath, JSON.stringify(allData, null, 2));

      return {
        success: true,
        message: '导出成功',
        filename: exportFilename,
        path: exportPath,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('导出失败:', error);
      return {
        success: false,
        message: '导出失败',
        error: error.message
      };
    }
  }

  // 导入数据
  importData(importPath) {
    try {
      if (this.useMemoryStorage) {
        return {
          success: false,
          message: '内存存储模式下不支持导入操作'
        };
      }

      if (!fs.existsSync(importPath)) {
        return {
          success: false,
          message: '导入文件不存在'
        };
      }

      const importData = JSON.parse(fs.readFileSync(importPath, 'utf8'));
      this.writeAllData(importData);

      return {
        success: true,
        message: '导入成功',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('导入失败:', error);
      return {
        success: false,
        message: '导入失败',
        error: error.message
      };
    }
  }

  // 获取备份列表
  getBackupList() {
    if (this.useMemoryStorage) {
      return [];
    }

    try {
      const files = fs.readdirSync(this.backupDir)
        .map(file => {
          try {
            const filePath = path.join(this.backupDir, file);
            const stats = fs.statSync(filePath);
            return {
              name: file,
              time: stats.mtime,
              size: stats.size
            };
          } catch (error) {
            console.warn(`Failed to stat file ${file}:`, error.message);
            return null;
          }
        })
        .filter(Boolean)
        .sort((a, b) => b.time - a.time);

      return files;
    } catch (error) {
      console.error('获取备份列表失败:', error);
      return [];
    }
  }

  // 删除备份
  deleteBackup(backupFilename) {
    if (this.useMemoryStorage) {
      return {
        success: false,
        message: '内存存储模式下不支持删除操作'
      };
    }

    try {
      const backupPath = path.join(this.backupDir, backupFilename);
      if (fs.existsSync(backupPath)) {
        fs.unlinkSync(backupPath);
        return {
          success: true,
          message: '备份删除成功'
        };
      }
      return {
        success: false,
        message: '备份文件不存在'
      };
    } catch (error) {
      console.error('删除备份失败:', error);
      return {
        success: false,
        message: '删除备份失败',
        error: error.message
      };
    }
  }
}

// 自动备份功能
class AutoBackup {
  constructor(dataManager, interval = 24 * 60 * 60 * 1000) { // 默认24小时
    this.dataManager = dataManager;
    this.interval = interval;
    this.timer = null;
  }

  start() {
    // 在Serverless环境中，定时器可能不持久，所以我们只在开发环境中启动
    if (process.env.NODE_ENV === 'production') {
      console.log('Running in production environment, auto backup disabled (Serverless limitations)');
      return;
    }

    this.stop(); // 先停止之前的定时器
    this.timer = setInterval(() => {
      console.log('执行自动备份...');
      const result = this.dataManager.backupAllData();
      if (result.success) {
        console.log('自动备份成功:', result.filename);
      } else {
        console.error('自动备份失败:', result.message);
      }
    }, this.interval);
    console.log(`自动备份已启动，间隔: ${this.interval / (1000 * 60 * 60)}小时`);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log('自动备份已停止');
    }
  }

  setInterval(interval) {
    this.interval = interval;
    this.start(); // 重启定时器
  }
}

// 导出实例
const dataManager = new DataManager();
const autoBackup = new AutoBackup(dataManager);

module.exports = {
  dataManager,
  autoBackup,
  DataManager,
  AutoBackup
};
