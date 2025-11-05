$(document).ready(function() {
  $('.intro').hide().fadeIn(1000);
  $('.story-div').css({opacity: 0, position: 'relative', left: '-50px'});
  $('.mission-div').css({opacity: 0, position: 'relative', right: '-50px'});

  $(window).on('scroll', function() {
    $('.story-div').each(function() {
      if ($(this).offset().top < $(window).scrollTop() + $(window).height() - 100) {
        $(this).animate({opacity: 1, left: 0}, 800);
      }
    });
  });

  $(window).on('scroll', function() {
    $('.mission-div').each(function() {
      if ($(this).offset().top < $(window).scrollTop() + $(window).height() - 100) {
        $(this).animate({opacity: 1, right: 0}, 800);
      }
    });
  });
});
