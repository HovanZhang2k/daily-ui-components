"use strict";
// script.ts
class AutoProgress {
    constructor() {
        this.progressElement = document.getElementById('autoProgress');
        this.valueDisplay = document.getElementById('progressValue');
        this.startAutoProgress();
    }
    updateProgress() {
        const newValue = this.progressElement.value + 1;
        const progress = newValue > 100 ? 0 : newValue;
        this.progressElement.value = progress;
        this.valueDisplay.textContent = `${progress}%`;
    }
    startAutoProgress() {
        this.intervalId = window.setInterval(() => {
            this.updateProgress();
        }, 50);
    }
}
// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new AutoProgress();
});
