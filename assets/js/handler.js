let CUR_PAGE = "main";

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
        setCookie("ref1", document.referrer + "&from=aqrhome", 1);
    }

    if ($('[data-youtube]').length > 0)
        $('[data-youtube]').youtube_background();


    $("#btn_register_light_on_top").click(function() {
        AAPI_GA_EVENT("btn_register_light_on_top", CUR_PAGE, "click");
    });

    $("#btn_register_dark_on_top").click(function() {
        AAPI_GA_EVENT("btn_register_dark_on_top", CUR_PAGE, "click");
    });

    $("#btn_login_light_on_top").click(function() {
        AAPI_GA_EVENT("btn_login_light_on_top", CUR_PAGE, "click");
    });

    $("#btn_login_dark_on_top").click(function() {
        AAPI_GA_EVENT("btn_login_dark_on_top", CUR_PAGE, "click");
    });

    $("#btn_register_in_body_1").click(function() {
        AAPI_GA_EVENT("btn_register_in_body_1", CUR_PAGE, "click");
    });

    $("#btn_manual_download_in_body_1").click(function() {
        AAPI_GA_EVENT("btn_manual_download_in_body_1", CUR_PAGE, "click");
    });

    $("#btn_go_to_widget_page_in_body_1").click(function() {
        AAPI_GA_EVENT("btn_go_to_widget_page_in_body_1", CUR_PAGE, "click");
    });

    $("#btn_go_to_email_up_in_body_1").click(function() {
        AAPI_GA_EVENT("btn_go_to_email_up_in_body_1", CUR_PAGE, "click");
    });

    $("#btn_go_to_email_up_in_body_2").click(function() {
        AAPI_GA_EVENT("btn_go_to_email_up_in_body_2", CUR_PAGE, "click");
    });

    $("#btn_slide_image_prev").click(function() {
        AAPI_GA_EVENT("btn_slide_image_prev", CUR_PAGE, "click");
    });

    $("#btn_slide_image_next").click(function() {
        AAPI_GA_EVENT("btn_slide_image_next", CUR_PAGE, "click");
    });

    $("#btn_go_to_aqr_store_in_body_1").click(function() {
        AAPI_GA_EVENT("btn_go_to_aqr_store_in_body_1", CUR_PAGE, "click");
    });

    $("#form_contact_send").click(function() {
        AAPI_GA_EVENT("btn_contact_sent", CUR_PAGE, "click");
    });

    $("#btn_main_on_related_site").click(function() {
        AAPI_GA_EVENT("btn_main_on_related_site", CUR_PAGE, "click");
    });

    $("#btn_aply_on_related_site").click(function() {
        AAPI_GA_EVENT("btn_aply_on_related_site", CUR_PAGE, "click");
    });

    $("#btn_widget_on_related_site").click(function() {
        AAPI_GA_EVENT("btn_widget_on_related_site", CUR_PAGE, "click");
    });

    $("#btn_plate_on_related_site").click(function() {
        AAPI_GA_EVENT("btn_plate_on_related_site", CUR_PAGE, "click");
    });

    $("#btn_give_on_related_site").click(function() {
        AAPI_GA_EVENT("btn_give_on_related_site", CUR_PAGE, "click");
    });

    $("#btn_aqrm_on_related_site").click(function() {
        AAPI_GA_EVENT("btn_aqrm_on_related_site", CUR_PAGE, "click");
    });

    $("#btn_aplx_on_related_site").click(function() {
        AAPI_GA_EVENT("btn_aplx_on_related_site", CUR_PAGE, "click");
    });

    $("#btn_qr_on_related_site").click(function() {
        AAPI_GA_EVENT("btn_qr_on_related_site", CUR_PAGE, "click");
    });

    $("#btn_instagram_on_bottom").click(function() {
        AAPI_GA_EVENT("btn_instagram_on_bottom", CUR_PAGE, "click");
    });

    $("#btn_facebook_on_bottom").click(function() {
        AAPI_GA_EVENT("btn_facebook_on_bottom", CUR_PAGE, "click");
    });

    $("#btn_linkedin_on_bottom").click(function() {
        AAPI_GA_EVENT("btn_linkedin_on_bottom", CUR_PAGE, "click");
    });

    $("#btn_aply_on_footer").click(function() {
        AAPI_GA_EVENT("btn_aply_in_footer", CUR_PAGE, "click");
    });

    $("#form_contact_privacy_link").click(function() {
        AAPI_GA_EVENT("btn_privacy_policy_in_mailup", CUR_PAGE, "click");
    });

    $("#bottom_smartstore_button").click(function() {
        AAPI_GA_EVENT("btn_go_to_aqr_store_in_floating", CUR_PAGE, "click");
    });

    $("#bottom_register_button").click(function() {
        AAPI_GA_EVENT("btn_register_in_floating", CUR_PAGE, "click");
    });

    $("#btn_support_apps_in_index").click(function() {
        AAPI_GA_EVENT("btn_support_apps_in_index", CUR_PAGE, "click");
    });

    $("#btn_howto_payapp_set_in_index").click(function() {
        AAPI_GA_EVENT("btn_howto_payapp_set_in_index", CUR_PAGE, "click");
    });

    $("#btn_howto_widget_set_in_index").click(function() {
        AAPI_GA_EVENT("btn_howto_widget_set_in_index", CUR_PAGE, "click");
    });

    $("#btn_howto_bulk_in_index").click(function() {
        AAPI_GA_EVENT("btn_howto_bulk_in_index", CUR_PAGE, "click");
    });

    $("#btn_price_in_index").click(function() {
        AAPI_GA_EVENT("btn_price_in_index", CUR_PAGE, "click");
    });

    $("#btn_custom_price_in_index").click(function() {
        AAPI_GA_EVENT("btn_custom_price_in_index", CUR_PAGE, "click");
    });

    $("#btn_more_in_index").click(function() {
        AAPI_GA_EVENT("btn_more_in_index", CUR_PAGE, "click");
    });

    $("#btn_goto_jebo_blog_1").click(function() {
        AAPI_GA_EVENT("btn_goto_jebo_blog_1", CUR_PAGE, "click");
    });

    $("#btn_goto_aqr_square_1").click(function() {
        AAPI_GA_EVENT("btn_goto_aqr_square_1", CUR_PAGE, "click");
    });

    $("#btn_goto_aply_blog_1").click(function() {
        AAPI_GA_EVENT("btn_goto_aply_blog_1", CUR_PAGE, "click");
    });

    $("#btn_download_xlsx_example_file").click(function() {
        AAPI_GA_EVENT("btn_download_xlsx_example_file", CUR_PAGE, "click");
    });

    $("#btn_go_to_email_up_in_body_2").click(function() {
        AAPI_GA_EVENT("btn_go_to_email_up_in_body_2", CUR_PAGE, "click");
    });

    $("#btn_download_xlsx_example_file").click(function() {
        AAPI_GA_EVENT("btn_download_xlsx_example_file", CUR_PAGE, "click");
    });

    $("#btn_download_xlsx_example_file").click(function() {
        AAPI_GA_EVENT("btn_download_xlsx_example_file", CUR_PAGE, "click");
    });
});
