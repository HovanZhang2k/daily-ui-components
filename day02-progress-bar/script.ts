// script.ts
class AutoProgress {
    private progressElement: HTMLProgressElement;
    private valueDisplay: HTMLElement;
    private intervalId?: number;

    constructor() {
        this.progressElement = document.getElementById('autoProgress') as HTMLProgressElement;
        this.valueDisplay = document.getElementById('progressValue')!;
        this.startAutoProgress();
    }

    private updateProgress(): void {
        const newValue = this.progressElement.value + 1;
        const progress = newValue > 100 ? 0 : newValue;
        
        this.progressElement.value = progress;
        this.valueDisplay.textContent = `${progress}%`;
    }

    private startAutoProgress(): void {
        this.intervalId = window.setInterval(() => {
            this.updateProgress();
        }, 50);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new AutoProgress();
});