
const showPrivacy = () => {
    $('#modal_title_content').text("AQR 개인정보처리방침");
    $('#modal_body_content').load("privacy.html");
    $('#modal-3').modal({"show" : true});
};

const showService = () => {
    $('#modal_title_content').text("AQR 이용약관");
    $('#modal_body_content').load("service.html");
    $('#modal-3').modal({"show" : true});
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

$(function() {
	$(window).on('scroll', function() {        
        stickToTop();
    });

	$('[data-youtube]').youtube_background();

	AAPI_setContactForm("aqrcontact");
});
