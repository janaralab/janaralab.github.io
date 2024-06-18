/**
* Template Name: UpConstruction - v1.3.0
* Template URL: https://bootstrapmade.com/upconstruction-bootstrap-construction-website-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Mobile nav toggle
   */

  const mobileNavShow = document.querySelector('.mobile-nav-show');
  const mobileNavHide = document.querySelector('.mobile-nav-hide');

  document.querySelectorAll('.mobile-nav-toggle').forEach(el => {
    el.addEventListener('click', function(event) {
      event.preventDefault();
      mobileNavToogle();
    })
  });

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavShow.classList.toggle('d-none');
    mobileNavHide.classList.toggle('d-none');
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navbar a').forEach(navbarlink => {

    if (!navbarlink.hash) return;

    let section = document.querySelector(navbarlink.hash);
    if (!section) return;

    navbarlink.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  const navDropdowns = document.querySelectorAll('.navbar .dropdown > a');

  navDropdowns.forEach(el => {
    el.addEventListener('click', function(event) {
      if (document.querySelector('.mobile-nav-active')) {
        event.preventDefault();
        this.classList.toggle('active');
        this.nextElementSibling.classList.toggle('dropdown-active');

        let dropDownIndicator = this.querySelector('.dropdown-indicator');
        dropDownIndicator.classList.toggle('bi-chevron-up');
        dropDownIndicator.classList.toggle('bi-chevron-down');
      }
    })
  });

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    const togglescrollTop = function() {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
    window.addEventListener('load', togglescrollTop);
    document.addEventListener('scroll', togglescrollTop);
    scrollTop.addEventListener('click', window.scrollTo({
      top: 0,
      behavior: 'smooth'
    }));
  }

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Porfolio isotope and filter
   */
  let portfolionIsotope = document.querySelector('.portfolio-isotope');

  if (portfolionIsotope) {

    let portfolioFilter = portfolionIsotope.getAttribute('data-portfolio-filter') ? portfolionIsotope.getAttribute('data-portfolio-filter') : '*';
    let portfolioLayout = portfolionIsotope.getAttribute('data-portfolio-layout') ? portfolionIsotope.getAttribute('data-portfolio-layout') : 'masonry';
    let portfolioSort = portfolionIsotope.getAttribute('data-portfolio-sort') ? portfolionIsotope.getAttribute('data-portfolio-sort') : 'original-order';

    window.addEventListener('load', () => {
      let portfolioIsotope = new Isotope(document.querySelector('.portfolio-container'), {
        itemSelector: '.portfolio-item',
        layoutMode: portfolioLayout,
        filter: portfolioFilter,
        sortBy: portfolioSort
      });

      let menuFilters = document.querySelectorAll('.portfolio-isotope .portfolio-flters li');
      menuFilters.forEach(function(el) {
        el.addEventListener('click', function() {
          document.querySelector('.portfolio-isotope .portfolio-flters .filter-active').classList.remove('filter-active');
          this.classList.add('filter-active');
          portfolioIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
          if (typeof aos_init === 'function') {
            aos_init();
          }
        }, false);
      });

    });

  }

  /**
   * Init swiper slider with 1 slide at once in desktop view
   */
  new Swiper('.slides-1', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });

  /**
   * Init swiper slider with 2 slides at once in desktop view
   */
  new Swiper('.slides-2', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 2,
        spaceBetween: 20
      }
    }
  });

  /**
   * Initiate pURE cOUNTER
   */
  new PureCounter();

  /**
   * Animation on scroll function and init
   */
  function aos_init() {
    AOS.init({
      duration: 800,
      easing: 'slide',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', () => {
    aos_init();
  });

  $('#papers').DataTable({
    "ajax": {
      "url": 'https://dblp.org/search/publ/api?q=aaron%20visaggio&h=200&format=json',
      "dataSrc": function(json) {
        var papers = [];

        try {
          if (json.result && json.result.hits && Array.isArray(json.result.hits.hit)) {
            papers = json.result.hits.hit;
            
            return papers.map(function(paper) {
              var title = paper.info.title || "Unknown Title";
              if (title.endsWith('.')) {
                title = title.slice(0, -1);
              }

              var authors = "Unknown Authors";
              if (paper.info.authors && Array.isArray(paper.info.authors.author)) {
                authors = paper.info.authors.author.map(function(author) {
                  return author && author.text ? author.text : "Unknown Author";
                }).join(', ');
              }

              var year = paper.info.year || "Unknown Year";
              var venue = paper.info.venue || "Unknown Venue";

              var pdfLink = '';
              if (paper.info.ee && typeof paper.info.ee === 'string' && paper.info.ee.startsWith('http')) {
                pdfLink = '<a href="' + paper.info.ee + '" target="_blank">Paper</a>';
              }

              return [authors, title, venue, year, pdfLink];
            });
          } else {
            console.error("Invalid data structure", json);
            return [];
          }
        } catch (error) {
          console.error("An error occurred while processing the papers data:", error);
          return [];
        }
      }
    },
    "searching": false,
    "info": false,
    "order": [[3, 'desc']],
    "scrollX": true,
    "columns": [
      { "title": "Authors" },
      { "title": "Title" },
      { "title": "Venue" },
      { "title": "Year" },
      { "title": "PDF Link" }
    ],
    "dom": 'Bfrtip',
    "buttons": [
      {
        extend: 'excelHtml5',
        text: '<i class="fa-solid fa-file-excel"></i>',
        titleAttr: 'Export to excel',
        customize: function( xlsx ) {

          var sheet = xlsx.xl.worksheets['sheet1.xml'];

          $('row c', sheet).each( function () {

              if ( $('is t', this).text().indexOf("http") === 0 ) {

                  $(this).attr('t', 'str');
                  $(this).append('<f>' + 'HYPERLINK("'+$('is t', this).text()+'","PDF Link")'+ '</f>');
                  $('is', this).remove();
                  $(this).attr( 's', '4' );
              }
          });
          },
        exportOptions: {
          columns: ':visible',
          format: {
            body: function(data, row, column, node) {
              return column === 4 ? $(data).attr('href') : data;
            }
          }
        }
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="fa-solid fa-file-pdf"></i>',
        titleAttr: 'Export to pdf',
        customize: function(doc) {
              var body = doc.content[1].table.body;
              body.forEach(function(row) {
                  row.forEach(function(cell) {
                      if (typeof cell.text === 'string' && cell.text.startsWith('http')) {
                          cell.text = {
                              text: 'PDF Link',
                              link: cell.text,
                              color: 'blue',
                              decoration: 'underline'
                          };
                      }
                  });
              });
          },
          exportOptions: {
              columns: ':visible',
              format: {
                  body: function(data, row, column, node) {
                      if (column === 4) {
                          var url = $(data).attr('href');
                          return url ? url : 'No link';
                      }
                      return data;
                  }
              }
          }
      }
  ]
  });
});