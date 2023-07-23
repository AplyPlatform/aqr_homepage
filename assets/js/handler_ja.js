let isRecaptchaInit = false;
let appSent = false;

function showDialog(msg, callback) {
	$('#askModalContent').text(msg);
	$('#askModal').modal('show');

	if (callback == null) return;

	$('#askModalOKButton').off('click');
	$('#askModalOKButton').click(function () {
			$('#askModal').modal('hide');
			callback();
	});
}

function showPrivacyDialog() {	
	$('#modal_title_content').text("APLY Privacy Policy");
    $('#modal_body_content').load("privacy_for_email.html");
    $('#modal-3').modal('show');
}

const showPrivacy = () => {
    $('#modal_title_content').text("AQR Privacy Policy");
    $('#modal_body_content').load("privacy.html");
    $('#modal-3').modal({"show" : true});
};

function sendApplicationData(form_id, token)
{
	let min_type = "";
	if ($(form_id).find('input[name="min_type_1"]').is(":checked")) {
		min_type = "/SW개발";
	}

	if ($(form_id).find('input[name="min_type_2"]').is(":checked")) {
		min_type = min_type + "/제휴 및 협업";
	}

	if ($(form_id).find('input[name="min_type_3"]').is(":checked")) {
		min_type = min_type + "/서비스 적용";
	}

	if ($(form_id).find('input[name="min_type_4"]').is(":checked")) {
		min_type = min_type + "/서비스 문의";
	}

	let form_content = $("#form_content").val();
	if (form_content == "") {
		showDialog("お問い合わせ内容を入力してください。", null);
		if ($('div').is('.page-loader')) {
			$('.page-loader').delay(200).fadeOut(800);
		}
		return false;
	}

	let form_phone = $(form_id).find('input[name="form_phone"]').val();
	if (form_phone == "") {
		showDialog("電話番号を入力してください。", null);
		if ($('div').is('.page-loader')) {
			$('.page-loader').delay(200).fadeOut(800);
		}
		return false;
	}

	let form_email = $(form_id).find('input[name="form_email"]').val();
	if (form_email == "") {
		showDialog("メールを入力してください。", null);
		if ($('div').is('.page-loader')) {
			$('.page-loader').delay(200).fadeOut(800);
		}
		return false;
	}

	if ($(form_id).find("#agree_1").length > 0 && $(form_id).find("#agree_1").is(":checked") == false) {
		showDialog("個人情報の処理方針に同意してください。", null);
		if ($('div').is('.page-loader')) {
			$('.page-loader').delay(200).fadeOut(800);
		}
		return false;
	}

	$(form_id).find('input[name="form_token"]').val(token);
	
	let ref = $('<input type="hidden" value="' + document.referrer + '" name="ref">');	
	$(form_id).append(ref);	
	ref = $('<input type="hidden" value="' + min_type + '" name="min_type">');	
	$(form_id).append(ref);	
	ref = $('<input type="hidden" value="aqrcontact" name="form_kind">');	
	$(form_id).append(ref);
		
	let sed = new FormData($(form_id)[0]);

	$("#email_up_send").hide();
	$("#sending_progress").show();

	if (isRecaptchaInit == true) {
		grecaptcha.execute('6LfPn_UUAAAAAN-EHnm2kRY9dUT8aTvIcfrvxGy7', {action: 'homepage'}).then(function(token) {
			$(form_id).find('input[name="form_token"]').val(token);
			let fed = new FormData($(form_id)[0]);
			   ajaxRequest(fed, form_id);
		});
	}
	else {
		grecaptcha.ready(function() {
			isRecaptchaInit = true;
			grecaptcha.execute('6LfPn_UUAAAAAN-EHnm2kRY9dUT8aTvIcfrvxGy7', {action: 'homepage'}).then(function(token) {
				$(form_id).find('input[name="form_token"]').val(token);
				let fed = new FormData($(form_id)[0]);
				   ajaxRequest(fed, form_id);
			});
		});
	}	
}

function ajaxRequest(fed, form_id) {
	$.ajax({
		type: "POST",
		url: 'https://aply.biz/contact/',
		crossDomain: true,
		dataType: "json",
		data:sed,
		enctype: 'multipart/form-data', // 필수
		processData: false,
    	contentType: false,
    	cache: false,
		success: function (data) {
			if (data.result == "success") {
				showDialog("転送が完了しました。 APLYから連絡いたします。", function(){
					location.href = "./index_ja.html";
					return;
				});
			}
			else {
				showDialog("エラーが発生しました。 しばらくしてからもう一度お試しください。 : " + data.message , null);
				$("#email_up_send").show();
				$("#sending_progress").hide();
			}

			$(form_id + " input").last().remove();
			if ($('div').is('.page-loader')) {
				$('.page-loader').delay(200).fadeOut(800);
			}
		},
		error: function(jqXHR, text, error){
			showDialog("申し訳ありません、一時的なエラーが発生しました。 もう一度お試しください。", null);
			if ($('div').is('.page-loader')) {
				$('.page-loader').delay(200).fadeOut(800);
			}

			$("#email_up_send").show();
			$("#sending_progress").hide();
		}
	});
}


function setSubmitHandler(form_p_id) {
	var form_id = "#" + form_p_id;

	$(form_id + "_send").on("click", function(e) {
		e.preventDefault();

		if (appSent == true) {
			if (confirm('すでに転送した内容があります。 もう一度進めますか？')) {	}
			else {
			  return;
			}
		}

		$('.page-loader').show();
		
		grecaptcha.ready(function() {
	      grecaptcha.execute('6LfPn_UUAAAAAN-EHnm2kRY9dUT8aTvIcfrvxGy7', {action: 'homepage'}).then(function(token) {
	         sendApplicationData(form_id, token);
	      });
	  });
	});

	$('[name^=form_phone]').keypress(validateNumber);
}

function setPage() {
	setSubmitHandler("email_up");

	grecaptcha.ready(function() {
		isRecaptchaInit = true;		
	});
}

function validateNumber(event) {
    var key = window.event ? event.keyCode : event.which;
    if (event.keyCode === 8 || event.keyCode === 46) {
        return true;
    } else if ( key < 48 || key > 57 ) {
        return false;
    } else {
        return true;
    }
}

function isSet(value) {
  if (value == "" || value == null || value == "undefined") return false;

  return true;
}