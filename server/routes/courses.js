const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const coursesDir = path.join(__dirname, '../../data/courses');

// 确保课程目录存在
if (!fs.existsSync(coursesDir)) {
  fs.mkdirSync(coursesDir, { recursive: true });
}

// 获取所有课程
router.get('/', (req, res) => {
  try {
    const files = fs.readdirSync(coursesDir);
    const courses = files.map(file => {
      const courseData = fs.readFileSync(path.join(coursesDir, file), 'utf8');
      return JSON.parse(courseData);
    });
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: '读取课程失败' });
  }
});

// 获取单个课程
router.get('/:id', (req, res) => {
  try {
    const courseId = req.params.id;
    const filePath = path.join(coursesDir, `${courseId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: '课程不存在' });
    }
    
    const courseData = fs.readFileSync(filePath, 'utf8');
    res.json({ success: true, data: JSON.parse(courseData) });
  } catch (error) {
    res.status(500).json({ success: false, message: '读取课程失败' });
  }
});

// 创建课程
router.post('/', (req, res) => {
  try {
    const courseData = req.body;
    const courseId = `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const course = {
      id: courseId,
      title: courseData.title,
      description: courseData.description,
      category: courseData.category || '默认',
      tags: courseData.tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      outline: courseData.outline || [],
      materials: courseData.materials || [],
      notes: courseData.notes || []
    };
    
    fs.writeFileSync(path.join(coursesDir, `${courseId}.json`), JSON.stringify(course, null, 2));
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: '创建课程失败' });
  }
});

// 更新课程
router.put('/:id', (req, res) => {
  try {
    const courseId = req.params.id;
    const filePath = path.join(coursesDir, `${courseId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: '课程不存在' });
    }
    
    const existingCourse = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const updatedCourse = {
      ...existingCourse,
      ...req.body,
      updated_at: new Date().toISOString()
    };
    
    fs.writeFileSync(filePath, JSON.stringify(updatedCourse, null, 2));
    res.json({ success: true, data: updatedCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: '更新课程失败' });
  }
});

// 删除课程
router.delete('/:id', (req, res) => {
  try {
    const courseId = req.params.id;
    const filePath = path.join(coursesDir, `${courseId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: '课程不存在' });
    }
    
    fs.unlinkSync(filePath);
    res.json({ success: true, message: '课程删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除课程失败' });
  }
});

module.exports = router;