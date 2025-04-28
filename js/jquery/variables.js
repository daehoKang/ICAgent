
let g_teannt = "";    // 로그인때 쓰는 테넌트아이디
let g_agentid = "";   // 상담사 아이디
let g_agentdn = "";   // 상담사 DN
let g_agentpwd = "";  // 상담사 비밀번호
let mediaSet = [];    // 미디어 설정
mediaSet.push("voice");

let g_tnt_id = "";          //소스에서는 쓰는 암호화된 테넌트ID
let g_user_id = "";         //user session id
let g_call_id = "";         //call session id
let g_conn_id = "";         //connection session id
let g_call_id_sub = "";     //call session id sub
let g_conn_id_sub = "";     //connection session id sub
let g_init_first = false; // 최초 로그인 여부

let call_uui;                     //call uui
let call_uei;                     //call uei
let call_history = "";            //call history

let party_type = "party";
let g_user_ani = "";

let g_notReady = ""                // 상담사 이석사유
let electron_use = false;       // electron 사용여부

/**
 * 테넌트 정보
 * */
let json_timout;
let json_reportretime;
let json_mediaset;

/**
 * 개인환경변수 정보
 * */
let json_afterstatus;
let json_afterstatusCause;
let json_afterrecall;
let json_afterrecallCause;
let json_afterlogin;
let json_afterloginCause;
let json_autoanswer;
let json_obcallingdn;
let json_belltimeout;
let json_prefixuse;
let json_prefixnum;
let json_autoreadytime;
let json_debug;
let json_mediaSet;
let json_retry;
let json_uei;
let json_mp3ues;
let json_apiurl;
let json_veloceurl;
let json_transferIVR;
let json_conferenceIVR;


/**
 * WEB API 관련
 * */
let g_webapi = {
    accessToken : ""
};

let g_hold = false; // 홀드여부


let event_call = {
    ivr_conference : false,     // IVR 회의
    hold : false,               // 홀드중
    isCall : false              // 콜중
}; // 콜 이벤트


let popupHtml;                  // 상담원리스트 팝업창

/**
 * 라우팅할때 옵션설정
 * */
function getRouteOption() {
    return {
        type: parseInt($("#roType").val(), 10),
        priority: $("#roPriority").val(),
        relation_method: parseInt($("#roRelationMethod").val(), 10),
        relation_agent_id: $("#roRelationAgentId").val(),
        relation_timeout: $("#roRelationTimeout").val(),
        method: parseInt($("#roMethod").val(), 10),
        skill_id: $("#roSkillId").val(),
        skill_level: $("#roSkillLevel").val(),
        group_id: $("#roGroupId").val(),
    };
}


/**
 * 이벤트 에러코드 input code
 * */
function errCode(code){
    let msg = "";
    switch (code){
        ////////////////////////////////////////////////////////////////////////////////////////////Call
        case 1460000:
            msg = "서버 내부에서 처리중에 에러가 발생한 경우";
            break;
        case 1460001:
            msg = "필수 인자가 포함되지 않은 경우나 호출 인자값의 데이타 타입이 적절하지 않거나 허용된 범위를 벗어난 경우";
            break;
        case 1460002:
            msg = "발신 요청한 참가자의 상태가 기능을 사용할 수 없는 경우";
            break;
        case 1460003:
            msg = "발신 요청한 참가자와 착신 참가자가 같을 경우";
            break;
        case 1460004:
            msg = "요청한 콜을 찾을 수 없는 경우";
            break;
        case 1460005:
            msg = "유저를 찾을 수 없거나 유저의 상태가 기능을 사용할 수 없는 경우";
            break;
        case 1460006:
            msg = "요청한 콜에 필요한 참가자 정보가 누락된 경우";
            break;
        case 1460007:
            msg = "목적지를 찾을 수 없는 경우";
            break;
        case 1460008:
            msg = "콜 생성 중 목적지의 테넌트와 사이트 정보가 없는 경우";
            break;
        case 1461000:
            msg = "유저에 감청 권한이 없는 경우";
            break;
        case 1461001:
            msg = "유저에 코칭 권한이 없는 경우";
            break;
        case 1461002:
            msg = "유저가 피감청/피코칭이 켜져서 join을 사용할 수 없는 경우";
            break;
        ////////////////////////////////////////////////////////////////////////////////////////////Presence
        case 1450001:
            msg = '유효하지 않은 Media(Type 혹은 Set) 입니다.';
            break;
        case 1450002:
            msg = '유효하지 않은 DN 입니다.';
            break;
        case 1450003:
            msg = '유효하지 않은 상태값 입니다.';
            break;
        case 1450004:
            msg = '불가능한 동작 입니다.';
            break;
        case 1450005:
            msg = '동작 불가능한 설정 입니다.';
            break;
        case 1450006:
            msg = '유효하지 않은 AccountId';
            break;
        case 1450010:
            msg = 'Phone을 찾을 수 없습니다.';
            break;
        case 1450011:
            msg = 'User를 찾을 수 없습니다.';
            break;
        case 1450020:
            msg = '내부 데이터 접근에 문제가 있습니다.';
            break;
        case 1450021:
            msg = '라이선스 초과 되었습니다.';
            break;
        case 1450022:
            msg = '추가 토큰 발급 오류가 발생했습니다.';
            break;
        case 1450023:
            msg = 'Event 처리에 오류가 발생했습니다.';
            break;
        case 1451000:
            msg = '기타 내부처리중 문제가 발생했습니다.';
            break;
        ////////////////////////////////////////////////////////////////////////////////////////////Auth
        case 1520001:
            msg = '로그인 실패';
            break;
        case 1520002:
            msg = '존재하지 않는 테넌트';
            break;
        case 1520003:
            msg = '존재하지 않는 유저';
            break;
        case 1520004:
            msg = '유저 상태가 임시(최초가입)이므로 로그인 할 수 없음, 비밀번호 변경대상';
            break;
        case 1520005:
            msg = '로그인 시도 횟수 초과, 비밀번호 변경 대상';
            break;
        case 1520006:
            msg = '휴면 계정, 휴면 해제 대상';
            break;
        case 1520007:
            msg = '유저 상태가 관리자에 의한 잠금 상태';
            break;
        case 1520008:
            msg = '유효하지 않은 패스워드';
            break;
        case 1520009:
            msg = '유효하지 않은 인증키';
            break;
        case 1520010:
            msg = '로그인이 허용되지 않는 사용자 등급(agent)';
            break;
        case 1520011:
            msg = '중복 로그인 상태, 테넌트 설정에서 중복로그인 비허용시 발생';
            break;
        default:
            msg = "에러발생 (" + code + ")";
            break;
    }
    return msg;
}

