let blocks = document.querySelectorAll('.block1');


// --- Magnific Popup Settings ---

$(document).ready(function () {
   $('.popup-with-form').magnificPopup({
      type: 'inline',
      preloader: true,
      mainClass: 'custom-mfp-bg',
      removalDelay: 300,

      callbacks: {
         open: function () {
            setTimeout(() => {
               blocks.forEach(el => {
                  el.classList.add('active');
               })
            }, 100);
         },
         close: function () {
            blocks.forEach(el => {
               el.classList.remove('active');
            })
         },
      }
   });


// --- Slick Sliders ---

   let category = $('.menu__category');
   let product = $('.menu__product');

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
      variableWidth: true
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
      variableWidth: true
   });


   category.on('afterChange', function (event, slick, currentSlide, nextSlide) {
      ajustUnderline(currentSlide)
   });
   category.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
      product.slick('slickGoTo', findSlide(nextSlide));
   });

   product.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
      category.slick('slickGoTo', findCategory(nextSlide))

   });


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






   // --------- HEADER



   let navbar = document.querySelector('.header__navbar')
   let menuBtn = document.querySelector('.header__menu-item_select');
   let cityBtn = document.querySelector('.header__location');
   let dropdowns = document.querySelectorAll('.header__dropdown')


   document.addEventListener('scroll', function () {
      window.pageYOffset > 0 ? showNavbarBg() : hideNavbarBg();
   })

   function showNavbarBg() {
      navbar.classList.add('header__navbar_white')
   }
   function hideNavbarBg() {
      navbar.classList.remove('header__navbar_white')
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

   function init() {
      if (document.documentElement.clientWidth > 1183) {
         navbar.addEventListener('mousemove', showNavbarBg)
         navbar.addEventListener('mouseleave', function () {
            window.pageYOffset === 0 ? hideNavbarBg() : '';
         });

         menuBtn.addEventListener('mouseover', showDropdown);
         cityBtn.addEventListener('mouseover', showDropdown);
         menuBtn.addEventListener('mouseleave', hideDropdown);
         cityBtn.addEventListener('mouseleave', hideDropdown);
      }
      else {
         navbar.removeEventListener('mousemove', showNavbarBg)
         menuBtn.removeEventListener('mouseover', showDropdown);
         cityBtn.removeEventListener('mouseover', showDropdown);
      }

      
   }

   init();
   window.addEventListener('resize', function () {
      init();
   })



   let pointerIcon = document.querySelector('.icon-pointer');
   let pointerShift = 0;
   setInterval(() => {
      pointerShift -= 73;
      pointerShift < -292 ? pointerShift = 0 : '';
      pointerIcon.style.left = pointerShift + 'px'
   }, 1000);

   let pointer = document.querySelector('.header__arrow-block');
   pointer.addEventListener('click', function (e) {
      let menuSection = document.querySelector('.menu')
      window.scrollTo({
         top: getCoords(menuSection).top - 64,
         behavior: 'smooth'
      });
   });

   function getCoords(elem) {
      var box = elem.getBoundingClientRect();
      return {
         top: box.top + pageYOffset,
         left: box.left + pageXOffset
      }
   }
});