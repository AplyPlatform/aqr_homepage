
const showService = () => {
    $('#modal_title_content').text("AQR 이용약관");
    $('#contact_privacy_body_content').load("service.html");
    $('#contactPrivacyDialog').modal({ "show": true });
};

function stickToTop() {
    let ntop = 65;
    let winScrollTop = $(window).scrollTop();

    if (winScrollTop >= ntop) {
        $('#bottom_smartstore_button').show();
        $('#bottom_register_button').show();
    } else {
        $('#bottom_smartstore_button').hide();
        $('#bottom_register_button').hide();
    }
}

function setCookie(cName, cValue, cDay) {
    var date = new Date();
    date.setTime(date.getTime() + cDay * 60 * 60 * 24 * 1000);
    document.cookie = cName + '=' + cValue + '; expires=' + date.toUTCString() + '; path=/; domain=.aplx.link';
}

function getCookie(cName) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + cName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));

    return matches ? matches[1] : null;
}

$(function () {
    $(window).on('scroll', function () {
        stickToTop();
    });

    $('[data-youtube]').youtube_background();

    if (AAPI_isSet(getCookie("ref1"))) return;
    if (AAPI_isSet(document.referrer) == false) {
        setCookie("ref1", "", 1)
        return;
    }

    setCookie("ref1", document.referrer, 1);
});
