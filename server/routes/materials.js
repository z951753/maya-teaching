const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const materialsDir = path.join(__dirname, '../../data/materials');
const uploadsDir = path.join(__dirname, '../../public/uploads');

// 确保目录存在
if (!fs.existsSync(materialsDir)) {
  fs.mkdirSync(materialsDir, { recursive: true });
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 获取所有资料
router.get('/', (req, res) => {
  try {
    const files = fs.readdirSync(materialsDir);
    const materials = files.map(file => {
      const materialData = fs.readFileSync(path.join(materialsDir, file), 'utf8');
      return JSON.parse(materialData);
    });
    res.json({ success: true, data: materials });
  } catch (error) {
    res.status(500).json({ success: false, message: '读取资料失败' });
  }
});

// 获取单个资料
router.get('/:id', (req, res) => {
  try {
    const materialId = req.params.id;
    const filePath = path.join(materialsDir, `${materialId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: '资料不存在' });
    }
    
    const materialData = fs.readFileSync(filePath, 'utf8');
    res.json({ success: true, data: JSON.parse(materialData) });
  } catch (error) {
    res.status(500).json({ success: false, message: '读取资料失败' });
  }
});

// 上传资料
router.post('/upload', (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ success: false, message: '请选择文件' });
    }
    
    const file = req.files.file;
    const materialId = `material_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileName = `${materialId}_${file.name}`;
    const filePath = path.join(uploadsDir, fileName);
    
    // 保存文件
    file.mv(filePath, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: '文件保存失败' });
      }
      
      // 创建资料元数据
      const material = {
        id: materialId,
        name: file.name,
        filename: fileName,
        path: `/uploads/${fileName}`,
        size: file.size,
        type: file.mimetype,
        category: req.body.category || '默认',
        tags: req.body.tags ? JSON.parse(req.body.tags) : [],
        description: req.body.description || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        related_courses: req.body.related_courses ? JSON.parse(req.body.related_courses) : []
      };
      
      fs.writeFileSync(path.join(materialsDir, `${materialId}.json`), JSON.stringify(material, null, 2));
      res.json({ success: true, data: material });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '上传资料失败' });
  }
});

// 更新资料信息
router.put('/:id', (req, res) => {
  try {
    const materialId = req.params.id;
    const filePath = path.join(materialsDir, `${materialId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: '资料不存在' });
    }
    
    const existingMaterial = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const updatedMaterial = {
      ...existingMaterial,
      ...req.body,
      updated_at: new Date().toISOString()
    };
    
    fs.writeFileSync(filePath, JSON.stringify(updatedMaterial, null, 2));
    res.json({ success: true, data: updatedMaterial });
  } catch (error) {
    res.status(500).json({ success: false, message: '更新资料失败' });
  }
});

// 删除资料
router.delete('/:id', (req, res) => {
  try {
    const materialId = req.params.id;
    const filePath = path.join(materialsDir, `${materialId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: '资料不存在' });
    }
    
    // 删除文件
    const material = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (material.path) {
      const fileToDelete = path.join(uploadsDir, material.filename);
      if (fs.existsSync(fileToDelete)) {
        fs.unlinkSync(fileToDelete);
      }
    }
    
    // 删除元数据
    fs.unlinkSync(filePath);
    res.json({ success: true, message: '资料删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除资料失败' });
  }
});

// 搜索资料
router.get('/search', (req, res) => {
  try {
    const keyword = req.query.keyword || '';
    const files = fs.readdirSync(materialsDir);
    const filteredMaterials = files.map(file => {
      const materialData = fs.readFileSync(path.join(materialsDir, file), 'utf8');
      return JSON.parse(materialData);
    }).filter(material => {
      return material.name.includes(keyword) || 
             material.description.includes(keyword) ||
             material.tags.some(tag => tag.includes(keyword));
    });
    
    res.json({ success: true, data: filteredMaterials });
  } catch (error) {
    res.status(500).json({ success: false, message: '搜索资料失败' });
  }
});

module.exports = router;