(function($, ga) {

  /**
   * Menu Open / Close
   */

  let menu = (action = true) => {
    if (action) {
      $('menu').addClass('active');
      $('body').css({
        'overflow-y': 'hidden'
      });
      ga('send', 'event', 'menu', 'status', 'open');
    } else {
      $('menu').removeClass('active');
      $('body').css({
        'overflow-y': 'scroll'
      });
      ga('send', 'event', 'menu', 'status', 'close');
    }
  };

  /**
   * Menu toggle
   */

  $('.menu-toggle').on('click', (e) => {
    menu(!$('menu').hasClass('active'));
    e.preventDefault();
  });

  /**
   * Menu fechar ao clicar na "área escura / fora do menu"
   */

  $('menu').on('click', (e) => {
    if (e.target.tagName === 'MENU') {
      menu(false);
    }
    e.preventDefault();
  });


  /**
   * Menu Swipe (Mobile)
   */

  $(window).on('swipeleft', () => menu(true));

  $(window).on('swiperight', () => menu(false));

  /**
   * Menu links
   */

  $('[href^="#"]').on('click', (e) => {
    if ($('menu.active').length) {
      menu(false);
    }
    if (e.currentTarget.hash.length > 1) {
      let el = $(e.currentTarget.hash);
      if (el.length) {
        $('body').animate({
          scrollTop: el.offset().top - 10
        });
      }
    }
    e.preventDefault();
  });

  /**
   * Tracking click urls
   */

  $('[data-tracking-label]').on('click', (e) => {
    ga('send', 'event', 'link', 'click', $(e.currentTarget).data('tracking-label'));
  });

  $('[href]:not([data-tracking-label])').on('click', (e) => {
    ga('send', 'event', 'link', 'click', $(e.currentTarget).text());
  });

  /**
   * Tracking sections views
   */

   let sections = [];

   $('section').each((i, e) => {
     sections.push({
       top: $(e).offset().top,
       label: $(e).attr('id'),
       element: e
     });
   });

   let tracked_sections = {};

   $(window).on('scroll', (e) => {
     let top = $('body').scrollTop();
     let bottom = top + $(window).height();
     sections.forEach((section) => {
       if (section.top >= top && section.top <= bottom && !tracked_sections[section.label]) {
         tracked_sections[section.label] = true;
         ga('send', 'event', 'section', 'view', section.label);
       }
     });
   });

   window.scrollTo(0, 1);

})(jQuery, ga);
