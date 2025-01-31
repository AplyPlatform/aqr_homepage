
const showService = () => {
    $('#modal_title_content').text("AQR 이용약관");
    $('#contact_privacy_body_content').load("service.html");
    $('#contactPrivacyDialog').modal({"show" : true});
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
});