/**
 * 전화번호 유호체크
 * */
function chkPhoneNum(num){
    if (/^\d{4,5}$/.test(num)) {
        return true;
    }
    // 기존 정규식을 이용하여 전화번호 형식 검증
    const regex = /^(01[016789]\d{7,8})|(0\d{1,2}\d{7,8})|(1[5689]\d{2}\d{4})$/;
    return regex.test(num);
}

function togglePopup(popupId) {
    $('#' + popupId).fadeIn();
}

function closePopup(popupId) {
    $('#' + popupId).fadeOut();
}

/**
 * 전화번호 prefix 제거하기
 * */
function getPrefixRemove(prefix, number){
    let aStr = prefix.toString();
    let bStr = number.toString();
    if (bStr.startsWith(aStr)) {
        bStr = bStr.substring(aStr.length);
    }
    return bStr;
}

/**
 * JWT 디코딩
 * */
function decodeJWT(jwt) {
    return Ipron.util.decodeJWT(jwt);
}

/**
 * 데이터 초기화 (추가분기처리)
 * */
function datareset(gb) {
    if ("logout" === gb) {
        /*
        g_call_id = "";
        g_conn_id = "";
        g_call_id_sub = "";
        g_conn_id_sub = "";
        call_uei = "";
        call_uui = "";
        g_hold = false;
        intervalStop(callTimeIntervalId);
        intervalStop(intervalId_qwait);
        $("#phoneInput_sub").val("");
        $("#phoneInput").val("");
        $("#action_hold").text("홀드");
        $('#popupOverlay').removeClass('active');
        hideIncomingCall();
        g_webapi.accessToken = "";
        */
        if (popupHtml && !popupHtml.closed) popupHtml.close();
        setTimeout(function(){
            location.reload();
        },1000);

    } else if ("releaseCall" === gb) {
        g_call_id = "";
        g_conn_id = "";
        call_uei = "";
        call_uui = "";
        g_hold = false;
        $("#phoneInput_sub").val("");
        $("#phoneInput").val("");
        $("#action_hold").text("홀드");
        hideIncomingCall();
        intervalStop(agentListIntervalId);
    } else if ("releaseCallSub" === gb) {
        g_call_id_sub = "";
        g_conn_id_sub = "";
    }
}


/**
 * 상담사 로그인 로딩바
 * */
function showCircularSpinner() {
    $('#circular-spinner').css('display', 'block'); /* 스피너 표시 */
    $('#spinner-bg').css('display', 'block'); /* 배경 표시 */
}

function hideCircularSpinner() {
    $('#circular-spinner').css('display', 'none'); /* 스피너 숨기기 */
    $('#spinner-bg').css('display', 'none'); /* 배경 숨기기 */
}

/**
 * 로그찍기 (error, warn, info, debug),
 * node.js 로컬파일 로그찍기
 * */
