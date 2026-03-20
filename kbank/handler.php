<?php
/**
 * handler.php
 * AQR 간편 송금 서비스 - QR 코드 정보 갱신 요청 처리
 *
 * POST 파라미터:
 *   biz_no       : 사업자 번호 (필수)
 *   account_no   : 계좌번호    (필수)
 *   account_name : 예금주명   (필수)
 *   store_name   : 상호명     (선택)
 */

header('Content-Type: application/json; charset=utf-8');

// ─────────────────────────────────────────────
// 데이터베이스 설정 (환경에 맞게 수정)
// ─────────────────────────────────────────────
define('DB_HOST',   'localhost');
define('DB_NAME',   'your_database');   // TODO: 실제 DB 이름으로 교체
define('DB_USER',   'your_db_user');    // TODO: 실제 DB 계정으로 교체
define('DB_PASS',   'your_db_password'); // TODO: 실제 DB 비밀번호로 교체
define('DB_CHARSET', 'utf8mb4');

// ─────────────────────────────────────────────
// 외부 API 설정 (환경에 맞게 수정)
// ─────────────────────────────────────────────
define('EXTERNAL_API_URL',    'https://api.example.com/v1/business/verify'); // TODO: 실제 API URL로 교체
define('EXTERNAL_API_KEY',    'YOUR_API_KEY_HERE');   // TODO: 실제 인증 키로 교체
define('EXTERNAL_API_TIMEOUT', 10);

// ─────────────────────────────────────────────
// 요청 메서드 확인
// ─────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => '허용되지 않는 메서드입니다.']);
    exit;
}

// ─────────────────────────────────────────────
// 입력값 수집 및 검증
// ─────────────────────────────────────────────
$biz_no       = trim($_POST['biz_no']       ?? '');
$account_no   = trim($_POST['account_no']   ?? '');
$account_name = trim($_POST['account_name'] ?? '');
$store_name   = trim($_POST['store_name']   ?? '');

if ($biz_no === '' || $account_no === '' || $account_name === '') {
    echo json_encode(['success' => false, 'message' => '필수 항목(사업자 번호, 계좌번호, 예금주명)이 누락되었습니다.']);
    exit;
}

// 사업자 번호 기본 형식 검사 (숫자 10자리, 하이픈 허용)
$biz_no_clean = preg_replace('/[^0-9]/', '', $biz_no);
if (strlen($biz_no_clean) !== 10) {
    echo json_encode(['success' => false, 'message' => '사업자 번호는 10자리 숫자여야 합니다.']);
    exit;
}

// ─────────────────────────────────────────────
// 상점 ID 생성
// ─────────────────────────────────────────────
$store_id = generateStoreId($biz_no_clean);

// ─────────────────────────────────────────────
// DB 처리
// ─────────────────────────────────────────────
try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET,
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );

    $stmt = $pdo->prepare("
        INSERT INTO aqr_dhlottery_kbank_table
            (biz_no, account_no, account_name, store_id, store_name, created_at, updated_at)
        VALUES
            (:biz_no, :account_no, :account_name, :store_id, :store_name, NOW(), NOW())
        ON DUPLICATE KEY UPDATE
            account_no   = VALUES(account_no),
            account_name = VALUES(account_name),
            store_id     = VALUES(store_id),
            store_name   = VALUES(store_name),
            updated_at   = NOW()
    ");

    $stmt->execute([
        ':biz_no'       => $biz_no,
        ':account_no'   => $account_no,
        ':account_name' => $account_name,
        ':store_id'     => $store_id,
        ':store_name'   => $store_name,
    ]);

} catch (PDOException $e) {
    error_log('[AQR handler] DB Error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => '데이터베이스 처리 중 오류가 발생했습니다.']);
    exit;
}

// ─────────────────────────────────────────────
// 외부 API 호출 (사업자 번호만 전달)
// ─────────────────────────────────────────────
$api_result = callExternalApi($biz_no_clean);

if (!$api_result['success']) {
    // API 호출 실패는 경고 로그만 남기고 전체 처리는 성공으로 처리
    error_log('[AQR handler] External API warning: ' . ($api_result['error'] ?? 'unknown error'));
}

// ─────────────────────────────────────────────
// 최종 응답
// ─────────────────────────────────────────────
echo json_encode([
    'success'    => true,
    'store_id'   => $store_id,
    'api_status' => $api_result['success'] ? 'ok' : 'failed',
]);
exit;


// =============================================================
// 함수 정의
// =============================================================

/**
 * 상점 ID 생성
 * 형식: AQR-YYYYMMDD-{사업자번호 앞 4자리}-{랜덤 6자리 hex}
 */
function generateStoreId(string $biz_no_clean): string
{
    $date    = date('Ymd');
    $prefix  = substr($biz_no_clean, 0, 4);
    $random  = strtoupper(bin2hex(random_bytes(3))); // 6자리 hex
    return 'AQR-' . $date . '-' . $prefix . '-' . $random;
}

/**
 * 외부 API 호출 (CURL)
 * 사업자 번호만 파라미터로 전달
 *
 * @param  string $biz_no  숫자만 포함된 10자리 사업자 번호
 * @return array{success: bool, http_code: int, data: mixed, error: string}
 */
function callExternalApi(string $biz_no): array
{
    $payload = json_encode(['biz_no' => $biz_no], JSON_UNESCAPED_UNICODE);

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => EXTERNAL_API_URL,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Accept: application/json',
            'X-Api-Key: ' . EXTERNAL_API_KEY,  // TODO: 실제 인증 방식에 맞게 수정
        ],
        CURLOPT_TIMEOUT        => EXTERNAL_API_TIMEOUT,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ]);

    $response  = curl_exec($ch);
    $http_code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_err  = curl_error($ch);
    curl_close($ch);

    if ($curl_err !== '') {
        return [
            'success'   => false,
            'http_code' => 0,
            'data'      => null,
            'error'     => $curl_err,
        ];
    }

    $decoded = json_decode($response, true);

    return [
        'success'   => ($http_code >= 200 && $http_code < 300),
        'http_code' => $http_code,
        'data'      => $decoded,
        'error'     => '',
    ];
}
