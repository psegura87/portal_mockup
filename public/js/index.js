$(document).ready(function() {

    let isOpen = false;
    let lastData;
    var evColor;

    function open(data) {
        var iframe = $('<iframe class="vidF" width="100%" height="100%" src="'+data+'" frameborder="0" allowfullscreen autoplay>');
        iframe.appendTo('#video');
        $('#video').css('width', '280px');
        lastData = data;
        isOpen = true;
    }

    $('.cover').on('click', function() {
        let data = $(this).data('vid');
        if (isOpen && lastData != data){
            $('.vidF').attr('src', data);
            lastData = data;
        } else if (!isOpen) {
            open(data);
        } else {
            $('#video').css('width', '0px');
            isOpen = false;
            setTimeout(function() {
                $('#video').empty();
            }, 1000);
        }
    })

    function resetHover() {
        $('.evX').on('mouseenter', function () {
            evColor = $(this).css('background-color');
            $(this).css('background-color', '#ddd');
        });
        $('.evX').on('mouseleave', function () {
            $(this).css('background-color', evColor);
        });
    }

    resetHover();

    $('svg').on('click', resetHover);

    $('.paths, #burwood').on('mouseenter', function() {
        $('#health-modal').css('opacity', '1');
    })
    $('.paths, #burwood').on('mouseleave', function() {
        $('#health-modal').css('opacity', '0');
    })

    var checked = false;

    $('#subscription-details').on('click', function() {
        if (!checked) {
            $('#contract-contain').css('margin-bottom', '0px');
            $('.tabs').hide();
            checked = true;
        } else {
            $('#contract-contain').css('margin-bottom', '-80px');
            $('.tabs').show();
            checked = false;
        }
    })

})
