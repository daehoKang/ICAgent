var tenantValue = "";
var IP1Value = "";
var IP2Value = "";
var PortValue = "";
var PrefixValue = "";
var passwordUse = "";
var CallSender = "";


$(function () {
    $("#settingsPre").click(function () {
      $('#settingsPopup').toggleClass('active');
    });

    $("#popupCloseBtn").click(function () {
      $('#settingsPopup').removeClass('active');
    });

    $(document).on("click", function (e) {
      if ($(e.target).closest('#settingsPre, #settingsPopup').length === 0) {
        $('#settingsPopup').removeClass('active');
      }
    });
  });
  
  window.addEventListener("beforeunload", function(){
    if(agentState = 50){
        ClearCall();
        Unregister();
        CloseServer();
      }
  });


  document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.querySelector(".login-btn");
    const userIDField = document.getElementById("InputuserID");
    const passwordField = document.getElementById("Inputpassword");
    const DNField = document.getElementById("InputDN");
  
    // cfg 파일 읽기
    function loadConfig() {
      fetch("sample.cfg")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Config 파일을 불러올 수 없습니다.");
          }
          return response.text();
        })
        .then((data) => {
          const config = parseConfig(data);
          applyConfig(config);
          checkInputs(); // 초기 상태 확인
        })
        .catch((error) => {
          console.error("Config 파일 로드 에러:", error);
        });
    }
  
    // cfg 파일 파싱
    function parseConfig(data) {
      const config = {};
      const lines = data.split("\n");
      lines.forEach((line) => {
        const [key, value] = line.split("=");
        if (key && value) {
          config[key.trim()] = value.trim();
        }
      });
      return config;
    }
  
    // 입력 필드에 값 적용
    function applyConfig(config) {
      const ip1Field = document.getElementById("InputIp1");
      const ip2Field = document.getElementById("InputIp2");
      const portField = document.getElementById("InputPort");
      const prefixField = document.getElementById("InputPrefix");
      const tenantField = document.getElementById("InputTenant");
      
      if (config.IP1) {
        IP1Value = config.IP1;
        ip1Field.value = config.IP1;
        ip1Field.readOnly = true;
      }
      if (config.IP2) {
        IP2Value = config.IP2;
        ip2Field.value = config.IP2;
        ip2Field.readOnly = true;
      }
      if (config.port) {
        PortValue = config.port;
        portField.value = config.port;
        portField.readOnly = true;
      }
      if (config.prefix) {
        PrefixValue = config.prefix;
        prefixField.value = config.prefix;
        prefixField.readOnly = true;
      }

      if (config.tenant){
        tenantValue = config.tenant;
        tenantField.value = config.tenant;
        tenantField.readOnly = true;

      }

      if (config.password_use){
        passwordUse = config.password_use;
          if(passwordUse == 'N'){
            passwordField.style.display = "none"; // 비밀번호 필드 숨기기
          }else{
            passwordField.style.display = ""; // 비밀번호 필드 보이기
          }
      }

    }


  
    // 입력 필드 상태 확인 함수
    function checkInputs() {
      if(passwordUse ==  'Y'){
        const allFilled =
        userIDField.value.trim() !== "" &&
        passwordField.value.trim() !== "" &&
        DNField.value.trim() !== ""; 
      loginButton.disabled = !allFilled; // 모든 필드가 채워지지 않으면 버튼 비활성화
      }
      else{
      loginButton.disabled = false;
    }
    }
  
    // 입력 필드에 이벤트 리스너 추가
    [userIDField, passwordField, DNField].forEach((input) => {
      input.addEventListener("input", checkInputs);
    });
  
    // cfg 파일 로드
    loadConfig();
  
    // 로그인 버튼 클릭 이벤트
    loginButton.addEventListener("click", function () {
      const loginData = {
        userID: userIDField.value,
        password: passwordField.value,
        DN: DNField.value,
        tenant: tenantValue, // 테넌트 값 사용
      };
      console.log("로그인 데이터:", loginData);
      // 여기서 서버로 로그인 요청을 보냅니다.
    });
  });
  
    // Enter 키로 로그인 버튼 동작
    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          // Enter 키가 눌렸을 때
          const loginButton = document.querySelector(".login-btn");
          if (loginButton) {
            loginButton.click(); // 로그인 버튼 클릭 이벤트 트리거
          }
        }
      });

      function StateControl(disable){
        const buttons = document.querySelectorAll(".controls-state button");

        buttons.forEach(function(button) {
          button.disabled = disable;
        });
      }

      function CallControl(buttonID, disable){
        const button = document.getElementById(buttonID);
        if(button){
          button.disabled = disable;
        }
      }

      function MakeCallControl(disable){
        const buttons = document.querySelectorAll(".dialer button");

        buttons.forEach(function(button) {
          button.disabled = disable;
        });
      }

      function toggleDialer(show) {
        const dialer = document.querySelector(".dialer");
        if (dialer) {
          dialer.classList.toggle("hidden", !show); // show가 false면 hidden 클래스 추가

          const transferElements = dialer.querySelectorAll(".Transfer");
          transferElements.forEach((element) => {
            if (!show) {
                element.style.display = "block"; // hidden 상태에서도 표시
            } else {
                element.style.display = ""; // 기본 상태로 복원
            }
        });
        }
      }

      function ClearLogs(){
        const callList = document.querySelector(".call-list");
        callList.innerHTML = ""; // 기존 로그 삭제
      }

      function toggleLogoutPopup(show) {
        const logoutPopup = document.getElementById("logoutPopup");
        if (logoutPopup) {
          logoutPopup.classList.toggle("hidden", !show);
        }
      }

      function BtnSave_onclick() {
        // 입력값 가져오기
        loginData.ip1 = document.getElementById("InputIp1").value.trim();
        loginData.ip2 = document.getElementById("InputIp1").value.trim();
        loginData.port = document.getElementById("InputPort").value.trim();
        loginData.prefix = document.getElementById("InputPrefix").value.trim();
        console.log("확인 : ", loginData.prefix);
    
        // 팝업 숨기기
        document.getElementById("settingsPopup").classList.remove('active');
    
        return false; // 기본 동작 방지
      }
    
      function GetProtocol() {
        var strProtocol = "ws";
        return strProtocol;
      }
    
      function BtnLogin_onclick() {
        const rememberInfo = document.getElementById("rememberInfo").checked;
        if (rememberInfo) {
          const userID = document.getElementById("InputuserID").value;
          const dn = document.getElementById("InputDN").value.trim();
          const tenant = tenantValue;
          localStorage.setItem("saveID", userID);
          localStorage.setItem("saveDN", dn);
          localStorage.setItem("saveTenant", tenant);
          console.log("로그인 정보 저장");
          saveInfo();
        } else {
          localStorage.removeItem("saveID");
          localStorage.removeItem("saveDN");
          localStorage.removeItem("saveTenant");
          console.log("로그인 정보 삭제");
        }
        OpenServer();
      }

      function saveInfo(){
        const saveID = localStorage.getItem("saveID");
        const saveDN = localStorage.getItem("saveDN");
        const saveTenant = localStorage.getItem("saveTenant");
    
        if (saveID) {
          document.getElementById("InputuserID").value = saveID;
        }
        if(saveDN){
          document.getElementById("InputDN").value = saveDN;
        }
        if(saveTenant){
          tenantValue = saveTenant;
        }
        OpenServer();
      }

      function OpenServer(){
        // WebSocket URL 생성
        var p1 = GetProtocol() + '://' + IP1Value + ':' + PortValue + '/wsapi';
        var p2 = GetProtocol() + '://' + InputIp2.value + ':' + InputPort.value + '/wsapi';
    
        if (IP1Value != '') {
            console.log(p1);
        } else {
            console.log(p2);
        }
    
        // ipron 초기화
        ipron.init(p1, p1);
    
        // OpenServer 호출
        var ret = ipron.OpenServer(CBFuncEvent, CBFuncResponse);
    
        if (!ret) {
            console.log('OpenServer 연결 실패');
            return; // 연결 실패 시 종료
        } else {
            //console.log('OpenServer 연결 성공');
        }
      }
    
      function CallRegister() {
          console.log("DN:", InputDN.value);
          console.log("Tenant:", tenantValue);
    
        ipron.Register(InputDN.value, tenantValue);
            
        }
    
      function LoginDupChk(){
    
        agentState = 0;
        agentsub = 0;
    
        console.log("Login ID:", InputuserID.value);
        console.log("Login Password:", Inputpassword.value);
    
        ipron.AgentLoginDupChk(
          InputDN.value,
          InputuserID.value,
          Inputpassword.value,
          tenantValue,
          loginData.state,
          agentsub,
          loginData.extension,
          loginData.passwdType,
          loginData.mediaset
        );
      }

      function BtnLogout_onclick() {
        const result = confirm("로그아웃 하시겠습니까?");
        if (result) {
          AgentLogout();
          console.log("로그아웃 요청");
        } else {
          console.log("로그아웃 취소");
        }
      }

      function AgentLogout() {
        ipron.AgentLogout(
          InputDN.value,
          InputuserID.value,
          tenantValue,
          loginData.extension,
        );
      }
    
      function Unregister() {
        ipron.Unregister(
          InputDN.value,
          tenantValue
        );
      }

      function CloseServer() {
        ipron.CloseServer(
        );
      }


      function LogoutSuccess() {
        alert("정상적으로 로그아웃 되었습니다.");
        location.reload(); // 화면 새로고침
      }
      /*function CallLogin() {
    
        console.log("Login ID:", InputuserID.value);
        console.log("Login Password:", Inputpassword.value);
    
        // 로그인 -> 중복체크 로그인 변경
        ipron.AgentLogin(
          InputDN.value, 
          InputuserID.value, 
          Inputpassword.value, 
          InputTenant.value, 
          loginData.state, 
          loginData.statesub, 
          loginData.extension, 
          loginData.passwdType, 
          loginData.mediaset);
      }*/
    
      function navigateToCallMain() {;
        
        // 로그인 화면 숨기기
        document.querySelector(".login-container").style.display = "none";
    
        // CallMain 화면 표시
        document.querySelector(".callmain-container").style.display = "block";
    
        document.getElementById("userID").textContent = InputuserID.value;
        document.getElementById("DN").textContent = `(${InputDN.value})`;
      }
    
      function BtnMakeCall_onclick() {
        document.getElementById("InputDnis").value;
        
        const MobileNumber = /^010\d{8}$/.test(InputDnis.value); // 휴대전화번호
        const LandlineNumber = /^\d{2,3}\d{7,8}$/.test(InputDnis.value); // 국선 전화번호

        if (PrefixValue !== "" && (MobileNumber || LandlineNumber)) {
          InputDnis.value = PrefixValue + InputDnis.value;
          console.log("Dnis: " , InputDnis.value);
        }

        CallSender = 1;

        ipron.MakeCall(
          InputDN.value,
          InputDnis.value,
          MakeCall.OB_CALLING_DN,
          MakeCall.SKILL_LEVEL,
          MakeCall.PRIORIY,
          MakeCall.RELATION_AGENT_DN,
          MakeCall.RELATION_AGENT_ID,
          MakeCall.RELATION_METHOD,
          MakeCall.ROUTE_METHOD,
          MakeCall.ROUTE_SKILL_ID,
          MakeCall.ROUTE_GROUP_ID,
          MakeCall.UCID,
          MakeCall.EXTENSION_DATA,
          MakeCall.MEDIA_TYPE,
          MakeCall.USEPREVAGENT,
          MakeCall.USEDESIGNATEDAGENT,
          MakeCall.RELATION_TIMEOUT,
          MakeCall.HOP
        );
      }
    
      let timerInterval; // 타이머를 관리할 변수
      let timerSeconds = 0; // 타이머 초기값
    
      function resetTimer(statusBar) {
          // 기존 타이머 중지
          if (timerInterval) {
              clearInterval(timerInterval); // 기존 타이머를 중지
              timerInterval = null; // 타이머 변수를 초기화
          }
    
          // 타이머 초기화
          timerSeconds = 0;
    
          // 새로운 타이머 시작
          timerInterval = setInterval(() => {
              timerSeconds++;
              const hours = String(Math.floor(timerSeconds / 3600)).padStart(2, '0');
              const minutes = String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, '0');
              const seconds = String(timerSeconds % 60).padStart(2, '0');
              statusBar.textContent = `${statusBar.textContent.split(' ')[0]} (${hours}:${minutes}:${seconds})`;
          }, 1000);
      }
    
      function AgentStateBar() {
          if(agentState_bak == ""){
            var agentState_bak = 0;
          }

          const statusBar = document.querySelector(".status-bar");
    
          // 상태에 따라 텍스트 변경
          switch (agentState) {
              case 30:
                  statusBar.textContent = "자리비움";
                  break;
              case 40:
                  statusBar.textContent = "수신대기";
                  break;
              case 51:
                  statusBar.textContent = "통화중";
                  break;
              case 52:
                  statusBar.textContent = "연결중";
                  break;
              case 53:
                  statusBar.textContent = "벨울림";
                  break;
              case 60:
                  statusBar.textContent = "후처리";
                  break;
              default:
                  statusBar.textContent = "이외";
          }
    
          // 상태 변경 시 타이머 초기화 및 시작
          resetTimer(statusBar);
            addLog(agentState);
      }
    
      function SetAgentState(value, state_sub) {
        agentState = parseInt(value);
        console.log("확인 : ", state_sub);
        const InputuserID = document.getElementById("InputuserID");
        loginData.tenant = tenantValue; // Tenant 값 설정
    
        if(state_sub == 0){
          ipron.SetAgentState(
            InputuserID.value, // User ID
            loginData.tenant,  // Tenant
            agentState,        // Agent State
            loginData.statesub,          // State Sub
            loginData.extension,        // Extension
            loginData.mediaset           // Media Set
        );
        }else{
          ipron.SetAgentState(
            InputuserID.value, // User ID
            loginData.tenant,  // Tenant
            agentState,        // Agent State
            state_sub,          // State Sub
            loginData.extension,        // Extension
            loginData.mediaset           // Media Set
          );
        }
        console.log("상담원 상태 변경:", agentState);
    
        // 상태바 업데이트
        AgentStateBar();

      }
    
      let PopTimerInterval;

      function showCallPopup(ANI) {

        const popup = document.getElementById("callPopup");
        const phoneNumberElement = document.getElementById("popupPhoneNumber");
        const timerElement = document.getElementById("popupTimer");

        const formattedANI = formatPhoneNumber(ANI);

        // 전화번호 설정
        phoneNumberElement.textContent = formattedANI;
        timerElement.textContent = "00:00:00";

        if (PopTimerInterval) {
          clearInterval(PopTimerInterval); // 기존 타이머를 중지
          PopTimerInterval = null; // 타이머 변수를 초기화
      }
    
        // 타이머 초기화
        let seconds = 0;
        PopTimerInterval = setInterval(() => {
          seconds++;
          const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
          const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
          const secs = String(seconds % 60).padStart(2, "0");
          timerElement.textContent = `${hours}:${minutes}:${secs}`;
        }, 1000);
    
        // 팝업 표시
        popup.classList.remove("hidden");
    
        // 버튼 동작 정의
        document.getElementById("pop_AnswerCall").onclick = () => {
          clearInterval(PopTimerInterval);
          popup.classList.add("hidden");
          AnswerCall();
        };
    
        document.getElementById("pop_ClearCall").onclick = () => {
          console.log("전화 종료");
          clearInterval(PopTimerInterval);
          popup.classList.add("hidden");
          ClearCall();
        };
    
      }
    
      function formatPhoneNumber(phoneNumber) {
        if (/^010\d{8}$/.test(phoneNumber)) {
          return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
        }

        if (/^\d{2,3}\d{7,8}$/.test(phoneNumber)) {
          return phoneNumber.replace(/(\d{2,3})(\d{3,4})(\d{4})/, "$1-$2-$3");
        }

        return phoneNumber;
      }


      function AnswerCall() {
        ipron.AnswerCall(
          InputDN.value,
          Connection_id,
          MakeCall.MEDIA_TYPE
        );
      }
    
      function ClearCall(){
        ipron.ClearCall(
          InputDN.value,
          Connection_id,
          MakeCall.MEDIA_TYPE
        );
      }
    
      function HoldCall(){
        ipron.HoldCall(
          InputDN.value,
          Connection_id,
          MakeCall.EXTENSION_DATA,
          MakeCall.MEDIA_TYPE
        );
      }
    
      function RetrieveCall(){
        ipron.RetrieveCall(
          InputDN.value,
          Connection_id,
          MakeCall.EXTENSION_DATA,
          MakeCall.MEDIA_TYPE
        );
      }
    
      var LastLog = null;

      function addLog(state) {
        if (state === 51 || state === 52 || state === 53 || (state === 60 && state === LastLog)) {
          LastLog = null;
          return;
        }
        const callList = document.querySelector(".call-list");
        console.log("확인 : ", state)
        // 현재 시간 가져오기
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const currentTime = `${hours}:${minutes}`;
    
        // 상태 텍스트 설정
        let stateText = "";
        switch (state) {
          case 30 :
            stateText = "자리비움";
            break;
          case 40 :
            stateText = "수신대기";
            break;
          case 58 :
            stateText = "보류";
            break;
          case 59 :
            stateText = "보류해제";
            break;
          case 60 :
            stateText = "후처리";
            break;
          default:
            stateText = "알 수 없는 상태";
        }
        
        const existingLogs = callList.querySelectorAll(".call-item");
        existingLogs.forEach((log) => {
        const stateSpan = log.querySelector("span:first-child"); // 상태 텍스트 부분
        if (stateSpan) {
            stateSpan.style.color = "gray"; // 상태 텍스트만 옅게 설정
        }
      });

        // 로그 항목 생성
        const logItem = document.createElement("div");
        logItem.classList.add("call-item");
        logItem.innerHTML = `
        <span style="color: #4a90e2;">📄 ${stateText}</span> <!-- 상태 텍스트는 기본 색상 유지 -->
        <span>${currentTime}</span> <!-- 시간은 변경하지 않음 -->
    `;
    
        // 로그 추가
        callList.prepend(logItem); // 최신 로그가 위로 오도록 추가
        LastLog = state;
      }
      
      function SelectState(state) {
        if(state == 'ACW'){
        var SelectState_popup = document.getElementById("SelectState_AcwPopup");
        var ClosePopupBtn = document.getElementById("ClosePopupBtn_Acw");
        var ConfirmBtn = document.getElementById("ConfirmBtn_Acw");
        var CancelBtn = document.getElementById("CancelBtn_Acw");
        }else if(state == 'NotReady'){
        var SelectState_popup = document.getElementById("SelectState_NotReadyPopup");
        var ClosePopupBtn = document.getElementById("ClosePopupBtn_NotReady");
        var ConfirmBtn = document.getElementById("ConfirmBtn_NotReady");
        var CancelBtn = document.getElementById("CancelBtn_NotReady");
        }

        // 팝업 표시
        if (SelectState_popup) {
          SelectState_popup.classList.remove("hidden"); // hidden 클래스 제거

        // 팝업 닫기 버튼
        if (ClosePopupBtn) {
          ClosePopupBtn.onclick = function () {
            SelectState_popup.classList.add("hidden");
          };
        }
      
        // 취소 버튼 클릭 시 팝업 닫기
        if (CancelBtn) {
          CancelBtn.onclick = function () {
            SelectState_popup.classList.add("hidden");
          };
        }
      
        // 확인 버튼 클릭 시 동작
        if (ConfirmBtn) {
          ConfirmBtn.onclick = function () {        
            if(state == 'NotReady'){
              const StateReason = document.querySelector("#SelectState_NotReadyPopup #StateReason_NotReady");
              SetAgentState(30, Number(StateReason_NotReady.value));
            }else{
              const StateReason = document.querySelector("#SelectState_AcwPopup #StateReason_ACW");
              SetAgentState(60, Number(StateReason_ACW.value));
            }
            // 팝업 닫기
            SelectState_popup.classList.add("hidden");
          };
        }
      }
    }

    function GetStateSubcode(agent_state){
      ipron.GetStateSubcode(
        tenantValue,
        agent_state
      );
    }

    function TransferPopup(show = true) {
      const transferPopup = document.getElementById("transferPopup");
      if (transferPopup) {
        if (show) {
          transferPopup.classList.remove("hidden"); // 팝업 표시
        } else {
          transferPopup.classList.add("hidden"); // 팝업 숨김
        }
      }
      if (show == true){
        HoldCall();
      }else{
        RetrieveCall();
      }
      
    }

    function SingleStepTransfer(){
      
      const TransferDN = document.getElementById("transferNumber");

      MakeCall.MEDIA_TYPE = 0;
      MakeCall.USEPREVAGENT = 1;
      console.log("media_type : ", MakeCall.MEDIA_TYPE);
      console.log("usePrevAgent : ", MakeCall.USEPREVAGENT);
      ipron.SinglestepTransfer(
        InputDN.value,
        Connection_id,
        TransferDN.value,
        MakeCall.OB_CALLING_DN,
        MakeCall.SKILL_LEVEL,
        MakeCall.PRIORIY,
        MakeCall.RELATION_AGENT_DN,
        MakeCall.RELATION_AGENT_ID,
        MakeCall.RELATION_METHOD,
        MakeCall.ROUTE_METHOD,
        MakeCall.ROUTE_SKILL_ID,
        MakeCall.ROUTE_GROUP_ID,
        MakeCall.EXTENSION_DATA,
        MakeCall.MEDIA_TYPE,
        MakeCall.USEPREVAGENT,
        MakeCall.USEDESIGNATEDAGENT,
        MakeCall.RELATION_TIMEOUT,
        MakeCall.HOP
      );
      
    }