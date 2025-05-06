"use strict";
const singleSlider = document.getElementById('singleSlider');
const sliderValue = document.getElementById('sliderValue');
// 左范围滑块
const rangeStart = document.getElementById('rangeStart');
const rangeStartValue = document.getElementById('rangeStartValue');
// 新增右范围滑块
const rangeEnd = document.getElementById('rangeEnd');
const rangeEndValue = document.getElementById('rangeEndValue');
// 增强的更新函数
function updateDisplay(element, displayElement, mode) {
    const value = element.value;
    const numericValue = parseInt(value);
    switch (mode) {
        case 'single':
            displayElement.textContent = value;
            displayElement.style.color = `rgb(${numericValue * 2.55}, 100, 100)`;
            break;
        case 'start':
            displayElement.textContent = `(0, ${value})`;
            // 绿色系优化（保持可见性）
            displayElement.style.color = `hsl(${numericValue * 1.8}, 85%, 35%)`; // 饱和度提升
            break;
        case 'end':
            displayElement.textContent = `(${value}, 100)`;
            // 蓝色系优化方案
            const hue = 215;
            const saturation = 80;
            const baseLightness = 70; // 最高亮度70%
            const lightnessRange = 40; // 亮度变化幅度40%
            let lightness = baseLightness - (numericValue * (lightnessRange / 100));
            lightness = Math.min(Math.max(lightness, 30), 70); // 限制在30-70%之间
            displayElement.style.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            break;
    }
}
// 初始化
updateDisplay(singleSlider, sliderValue, 'single');
updateDisplay(rangeStart, rangeStartValue, 'start');
updateDisplay(rangeEnd, rangeEndValue, 'end');
// 事件监听
singleSlider.addEventListener('input', () => updateDisplay(singleSlider, sliderValue, 'single'));
rangeStart.addEventListener('input', () => updateDisplay(rangeStart, rangeStartValue, 'start'));
rangeEnd.addEventListener('input', () => updateDisplay(rangeEnd, rangeEndValue, 'end'));
// 新增TS代码
const rangeUp = document.getElementById('rangeUp');
const rangeDown = document.getElementById('rangeDown');
const rangeDoubleValue = document.getElementById('rangeDoubleValue');
// 独立更新函数
function updateDoubleRange() {
    const upValue = rangeUp.value;
    const downValue = rangeDown.value;
    rangeDoubleValue.textContent = `(${upValue}, ${downValue})`;
    // 紫色系颜色变化（可选）
    const avgValue = (parseInt(upValue) + parseInt(downValue)) / 2;
    rangeDoubleValue.style.color = `hsl(276, 70%, ${50 - (avgValue * 0.3)}%)`;
}
// 初始化
updateDoubleRange();
// 事件监听
rangeUp.addEventListener('input', updateDoubleRange);
rangeDown.addEventListener('input', updateDoubleRange);
class VisualRangePicker {
    constructor() {
        this.currentDragger = null;
        this.container = document.querySelector('.visual-range');
        this.track = this.container.querySelector('.track-line');
        this.activeTrack = this.container.querySelector('.active-track');
        this.leftThumb = this.container.querySelector('.left-thumb');
        this.rightThumb = this.container.querySelector('.right-thumb');
        this.valueDisplay = document.getElementById('visualRangeValue');
        this.init();
    }
    init() {
        this.initPositions();
        this.initEvents();
    }
    initPositions() {
        // 设置初始位置（0和100）
        this.leftThumb.style.left = '0%';
        this.rightThumb.style.left = '100%';
        this.updateActiveTrack();
        this.updateValues();
    }
    initEvents() {
        [this.leftThumb, this.rightThumb].forEach(thumb => {
            thumb.addEventListener('mousedown', (e) => this.startDrag(e));
        });
        document.addEventListener('mousemove', (e) => this.handleDrag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
    }
    startDrag(e) {
        this.trackRect = this.track.getBoundingClientRect();
        this.currentDragger = e.target;
        // 处理重叠选择逻辑
        if (this.getLeftValue() === this.getRightValue()) {
            const clickX = e.clientX - this.trackRect.left;
            const midPoint = this.trackRect.width / 2;
            this.currentDragger = clickX < midPoint ? this.leftThumb : this.rightThumb;
        }
        this.activeTrack.style.transition = 'none';
        this.activeTrack.style.backgroundColor = 'transparent'; // 或者 'initial'
        this.currentDragger.classList.add('dragging');
    }
    handleDrag(e) {
        if (!this.currentDragger || !this.trackRect)
            return;
        const trackWidth = this.trackRect.width;
        const offsetX = e.clientX - this.trackRect.left;
        let newValue = (Math.min(Math.max(offsetX, 0), trackWidth) / trackWidth) * 100;
        // 精确边界控制
        if (this.currentDragger === this.leftThumb) {
            newValue = Math.min(newValue, this.getRightValue());
            newValue = Math.max(newValue, 0);
        }
        else {
            newValue = Math.max(newValue, this.getLeftValue());
            newValue = Math.min(newValue, 100);
        }
        this.updateThumbPosition(this.currentDragger, newValue);
        this.updateActiveTrack();
        this.updateValues();
    }
    stopDrag() {
        if (this.currentDragger) {
            this.currentDragger.classList.remove('dragging');
            this.currentDragger = null;
        }
        this.activeTrack.style.transition = 'all 0.2s';
        this.activeTrack.style.backgroundColor = '#2196F3';
    }
    updateThumbPosition(thumb, value) {
        thumb.style.left = `${value}%`;
    }
    getLeftValue() {
        return parseFloat(this.leftThumb.style.left) || 0;
    }
    getRightValue() {
        const rightValue = parseFloat(this.rightThumb.style.left);
        return isNaN(rightValue) ? 100 : rightValue;
    }
    updateActiveTrack() {
        const left = this.getLeftValue();
        const right = this.getRightValue();
        this.activeTrack.style.left = `${left}%`;
        this.activeTrack.style.width = `${right - left}%`;
    }
    updateValues() {
        const left = Math.round(this.getLeftValue());
        const right = Math.round(this.getRightValue());
        this.valueDisplay.textContent = `(${left}, ${right})`;
    }
}
// 初始化可视化范围选择器
new VisualRangePicker();
