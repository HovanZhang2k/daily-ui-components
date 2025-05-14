var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// 示例图片数据 - 澳大利亚主题（使用本地图片）
var slidesData = [
    {
        id: 1,
        src: './assets/sydney-opera-house.jpg',
        alt: '悉尼歌剧院',
        title: '悉尼歌剧院',
        description: '澳大利亚的标志性建筑，位于悉尼港，是世界著名的表演艺术中心。'
    },
    {
        id: 2,
        src: './assets/kangaroo.jpg',
        alt: '袋鼠',
        title: '澳洲袋鼠',
        description: '澳大利亚特有的有袋类动物，是澳大利亚的国家象征之一。'
    },
    {
        id: 3,
        src: './assets/koala.jpg',
        alt: '考拉',
        title: '可爱考拉',
        description: '澳大利亚特有的树栖有袋类动物，主要以桉树叶为食。'
    },
    {
        id: 4,
        src: './assets/gold-coast.jpg',
        alt: '黄金海岸',
        title: '黄金海岸',
        description: '位于澳大利亚昆士兰州的著名度假胜地，拥有绵延的白沙滩和湛蓝的海水。'
    },
    {
        id: 5,
        src: './assets/uluru.jpg',
        alt: '乌鲁鲁巨石',
        title: '乌鲁鲁巨石',
        description: '澳大利亚中部的巨大砂岩单体岩石，对当地原住民有着重要的文化意义。'
    }
];
/**
 * 基础轮播图类
 */
var Carousel = /** @class */ (function () {
    function Carousel(carouselId, slides, autoplay, interval) {
        if (autoplay === void 0) { autoplay = false; }
        if (interval === void 0) { interval = 3000; }
        this.currentIndex = 0;
        this.indicators = [];
        this.timer = null;
        this.autoplay = false;
        this.interval = 3000;
        this.carousel = document.getElementById(carouselId);
        this.innerContainer = this.carousel.querySelector('.carousel-inner');
        this.prevButton = this.carousel.querySelector('.prev');
        this.nextButton = this.carousel.querySelector('.next');
        this.indicatorsContainer = this.carousel.querySelector('.carousel-indicators');
        this.slides = slides;
        this.autoplay = autoplay;
        this.interval = interval;
        this.initSlides();
        this.initIndicators();
        this.initEvents();
        if (this.autoplay) {
            this.startAutoplay();
        }
    }
    /**
     * 初始化轮播图项
     */
    Carousel.prototype.initSlides = function () {
        var _this = this;
        this.innerContainer.innerHTML = '';
        this.slides.forEach(function (slide, index) {
            var slideElement = document.createElement('div');
            slideElement.className = "carousel-item ".concat(index === 0 ? 'active' : '');
            // 使用图片元素，确保完全加载
            slideElement.style.backgroundImage = "url('".concat(slide.src, "')");
            _this.innerContainer.appendChild(slideElement);
        });
    };
    /**
     * 初始化指示器
     */
    Carousel.prototype.initIndicators = function () {
        var _this = this;
        this.indicatorsContainer.innerHTML = '';
        this.indicators = [];
        this.slides.forEach(function (_, index) {
            var indicator = document.createElement('div');
            indicator.className = "indicator ".concat(index === 0 ? 'active' : '');
            indicator.dataset.index = index.toString();
            _this.indicatorsContainer.appendChild(indicator);
            _this.indicators.push(indicator);
        });
    };
    /**
     * 初始化事件监听
     */
    Carousel.prototype.initEvents = function () {
        var _this = this;
        // 上一张
        this.prevButton.addEventListener('click', function () {
            _this.goTo(_this.currentIndex - 1);
        });
        // 下一张
        this.nextButton.addEventListener('click', function () {
            _this.goTo(_this.currentIndex + 1);
        });
        // 点击指示器
        this.indicators.forEach(function (indicator, index) {
            indicator.addEventListener('click', function () {
                _this.goTo(index);
            });
        });
        // 鼠标悬停时暂停自动播放
        this.carousel.addEventListener('mouseenter', function () {
            _this.stopAutoplay();
        });
        // 鼠标离开时恢复自动播放
        this.carousel.addEventListener('mouseleave', function () {
            if (_this.autoplay) {
                _this.startAutoplay();
            }
        });
    };
    /**
     * 切换到指定索引的幻灯片
     */
    Carousel.prototype.goTo = function (index) {
        // 确保索引在有效范围内
        if (index < 0) {
            index = this.slides.length - 1;
        }
        else if (index >= this.slides.length) {
            index = 0;
        }
        // 移除当前活动项
        var currentSlide = this.innerContainer.querySelector('.carousel-item.active');
        currentSlide === null || currentSlide === void 0 ? void 0 : currentSlide.classList.remove('active');
        this.indicators[this.currentIndex].classList.remove('active');
        // 激活新项
        var newSlide = this.innerContainer.querySelectorAll('.carousel-item')[index];
        newSlide.classList.add('active');
        this.indicators[index].classList.add('active');
        // 更新当前索引
        this.currentIndex = index;
    };
    /**
     * 开始自动播放
     */
    Carousel.prototype.startAutoplay = function () {
        var _this = this;
        if (this.timer)
            return;
        this.timer = window.setInterval(function () {
            _this.goTo(_this.currentIndex + 1);
        }, this.interval);
    };
    /**
     * 停止自动播放
     */
    Carousel.prototype.stopAutoplay = function () {
        if (this.timer) {
            window.clearInterval(this.timer);
            this.timer = null;
        }
    };
    /**
     * 设置自动播放状态
     */
    Carousel.prototype.setAutoplay = function (autoplay) {
        this.autoplay = autoplay;
        if (autoplay) {
            this.startAutoplay();
        }
        else {
            this.stopAutoplay();
        }
    };
    /**
     * 设置间隔时间
     */
    Carousel.prototype.setInterval = function (interval) {
        this.interval = interval;
        if (this.autoplay && this.timer) {
            this.stopAutoplay();
            this.startAutoplay();
        }
    };
    return Carousel;
}());
/**
 * 高级轮播图类，扩展基础轮播图
 */
