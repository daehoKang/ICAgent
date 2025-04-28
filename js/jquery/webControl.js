try{
  if(window.electron){
    electron_use = true;
  }
  log("info","electron use");
}catch(e){
  log("info","electron not use");
}


$(document).ready(function () {

  getAgentConfig();
  getLoginDataFromCookie();   // 쿠키설정

  $("#loginClick").on("click", async function () {
    g_teannt = $("#tenant").val().trim();
    g_agentid = $("#agentId").val().trim();
    g_agentdn = $("#agentDn").val().trim();
    g_agentpwd = $("#agentPwd").val().trim();
    /**
     * 상담사 로그인 버튼클릭시 init -> login
     * */
    if (g_teannt && g_agentid && g_agentdn && g_agentpwd) {
      showCircularSpinner();
      try {
        let res_login = false;
        if(!g_init_first) {
          Ipron.init(json_apiurl, (json_timout * 1000), json_debug);
          g_init_first = true;
        }

        res_login = await agentLogin();
        if(res_login){
          setLoginDataFromCookie();
          pageForward("go");
        }
      } finally{
        hideCircularSpinner();
      }
    } else {
      if (g_agentid === "") {
        $('#alert-layer').text('Agent ID를 입력해주세요.').fadeIn().delay(2000).fadeOut();
        return null;
      } else if (g_agentpwd === "") {
        $('#alert-layer').text('Agent Password를 입력해주세요.').fadeIn().delay(2000).fadeOut();
        return null;
      } else if (g_agentdn === "") {
        $('#alert-layer').text('Agent DN을 입력해주세요.').fadeIn().delay(2000).fadeOut();
        return null;
      } else if (g_teannt === "") {
        $('#alert-layer').text('테넌트 아이디를 입력해주세요.').fadeIn().delay(2000).fadeOut();
        return null;
      }
    }
  });


  // 행(row) 클릭 시 phoneInput 값 업데이트
  $('.call-history-content').on('click', 'li', function (event) {
    const row = $(event.target).closest('li');
    if (row.length) {
      const phoneNumber = row.find('.content-item:nth-child(2)').text().trim();
      $('#phoneInput').val(phoneNumber);
      callHistory.classList.remove('show');
    }
  });

  // 전화번호 입력 시 통화 기록 대시보드 표시
  const callHistory = document.getElementById('callHistory');
  $("#phoneInput").on({
    focus: function () {
      $('#callHistory').addClass('show');
      if($("#phoneInput").val() === "")
        $(".call-history-content ul li").show();
    },
    blur: function () {
      setTimeout(function () {
        $('#callHistory').removeClass('show');
      }, 100);
    },
    input: function () {
      const filter = $(this).val().trim().toLowerCase();
      const historyEntries = $('.call-history-content li');
      historyEntries.each(function () {
        const phoneNumber = $(this).find('.content-item:nth-child(2)').text().trim().toLowerCase();
        if (phoneNumber.includes(filter)) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    }
  });


  /**
   * 이메일찾기 팝업
   * */
  $("#confirmPassword").on("click", function () {
    try{
      window.electronAPI.passwordCheck("https://manager.cloudipcc.kr");
    }catch(e){
      log.error("password forwarding failed");
    }

    //메일전송 
    //const email = $("#agentId").val().trim();
    //if(email === ""){
    //    $('#alert-layer').text('Email 주소를 입력해주세요.').fadeIn().delay(2000).fadeOut();
    //    return null;
    //}
    //
    //$("#confirmHidden").val("passwordReset");
    //$('#confirm-title').text(email);
    //$('#confirm-msg').text('비밀번호찾기 - 이메일로 전송하시겠습니까?');
    //$('#confirm-popup').fadeIn();

  });

  // 자리비움 드롭다운 기능
  $('#action_agentnotready').on('click', function () {
    $('#awayDropdown').toggleClass('show');
  });

  $(document).on('click', function (e) {
    // 자리비움 드롭다운 외부 클릭 시 닫기
    if (!$(e.target).closest('#action_agentnotready').length && !$(e.target).closest('#awayDropdown').length) {
      $('#awayDropdown').removeClass('show');
    }



    // 호전환 외부 클릭 시 모든 드롭다운 닫기
    if (!$(e.target).closest('#action_transfer').length && !$(e.target).closest('#action_conference').length && !$(e.target).closest('.custom-dropdown-menu').length) {
      $('.custom-dropdown-menu').hide(); // 드롭다운 메뉴 숨기기
    }

  });

  // 드롭다운 버튼과 메뉴를 찾아 처리
  $('.dropdown-toggle').each(function () {
    const $dropdownButton = $(this);
    const $dropdownMenu = $dropdownButton.next('.custom-dropdown-menu');

    // 드롭다운 메뉴 토글
    $dropdownButton.on('mouseover', function (e) {
      e.stopPropagation(); // 이벤트 전파 방지
      $('.custom-dropdown-menu').not($dropdownMenu).hide(); // 다른 드롭다운 숨기기
      $dropdownMenu.toggle(); // 현재 드롭다운 표시/숨기기
    });

    // 드롭다운 내부 클릭 시 메뉴 유지
    $dropdownMenu.on('click', async function (e) {
      const destDn = e.target.getAttribute("data-dn");
      const destUei = e.target.getAttribute("data-uei");
      const destValue = e.target.getAttribute("data-value");
      const destPartyType = e.target.getAttribute("data-partytype");
      if(e.target.getAttribute("data-type") === "transfer"){
        //호전환
        try{
          if(g_call_id_sub !== "" && g_conn_id_sub !== ""){
              $('#alert-layer-board').text("통화중에는 사용이 불가합니다.").fadeIn().delay(2000).fadeOut()
              return;
          }else{
            log("info", "singleStepTransfer");
            call_uei = ueiChange(call_uei,destUei,destValue);
            log("error", JSON.stringify(call_uei));
            try{
              await Ipron.call.singleStepTransfer(g_tnt_id, g_call_id, g_conn_id, destDn, g_user_ani, call_uei, call_uui, getRouteOption());
            }catch(error){
              log("error", (JSON.stringify(error?.message || error, null, 2)));
              $('#alert-layer-board').text(JSON.stringify(error?.response?.data?.msg)).fadeIn().delay(2000).fadeOut();
            }
          }
        }finally{
          g_hold = false;
        }
      }else if(e.target.getAttribute("data-type") === "conference"){
        try{
          if(g_call_id_sub !== "" && g_conn_id_sub !== ""){
            $('#alert-layer-board').text("통화중에는 사용이 불가합니다.").fadeIn().delay(2000).fadeOut()
            return;
          }else{
            try{
              log("info", "singleStepConference");
              call_uei = ueiChange(call_uei,destUei,destValue);
              await Ipron.call.unhold(g_tnt_id, g_call_id, g_conn_id);
              event_call.ivr_conference = true;
              new Promise(() => {
                const conference_interval = setInterval(async () => {
                  if (!event_call.ivr_conference) { // 플래그 확인
                    clearInterval(conference_interval); // 타이머 정리
                    await Ipron.call.singleStepConference(g_tnt_id, g_call_id, g_conn_id, destDn, g_user_ani, call_uui, call_uei, destPartyType);
                  }
                },100);
              });
            }catch(error){
              log("error", (JSON.stringify(error?.message || error, null, 2)));
              $('#alert-layer-board').text(JSON.stringify(error?.response?.data?.msg)).fadeIn().delay(2000).fadeOut();
            }
          }
        }finally{
          g_hold = false;
        }
      }
      e.stopPropagation(); // 이벤트 전파 방지
    });
  });


  // 이벤트 대기 함수
  function waitForConferenceEvent() {
    return new Promise(resolve => {
      const onConferenceEvent = (event) => {
        if (event.type === 'conference') {
          // 이벤트 수신 시 처리
          resolve();
        }
      };
      // 이벤트 리스너 등록
      Ipron.on('event', onConferenceEvent);
    });
  }


  $('#agentDn, #setting-obCallingDn, #phoneInput, #phoneInput_sub').on('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '');
  });

  $('#phoneInput').on('keypress', function (event) {
    if (event.key === 'Enter') {
      $('#action_makecall').click();
      setTimeout(function () {
        $('#callHistory').removeClass('show');
      }, 100);
    }
  });

  $('#phoneInput_sub').on('keypress', function (event) {
    if (event.key === 'Enter') {
      $('#action_makecall_sub').click();
    }
  });

  $('#agentId,#agentPwd,#agentDn,#tenant').on('keypress', function (event) {
    if (event.key === 'Enter') {
      $('#loginClick').click();
    }
  });

  $('#close-btn').on('click', function () {
    hideIncomingCall();
  });

  $("#call-report").on("click", async function () {
    const url = json_apiurl + '/stat/statistics/v1/dash-board/' + g_tnt_id + '/search/94';
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1); // 저번 달 1일
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0); // 저번 달 말일
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1); // 이번 달 1일

    const last_month = get_searchItem("MM", formatDate(lastMonth), formatDate(lastMonthEnd));

    const r_data = await apiFuncion(url, last_month);
    reportSpread("lastMonth", r_data);
    log("info", "[Report] lastMonth read success");
    const this_month = get_searchItem("MM", formatDate(firstDay), formatDate(now));
    const r_data2 = await apiFuncion(url, this_month);
    reportSpread("thisMonth", r_data2);
    log("info", "[Report] thisMonth read success");
    const this_today = get_searchItem("DD", formatDate(now), formatDate(now));
    const r_data3 = await apiFuncion(url, this_today);
    reportSpread("today", r_data3);
    log("info", "[Report] today read success");

    toggleUniquePopup();

    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    }

    function get_searchItem(TypeInfo, from_date, to_date){
      return {
        searchItem: [
          {
            searchId: 2,
            field: "userId",
            searchType: "30",
            multiYn: 1,
            values: [g_user_id]
          }, {
            searchId: 5,
            searchType: "10",
            multiSelectYn: 1,
            field: "mediaType",
            values: mediaSet
          }
        ], dateItem: {
          viewTypeInfo: TypeInfo,
          date: {
            from: from_date,
            to: to_date
          }, time: {
            from: "0000",
            to: "2359"
          }
        }
      };
    }
  });

  let isProcessing = false; // 더블클릭 방지 플래그
  $("#usersInfo").on("click",async function(){
    if (isProcessing) {
      return; // 이미 처리 중이면 아무 작업도 하지 않음
    }
    isProcessing = true; // 작업 시작 플래그 설정

    if (popupHtml && !popupHtml.closed){
      isProcessing = false; // 작업 완료 후 플래그 해제
      return false;
    }else{
      //await getReportAgentList();
      popupHtml = window.open("./agentInfo.html", "AgentMonitor", "width=600px,height=550px");
      popupHtml.onload = function() {
        popupHtml.setAgentGroupList(groupList);
        popupHtml.setAgentList(agentList);
      }
      isProcessing = false; // 작업 완료 후 플래그 해제
    }

  });
});

