$(document).ready(function () {

   // Function to make IE9+ support forEach:
   (function () {
      if (typeof NodeList.prototype.forEach === "function")
         return false;
      else
         NodeList.prototype.forEach = Array.prototype.forEach;
   })();

   // svg for IE11
   svg4everybody({});
   
   const navbar = document.querySelector('.header__navbar')
   init();
   

// ----------------------- PLUGINS

   function magnificPopupsInit() {
      let blocks = document.querySelectorAll('.p-menu__block');
      $('.header__burger-link').magnificPopup({
         type: 'inline',
         preloader: true,
         removalDelay: 300,
         mainClass: 'custom-mfp',
         showCloseBtn: false,
         fixedContentPos: true,
         fixedBgPos: true,

         callbacks: {
            open: function () {
               $('.p-menu__close-btn').on('click', function (event) {
                  event.preventDefault();
                  $.magnificPopup.close();
               });
               setTimeout(() => {
                  blocks.forEach(el => {
                     el.classList.add('active');
                  })
               }, 200);
            },
            close: function () {
               blocks.forEach(el => {
                  el.classList.remove('active');
               })
            },
         }
      });
   }

   function slickSlidersInit() {
      let category = $('.menu__category');
      let product = $('.menu__product_mobile');
      let productDesktop = $('.menu__product-slider_desktop')

      category.slick({
         prevArrow: $('.menu__category-arrow_left'),
         nextArrow: $('.menu__category-arrow_right'),
         infinite: false,
         slidesToShow: 1,
         centerMode: true,
         variableWidth: true,
         focusOnSelect: true
      });

      product.slick({
         prevArrow: $('.menu__product-arrow_left'),
         nextArrow: $('.menu__product-arrow_right'),
         infinite: false,
         slidesToShow: 1,
         centerMode: true,
         variableWidth: true,
         mobileFirst: true,
      });

      productDesktop.slick({
         arrows: true,
         prevArrow: $('.menu__product-slider-arrow_left'),
         nextArrow: $('.menu__product-slider-arrow_right'),
         dots: true,
         dotsClass: 'menu__product-item-dots',
         autoplay: true,
         infinite: true,
         fade: true,
         cssEase: 'linear'
      });

      $('.offer__list_mobile').slick({
         arrows: false,
         autoplay: true,
         infinite: true,
         slidesToShow: 1,
         centerMode: true,
         variableWidth: true
      });

      $('.offer__list_desktop').slick({
         arrows: false,
         autoplay: true,
         infinite: true,
         slidesToShow: 1,
         centerMode: true,
         variableWidth: true,
         mobileFirst: true,
         responsive: [
            {
               breakpoint: 1184,
               settings: {
                  fade: true,
                  variableWidth: false,
                  mobileFirst: false,
                  dots: true,
                  dotsClass: 'offer__list_desktop-dots',

               }
            }
         ]
      });

      $('.partners__slider-list').slick({
         arrows: false,
         autoplay: true,
         infinite: true,
         slidesToShow: 3,
         mobileFirst: true,
         responsive: [
            {
               breakpoint: 680,
               settings: {
                  slidesToShow: 5,
               },
            },
            {
               breakpoint: 1184,
               settings: {
                  slidesToShow: 7,
                  arrows: true,
                  prevArrow: $('.partners__slider-arrow_left'),
                  nextArrow: $('.partners__slider-arrow_right'),
               }
            }
         ]
      });

      // Изменение ширины underline при переключении слайда
      category.on('afterChange', function (event, slick, currentSlide, nextSlide) {
         ajustUnderline(currentSlide)
      });

      // Связывание слайдера категорий и слайдера продуктов
      category.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
         product.slick('slickGoTo', findSlide(nextSlide));
      });
      product.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
         category.slick('slickGoTo', findCategory(nextSlide))
      });

      // Установка динамических точек для слайдера
      document.querySelectorAll('.menu__product-item-dots li').forEach(setDynamicSliderDots)
      document.querySelectorAll('.offer__list_desktop-dots li').forEach(setDynamicSliderDots)

      // Переключение динамических точек по клику
      document.querySelector('.menu__title').addEventListener('click', function () {
         document.querySelector('.product-ring').classList.toggle('product-ring_active')
      })
   }

   function findSlide(categoryIndex) {
      let item = document.querySelector(`[data-product="${categoryIndex}"]`);
      return item.parentElement.parentElement.getAttribute('data-slick-index');
   }

   function findCategory(slideIndex) {
      let item = document.querySelectorAll(`.menu__product-item`)[slideIndex];
      return item.getAttribute('data-product')
   }

   function ajustUnderline(currentSlide) {
      let line = document.querySelector('.menu__category-underline');
      let item = document.querySelector(`[data-slick-index="${currentSlide}"]`)
      let itemWidth = item.clientWidth;
      line.style.width = `${itemWidth - 26}px`
   }

   function setDynamicSliderDots(item) {
      item.innerHTML = `
         <svg class="product-dot" width="20px" height="20px" viewBox="0 0 20 20">
            <g>
               <circle cx="10" cy="10" r="4" fill="#92a9b5"></circle>
               <circle class="product-ring" cx="10" cy="10" r="9" fill="transparent" stroke="#92a9b5" stroke-width="2px">
               </circle>
            </g>
         </svg>`
   }

