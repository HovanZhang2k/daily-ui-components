// 定义颜色类型
interface ColorData {
    background: string;
    textClass: 'light-mode' | 'dark-mode';
}

// 按钮颜色配置
const buttonColors: Record<string, ColorData> = {
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
const colorPalettes: ColorData[] = [
    { background: '#448aff', textClass: 'light-mode' }, // 亮蓝
    { background: '#ff5252', textClass: 'light-mode' }, // 亮红
    { background: '#ffca28', textClass: 'dark-mode' },  // 亮黄
    { background: '#4caf50', textClass: 'light-mode' }, // 亮绿
    { background: '#9c27b0', textClass: 'light-mode' }, // 亮紫
    { background: '#ff9800', textClass: 'dark-mode' },  // 亮橙
];

// DOM元素
let normalBtn: HTMLElement;
let dancingBtn: HTMLElement;
let escapeBtn: HTMLElement;
let escapeRangeSelect: HTMLSelectElement;
let body: HTMLElement;

// 逃跑按钮状态
let isChasingEscapeButton = false;
let lastEscapeDirection = { x: 0, y: 0 };
let escapeMode: 'fullscreen' | 'container' = 'fullscreen'; // 默认是全屏模式

/**
 * 初始化页面元素
 */
function initElements(): void {
    body = document.body;
    normalBtn = document.getElementById('normalBtn') as HTMLElement;
    dancingBtn = document.getElementById('dancingBtn') as HTMLElement;
    escapeBtn = document.getElementById('escapeBtn') as HTMLElement;
    escapeRangeSelect = document.getElementById('escapeRange') as HTMLSelectElement;

    // 初始化逃跑按钮位置
    resetEscapeButtonPosition();

    // 添加事件监听器
    normalBtn.addEventListener('click', () => changeBackgroundColor('normal'));
    dancingBtn.addEventListener('click', () => changeBackgroundColor('dancing'));
    escapeBtn.addEventListener('click', () => changeBackgroundColor('escape'));
    
    // 监听逃跑范围选择器的变化
    escapeRangeSelect.addEventListener('change', () => {
        escapeMode = escapeRangeSelect.value as 'fullscreen' | 'container';
        resetEscapeButtonPosition();
    });

    // 添加逃跑按钮的鼠标跟踪
    document.addEventListener('mousemove', (e: Event) => {
        handleEscapeButtonHover(e as MouseEvent);
    });
}

/**
 * 重置逃跑按钮位置到容器中心
 */
function resetEscapeButtonPosition(): void {
    const escapeContainer = document.querySelector('.escape-container') as HTMLElement;
    const containerRect = escapeContainer.getBoundingClientRect();
    
    // 无论哪种模式，按钮初始位置都在容器中心
    if (escapeMode === 'fullscreen') {
        // 全屏模式下，将按钮初始位置设置为相对于视窗的容器中心位置
        const containerCenterX = containerRect.left + containerRect.width / 2;
        const containerCenterY = containerRect.top + containerRect.height / 2;
        
        escapeBtn.style.position = 'fixed';
        escapeBtn.style.left = `${containerCenterX}px`;
        escapeBtn.style.top = `${containerCenterY}px`;
    } else {
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
function changeBackgroundColor(type: string): void {
    let colorData: ColorData;

    if (type === 'random') {
        // 随机选择一个颜色
        const randomIndex = Math.floor(Math.random() * colorPalettes.length);
        colorData = colorPalettes[randomIndex];
    } else {
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
function getRandomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/**
 * 处理逃跑按钮的鼠标悬停
 */
function handleEscapeButtonHover(e: MouseEvent): void {
    if (isChasingEscapeButton) return;

    // 获取按钮当前位置和尺寸
    const buttonRect = escapeBtn.getBoundingClientRect();
    const buttonX = buttonRect.left + buttonRect.width / 2;
    const buttonY = buttonRect.top + buttonRect.height / 2;
    
    // 鼠标在视窗内的位置
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // 计算鼠标和按钮之间的距离
    const dx = mouseX - buttonX;
    const dy = mouseY - buttonY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 如果鼠标距离按钮太近，按钮就会"逃跑"
    if (distance < 180) { // 增加感应距离
        // 设置标志，防止频繁触发
        isChasingEscapeButton = true;
        
        // 基本逃跑方向（与鼠标相反）
        const baseAngle = Math.atan2(dy, dx);
        
        // 生成随机角度偏移，增加随机性 (-π/2 到 π/2，即 -90° 到 90°)
        const randomAngleOffset = getRandomBetween(-Math.PI/2, Math.PI/2);
        
        // 最终逃跑角度 (基本角度 + π(180°) + 随机偏移)
        const escapeAngle = baseAngle + Math.PI + randomAngleOffset;
        
        // 设置不同范围的逃跑距离
        const escapeDistance = getRandomBetween(250, 350);
        
        // 计算新位置
        let newX = buttonX + Math.cos(escapeAngle) * escapeDistance;
        let newY = buttonY + Math.sin(escapeAngle) * escapeDistance;
        
        // 根据不同模式进行边界检查
        if (escapeMode === 'fullscreen') {
            // 全屏模式 - 检查视窗边界
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const buttonWidth = buttonRect.width;
            const buttonHeight = buttonRect.height;
            const margin = 20; // 离边缘的最小距离
            
            newX = Math.max(buttonWidth/2 + margin, Math.min(viewportWidth - buttonWidth/2 - margin, newX));
            newY = Math.max(buttonHeight/2 + margin, Math.min(viewportHeight - buttonHeight/2 - margin, newY));
            
            // 从相对于容器的位置转换为相对于视窗的位置
            escapeBtn.style.position = 'fixed';
            escapeBtn.style.left = `${newX}px`;
            escapeBtn.style.top = `${newY}px`;
        } else {
            // 容器内模式 - 检查容器边界
            const escapeContainer = document.querySelector('.escape-container') as HTMLElement;
            const containerRect = escapeContainer.getBoundingClientRect();
            const buttonWidth = buttonRect.width;
            const buttonHeight = buttonRect.height;
            
            // 计算相对于容器的位置
            const containerX = newX - containerRect.left;
            const containerY = newY - containerRect.top;
            
            // 限制在容器内
            const margin = 10;
            const boundedX = Math.max(buttonWidth/2 + margin, Math.min(containerRect.width - buttonWidth/2 - margin, containerX));
            const boundedY = Math.max(buttonHeight/2 + margin, Math.min(containerRect.height - buttonHeight/2 - margin, containerY));
            
            // 设置相对于容器的位置
            escapeBtn.style.position = 'absolute';
            escapeBtn.style.left = `${boundedX}px`;
            escapeBtn.style.top = `${boundedY}px`;
        }
        
        // 保存本次逃跑方向
        lastEscapeDirection = {
            x: newX - buttonX,
            y: newY - buttonY
        };
        
        // 设置随机旋转
        const randomRotation = getRandomBetween(-45, 45);
        escapeBtn.style.transform = `translate(-50%, -50%) rotate(${randomRotation}deg)`;
        
        // 改变按钮的z-index以确保在其他元素上方
        escapeBtn.style.zIndex = '1000';
        
        // 按钮逃跑后一段时间重置状态
        setTimeout(() => {
            isChasingEscapeButton = false;
        }, 150); // 冷却时间
    }
}

// 当页面加载完成时初始化
document.addEventListener('DOMContentLoaded', initElements);