/**
 * page 전환(login <-> dashboard)
 * */
function pageForward(msg) {
  if (msg === "go") {
    $('#page1').addClass('slide-left').removeClass('active');
    $('#page2').removeClass('hidden').addClass('active').removeClass('slide-right');
  } else if (msg === "back") {
    $('#page1').removeClass('slide-left').addClass('active').removeClass('hidden');
    $('#page2').removeClass('active').addClass('hidden');
  }
}

/**
 * 로그인후 쿠키에 정보 저장
 */
function setLoginDataFromCookie() {
  const saveId = $("#save-id");
  const loginData = {
    c_tenant: g_teannt,
    c_agentId: g_agentid,
    c_agentDn: g_agentdn,
    c_agentPwd: saveId.prop("checked") ? g_agentpwd : "",
    c_pwdSave : saveId.prop("checked") ? "Y" : "N"
  };

  const cookie = {
    url: json_apiurl,
    name: 'ICAGENT-NE',
    value: JSON.stringify(loginData),
    expirationDate: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)
  };

  window.electron.setCookie(cookie).then(response => {
    log("info","[Session] Login save Success");
  });
}

/**
 * 개인환경설정가져오기
 * */
function getAgentConfig() {
  window.electronAPI.getConfigPath().then(configPath => {
    $.ajax({
      url: configPath + '/ipron-ne.json',
      type: 'GET',
      async: false,
      dataType: 'json', // 데이터를 JSON 형식으로 처리
      success: function (data) {
        json_apiurl           = data.APIURL;          // API URL
        json_veloceurl        = data.VELOCEURL;       // VELOCE URL
        json_timout           = data.TIMEOUT;         // TIMEOUT
        json_reportretime     = data.REPORT_RETIME;   // REPORT 갱신주기
        json_mediaset         = data.MEDIASET;        // 사용 MEDIA SET
        json_afterstatus      = data.aftercall;       // 통화 종료 후 상태
        json_afterrecall      = data.afterrecall;     // 호회수 후 상태
        json_afterlogin       = data.afterlogin;      // 로그인 후 상태
        json_afterloginCause  = data.afterloginCause; // 로그인 후 상태사유
        json_autoanswer       = data.autoanswer;      // 자동응답
        json_obcallingdn      = data.obcallingdn;     // 발신번호
        json_belltimeout      = data.belltimeout;     // 벨타임아웃
        json_prefixuse        = data.prefixuse;       // 아웃바운드 prefix 사용여부
        json_prefixnum        = data.prefixnum;       // 아웃바운드 prefix 번호
        json_autoreadytime    = data.autoreadytime;   // 자동대기시간
        json_retry            = data.RETRY;           // 재시도횟수
        json_uei              = data.UEI;             // 큐명 UEI설정
        json_mp3ues           = data.MP3USE;          // 벨소리사용유무
        json_conferenceIVR    = data.conferenceIVR;   // 회의 IVR UEI  설정
        json_transferIVR      = data.transferIVR;     // 호전환 IVR UEI  설정
      },
      error: function () {
        $('#alert-layer').text($('#agentId').val() + "에 대한 환경설정을 설정해주십시오.").fadeIn().delay(2000).fadeOut();
        $("#action_settings").click();
        log("error", $('#agentId').val() + "에 대한 환경설정을 설정해주십시오.");
      },
      complete: function () {
        $("#setting-timeout").val(json_timout);
        $("#setting-bellTimeout").val(json_belltimeout);
        $("#setting-prefixUse").val(json_prefixuse);
        $("#setting-prefixNum").val(json_prefixnum);
        $("#setting-afterCallStatus").val(json_afterstatus);
        $("#setting-afterReCallStatus").val(json_afterrecall);
        $("#setting-afterLoginStatus").val(json_afterlogin);
        $("#setting-autoAnswer").val(json_autoanswer);
        $("#setting-obCallingDn").val(json_obcallingdn);
        $("#setting-reportTime").val(json_reportretime);
        $("#setting-retry").val(json_retry);
        json_mediaset.forEach((item) => {
          $("#setting-mediaSet").val(item);
        });

        if(json_prefixuse !== "Y")
          json_prefixnum = "";
        $("#setting-uei").val(json_uei);
        $("#setting-mp3ues").val(json_mp3ues);
        $("#setting-apiurl").val(json_apiurl);
        $("#setting-veloceurl").val(json_veloceurl);
        $("#setting-transfer").val(json_transferIVR);
        $("#setting-conference").val(json_conferenceIVR);

        const json_transferIVR_Array = json_transferIVR.split("_");
        if(json_transferIVR_Array !== ""){
          const trasn_dropdownMenu = document.querySelector('#transfer-dropdown');
          json_transferIVR_Array.forEach((item) => {
            const splitByPipe = item.split('|');
            const li = document.createElement('li');
            splitByPipe.forEach((value, subIndex) => {
              if(subIndex === 0)
                li.textContent = value;
              else if(subIndex === 1)
                li.setAttribute("data-dn", value);
              else if(subIndex === 2)
                li.setAttribute("data-uei",value);
              else if(subIndex === 3)
                li.setAttribute("data-value",value);
            });
            li.setAttribute("data-type","transfer");
            trasn_dropdownMenu.appendChild(li);
          });
        }

        if(json_conferenceIVR !== ""){
          const json_conferenceIVR_Array = json_conferenceIVR.split("_");
          const confer_dropdownMenu = document.querySelector('#conference-dropdown');
          json_conferenceIVR_Array.forEach((item) => {
            const splitByPipe = item.split('|');
            const li = document.createElement('li');
            splitByPipe.forEach((value, subIndex) => {
              if(subIndex === 0)
                li.textContent = value;
              else if(subIndex === 1)
                li.setAttribute("data-dn", value);
              else if(subIndex === 2)
                li.setAttribute("data-uei",value);
              else if(subIndex === 3)
                li.setAttribute("data-value",value);
              else if(subIndex ===4)
                li.setAttribute("data-partytype",value);
            });
            li.setAttribute("data-type","conference");
            confer_dropdownMenu.appendChild(li);
          });
        }
      }
    });
  });
}

