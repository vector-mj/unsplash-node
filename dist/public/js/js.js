$(function(){
    // $('.aside').toggle();
        $('.aside').click(function(){
            var vwith = $('.aside').width()==280?'80px':'280px';
            $('.aside').css("width",vwith);
        });

});
// $(document).on("resize",function(){
//     var vwith = $(document).width()>1000?'auto':'0px';
//     $('.right-menu').animate({"width":vwith},100);
// });