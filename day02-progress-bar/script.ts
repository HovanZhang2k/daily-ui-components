// script.ts
class AutoProgress {
    private progressElement: HTMLProgressElement;
    private valueDisplay: HTMLElement;
    private intervalId?: number;
    
    // 统一所有进度条的更新频率
    static readonly UPDATE_INTERVAL = 50; // 50毫秒
    // 统一所有进度条的移动速度
    static readonly INCREMENT_VALUE = 1; // 每次增加1%

    constructor() {
        this.progressElement = document.getElementById('autoProgress') as HTMLProgressElement;
        this.valueDisplay = document.getElementById('progressValue')!;
        this.startAutoProgress();
    }

    private updateProgress(): void {
        const newValue = this.progressElement.value + AutoProgress.INCREMENT_VALUE;
        const progress = newValue > 100 ? 0 : newValue;

        this.progressElement.value = progress;
        this.valueDisplay.textContent = `${progress}%`;
    }

    private startAutoProgress(): void {
        this.intervalId = window.setInterval(() => {
            this.updateProgress();
        }, AutoProgress.UPDATE_INTERVAL);
    }
}

class CustomProgress {
    private progressElement: HTMLProgressElement;
    private valueDisplay: HTMLElement;
    private decreaseBtn: HTMLElement;
    private resetBtn: HTMLElement;
    private increaseBtn: HTMLElement;
    private intervalId?: number;
    
    constructor() {
        this.progressElement = document.getElementById('customProgress') as HTMLProgressElement;
        this.valueDisplay = document.getElementById('customProgressValue')!;
        this.decreaseBtn = document.getElementById('decreaseBtn')!;
        this.resetBtn = document.getElementById('resetBtn')!;
        this.increaseBtn = document.getElementById('increaseBtn')!;
        
        this.initEvents();
        this.updateDisplay();
        this.startAutoProgress();
    }
    
    private initEvents(): void {
        this.decreaseBtn.addEventListener('click', () => this.decreaseProgress());
        this.resetBtn.addEventListener('click', () => this.resetProgress());
        this.increaseBtn.addEventListener('click', () => this.increaseProgress());
    }
    
    private decreaseProgress(): void {
        // 不暂停自动增长，只改变进度值
        const newValue = Math.max(0, this.progressElement.value - 10);
        this.progressElement.value = newValue;
        this.updateDisplay();
    }
    
    private increaseProgress(): void {
        // 不暂停自动增长，只改变进度值
        const newValue = Math.min(100, this.progressElement.value + 10);
        this.progressElement.value = newValue;
        this.updateDisplay();
    }
    
    private resetProgress(): void {
        // 不暂停自动增长，只重置进度值
        this.progressElement.value = 0;
        this.updateDisplay();
    }
    
    private updateDisplay(): void {
        this.valueDisplay.textContent = `${this.progressElement.value}%`;
    }
    
    private updateAutoProgress(): void {
        const newValue = this.progressElement.value + AutoProgress.INCREMENT_VALUE;
        const progress = newValue > 100 ? 0 : newValue;
        
        this.progressElement.value = progress;
        this.updateDisplay();
    }
    
    private startAutoProgress(): void {
        this.intervalId = window.setInterval(() => {
            this.updateAutoProgress();
        }, AutoProgress.UPDATE_INTERVAL);
    }
}

class CustomBarProgress {
    private progressBar: HTMLElement;
    private valueDisplay: HTMLElement;
    private decreaseBtn: HTMLElement;
    private resetBtn: HTMLElement;
    private increaseBtn: HTMLElement;
    private currentValue: number = 50;
    private intervalId?: number;
    
    // 特殊效果状态
    private pulseEffect: boolean = false;
    private reverseDirection: boolean = false;
    private milestoneReached: boolean = false;
    