/**
 * 최초 페이지 로딩시에 쿠키 정보 세팅
 */
function getLoginDataFromCookie() {
  window.electron.getCookies(json_apiurl).then(cookies => {
    if (cookies.length > 0) {
      cookies.forEach(cookie => {
        if(cookie.name === "ICAGENT-NE" && new URL(json_apiurl).hostname === cookie.domain){
          const login_json = JSON.parse(cookie.value);
          $("#tenant").val(login_json.c_tenant);
          $("#agentId").val(login_json.c_agentId);
          $("#agentDn").val(login_json.c_agentDn);
          $("#agentPwd").val(login_json.c_agentPwd);
          if(login_json.c_pwdSave === "Y")
            $("#save-id").prop("checked", true);
          else
            $("#save-id").prop("checked", false);
        }
      });
    }
  });
}

/**
 * 이력로그 쌓기
 * item call / end / note
 * title 통화중 / 끊김 / 메모 / etc
 * ani 전화번호
 * 하단 looging footer 사용여부
 * */
let callTimeIntervalId = 0;
let callingTimeId = 0;
let callStatus = "";
function setLogging(item, title, ani, url, footer) {
  //footer
  //agent -> agent 상태변경
  //callStart -> 통화시작
  //callEvent -> 통화서브이벤트
  //callContinue -> 통화계속
  //callEnd -> 종료
  const $callStatus = $('.call-status p');
  let seconds = 0;
  let seconds2 = 0;
  callStatus = footer;
  if(footer === "agent"){
    if(callTimeIntervalId){
      clearInterval(callTimeIntervalId);
      callTimeIntervalId = null;
    }

    callTimeIntervalId = setInterval(updateCallTime, 1000);
  }else if(footer === "callStart"){
    if(callTimeIntervalId){
      clearInterval(callTimeIntervalId);
      callTimeIntervalId = null;
    }
    if(callingTimeId){
      clearInterval(callingTimeId);
      callingTimeId = null;
    }
    callTimeIntervalId = setInterval(updateCallTime, 1000);
    callingTimeId = setInterval(updateCallTime2, 1000);
  }else if(footer === "callEvent"){
    if(callTimeIntervalId){
      clearInterval(callTimeIntervalId);
      callTimeIntervalId = null;
    }
    callTimeIntervalId = setInterval(updateCallTime, 1000);
  }else if(footer === "callContinue"){
    if(callTimeIntervalId){
      clearInterval(callTimeIntervalId);
      callTimeIntervalId = null;
    }

  }else if(footer === "callEnd"){
    if(callingTimeId){
      clearInterval(callingTimeId);
      callingTimeId = null;
    }

    log("info", "call_history :" + call_history);
    call_history = "";
  }

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  addHistoryEntry(item, title.replace("중",""), ani, `${hours}:${minutes}`, url);

  function updateCallTime() {
    seconds++;
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if(callStatus === "agent" || callStatus === "callEvent")
      $callStatus.text(title + ` (${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')})`);
  }

  function updateCallTime2() {
    seconds2++;
    const hrs = Math.floor(seconds2 / 3600);
    const mins = Math.floor((seconds2 % 3600) / 60);
    const secs = seconds2 % 60;
    if(callStatus === "callStart" || callStatus === "callContinue")
      $callStatus.text(title + ` (${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')})`);
  }

}

