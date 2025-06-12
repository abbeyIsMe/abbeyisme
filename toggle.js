// $(function() {
//     // Your code goes here
//     // $("button").on("click", function() {
//     //     $('form').fadeIn();
//     //     $('#search-bar').focus();
//     // })
//     // $(".close-button").on("click", function() {
//     //     $('form').fadeOut();
//     //     $('.close-button').focus();
//     // })
//     $(window).on("scroll", function() {
//         let dis = $(window).scrollTop();
//         let height = $('header').height();
//         if (dis > height) {
//             $('.navigation').addClass("scroll");
//         } else
//             $('.navigation').removeClass("scroll");
//     })
// });
$(function() {
    $(window).on("scroll", function() {
        let dis = $(window).scrollTop();
        let height = $('header').height();
        if (dis > height) {
            $('.navigation').addClass("scroll");
        } else {
            $('.navigation').removeClass("scroll");
        }
    });
});