var AdvancedCarousel = /** @class */ (function (_super) {
    __extends(AdvancedCarousel, _super);
    function AdvancedCarousel(carouselId, slides, autoplay, interval) {
        if (autoplay === void 0) { autoplay = true; }
        if (interval === void 0) { interval = 3000; }
        var _this = _super.call(this, carouselId, slides, autoplay, interval) || this;
        _this.transitionEffect = 'slide';
        _this.captionElement = document.getElementById('advancedCaption');
        // 初始化标题区域
        _this.updateCaption(0);
        // 设置初始过渡效果
        _this.setTransitionEffect('slide');
        return _this;
    }
    /**
     * 重写goTo方法，添加更新标题和过渡效果
     */
    AdvancedCarousel.prototype.goTo = function (index) {
        var targetIndex = index;
        // 确保索引在有效范围内
        if (targetIndex < 0) {
            targetIndex = this.slides.length - 1;
        }
        else if (targetIndex >= this.slides.length) {
            targetIndex = 0;
        }
        // 更新标题
        this.updateCaption(targetIndex);
        _super.prototype.goTo.call(this, targetIndex);
    };
    /**
     * 更新标题区域
     */
    AdvancedCarousel.prototype.updateCaption = function (index) {
        var slide = this.slides[index];
        if (slide.title || slide.description) {
            this.captionElement.innerHTML = "\n                ".concat(slide.title ? "<h3>".concat(slide.title, "</h3>") : '', "\n                ").concat(slide.description ? "<p>".concat(slide.description, "</p>") : '', "\n            ");
            this.captionElement.style.display = 'block';
        }
        else {
            this.captionElement.style.display = 'none';
        }
    };
    /**
     * 设置过渡效果
     */
    AdvancedCarousel.prototype.setTransitionEffect = function (effect) {
        this.transitionEffect = effect;
        var carousel = document.getElementById('advancedCarousel');
        carousel.dataset.transition = effect;
    };
    return AdvancedCarousel;
}(Carousel));
// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function () {
    // 初始化基础轮播图
    var basicCarousel = new Carousel('basicCarousel', slidesData, true);
    // 初始化高级轮播图
    var advancedCarousel = new AdvancedCarousel('advancedCarousel', slidesData, true);
    // 监听自动播放切换
    var autoplayToggle = document.getElementById('autoplayToggle');
    autoplayToggle.addEventListener('change', function (e) {
        var checked = e.target.checked;
        advancedCarousel.setAutoplay(checked);
    });
    // 监听间隔时间变化
    var intervalInput = document.getElementById('intervalInput');
    intervalInput.addEventListener('change', function (e) {
        var value = parseInt(e.target.value);
        advancedCarousel.setInterval(value);
    });
    // 监听过渡效果变化
    var transitionSelect = document.getElementById('transitionSelect');
    transitionSelect.addEventListener('change', function (e) {
        var value = e.target.value;
        advancedCarousel.setTransitionEffect(value);
    });
});
