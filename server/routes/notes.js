const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const notesDir = path.join(__dirname, '../../data/notes');

// 确保笔记目录存在
if (!fs.existsSync(notesDir)) {
  fs.mkdirSync(notesDir, { recursive: true });
}

// 获取所有笔记
router.get('/', (req, res) => {
  try {
    const files = fs.readdirSync(notesDir);
    const notes = files.map(file => {
      const noteData = fs.readFileSync(path.join(notesDir, file), 'utf8');
      return JSON.parse(noteData);
    });
    res.json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: '读取笔记失败' });
  }
});

// 获取单个笔记
router.get('/:id', (req, res) => {
  try {
    const noteId = req.params.id;
    const filePath = path.join(notesDir, `${noteId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: '笔记不存在' });
    }
    
    const noteData = fs.readFileSync(filePath, 'utf8');
    res.json({ success: true, data: JSON.parse(noteData) });
  } catch (error) {
    res.status(500).json({ success: false, message: '读取笔记失败' });
  }
});

// 创建笔记
router.post('/', (req, res) => {
  try {
    const noteData = req.body;
    const noteId = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const note = {
      id: noteId,
      title: noteData.title,
      content: noteData.content || '',
      category: noteData.category || '默认',
      tags: noteData.tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      related_courses: noteData.related_courses || [],
      related_materials: noteData.related_materials || []
    };
    
    fs.writeFileSync(path.join(notesDir, `${noteId}.json`), JSON.stringify(note, null, 2));
    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: '创建笔记失败' });
  }
});

// 更新笔记
router.put('/:id', (req, res) => {
  try {
    const noteId = req.params.id;
    const filePath = path.join(notesDir, `${noteId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: '笔记不存在' });
    }
    
    const existingNote = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const updatedNote = {
      ...existingNote,
      ...req.body,
      updated_at: new Date().toISOString()
    };
    
    fs.writeFileSync(filePath, JSON.stringify(updatedNote, null, 2));
    res.json({ success: true, data: updatedNote });
  } catch (error) {
    res.status(500).json({ success: false, message: '更新笔记失败' });
  }
});

// 删除笔记
router.delete('/:id', (req, res) => {
  try {
    const noteId = req.params.id;
    const filePath = path.join(notesDir, `${noteId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: '笔记不存在' });
    }
    
    fs.unlinkSync(filePath);
    res.json({ success: true, message: '笔记删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除笔记失败' });
  }
});

// 搜索笔记
router.get('/search', (req, res) => {
  try {
    const keyword = req.query.keyword || '';
    const files = fs.readdirSync(notesDir);
    const filteredNotes = files.map(file => {
      const noteData = fs.readFileSync(path.join(notesDir, file), 'utf8');
      return JSON.parse(noteData);
    }).filter(note => {
      return note.title.includes(keyword) || 
             note.content.includes(keyword) ||
             note.tags.some(tag => tag.includes(keyword));
    });
    
    res.json({ success: true, data: filteredNotes });
  } catch (error) {
    res.status(500).json({ success: false, message: '搜索笔记失败' });
  }
});

module.exports = router;