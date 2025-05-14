// 定义图片数据结构
interface SlideData {
    id: number;
    src: string;
    alt: string;
    title?: string;
    description?: string;
}

// 定义过渡效果类型
type TransitionEffect = 'fade' | 'slide' | 'zoom' | 'flip';

// 示例图片数据 - 澳大利亚主题（使用本地图片）
const slidesData: SlideData[] = [
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
class Carousel {
    private carousel: HTMLElement;
    private innerContainer: HTMLElement;
    private prevButton: HTMLElement;
    private nextButton: HTMLElement;
    private indicatorsContainer: HTMLElement;
    protected slides: SlideData[]; // 改为protected，让子类可以访问
    private currentIndex: number = 0;
    private indicators: HTMLElement[] = [];
    private timer: number | null = null;
    private autoplay: boolean = false;
    private interval: number = 3000;

    constructor(carouselId: string, slides: SlideData[], autoplay: boolean = false, interval: number = 3000) {
        this.carousel = document.getElementById(carouselId) as HTMLElement;
        this.innerContainer = this.carousel.querySelector('.carousel-inner') as HTMLElement;
        this.prevButton = this.carousel.querySelector('.prev') as HTMLElement;
        this.nextButton = this.carousel.querySelector('.next') as HTMLElement;
        this.indicatorsContainer = this.carousel.querySelector('.carousel-indicators') as HTMLElement;
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
    private initSlides(): void {
        this.innerContainer.innerHTML = '';
        
        this.slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            // 使用图片元素，确保完全加载
            slideElement.style.backgroundImage = `url('${slide.src}')`;
            
            this.innerContainer.appendChild(slideElement);
        });
    }

    /**
     * 初始化指示器
     */
    private initIndicators(): void {
        this.indicatorsContainer.innerHTML = '';
        this.indicators = [];

        this.slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
            indicator.dataset.index = index.toString();
            
            this.indicatorsContainer.appendChild(indicator);
            this.indicators.push(indicator);
        });
    }

    /**
     * 初始化事件监听
     */
    private initEvents(): void {
        // 上一张
        this.prevButton.addEventListener('click', () => {
            this.goTo(this.currentIndex - 1);
        });

        // 下一张
        this.nextButton.addEventListener('click', () => {
            this.goTo(this.currentIndex + 1);
        });

        // 点击指示器
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goTo(index);
            });
        });

        // 鼠标悬停时暂停自动播放
        this.carousel.addEventListener('mouseenter', () => {
            this.stopAutoplay();
        });

        // 鼠标离开时恢复自动播放
        this.carousel.addEventListener('mouseleave', () => {
            if (this.autoplay) {
                this.startAutoplay();
            }
        });
    }

    /**
     * 切换到指定索引的幻灯片
     */
    public goTo(index: number): void {
        // 确保索引在有效范围内
        if (index < 0) {
            index = this.slides.length - 1;
        } else if (index >= this.slides.length) {
            index = 0;
        }

        // 移除当前活动项
        const currentSlide = this.innerContainer.querySelector('.carousel-item.active');
        currentSlide?.classList.remove('active');
        this.indicators[this.currentIndex].classList.remove('active');

        // 激活新项
        const newSlide = this.innerContainer.querySelectorAll('.carousel-item')[index];
        newSlide.classList.add('active');
        this.indicators[index].classList.add('active');

        // 更新当前索引
        this.currentIndex = index;
    }

    /**
     * 开始自动播放
     */
    public startAutoplay(): void {
        if (this.timer) return;
        
        this.timer = window.setInterval(() => {
            this.goTo(this.currentIndex + 1);
        }, this.interval);
    }

    /**
     * 停止自动播放
     */
    public stopAutoplay(): void {
        if (this.timer) {
            window.clearInterval(this.timer);
            this.timer = null;
        }
    }

    /**
     * 设置自动播放状态
     */
    public setAutoplay(autoplay: boolean): void {
        this.autoplay = autoplay;
        
        if (autoplay) {
            this.startAutoplay();
        } else {
            this.stopAutoplay();
        }
    }

    /**
     * 设置间隔时间
     */
    public setInterval(interval: number): void {
        this.interval = interval;
        
        if (this.autoplay && this.timer) {
            this.stopAutoplay();
            this.startAutoplay();
        }
    }
}

/**
 * 高级轮播图类，扩展基础轮播图
 */
class AdvancedCarousel extends Carousel {
    private captionElement: HTMLElement;
    private transitionEffect: TransitionEffect = 'slide';

    constructor(carouselId: string, slides: SlideData[], autoplay: boolean = true, interval: number = 3000) {
        super(carouselId, slides, autoplay, interval);
        this.captionElement = document.getElementById('advancedCaption') as HTMLElement;
        
        // 初始化标题区域
        this.updateCaption(0);
        
        // 设置初始过渡效果
        this.setTransitionEffect('slide');
    }

    /**
     * 重写goTo方法，添加更新标题和过渡效果
     */
    public goTo(index: number): void {
        let targetIndex = index;
        
        // 确保索引在有效范围内
        if (targetIndex < 0) {
            targetIndex = this.slides.length - 1;
        } else if (targetIndex >= this.slides.length) {
            targetIndex = 0;
        }

        // 更新标题
        this.updateCaption(targetIndex);
        
        super.goTo(targetIndex);
    }

    /**
     * 更新标题区域
     */
    private updateCaption(index: number): void {
        const slide = this.slides[index];
        
        if (slide.title || slide.description) {
            this.captionElement.innerHTML = `
                ${slide.title ? `<h3>${slide.title}</h3>` : ''}
                ${slide.description ? `<p>${slide.description}</p>` : ''}
            `;
            this.captionElement.style.display = 'block';
        } else {
            this.captionElement.style.display = 'none';
        }
    }

    /**
     * 设置过渡效果
     */
    public setTransitionEffect(effect: TransitionEffect): void {
        this.transitionEffect = effect;
        const carousel = document.getElementById('advancedCarousel') as HTMLElement;
        carousel.dataset.transition = effect;
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化基础轮播图
    const basicCarousel = new Carousel('basicCarousel', slidesData, true);
    
    // 初始化高级轮播图
    const advancedCarousel = new AdvancedCarousel('advancedCarousel', slidesData, true);
    
    // 监听自动播放切换
    const autoplayToggle = document.getElementById('autoplayToggle') as HTMLInputElement;
    autoplayToggle.addEventListener('change', (e) => {
        const checked = (e.target as HTMLInputElement).checked;
        advancedCarousel.setAutoplay(checked);
    });
    
    // 监听间隔时间变化
    const intervalInput = document.getElementById('intervalInput') as HTMLInputElement;
    intervalInput.addEventListener('change', (e) => {
        const value = parseInt((e.target as HTMLInputElement).value);
        advancedCarousel.setInterval(value);
    });
    
    // 监听过渡效果变化
    const transitionSelect = document.getElementById('transitionSelect') as HTMLSelectElement;
    transitionSelect.addEventListener('change', (e) => {
        const value = (e.target as HTMLSelectElement).value as TransitionEffect;
        advancedCarousel.setTransitionEffect(value);
    });
}); 