// script.ts
var AutoProgress = /** @class */ (function () {
    function AutoProgress() {
        this.progressElement = document.getElementById('autoProgress');
        this.valueDisplay = document.getElementById('progressValue');
        this.startAutoProgress();
    }
    AutoProgress.prototype.updateProgress = function () {
        var newValue = this.progressElement.value + AutoProgress.INCREMENT_VALUE;
        var progress = newValue > 100 ? 0 : newValue;
        this.progressElement.value = progress;
        this.valueDisplay.textContent = "".concat(progress, "%");
    };
    AutoProgress.prototype.startAutoProgress = function () {
        var _this = this;
        this.intervalId = window.setInterval(function () {
            _this.updateProgress();
        }, AutoProgress.UPDATE_INTERVAL);
    };
    // 统一所有进度条的更新频率
    AutoProgress.UPDATE_INTERVAL = 50; // 50毫秒
    // 统一所有进度条的移动速度
    AutoProgress.INCREMENT_VALUE = 1; // 每次增加1%
    return AutoProgress;
}());
var CustomProgress = /** @class */ (function () {
    function CustomProgress() {
        this.progressElement = document.getElementById('customProgress');
        this.valueDisplay = document.getElementById('customProgressValue');
        this.decreaseBtn = document.getElementById('decreaseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.increaseBtn = document.getElementById('increaseBtn');
        this.initEvents();
        this.updateDisplay();
        this.startAutoProgress();
    }
    CustomProgress.prototype.initEvents = function () {
        var _this = this;
        this.decreaseBtn.addEventListener('click', function () { return _this.decreaseProgress(); });
        this.resetBtn.addEventListener('click', function () { return _this.resetProgress(); });
        this.increaseBtn.addEventListener('click', function () { return _this.increaseProgress(); });
    };
    CustomProgress.prototype.decreaseProgress = function () {
        // 不暂停自动增长，只改变进度值
        var newValue = Math.max(0, this.progressElement.value - 10);
        this.progressElement.value = newValue;
        this.updateDisplay();
    };
    CustomProgress.prototype.increaseProgress = function () {
        // 不暂停自动增长，只改变进度值
        var newValue = Math.min(100, this.progressElement.value + 10);
        this.progressElement.value = newValue;
        this.updateDisplay();
    };
    CustomProgress.prototype.resetProgress = function () {
        // 不暂停自动增长，只重置进度值
        this.progressElement.value = 0;
        this.updateDisplay();
    };
    CustomProgress.prototype.updateDisplay = function () {
        this.valueDisplay.textContent = "".concat(this.progressElement.value, "%");
    };
    CustomProgress.prototype.updateAutoProgress = function () {
        var newValue = this.progressElement.value + AutoProgress.INCREMENT_VALUE;
        var progress = newValue > 100 ? 0 : newValue;
        this.progressElement.value = progress;
        this.updateDisplay();
    };
    CustomProgress.prototype.startAutoProgress = function () {
        var _this = this;
        this.intervalId = window.setInterval(function () {
            _this.updateAutoProgress();
        }, AutoProgress.UPDATE_INTERVAL);
    };
    return CustomProgress;
}());
var CustomBarProgress = /** @class */ (function () {
    function CustomBarProgress() {
        this.currentValue = 50;
        // 特殊效果状态
        this.pulseEffect = false;
        this.reverseDirection = false;
        this.milestoneReached = false;
        this.progressBar = document.getElementById('customBar');
        this.valueDisplay = document.getElementById('customBarValue');
        this.decreaseBtn = document.getElementById('customDecreaseBtn');
        this.resetBtn = document.getElementById('customResetBtn');
        this.increaseBtn = document.getElementById('customIncreaseBtn');
        this.initEvents();
        this.updateDisplay();
        this.startAutoProgress();
    }
    CustomBarProgress.prototype.initEvents = function () {
        var _this = this;
        this.decreaseBtn.addEventListener('click', function () { return _this.decreaseProgress(); });
        this.resetBtn.addEventListener('click', function () { return _this.resetProgress(); });
        this.increaseBtn.addEventListener('click', function () { return _this.increaseProgress(); });
        // 添加点击进度条可以直接设置进度的功能（原生progress不支持）
        var customProgress = document.querySelector('.custom-progress');
        if (customProgress) {
            customProgress.addEventListener('click', function (e) { return _this.handleProgressClick(e); });
        }
    };
    CustomBarProgress.prototype.handleProgressClick = function (e) {
        if (e.currentTarget) {
            var progressEl = e.currentTarget;
            var rect = progressEl.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var percentage = Math.round((x / rect.width) * 100);
            // 不暂停自动增长，只改变当前值
            this.currentValue = Math.min(100, Math.max(0, percentage));
            this.updateDisplay();
            // 点击时触发脉冲动画效果
            this.triggerPulseEffect();
            // 检查里程碑
            this.checkMilestone();
        }
    };
    CustomBarProgress.prototype.decreaseProgress = function () {
        // 不暂停自动增长，只改变当前值
        this.currentValue = Math.max(0, this.currentValue - 10);
        this.updateDisplay();
    };
    CustomBarProgress.prototype.increaseProgress = function () {
        // 不暂停自动增长，只改变当前值
        this.currentValue = Math.min(100, this.currentValue + 10);
        this.updateDisplay();
        this.checkMilestone();
    };
    CustomBarProgress.prototype.resetProgress = function () {
        // 不暂停自动增长，只重置当前值
        this.currentValue = 0;
        this.updateDisplay();
        this.milestoneReached = false;
        this.progressBar.classList.remove('milestone');
    };
    CustomBarProgress.prototype.checkMilestone = function () {
        // 检查是否达到了里程碑（75%）
        if (this.currentValue >= 75 && !this.milestoneReached) {
            this.milestoneReached = true;
            this.progressBar.classList.add('milestone');
            // 触发脉冲效果
            this.triggerPulseEffect();
        }
        else if (this.currentValue < 75 && this.milestoneReached) {
            // 如果低于75%并且之前已达到里程碑，则移除里程碑状态
            this.milestoneReached = false;
            this.progressBar.classList.remove('milestone');
        }
    };
    CustomBarProgress.prototype.triggerPulseEffect = function () {
        var _this = this;
        if (!this.pulseEffect) {
            this.pulseEffect = true;
            this.progressBar.classList.add('pulse');
            // 脉冲效果结束后移除类
            setTimeout(function () {
                _this.progressBar.classList.remove('pulse');
                _this.pulseEffect = false;
            }, 1500);
        }
    };
    CustomBarProgress.prototype.updateDisplay = function () {
        this.progressBar.style.width = "".concat(this.currentValue, "%");
        this.valueDisplay.textContent = "".concat(this.currentValue, "%");
    };
    CustomBarProgress.prototype.updateAutoProgress = function () {
        // 根据方向决定是增加还是减少
        if (!this.reverseDirection) {
            // 正向前进
            var newValue = this.currentValue + AutoProgress.INCREMENT_VALUE;
            if (newValue > 100) {
                this.currentValue = 100;
                this.reverseDirection = true; // 到达100%后反向
            }
            else {
                this.currentValue = newValue;
            }
        }
        else {
            // 反向后退
            var newValue = this.currentValue - AutoProgress.INCREMENT_VALUE;
            if (newValue < 0) {
                this.currentValue = 0;
                this.reverseDirection = false; // 到达0%后正向
            }
            else {
                this.currentValue = newValue;
            }
        }
        this.updateDisplay();
        this.checkMilestone();
    };
    CustomBarProgress.prototype.startAutoProgress = function () {
        var _this = this;
        this.intervalId = window.setInterval(function () {
            _this.updateAutoProgress();
        }, AutoProgress.UPDATE_INTERVAL);
    };
    return CustomBarProgress;
}());
// 初始化
document.addEventListener('DOMContentLoaded', function () {
    new AutoProgress();
    new CustomProgress();
    new CustomBarProgress();
});
