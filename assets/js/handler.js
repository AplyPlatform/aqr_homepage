
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

    $("#form_contact_min_type_2").click(function () {
        let isChecked = $(this).is(":checked");
		if (isChecked) {
		  let str = $("#form_contact_content").val();
		  if (str.includes("고급 고유 URL") && str.includes("비영리 공익/사회적 기업 및 단체") && str.includes("고급 고유 URL을 위한 키워드 후보 1")) return;
		  $("#form_contact_content").val("* 고급 고유 URL은 비영리 공익/사회적 기업 및 단체, 제휴 기업에게 무상으로 제공합니다.\n\n-고유 URL :\n-기업/단체명 :\n-고급 고유 URL을 위한 키워드 후보 1 Ex) mycompany1 :\n-고급 고유 URL을 위한 키워드 후보 2 Ex) mycompany2 :\n" + $("#form_contact_content").val());
		}
    });

    if (AAPI_isSet(getCookie("ref1"))) return;
    if (AAPI_isSet(document.referrer) == false) {
        setCookie("ref1", "", 1)
    }
    else {
        setCookie("ref1", document.referrer, 1);
    }

    if ($('[data-youtube]').length > 0)
        $('[data-youtube]').youtube_background();
});