/**
 * 전화 인바운드/아웃바운드 히스토리.
 * */
function addCallHistoryEntry(type, phoneNumber, queueInfo) {
  const $newEntry = $('<li></li>');
  $newEntry.append($('<div></div>').addClass('content-item').text(type));
  $newEntry.append($('<div></div>').addClass('content-item').text(phoneNumber));
  $newEntry.append($('<div></div>').addClass('content-item').text(queueInfo));

  $('.call-history-content ul').prepend($newEntry);
}

function addHistoryEntry(type, status, phoneNumber, time, url) {
  const $historyEntry = $('<div></div>').addClass(`history-entry ${type}`);
  const $statusDiv = $('<div></div>').addClass('status').text(status);
  const $phoneNumberDiv = $('<div></div>').addClass('phone-number').text(phoneNumber);
  const $timeDiv = $('<div></div>').addClass('time').text(time);
  $historyEntry.append($statusDiv).append($phoneNumberDiv).append($timeDiv);
  const $historyList = $('#history-list');
  $historyList.prepend($historyEntry);

  // 녹취재생
  if(url !== ""){
    // URL을 히든 데이터로 저장
    $historyEntry.data('popupUrl', encodeURI(`${json_veloceurl}/BT-VELOCE/recording/STTPlayCF.do?${url}`));
    $historyEntry.css('cursor', 'pointer');
    $historyEntry.on('click', function () {
      window.open($(this).data('popupUrl'), "VelocePopup", "width=600px,height=170px");
    });
  }
}