    constructor() {
        this.progressBar = document.getElementById('customBar')!;
        this.valueDisplay = document.getElementById('customBarValue')!;
        this.decreaseBtn = document.getElementById('customDecreaseBtn')!;
        this.resetBtn = document.getElementById('customResetBtn')!;
        this.increaseBtn = document.getElementById('customIncreaseBtn')!;
        
        this.initEvents();
        this.updateDisplay();
        this.startAutoProgress();
    }
    
    private initEvents(): void {
        this.decreaseBtn.addEventListener('click', () => this.decreaseProgress());
        this.resetBtn.addEventListener('click', () => this.resetProgress());
        this.increaseBtn.addEventListener('click', () => this.increaseProgress());
        
        // 添加点击进度条可以直接设置进度的功能（原生progress不支持）
        const customProgress = document.querySelector('.custom-progress') as HTMLElement;
        if (customProgress) {
            customProgress.addEventListener('click', (e) => this.handleProgressClick(e));
        }
    }
    
    private handleProgressClick(e: MouseEvent): void {
        if (e.currentTarget) {
            const progressEl = e.currentTarget as HTMLElement;
            const rect = progressEl.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.round((x / rect.width) * 100);
            
            // 不暂停自动增长，只改变当前值
            this.currentValue = Math.min(100, Math.max(0, percentage));
            this.updateDisplay();
            
            // 点击时触发脉冲动画效果
            this.triggerPulseEffect();
            
            // 检查里程碑
            this.checkMilestone();
        }
    }
    
    private decreaseProgress(): void {
        // 不暂停自动增长，只改变当前值
        this.currentValue = Math.max(0, this.currentValue - 10);
        this.updateDisplay();
    }
    
    private increaseProgress(): void {
        // 不暂停自动增长，只改变当前值
        this.currentValue = Math.min(100, this.currentValue + 10);
        this.updateDisplay();
        this.checkMilestone();
    }
    
    private resetProgress(): void {
        // 不暂停自动增长，只重置当前值
        this.currentValue = 0;
        this.updateDisplay();
        this.milestoneReached = false;
        this.progressBar.classList.remove('milestone');
    }
    
    private checkMilestone(): void {
        // 检查是否达到了里程碑（75%）
        if (this.currentValue >= 75 && !this.milestoneReached) {
            this.milestoneReached = true;
            this.progressBar.classList.add('milestone');
            
            // 触发脉冲效果
            this.triggerPulseEffect();
        } else if (this.currentValue < 75 && this.milestoneReached) {
            // 如果低于75%并且之前已达到里程碑，则移除里程碑状态
            this.milestoneReached = false;
            this.progressBar.classList.remove('milestone');
        }
    }
    
    private triggerPulseEffect(): void {
        if (!this.pulseEffect) {
            this.pulseEffect = true;
            this.progressBar.classList.add('pulse');
            
            // 脉冲效果结束后移除类
            setTimeout(() => {
                this.progressBar.classList.remove('pulse');
                this.pulseEffect = false;
            }, 1500);
        }
    }
    
    private updateDisplay(): void {
        this.progressBar.style.width = `${this.currentValue}%`;
        this.valueDisplay.textContent = `${this.currentValue}%`;
    }
    
    private updateAutoProgress(): void {
        // 根据方向决定是增加还是减少
        if (!this.reverseDirection) {
            // 正向前进
            const newValue = this.currentValue + AutoProgress.INCREMENT_VALUE;
            if (newValue > 100) {
                this.currentValue = 100;
                this.reverseDirection = true; // 到达100%后反向
            } else {
                this.currentValue = newValue;
            }
        } else {
            // 反向后退
            const newValue = this.currentValue - AutoProgress.INCREMENT_VALUE;
            if (newValue < 0) {
                this.currentValue = 0;
                this.reverseDirection = false; // 到达0%后正向
            } else {
                this.currentValue = newValue;
            }
        }
        
        this.updateDisplay();
        this.checkMilestone();
    }
    
    private startAutoProgress(): void {
        this.intervalId = window.setInterval(() => {
            this.updateAutoProgress();
        }, AutoProgress.UPDATE_INTERVAL);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new AutoProgress();
    new CustomProgress();
    new CustomBarProgress();
});