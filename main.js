'use strict';

class Slider {
    constructor({
        container: slider,
        arrows = true,
        pagination,
        autoPlay = false,
        autoPlayTime = 4000,
        animationTime = 700
    }) {
        this.autoPlay = autoPlay;
        this.autoPlayTime = autoPlayTime;
        this.sliderTrack = document.createElement('div');
        this.sliderTrack.style.transition = `transform ${animationTime}ms`;
        this.currentSlide = 0;
        this.sliderTrack.className = 'slider-track';

        this.sliderTrack.innerHTML = slider.innerHTML;
        slider.innerHTML = '';
        slider.append(this.sliderTrack);

        this.sliderItems = slider.querySelectorAll('.slider-item');
        this.slidesCount = this.sliderItems.length;

        this.slideWidth = slider.clientWidth;
        this.trackWidth = this.slideWidth * this.slidesCount;
        this.paginationContainer = null;
        this.autoplayTimerId = null;

        this.setElementsSizes();

        if (arrows) {
            this.createArrows(slider);
        }

        if (pagination) {
            this.paginationContainer = this.createPagination({ slider, slidesCount: this.slidesCount });
        }

        this.handleAutoPlay();


        slider.addEventListener('click', (event) => this.handleSliderClick(event));

        window.addEventListener('resize', () => this.handleWindowResize(slider));
    }

    handleAutoPlay() {
        if (!this.autoPlay) return;

        if (this.autoplayTimerId) {
            clearInterval(this.autoplayTimerId);
        }

        this.autoplayTimerId = setInterval(() => {
            this.slideTo(this.currentSlide + 1);
        }, this.autoPlayTime);
    }

    slideTo(index) {
        if (index < 0) {
            index = this.slidesCount - 1;
        } else if (index >= this.slidesCount) {
            index = 0;
        }

        this.currentSlide = index;
        this.translate = index * this.slideWidth;
        this.sliderTrack.style.transform = `translate3d(-${this.translate}px, 0px, 0px)`;
        this.updatePaginationActiveElement(this.currentSlide);
        this.handleAutoPlay();
    }

    updatePaginationActiveElement(activeIndex) {
        each(this.paginationContainer.children, (child, index) => {
            if (index === activeIndex) {
                child.classList.add('active');
            } else {
                child.classList.remove('active');
            }
        })
    }

    setElementsSizes() {
        each(this.sliderItems, slide =>
            slide.style.width = this.slideWidth + 'px');

        this.sliderTrack.style.width = this.trackWidth + 'px';
        this.translate = this.currentSlide * this.slideWidth;
        this.sliderTrack.style.transform = `translate3d(-${this.translate}px, 0px, 0px)`;
    }

    handleSliderClick(event) {
        const slideArrow = event.target.closest('.slider-arrow');
        const slideDot = event.target.closest('.slider-pagination-dot');

        if (slideArrow) {
            const slideToNum = Number(slideArrow.getAttribute('data-slide-to'));

            this.slideTo(this.currentSlide + slideToNum);
        }

        if (slideDot) {
            const slideToNum = Number(slideDot.getAttribute('data-slide-index'));
            this.slideTo(slideToNum);
        }
    }

    handleWindowResize(slider) {
        this.slideWidth = slider.clientWidth;
        this.trackWidth = this.slideWidth * this.slidesCount;
        this.setElementsSizes();
    }

    createPagination({ slider, slidesCount }) {
        this.container = document.createElement('ul');
        this.container.className = 'slider-pagination-container';
    
        for (let index = 0; index < slidesCount; index++) {
            this.dot = document.createElement('li');
            this.dot.className = 'slider-pagination-dot';
            if (index === 0) {
                this.dot.classList.add('active');
            }
            this.dot.setAttribute('data-slide-index', index);
            this.container.append(this.dot);
        }
    
        slider.append(this.container);
        return this.container;
    }


    createArrows(slider) {
        this.leftArrow = document.createElement('button');
        this.leftArrow.setAttribute('data-slide-to', '-1');
        this.leftArrow.className = 'slider-arrow slider-left-arrow';
        this.leftArrow.textContent = '<';
    
        this.rightArrow = document.createElement('button');
        this.rightArrow.setAttribute('data-slide-to', '1');
        this.rightArrow.className = 'slider-arrow slider-right-arrow';
        this.rightArrow.textContent = '>';
    
        slider.append(this.leftArrow);
        slider.append(this.rightArrow);
    }
}


function each(collection, cb) {
    for (let index = 0; index < collection.length; index++) {
        const element = collection[index];
        cb(element, index);
    }
}
const sliders = document.querySelectorAll('.slider');

each(sliders, function (slider) {
    new Slider({
        container: slider,
        arrows: true,
        pagination: true,
        autoPlay: true,
        autoPlayTime: 3000,
        animationTime: 1000,
    });
});