async function saveSettings() {
  const configData = {
      APIURL            : $("#setting-apiurl").val(),
      VELOCEURL         : $("#setting-veloceurl").val(),
      TIMEOUT           : $("#setting-timeout").val(),
      RETRY             : $("#setting-retry").val(),
      REPORT_RETIME     : $("#setting-reportTime").val(),
      MEDIASET          : ["voice"],
      aftercall         : $("#setting-afterCallStatus").val(),
      aftercallCause    : "ready",
      afterrecall       : $("#setting-afterReCallStatus").val(),
      afterrecallCause  : "afterwork",
      afterlogin        : $("#setting-afterLoginStatus").val(),
      afterloginCause   : "notready",
      autoanswer        : $("#setting-autoAnswer").val(),
      obcallingdn       : $("#setting-obCallingDn").val(),
      belltimeout       : $("#setting-bellTimeout").val(),
      prefixuse         : $("#setting-prefixUse").val(),
      prefixnum         : $("#setting-prefixUse").val() == "Y" ? $("#setting-prefixNum").val() : "",
      autoreadytime     : $("#setting-autoReadyTime").val(),
      debug             : true,
      UEI               : $("#setting-uei").val(),
      MP3USE            : $("#setting-mp3ues").val(),
      transferIVR       : $("#setting-transfer").val(),
      conferenceIVR     : $("#setting-conference").val()
  }
  try{
    window.electron.saveConfig(configData);
    json_timout           = $("#setting-timeout").val();
    json_retry            = $("#setting-retry").val();
    json_reportretime     = $("#setting-reportTime").val();
    json_mediaSet         = ["voice"];
    json_afterstatus      = $("#setting-afterCallStatus").val();
    json_afterstatusCause = "ready";
    json_afterrecall      = $("#setting-afterReCallStatus").val();
    json_afterrecallCause = "afterwork";
    json_afterlogin       = $("#setting-afterLoginStatus").val();
    json_afterloginCause  = "notready";
    json_autoanswer       = $("#setting-autoAnswer").val();
    json_obcallingdn      = $("#setting-obCallingDn").val();
    json_belltimeout      = $("#setting-bellTimeout").val();
    json_prefixuse        = $("#setting-prefixUse").val();
    json_prefixnum        = $("#setting-prefixUse").val() == "Y" ? $("#setting-prefixNum").val() : "";
    json_autoreadytime    = $("#setting-autoReadyTime").val();
    json_debug            = true;
    json_uei              = $("#setting-uei").val();
    json_mp3ues           = $("#setting-mp3ues").val();
    json_apiurl           = $("#setting-apiurl").val();
    json_veloceurl        = $("#setting-veloceurl").val();
    json_transferIVR      = $("#setting-transfer").val();
    json_conferenceIVR    = $("#setting-conference").val();
    try{
      try{
        await Ipron.presence.setUserAfterState(g_tnt_id, g_user_id, mediaSet, json_afterstatus, json_afterstatusCause);
        await Ipron.presence.setUserRecallState(g_tnt_id, g_user_id, mediaSet, json_afterrecall, json_afterrecallCause);
      }catch(e){
        log("error", "not setUserAfterState failed("+e.toString()+")")
      }
    }catch(e){
      log("error", "not agent login failed")
    }
    closePopup('settings-popup');
    $('#alert-layer').text('환경파일이 수정되었습니다.').fadeIn().delay(2000).fadeOut(function(){});
    $('#alert-layer-board').text('환경파일이 수정되었습니다.').fadeIn().delay(2000).fadeOut(function(){});
  }catch(e){
    log("error","config save failed");
  }
}

