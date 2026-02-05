const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Maya命令参考数据
const mayaCommands = [
  {
    id: 'cmd_1',
    name: 'polyCube',
    category: '建模',
    description: '创建多边形立方体',
    syntax: 'polyCube [-ax <linear linear linear>] [-cuv <int>] [-ch <boolean>] [-d <linear>] [-n <string>] [-o <boolean>] [-w <linear>] [-h <linear>] [-d <linear>]',
    example: 'polyCube -w 1 -h 1 -d 1 -n "myCube"',
    version: '所有版本'
  },
  {
    id: 'cmd_2',
    name: 'move',
    category: '变换',
    description: '移动对象',
    syntax: 'move [-a <boolean>] [-r <boolean>] [-u <boolean>] [-ws <boolean>] [-os <boolean>] [-wd <boolean>] [-rd <boolean>] [-x <linear>] [-y <linear>] [-z <linear>]',
    example: 'move -x 1 -y 2 -z 3',
    version: '所有版本'
  },
  {
    id: 'cmd_3',
    name: 'rotate',
    category: '变换',
    description: '旋转对象',
    syntax: 'rotate [-a <boolean>] [-r <boolean>] [-u <boolean>] [-ws <boolean>] [-os <boolean>] [-wd <boolean>] [-rd <boolean>] [-x <angle>] [-y <angle>] [-z <angle>]',
    example: 'rotate -x 90 -y 0 -z 0',
    version: '所有版本'
  },
  {
    id: 'cmd_4',
    name: 'scale',
    category: '变换',
    description: '缩放对象',
    syntax: 'scale [-a <boolean>] [-r <boolean>] [-u <boolean>] [-ws <boolean>] [-os <boolean>] [-wd <boolean>] [-rd <boolean>] [-x <double>] [-y <double>] [-z <double>]',
    example: 'scale -x 2 -y 2 -z 2',
    version: '所有版本'
  },
  {
    id: 'cmd_5',
    name: 'keyframe',
    category: '动画',
    description: '设置关键帧',
    syntax: 'keyframe [-animation <string>] [-breakdown <boolean>] [-controlPoints <boolean>] [-float <boolean>] [-hierarchy <string>] [-insert <boolean>] [-inTangentType <string>] [-lock <boolean>] [-name <string>] [-outTangentType <string>] [-shape <boolean>] [-time <timeRange>] [-valueChange <boolean>] [-weightChange <boolean>]',
    example: 'keyframe -t "1:10" -w 1',
    version: '所有版本'
  }
];

// Maya快捷键数据
const mayaHotkeys = [
  {
    id: 'hotkey_1',
    key: 'W',
    description: '移动工具',
    category: '变换'
  },
  {
    id: 'hotkey_2',
    key: 'E',
    description: '旋转工具',
    category: '变换'
  },
  {
    id: 'hotkey_3',
    key: 'R',
    description: '缩放工具',
    category: '变换'
  },
  {
    id: 'hotkey_4',
    key: '空格键',
    description: '工具架/视图切换',
    category: '界面'
  },
  {
    id: 'hotkey_5',
    key: 'Alt+鼠标左键',
    description: '旋转视图',
    category: '视图'
  },
  {
    id: 'hotkey_6',
    key: 'Alt+鼠标中键',
    description: '平移视图',
    category: '视图'
  },
  {
    id: 'hotkey_7',
    key: 'Alt+鼠标右键',
    description: '缩放视图',
    category: '视图'
  },
  {
    id: 'hotkey_8',
    key: 'S',
    description: '设置关键帧',
    category: '动画'
  },
  {
    id: 'hotkey_9',
    key: 'F',
    description: '聚焦选定对象',
    category: '视图'
  },
  {
    id: 'hotkey_10',
    key: 'Ctrl+Z',
    description: '撤销',
    category: '编辑'
  }
];

// Maya插件推荐
const mayaPlugins = [
  {
    id: 'plugin_1',
    name: 'Arnold',
    category: '渲染',
    description: '高端物理渲染器，支持GPU加速',
    version: '5.0+',
    download: 'https://www.arnoldrenderer.com/download/'
  },
  {
    id: 'plugin_2',
    name: 'Substance Painter',
    category: '材质',
    description: 'PBR材质绘制工具，与Maya无缝集成',
    version: '7.0+',
    download: 'https://www.substance3d.com/products/substance-painter/'
  },
  {
    id: 'plugin_3',
    name: 'ZBrush',
    category: '雕刻',
    description: '高精度数字雕刻软件，支持与Maya互导',
    version: '2023+',
    download: 'https://www.maxon.net/en/zbrush'
  },
  {
    id: 'plugin_4',
    name: 'Houdini Engine',
    category: '特效',
    description: 'Houdini procedural工具在Maya中的集成',
    version: '19.0+',
    download: 'https://www.sidefx.com/download/'
  }
];

// 获取Maya命令列表
router.get('/commands', (req, res) => {
  try {
    const category = req.query.category;
    let filteredCommands = mayaCommands;
    
    if (category) {
      filteredCommands = mayaCommands.filter(cmd => cmd.category === category);
    }
    
    res.json({ success: true, data: filteredCommands });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取命令失败' });
  }
});

// 获取Maya快捷键列表
router.get('/hotkeys', (req, res) => {
  try {
    const category = req.query.category;
    let filteredHotkeys = mayaHotkeys;
    
    if (category) {
      filteredHotkeys = mayaHotkeys.filter(hotkey => hotkey.category === category);
    }
    
    res.json({ success: true, data: filteredHotkeys });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取快捷键失败' });
  }
});

// 获取Maya插件推荐
router.get('/plugins', (req, res) => {
  try {
    const category = req.query.category;
    let filteredPlugins = mayaPlugins;
    
    if (category) {
      filteredPlugins = mayaPlugins.filter(plugin => plugin.category === category);
    }
    
    res.json({ success: true, data: filteredPlugins });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取插件失败' });
  }
});

// 搜索Maya命令
router.get('/commands/search', (req, res) => {
  try {
    const keyword = req.query.keyword || '';
    const filteredCommands = mayaCommands.filter(cmd => {
      return cmd.name.includes(keyword) || 
             cmd.description.includes(keyword) ||
             cmd.category.includes(keyword);
    });
    
    res.json({ success: true, data: filteredCommands });
  } catch (error) {
    res.status(500).json({ success: false, message: '搜索命令失败' });
  }
});

module.exports = router;