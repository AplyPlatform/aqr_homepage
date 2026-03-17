// 글자 수 카운터
function updateCharCount(inputId, countId) {
  var input = document.getElementById(inputId);
  var count = document.getElementById(countId);
  input.addEventListener('input', function () {
    var len = this.value.length;
    count.textContent = len + ' / 20';
    if (len >= 20) {
      count.classList.add('over');
    } else {
      count.classList.remove('over');
    }
  });
}
updateCharCount('keyword1', 'count_keyword1');
updateCharCount('keyword2', 'count_keyword2');

// 팝업 토스트
var toastTimer = null;
function showToast(msg) {
  clearTimeout(toastTimer);
  document.getElementById('validationToastMsg').textContent = msg;
  var toast = document.getElementById('validationToast');
  toast.classList.add('show');
  toastTimer = setTimeout(hideToast, 4000);
}
function hideToast() {
  document.getElementById('validationToast').classList.remove('show');
}

// AQR URL blur 검증
document.getElementById('aqr_url').addEventListener('blur', function () {
  var val = this.value.trim();
  if (val && !val.includes('://aq.gy/f/')) {
    showToast('올바른 AQR 고유 URL이 아닙니다. (예: http://aq.gy/f/keyword)');
  }
});

// 파일 선택 표시
document.getElementById('attachment').addEventListener('change', function () {
  var area = document.getElementById('fileUploadArea');
  var display = document.getElementById('fileNameDisplay');
  if (this.files && this.files.length > 0) {
    display.textContent = '선택된 파일: ' + this.files[0].name;
    area.classList.add('has-file');
  } else {
    display.textContent = '';
    area.classList.remove('has-file');
  }
});

// 개인정보 모달
document.getElementById('privacyLink').addEventListener('click', function () {
  $('#privacyModal').modal('show');
});
document.getElementById('footerPrivacyLink').addEventListener('click', function () {
  $('#privacyModal').modal('show');
});
document.getElementById('agreeAndClose').addEventListener('click', function () {
  document.getElementById('agree').checked = true;
  $('#privacyModal').modal('hide');
});

// GA 이벤트
function gaEvent(category, action, label) {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, { 'event_category': category, 'event_label': label });
  }
}

// 폼 유효성 검사
function validateForm() {
  var orgName    = document.getElementById('org_name').value.trim();
  var phone      = document.getElementById('phone').value.trim();
  var email      = document.getElementById('email').value.trim();
  var aqrUrl     = document.getElementById('aqr_url').value.trim();
  var attachment = document.getElementById('attachment');
  var agree      = document.getElementById('agree').checked;

  if (!orgName) {
    showToast('기업 및 단체명을 입력해주세요.');
    document.getElementById('org_name').focus();
    return false;
  }
  if (!phone || !/^\d+$/.test(phone)) {
    showToast('전화번호를 숫자만 입력해주세요.');
    document.getElementById('phone').focus();
    return false;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('올바른 이메일 주소를 입력해주세요.');
    document.getElementById('email').focus();
    return false;
  }
  if (!aqrUrl) {
    showToast('AQR 고유 URL을 입력해주세요.');
    document.getElementById('aqr_url').focus();
    return false;
  }
  if (!aqrUrl.includes('://aq.gy/f/')) {
    showToast('올바른 AQR 고유 URL이 아닙니다. (예: http://aq.gy/f/keyword)');
    document.getElementById('aqr_url').focus();
    return false;
  }
  if (!attachment.files || attachment.files.length === 0) {
    showToast('사업자 등록증 또는 단체증을 첨부해주세요.');
    return false;
  }
  if (!agree) {
    showToast('개인정보 처리방침에 동의해주세요.');
    return false;
  }

  return true;
}

// 폼 제출
document.getElementById('socialForm').addEventListener('submit', function (e) {
  e.preventDefault();

  if (!validateForm()) return;

  var submitBtn = document.getElementById('submitBtn');
  var loading = document.getElementById('loadingIndicator');

  submitBtn.disabled = true;
  loading.style.display = 'block';

  var formData = new FormData(this);

  $.ajax({
    url: 'https://aq.gy/contact/socialformhandler.php',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    dataType: 'json',
    success: function (data) {
      submitBtn.disabled = false;
      loading.style.display = 'none';

      if (data.success) {
        document.getElementById('socialForm').style.display = 'none';
        document.getElementById('resultSuccess').style.display = 'block';
        gaEvent('SocialForm', 'submit_success', 'social_apply');
      } else {
        document.getElementById('resultErrorMsg').textContent = data.message || '오류가 발생했습니다.';
        document.getElementById('resultError').style.display = 'block';
        gaEvent('SocialForm', 'submit_error', data.message || 'error');
      }
    },
    error: function (err) {
      submitBtn.disabled = false;
      loading.style.display = 'none';
      document.getElementById('resultErrorMsg').textContent = '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      document.getElementById('resultError').style.display = 'block';
    }
  });
});
