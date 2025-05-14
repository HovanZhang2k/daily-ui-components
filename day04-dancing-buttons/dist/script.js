// 按钮颜色配置
var buttonColors = {
    normal: {
        background: '#ff5252',
        textClass: 'light-mode'
    },
    dancing: {
        background: '#ffca28',
        textClass: 'dark-mode'
    },
    escape: {
        background: '#448aff',
        textClass: 'light-mode'
    }
};
// 随机颜色生成 - 使用更亮的颜色
var colorPalettes = [
    { background: '#448aff', textClass: 'light-mode' }, // 亮蓝
    { background: '#ff5252', textClass: 'light-mode' }, // 亮红
    { background: '#ffca28', textClass: 'dark-mode' }, // 亮黄
    { background: '#4caf50', textClass: 'light-mode' }, // 亮绿
    { background: '#9c27b0', textClass: 'light-mode' }, // 亮紫
    { background: '#ff9800', textClass: 'dark-mode' }, // 亮橙
];
// DOM元素
var normalBtn;
var dancingBtn;
var escapeBtn;
var escapeRangeSelect;
var body;
// 逃跑按钮状态
var isChasingEscapeButton = false;
var lastEscapeDirection = { x: 0, y: 0 };
var escapeMode = 'fullscreen'; // 默认是全屏模式
/**
 * 初始化页面元素
 */
function initElements() {
    body = document.body;
    normalBtn = document.getElementById('normalBtn');
    dancingBtn = document.getElementById('dancingBtn');
    escapeBtn = document.getElementById('escapeBtn');
    escapeRangeSelect = document.getElementById('escapeRange');
    // 初始化逃跑按钮位置
    resetEscapeButtonPosition();
    // 添加事件监听器
    normalBtn.addEventListener('click', function () { return changeBackgroundColor('normal'); });
    dancingBtn.addEventListener('click', function () { return changeBackgroundColor('dancing'); });
    escapeBtn.addEventListener('click', function () { return changeBackgroundColor('escape'); });
    // 监听逃跑范围选择器的变化
    escapeRangeSelect.addEventListener('change', function () {
        escapeMode = escapeRangeSelect.value;
        resetEscapeButtonPosition();
    });
    // 添加逃跑按钮的鼠标跟踪
    document.addEventListener('mousemove', function (e) {
        handleEscapeButtonHover(e);
    });
}
/**
 * 重置逃跑按钮位置到容器中心
 */
function resetEscapeButtonPosition() {
    var escapeContainer = document.querySelector('.escape-container');
    var containerRect = escapeContainer.getBoundingClientRect();
    // 无论哪种模式，按钮初始位置都在容器中心
    if (escapeMode === 'fullscreen') {
        // 全屏模式下，将按钮初始位置设置为相对于视窗的容器中心位置
        var containerCenterX = containerRect.left + containerRect.width / 2;
        var containerCenterY = containerRect.top + containerRect.height / 2;
        escapeBtn.style.position = 'fixed';
        escapeBtn.style.left = "".concat(containerCenterX, "px");
        escapeBtn.style.top = "".concat(containerCenterY, "px");
    }
    else {
        // 容器模式下，相对于容器的中心位置
        escapeBtn.style.position = 'absolute';
        escapeBtn.style.left = '50%';
        escapeBtn.style.top = '50%';
    }
    escapeBtn.style.transform = 'translate(-50%, -50%)';
}
/**
 * 改变背景色
 */
function changeBackgroundColor(type) {
    var colorData;
    if (type === 'random') {
        // 随机选择一个颜色
        var randomIndex = Math.floor(Math.random() * colorPalettes.length);
        colorData = colorPalettes[randomIndex];
    }
    else {
        // 使用按钮对应的颜色
        colorData = buttonColors[type];
    }
    // 应用背景色
    body.style.backgroundColor = colorData.background;
    // 切换文字颜色类
    body.classList.remove('light-mode', 'dark-mode');
    body.classList.add(colorData.textClass);
}
/**
 * 生成随机数范围
 */
function getRandomBetween(min, max) {
    return Math.random() * (max - min) + min;
}
/**
 * 处理逃跑按钮的鼠标悬停
 */
