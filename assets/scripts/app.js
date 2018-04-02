$(document).ready(function(){
  $(".flexnav").flexNav();
  // Slick Carousel
  $('.slick').slick({
    autoplay: true,
    arrows: false,
    fade: true,
    autoplaySpeed: 15000
  });

  // Select Dropdown jump to results
  $('select.scroller').on('change',function (e) {
    e.preventDefault(); // no need to use this line
    var target = $(this).val();
    var $target = $(target);

    $('html, body').animate({
        'scrollTop': $target.offset().top
    }, 1000, 'swing', function () {  // swing here will work if you include jquery-ui  without that it will not make a effect
        //window.location.hash = target;
    });
  }).change();



});

jQuery(document).ready(function() {
    jQuery('.tabs .tab-links a').on('click', function(e)  {
        var currentAttrValue = jQuery(this).attr('href');

        // Show/Hide Tabs
        jQuery('.tabs ' + currentAttrValue).show().siblings().hide();

        // Change/remove current tab to active
        jQuery(this).parent('li').addClass('active').siblings().removeClass('active');

        e.preventDefault();
    });
});