let audio = null;
function playAudio(plan) {
  try{
    if(plan === 'start'){
      window.electronAPI.getAudioPath().then(audioPath => {
        audio = new Audio(audioPath + "/ringing.mp3");
        audio.loop = true; // 반복 재생 설정
        audio.play();
      });

    }else if(plan === 'stop'){
      audio.pause();
      audio = null;
    }
  }catch(e){
    log("info","Ringing Audio Failed");
  }
}

/**
 * 버튼 활성화/비활성화 컨트롤
 * input값 albe 활성화
 * action_answercall,action_makecall,action_clearcall,action_hold,action_agentready,action_agentnotready,action_transfer_popup
 * */
function buttonControl(event, str){
  if(event === "input"){
      $("#action_answercall,"   +
        "#action_makecall,"     +
        "#action_clearcall,"    +
        "#action_hold,"         +
        "#action_agentready,"   +
        "#action_agentnotready,"+
        "#action_transfer_popup").attr('disabled', true);
  }else if(event === "output"){
    const b_id = str.split(",");
    for (const id of b_id) {
      $("#"+id).removeAttr('disabled');
    }
  }else if(event === "both"){
    $("#action_answercall,"   +
        "#action_makecall,"     +
        "#action_clearcall,"    +
        "#action_hold,"         +
        "#action_agentready,"   +
        "#action_agentnotready,"+
        "#action_transfer_popup").attr('disabled', true);
    const b_id = str.split(",");
    for (const id of b_id) {
      $("#"+id).removeAttr('disabled');
    }
  }
}

