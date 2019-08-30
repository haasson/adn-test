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
});
console.log(1);


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



let pointer = document.querySelector('.icon-pointer');
let pointerShift = 0;
setInterval(() => {
   pointerShift -= 73;
   pointerShift < -292 ? pointerShift = 0 : '';
   pointer.style.left = pointerShift + 'px'
}, 1000);