function handleEscapeButtonHover(e) {
    if (isChasingEscapeButton)
        return;
    // 获取按钮当前位置和尺寸
    var buttonRect = escapeBtn.getBoundingClientRect();
    var buttonX = buttonRect.left + buttonRect.width / 2;
    var buttonY = buttonRect.top + buttonRect.height / 2;
    // 鼠标在视窗内的位置
    var mouseX = e.clientX;
    var mouseY = e.clientY;
    // 计算鼠标和按钮之间的距离
    var dx = mouseX - buttonX;
    var dy = mouseY - buttonY;
    var distance = Math.sqrt(dx * dx + dy * dy);
    // 如果鼠标距离按钮太近，按钮就会"逃跑"
    if (distance < 180) { // 增加感应距离
        // 设置标志，防止频繁触发
        isChasingEscapeButton = true;
        // 基本逃跑方向（与鼠标相反）
        var baseAngle = Math.atan2(dy, dx);
        // 生成随机角度偏移，增加随机性 (-π/2 到 π/2，即 -90° 到 90°)
        var randomAngleOffset = getRandomBetween(-Math.PI / 2, Math.PI / 2);
        // 最终逃跑角度 (基本角度 + π(180°) + 随机偏移)
        var escapeAngle = baseAngle + Math.PI + randomAngleOffset;
        // 设置不同范围的逃跑距离
        var escapeDistance = getRandomBetween(250, 350);
        // 计算新位置
        var newX = buttonX + Math.cos(escapeAngle) * escapeDistance;
        var newY = buttonY + Math.sin(escapeAngle) * escapeDistance;
        // 根据不同模式进行边界检查
        if (escapeMode === 'fullscreen') {
            // 全屏模式 - 检查视窗边界
            var viewportWidth = window.innerWidth;
            var viewportHeight = window.innerHeight;
            var buttonWidth = buttonRect.width;
            var buttonHeight = buttonRect.height;
            var margin = 20; // 离边缘的最小距离
            newX = Math.max(buttonWidth / 2 + margin, Math.min(viewportWidth - buttonWidth / 2 - margin, newX));
            newY = Math.max(buttonHeight / 2 + margin, Math.min(viewportHeight - buttonHeight / 2 - margin, newY));
            // 从相对于容器的位置转换为相对于视窗的位置
            escapeBtn.style.position = 'fixed';
            escapeBtn.style.left = "".concat(newX, "px");
            escapeBtn.style.top = "".concat(newY, "px");
        }
        else {
            // 容器内模式 - 检查容器边界
            var escapeContainer = document.querySelector('.escape-container');
            var containerRect = escapeContainer.getBoundingClientRect();
            var buttonWidth = buttonRect.width;
            var buttonHeight = buttonRect.height;
            // 计算相对于容器的位置
            var containerX = newX - containerRect.left;
            var containerY = newY - containerRect.top;
            // 限制在容器内
            var margin = 10;
            var boundedX = Math.max(buttonWidth / 2 + margin, Math.min(containerRect.width - buttonWidth / 2 - margin, containerX));
            var boundedY = Math.max(buttonHeight / 2 + margin, Math.min(containerRect.height - buttonHeight / 2 - margin, containerY));
            // 设置相对于容器的位置
            escapeBtn.style.position = 'absolute';
            escapeBtn.style.left = "".concat(boundedX, "px");
            escapeBtn.style.top = "".concat(boundedY, "px");
        }
        // 保存本次逃跑方向
        lastEscapeDirection = {
            x: newX - buttonX,
            y: newY - buttonY
        };
        // 设置随机旋转
        var randomRotation = getRandomBetween(-45, 45);
        escapeBtn.style.transform = "translate(-50%, -50%) rotate(".concat(randomRotation, "deg)");
        // 改变按钮的z-index以确保在其他元素上方
        escapeBtn.style.zIndex = '1000';
        // 按钮逃跑后一段时间重置状态
        setTimeout(function () {
            isChasingEscapeButton = false;
        }, 150); // 冷却时间
    }
}
// 当页面加载完成时初始化
document.addEventListener('DOMContentLoaded', initElements);