/**
 * 호전환 서브 버튼 활성화/비활성화 컨트롤
 * */
function buttonControl_sub(str) {
  $(  "#action_makecall_sub,"   +
      "#action_clearcall_sub,"  +
      "#action_transfer,"       +
      "#action_conference").attr('disabled', true);
  const b_id = str.split(",");
  for (const id of b_id) {
    $("#"+id).removeAttr('disabled');
  }
}

/**
 * 레포트 데이터 가져오기
 * */
function toggleDropdown(id) {
  const $dropdown = $(`#${id}`);
  const $dropdowns = $('.dropdown-content');
  $dropdowns.not($dropdown).hide();
  $dropdown.toggle();
}

function toggleUniquePopup(){
  const $overlay = $('.unique-overlay');
  const $popup = $('.unique-popup');
  $overlay.toggleClass('active');
  $popup.toggleClass('active');
}

function closePopupIfOverlay(event) {
  const $overlay = $('.unique-overlay');
  const $popup = $('.unique-popup');
  if (!$popup.is(event.target) && $popup.has(event.target).length === 0) {
    $overlay.toggleClass('active');
    $popup.toggleClass('active');
  }
}

/**
 * 레포트 데이터 가져오기
 * */
async function apiFuncion(url,data){
  const result = await new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      headers: {
        'Authorization': 'Bearer ' + g_webapi.accessToken
      },
      success: function(response) {
        resolve(response);
      },
      error: function(error) {
        reject(error);
      }
    });
  });
  if(result.result){
    if(result.data[0] === undefined){
      return JSON.stringify("{}");
    }else{
      return JSON.stringify(result.data[0]);
    }
  }
}

/**
 * 상담원 리스트 조회
 * */

let agentList = {};
let groupList = {};
let userList = [];
async function monitoringInit() {
  const url = json_apiurl + "/sdkapi/sse/v1/monitoring";
  const parameter = {
    "token": g_webapi.accessToken,
  };
  const timeout = 10000;
  const isDebug = true;
  MonitoringSdk.init(url, parameter, timeout, isDebug);

  const group_result = await Ipron.info.getGroupList(g_tnt_id);
  if (group_result.result === false) {
    log("error", "getGroupList result fail, ", result.msg)
  } else {
    group_result.data.forEach(function(res) {
      groupList[`${res._id}`] = res.name;
    });
  }

  getReportAgentList().then(() => {
    // 성공적으로 완료되었을 때 실행할 로직이 없다면 빈 함수로 처리
  }).catch((error) => {
    console.error("getReportAgentList 함수 실행 중 오류가 발생했습니다:", error);
  });
  const dataset = "user";
  const params = {
    "colFilter" : [
      "userId", "groupId", "groupName", "userName", "usermon1000", "userrsn1010", "usermon1020"
    ],
    "rowFilter" : {
        "userId" : userList
        ,"mediaType" : [
          "voice"
        ]
    },
    "tntId": g_tnt_id
  };

  MonitoringSdk.monitoring.getEventSource(dataset, params).then(function (response) {
    response.data.onmessage = event => {
      const json_str = JSON.parse(event.data);
      let user_data = {};
      user_data._id = json_str.userId;
      user_data.groupId = json_str.groupId;
      user_data.groupName = json_str.groupName;
      user_data.userName = json_str.userName;
      user_data.usermon1000 = json_str.usermon1000;
      user_data.userrsn1010 = json_str.userrsn1010;
      user_data.usermon1020 = json_str.usermon1020;
      if (popupHtml && !popupHtml.closed)
        popupHtml.updateAgent(user_data);

      /*
      const t_body = $("#custom-popup-table-body");
      t_body.find("tr").each(function () {
        $(this).css('cursor', '');
        const dataId = $(this).data("id");
        if (dataId === json_str.userId) {
          let l_text = switchStatus($(this), json_str.usermon1000);
          if (json_str.usermon1000 === "afterwork" ||
              json_str.usermon1000 === "notready") {
            $(this).css('cursor', 'pointer');
            $(this).dblclick(function() {
              $("#phoneInput_sub").val("1111");
            });
          }
          $(this).find("td:eq(3)").text(l_text);
        }
      })
      */
    };
  });
}

