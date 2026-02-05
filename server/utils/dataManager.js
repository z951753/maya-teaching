const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

class DataManager {
  constructor() {
    this.dataDir = path.join(__dirname, '../../data');
    this.backupDir = path.join(__dirname, '../../backups');
    this.ensureDirectories();
  }

  // 确保目录存在
  ensureDirectories() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  // 备份所有数据
  backupAllData() {
    try {
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
    const data = {
      courses: this.getData('courses'),
      materials: this.getData('materials'),
      notes: this.getData('notes')
    };
    return data;
  }

  // 写入所有数据
  writeAllData(data) {
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
      return [];
    }
  }

  // 写入特定类型的数据
  writeData(type, items) {
    const typeDir = path.join(this.dataDir, type);
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }

    // 清空目录
    const files = fs.readdirSync(typeDir);
    files.forEach(file => {
      fs.unlinkSync(path.join(typeDir, file));
    });

    // 写入新数据
    items.forEach(item => {
      if (item.id) {
        const filePath = path.join(typeDir, `${item.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(item, null, 2));
      }
    });
  }

  // 清理旧备份
  cleanupOldBackups() {
    try {
      const files = fs.readdirSync(this.backupDir)
        .map(file => ({
          name: file,
          time: fs.statSync(path.join(this.backupDir, file)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);

      // 保留最近10个备份
      const backupsToDelete = files.slice(10);
      backupsToDelete.forEach(backup => {
        const backupPath = path.join(this.backupDir, backup.name);
        fs.unlinkSync(backupPath);
      });
    } catch (error) {
      console.error('清理备份失败:', error);
    }
  }

  // 导出数据为JSON文件
  exportData() {
    try {
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
    try {
      const files = fs.readdirSync(this.backupDir)
        .map(file => ({
          name: file,
          time: fs.statSync(path.join(this.backupDir, file)).mtime,
          size: fs.statSync(path.join(this.backupDir, file)).size
        }))
        .sort((a, b) => b.time - a.time);

      return files;
    } catch (error) {
      console.error('获取备份列表失败:', error);
      return [];
    }
  }

  // 删除备份
  deleteBackup(backupFilename) {
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