// ----------------------- SETTINGS

   function init() {
      magnificPopupsInit();
      slickSlidersInit();
      scrollToAnchor();
      setAjustScroll();
      partnersBtnHandler();
      selectHandler();
      setEventListeners();
      pointerAnimate();
      checkNavbarBg();
   }

   function setEventListeners() {
      let menuBtn = document.querySelector('.header__menu-item_select');
      let cityBtn = document.querySelector('.header__location');

      if (document.documentElement.clientWidth > 1183) {
         navbar.addEventListener('mousemove', showNavbarBg);
         navbar.addEventListener('mouseleave', checkNavbarBg);

         menuBtn.addEventListener('mouseover', showDropdown);
         cityBtn.addEventListener('mouseover', showDropdown);
         menuBtn.addEventListener('mouseleave', hideDropdown);
         cityBtn.addEventListener('mouseleave', hideDropdown);
      }
      else {
         navbar.removeEventListener('mousemove', showNavbarBg)
         menuBtn.removeEventListener('mouseover', showDropdown);
         cityBtn.removeEventListener('mouseover', showDropdown);
         menuBtn.removeEventListener('mouseleave', hideDropdown);
         cityBtn.removeEventListener('mouseleave', hideDropdown);
      }

      document.addEventListener('scroll', checkNavbarBg);
      window.addEventListener('resize', setEventListeners);
   }

   
// ----------------------- HEADER
   function showNavbarBg() {
      navbar.classList.add('header__navbar_white') 
   }
   function hideNavbarBg() {
      window.pageYOffset > 0 ? '' : navbar.classList.remove('header__navbar_white') 
   }
   function checkNavbarBg() {
      window.pageYOffset > 0 ? navbar.classList.add('header__navbar_white') : navbar.classList.remove('header__navbar_white');
   }

   function showDropdown() {
      let element = this.getAttribute('data-dropdown');
      let dropdown = document.querySelector(element);

      dropdown.classList.add('header__dropdown-active');
      dropdown.addEventListener('mouseover', function () {
         this.classList.add('header__dropdown-active')
      })
   }
   function hideDropdown() {
      let dropdowns = document.querySelectorAll('.header__dropdown')
      setTimeout(() => {
         showNavbarBg();
      }, 0);
      dropdowns.forEach(item => {
         item.classList.remove('header__dropdown-active');
         item.addEventListener('mouseleave', function () {
            this.classList.remove('header__dropdown-active');
            hideNavbarBg();
         });
      });
   }
  
   function pointerAnimate() {
      let pointerIcon = document.querySelector('.header__icon-pointer');
      let pointerShift = 0;
      setInterval(() => {
         pointerShift -= 73;
         pointerShift < -292 ? pointerShift = 0 : '';
         pointerIcon.style.left = pointerShift + 'px'
      }, 1000);
   }

   function scrollToAnchor() {
      let pointer = document.querySelector('.header__arrow-block');
      pointer.addEventListener('click', function (e) {

         let menuSection = document.querySelector('.content')
         window.scrollTo({
            top: getCoords(menuSection).top - 64,
            behavior: 'smooth'
         });
      });
   }

   function getCoords(elem) {
      var box = elem.getBoundingClientRect();
      return {
         top: box.top + window.pageYOffset,
         left: box.left + window.pageXOffset
      }
   }


// ----------------------- CONTENT 

   function setAjustScroll() {
      // Координаты блока
      let content = document.querySelector('.content');
      let position = content.offsetTop;

      // Координаты, с которых идет адаптивный скролл
      let start = position + 70;
      let stop = position + content.offsetHeight - document.documentElement.clientHeight;

      // Разница в высоте между колонками
      let staticBlock = document.querySelector('.content__column_static');
      let dynamicBlock = document.querySelector('.content__column_dynamic');
      let heightDiff = dynamicBlock.offsetHeight - staticBlock.offsetHeight;

      let current;
      let translate = 0;

      setTranslate();

      // Обработка скролла
      document.addEventListener('scroll', setTranslate);

      function setTranslate() {
         if (document.documentElement.clientWidth > 1183) {
            if (window.pageYOffset > start && window.pageYOffset < stop) {
               current = window.pageYOffset - start;
               translate = current * heightDiff / (stop - start);
            };
            if (window.pageYOffset < start) translate = 0
            else if (window.pageYOffset > stop) translate = heightDiff;
            dynamicBlock.style.transform = `translateY(-${translate}px)`
         }
         else dynamicBlock.style.transform = ``;
      }
   };


// ----------------------- PARTNERS

   function partnersBtnHandler(params) {
      let partnersBtns = document.querySelectorAll('.partners__btn');
      partnersBtns.forEach(item => {
         item.addEventListener('click', function (e) {
            e.preventDefault();
            partnersBtns.forEach(btn => btn.classList.add('partners__btn_wo-border'))
            this.classList.remove('partners__btn_wo-border');
         })
      })
   }


// ----------------------- SELECT

   function selectHandler() {
      // Обработчики клика на все селекты
      let selects = document.querySelectorAll('.select')
      selects.forEach(item => {
         item.addEventListener('click', () => {
            item.classList.toggle('select_active');
            item.querySelector('.select__dropdown').classList.toggle('select__dropdown_active');

         });

         // Обработчики клика по опциям
         let options = item.querySelectorAll('.select__option');
         options.forEach(el => {
            el.addEventListener('click', function () {
               item.querySelector('.select__value').innerText = el.innerText;
               item.querySelector('.select__option_selected').classList.remove('select__option_selected')
               el.classList.add('select__option_selected')
            });
         });
      });

      // Закрытие дропдауна при клике вне селекта
      document.addEventListener('click', outsideEvtListener);

      function outsideEvtListener(e) {
         let el = document.querySelector('.select_active');

         if (el == null) return;
         if (e.target === el || el.contains(e.target)) return;
         el.classList.remove('select_active');
         el.querySelector('.select__dropdown').classList.toggle('select__dropdown_active');
      }
   }
});