function reportSpread(id,r_data){
  r_data = JSON.parse(r_data);
  if(r_data === "{}"){
    return null;
  }
  $("#" + id + " > a:eq(0) > span:eq(1)").text(r_data.user1240 + r_data.user1220 + r_data.user1260); // 분배호
  $("#" + id + " > a:eq(1) > span:eq(1)").text(r_data.user1250); // SL이내 건수
  $("#" + id + " > a:eq(2) > span:eq(1)").text(r_data.user1150); // 포기호수
  $("#" + id + " > a:eq(3) > span:eq(1)").text(formatSecondsToTime(r_data.user1630 + r_data.user1640 + r_data.user1620 + r_data.user1660)); // I/B시간
  $("#" + id + " > a:eq(4) > span:eq(1)").text(formatSecondsToTime(r_data.user1600 + r_data.user1610 + r_data.user1580));// O/B시간
  $("#" + id + " > a:eq(5) > span:eq(1)").text(r_data.user1430 + r_data.user1390 + r_data.user1400 + r_data.user1440 +
                                               r_data.user1360 + r_data.user1040 + r_data.user1410 + r_data.user1450 +
                                               r_data.user1050 + r_data.user1370 + r_data.user1420); // 전환발신호

  $("#" + id + " > a:eq(6) > span:eq(1)").text(r_data.user1270 + r_data.user1320 + r_data.user1280 + r_data.user1650) // 전환수신호
  $("#" + id + " > a:eq(7) > span:eq(1)").text(r_data.user1010);  //발신시도
  $("#" + id + " > a:eq(8) > span:eq(1)").text(r_data.user1230);  //발신성공
  $("#" + id + " > a:eq(9) > span:eq(1)").text(r_data.user1520);  //보류횟수
  $("#" + id + " > a:eq(10) > span:eq(1)").text(formatSecondsToTime(r_data.user1590));  //보류시간
  $("#" + id + " > a:eq(11) > span:eq(1)").text(r_data.usersts1050);  //대기횟수
  $("#" + id + " > a:eq(12) > span:eq(1)").text(formatSecondsToTime(r_data.usersts1110));  //대기시간
  $("#" + id + " > a:eq(13) > span:eq(1)").text(r_data.usersts1080);  //이석횟수
  $("#" + id + " > a:eq(14) > span:eq(1)").text(formatSecondsToTime(r_data.usersts1140));  //이석시간
  $("#" + id + " > a:eq(15) > span:eq(1)").text(r_data.usersts1090);  //후처리횟수
  $("#" + id + " > a:eq(16) > span:eq(1)").text(formatSecondsToTime(r_data.usersts1150));  //후처리시간
}

/**
 * 통화중 -> 호전환 버튼 클릭 (상담사 상태조회)
 * */
let agentListIntervalId;
async function getReportAgentList(){
  log("info", "getReportAgentList call");
  const agent_result = await Ipron.info.getAllAgentList(g_tnt_id);
  if (agent_result.result === false) {
    log("error", "getAllAgentList result fail, ", agent_result.msg)
  } else {
    const t_body = $("#custom-popup-table-body");
    t_body.html("");
    agent_result.data.forEach(function(res) {
      agentList[`${res._id}`] = res.email + "|" + res.groupName + "|" + res.name + "|" +
                   res.phoneExtNum + "|" + res.currentState + "|" + res.groupId ;
      userList.push(res._id);
      if (res.email !== g_agentid) {
        const tr = $(`<tr data-id="${res._id}"></tr>`);
        const td1 = $('<td></td>').text(res.groupName);
        const td2 = $('<td></td>').text(res.name);
        const td3 = $('<td></td>').text(res.phoneExtNum);
        const td4 = $('<td></td>').text(res.currentState);
        tr.append(td1).append(td2).append(td3).append(td4);
        tr.css('cursor', '');
        if (res.currentState === "afterwork" ||
            res.currentState === "notready") {
          tr.css('cursor', 'pointer');
          tr.dblclick(function() {
            $("#phoneInput_sub").val(res.phoneExtNum)
          });
        }
        t_body.append(tr);
      }
    });
  }
}