function log(level, text){
    const LogStyles = {
        debug: 'color: black',
        info: 'color: green',
        warn: 'color: orange; font-weight: bold',
        error: 'color: red; font-weight: bold',
        event: 'color: blue; font-weight: bold; font-size: 20px',
    };

    const timestamp = new Date().toISOString(); // 타임스탬프 생성
    const style = LogStyles[level] || LogStyles.debug; // 기본값을 debug로 설정
    const formattedText = `[${timestamp}] [${level.toUpperCase()}] ${text}`; // 로그 포맷팅

    if (electron_use) {
        window.electronLog?.info(formattedText); // Electron 로그 호출
    }
    console.log.apply(console, [`%c${formattedText}`, style]);
}



/**
 * interval Timer stop
 * */
function intervalStop(id){
    if (id !== null) {
        clearInterval(id); // Interval 중지
        id = null; // 변수 초기화
    }
}

/**
 * 호전환/3자통화용 UEI Change
 * */
function ueiChange(json_value,uei,value){
    let r_value = {};
    if(json_value === undefined){
        r_value[uei] = value;
    }else{
        if(json_value !== ""){
            r_value = JSON.parse(json_value);
        }
        r_value[uei] = value;
    }
    return JSON.stringify(r_value);
}

/**
 * 전화받기 버튼의 동적 숫자 업데이트
 * */
function updateCallCount(count) {
    const callButton = $('#action_answercall');
    callButton.attr('data-count', "(" + count + ")");
    if(count === 0){
        $(':root').css('--after-color', "black");
    }else if(count > 0 && count <= 5){
        $(':root').css('--after-color', "blue");
    }else{
        $(':root').css('--after-color', "red");
    }
}

/**
 * int -> time hh24:mi:ss
 * */
function formatSecondsToTime(seconds) {
    // 시, 분, 초 계산
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    // 두 자리로 포맷팅
    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(secs).padStart(2, '0');
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

// 전화 알림 보이기 함수
function showIncomingCall() {
    $('#call-alert').removeClass('hidden').css('opacity', 1);
    $("#callButton").focus();
}

// 전화 알림 숨기기 함수
function hideIncomingCall() {
    $('#call-alert').css('opacity', 0);
    setTimeout(() => {
        $('#call-alert').addClass('hidden');
        $("#info-queue").text("");
        $("#info-ani").text("");
    }, 500);
}


/**
 * ICAGENT 매뉴얼 다운로드
 * */
function manualDown(){
    window.open("./assets/icagent-ne.pdf", "_blank");
}

function switchStatus($element, data){
    let l_text = "";
    switch (data) {
        case "notready":
            $element.find('.info-item').eq(3).css('background-color', '#27B77E');
            l_text = "이석";
            break;
        case "ready":
            $element.find('.info-item').eq(3).css('background-color', '#4B78B7');
            l_text = "수신대기";
            break;
        case "dialing":
            $element.find('.info-item').eq(3).css('background-color', '#F023FF');
            l_text = "다이얼링";
            break;
        case "ringing":
            $element.find('.info-item').eq(3).css('background-color', '#E48EFF');
            l_text = "벨울림";
            break;
        case "logout":
            $element.find('.info-item').eq(3).css('background-color', '#8F8F8F');
            l_text = "로그아웃";
            break;
        case "afterwork":
            $element.find('.info-item').eq(3).css('background-color', '#D9BA77');
            l_text = "후처리";
            break;
        case "out-online":
            $element.find('.info-item').eq(3).css('background-color', '#DE8FAF');
            l_text = "통화(OB)";
            break;
        case "in-online":
            $element.find('.info-item').eq(3).css('background-color', '#D06193');
            l_text = "통화(IB)";
            break;
        case "online":
            $element.find('.info-item').eq(3).css('background-color', '#D06193');
            l_text = "통화중";
            break;
        default:
            $element.find('.info-item').eq(3).css('background-color', 'white');
            l_text = data;
            break;
    }

    return l_text;
}




/**
 *
 * 응대호 : user1240 + user1220 + user1260
*  SL    : user1250
*  포기호 : user1150
*  IB시간 : user1630 + user1640 + user1620 + user1660
*  OB시간 : user1600 + user1610 + user1580
*  전환발신 : user1430 + user1390 + user1400 + user1440 + user1360 + user1040 + user1410 + user1450 + user1050 + user1370 + user1420
*  전환수신 : user1270 + user1320 + user1280 + user1650
*  발신시도 : user1010 + user1210
*  발신성공 : user1230
*  보류횟수 : user1520
*  보류시간 : user1590
*  대기횟수 : usersts1050
*  대기시간 : usersts1110
*  이석횟수 : usersts1080
*  이석시간 : usersts1140
*  후처리횟수 : usersts1090
*  후처리시간 : usersts1150
 *
 *
 * */