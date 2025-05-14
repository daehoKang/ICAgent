var ipron = ipron;
var LoginSuccess = "";
var agentState = "";
var Connection_id = "";
var subcode_NotReady = "";
var subcode_ACW = "";

var loginData = {
  ip1 : "",
  ip2 : "",
  port : "",
  userID : "",
  passWord : "",
  DN : "",
  tenant : "",
  state : 30,
  statesub : 0,
  extension : "",
  passwdType : 4,
  mediaset : 0
};

var MakeCall = {
  OB_CALLING_DN : "",
  SKILL_LEVEL : 0,
  PRIORIY : 0,
  RELATION_AGENT_DN : "",
  RELATION_AGENT_ID : "",
  RELATION_METHOD : 0,
  ROUTE_METHOD : 0,
  ROUTE_SKILL_ID : 0,
  ROUTE_GROUP_ID : 0,
  UCID : "",
  USEPREVAGENT : 1,
  USEDESIGNATEDAGENT : 1,
  RELATION_TIMEOUT : 0,
  HOP : 0,
  EXTENSION_DATA : "",
  MEDIA_TYPE : 0
};

function CBFuncResponse(response) {
  console.log("Response Callback:", response);

  switch (response.METHOD) {
    case ipron.APIResponse.OPENSERVER_RES:
      if (response.METHOD == ipron.APIResponse.OPENSERVER_RES) {
        console.log("RES : OpenServer 성공");
        CallRegister();
      }
      else {
        console.log("RES : OpenServer 실패");
      }
      break;
    case ipron.APIResponse.REGIADDR_RES:
      if (response.METHOD == ipron.APIResponse.REGIADDR_RES) {
        if(response.RESULT == 0) {
          console.log("RES : REGISTERED 성공");  
        }else if(response.RESULT == 2101) {
          alert("올바르지않은 DN입니다. 확인 후 다시 로그인해주십시오.");
          location.reload();
        }else if(response.RESULT == 2103) {
          alert("올바르지않은 테넌트입니다. 확인 후 다시 로그인해주십시오.");
          location.reload();
        }   
      }
      else {
        console.log("RES : REGISTERED 실패");
        location.reload();
      }
      break;
    case ipron.APIResponse.AGENTLOGIN_DUP_RES:
      if (response.METHOD == ipron.APIResponse.AGENTLOGIN_DUP_RES) {
        
        var password = response.AGENT_PASSWORD;
        
        if(response.RESULT == 0){
          console.log("RES : 로그인 사용자 없음, 로그인 진행");
            ipron.AgentLoginEx(
              InputDN.value,
              InputuserID.value,
              password,
              InputTenant.value,
              loginData.state,
              agentsub,
              loginData.extension,
              loginData.passwdType,
              loginData.mediaset,
              1
            );
        }else if(response.RESULT == 2006){
          if(confirm("이미 로그인 된 아이디입니다. 새로 로그인하시겠습니까?") == true) {
              ipron.AgentLoginEx(
              InputDN.value,
              InputuserID.value,
              password,
              InputTenant.value,
              loginData.state,
              agentsub,
              loginData.extension,
              loginData.passwdType,
              loginData.mediaset,
              1
            );
          }}else if(response.RESULT == 2105){
            alert("아이디가 올바르지않습니다. 확인 후 다시 로그인해주십시오.");
            location.reload();
          }else if(response.RESULT == 2502){
            alert("비밀번호가 올바르지않습니다. 확인 후 다시 로그인해주십시오");
            location.reload();
          }
          else {
            location.reload(); // 페이지 새로고침
        }
      }
      break;  
    case ipron.APIResponse.AGENTLOGIN_EX_RES:
      if (response.METHOD == ipron.APIResponse.AGENTLOGIN_EX_RES) {
        console.log("RES : AGENTLOGIN_EX 성공");
        agentState = response.AGENT_STATE;
        AgentStateBar();
      }
      else {
        console.log("RES : AGENTLOGIN_EX 실패");
      }
      break;
    case ipron.APIResponse.AGENTLOGOUT_RES:
      if (response.METHOD == ipron.APIResponse.AGENTLOGOUT_RES) {
        console.log("RES : AGENTLOGOUT 성공");
      }
      else {
        console.log("RES : AGENTLOGOUT 실패");
      }
      break;
    case ipron.APIResponse.UNREGIADDR_RES:
      if (response.METHOD == ipron.APIResponse.UNREGIADDR_RES) {
        console.log("RES : UNREGISTERED 성공");
      }
      else {
        console.log("RES : UNREGISTERED 실패");
      }
      break;
      case ipron.APIResponse.CLOSESERVER_RES:
        if (response.METHOD == ipron.APIResponse.CLOSESERVER_RES) {
          console.log("EVENT : CloseServer 성공");
          LogoutSuccess();
        }
        else {
          console.log("EVENT : CloseServer 실패");
        }
          break;
    case ipron.APIResponse.MAKECALL_RES:
      if (response.METHOD == ipron.APIResponse.MAKECALL_RES) {
        if(response.RESULT == 0) {
          console.log("RES : MAKECALL 성공");
        } else {
          console.log("RES : MAKECALL 실패", response.RESULT);
        }
        
      }
      else {
        console.log("RES : MAKECALL 실패");
      }
      break;
    case ipron.APIResponse.SETAGENTSTATE_RES:
      if (response.METHOD == ipron.APIResponse.SETAGENTSTATE_RES) {
        console.log("RES : SETAGENTSTATE 성공(", response.AGENT_STATE, ")");
      }
      else {
        console.log("RES : SETAGENTSTATE 실패(", response.RESULT, ")");
      }
      break;
    case ipron.APIResponse.ANSWERCALL_RES:
      if (response.METHOD == ipron.APIResponse.ANSWERCALL_RES) {
        console.log("RES : ANSWERCALL 성공");
      }
      else {
        console.log("RES : ANSWERCALL 실패");
      }
      break;
    case ipron.APIResponse.CLEARCALL_RES:
      if (response.METHOD == ipron.APIResponse.CLEARCALL_RES) {
        console.log("RES : CLEARCALL 성공");
      }
      else {
        console.log("RES : CLEARCALL 실패");
      }
      break;
    case ipron.APIResponse.HOLDCALL_RES:
      if (response.METHOD == ipron.APIResponse.HOLDCALL_RES) {
        console.log("RES : HOLDCALL 성공");
      }
      else {
        console.log("RES : HOLDCALL 실패");
      }
      break;
    case ipron.APIResponse.RETRIEVECALL_RES:
      if (response.METHOD == ipron.APIResponse.RETRIECALL_RES) {
        console.log("RES : RETRIECALL 성공");
      }
      else {
        console.log("RES : RETRIECALL 실패");
      }
      break;
    case ipron.APIResponse.GETSTATE_SUBCODE_RES:
      if (response.METHOD == ipron.APIResponse.GETSTATE_SUBCODE_RES) {
        console.log("RES : GETSTATE_SUBCODE 성공");

        agent_state = response.AGENT_STATE;
        state_subcode = response.EXTENSION_DATA;

        console.log("사유코드 : ", state_subcode);
        
        if(agent_state == 30){
          StateReason = "StateReason_NotReady";
          selectState = "NotReady";
        }else{
          StateReason = "StateReason_ACW";
          selectState = "ACW";
        }

        let stateReasonSelect = "";
        stateReasonSelect = document.getElementById(StateReason);
        
          for (key in state_subcode){
            console.log("현재 키:", key, "값:", state_subcode[key][0]); // 디버깅 로그

            if(agent_state == 30){
                subcode_NotReady = 1;
            }else{
                subcode_ACW = 1;
            }
              option = document.createElement("option");
              option.value = key;
              option.text = state_subcode[key][0];
              stateReasonSelect.appendChild(option);
              console.log(stateReasonSelect);
              
          }

        SelectState(selectState);

        stateReasonSelect.addEventListener("change", function () {
          const selectedKey = stateReasonSelect.value; // 선택된 키
          const selectedText = stateReasonSelect.options[stateReasonSelect.selectedIndex].text; // 선택된 텍스트
          console.log("선택된 사유코드:", selectedKey);
          console.log("선택된 사유 텍스트:", selectedText);
        });        
      }
      else {
        console.log("RES : GETSTATE_SUBCODE 실패");
      }
      break;
    default:
    console.log("알 수 없는 이벤트:", response);
  }
      }

function CBFuncEvent(event) {
  console.log("Event Callback:", event);

  // 이벤트 처리
  switch (event.METHOD) {
      case ipron.APIEvent.OPENSRVSUCCESS:
          console.log("EVENT : OpenServer 성공");
          break;
      case ipron.APIEvent.REGISTERED:
        if (event.METHOD == ipron.APIEvent.REGISTERED) {
          console.log("EVENT : Register 성공");
          LoginDupChk();
        }
        else {
          console.log("EVENT : Register 실패");
        }
          break;
      case ipron.APIEvent.AGENTLOGIN:
        if (event.METHOD == ipron.APIEvent.AGENTLOGIN) {
          console.log("EVENT : Login 성공");
            LoginSuccess = "true";
            navigateToCallMain();            
        }
        else {
          console.log("EVENT : Login 실패");
        }
          break;
      case ipron.APIEvent.AGENTLOGOUT:
        if (event.METHOD == ipron.APIEvent.AGENTLOGOUT) {
          console.log("EVENT : Logout 성공");
            LoginSuccess = "false";
            Unregister();
        }
        else {
          console.log("EVENT : Logout 실패");
        }
          break;
      case ipron.APIEvent.UNREGISTERED:
        if (event.METHOD == ipron.APIEvent.UNREGISTERED) {
          console.log("EVENT : Unregister 성공");
            CloseServer();
        }
        else {
          console.log("EVENT : Unregister 실패");
        }
          break;
      case ipron.APIEvent.AGENTREADY:
        if (event.METHOD == ipron.APIEvent.AGENTREADY) {
          console.log("EVENT : 수신대기 성공");
        }
        else {
          console.log("EVENT : 수신대기 실패");
        }
          break;
      case ipron.APIEvent.INITIATED:
        if (event.METHOD == ipron.APIEvent.INITIATED) {
          console.log("EVENT : INITIATED 성공");
          Connection_id = event.CONNECTION_ID;
        }
        else {
          console.log("EVENT : INITIATED 실패");
        }
          break;
      case ipron.APIEvent.DIALING:
        if (event.METHOD == ipron.APIEvent.DIALING) {
          console.log("EVENT : DIALING 성공");
          document.querySelector(".controls_2").classList.remove("hidden") //통화종료 버튼 활성화
          Connection_id = event.CONNECTION_ID;
              state = 52;
              SetAgentState(state);
              StateControl(true);
              CallControl(false);
        }
        else {
          console.log("EVENT : DIALING 실패");
        }
          break;
      case ipron.APIEvent.ESTABLISHED:
        if (event.METHOD == ipron.APIEvent.ESTABLISHED) {
          console.log("EVENT : ESTABLISHED 성공");
          document.querySelector(".controls").classList.remove("hidden")
          document.querySelector(".controls_2").classList.add("hidden")
          state = 51;
          SetAgentState(state);
          StateControl(true);
          MakeCallControl(true);
          CallControl(false);
          toggleDialer(false);
        }
        else {
          console.log("EVENT : ESTABLISHED 실패");
        }
          break;
      case ipron.APIEvent.RELEASED:
        if (event.METHOD == ipron.APIEvent.RELEASED) {
          console.log("EVENT : RELEASED 성공");
          document.querySelector(".controls").classList.add("hidden")
          document.querySelector(".controls_2").classList.add("hidden")
          const callPopup = document.getElementById("callPopup");
          state = 60
          SetAgentState(state);
          StateControl(false);
          MakeCallControl(false);
          CallControl(true);
          toggleDialer(true);

          if (callPopup) {
            callPopup.classList.add("hidden");
          }
      }
        else {
          console.log("EVENT : RELEASED 실패");
        }
          break;            
      case ipron.APIEvent.AGENTNOTREADY:
        if(LoginSuccess == "true"){
          if(event.METHOD == ipron.APIEvent.AGENTNOTREADY) {
            console.log("현재 상담원 상태 : ", event.AGENT_STATE);
            } 
        }           
          break;
      case ipron.APIEvent.RINGING:
        if (event.METHOD == ipron.APIEvent.RINGING) {
          console.log("EVENT : 벨울림");
          const ANI = event.ANI;
          Connection_id = event.CONNECTION_ID;
          showCallPopup(ANI); // 팝업 표시
          state = 53;
          SetAgentState(state);
        }
          break;
      case ipron.APIEvent.HELD:
        if (event.METHOD == ipron.APIEvent.HELD) {
          console.log("EVENT : 통화 대기 성공");
          value = 58; // 58 : 통화대기
          addLog(value);
          CallControl(false);
        }
        else {
          console.log("EVENT : 통화 대기 실패");
        }
          break;
      case ipron.APIEvent.RETRIEVED:
        if (event.METHOD == ipron.APIEvent.RETRIEVED) {
          console.log("EVENT : 통화 대기 해제 성공");
          value = 59; // 59 : 통화대기
          addLog(value);
        }
        else {
          console.log("EVENT : 통화 대기 해제 실패");
        }
          break;
      case ipron.APIEvent.AGENTACW:
        if (event.METHOD == ipron.APIEvent.AGENTACW) {
          console.log("EVENT : 후처리상태 변경완료");
        }else{
          console.log("EVENT : 후처리상태 변경실패");
        }
        break;
        case ipron.APIEvent.BANISHMENT:
          if (event.METHOD == ipron.APIEvent.BANISHMENT) {
            console.log("EVENT : 강제 로그아웃 성공");
        
          if (event.RESULT == 0) {
            var DestAgentID = event.DEST_AGENT_ID;
            var DestDN = event.DEST_DN;
        
            console.log(InputDN.value);
            console.log(InputuserID.value);
            console.log(DestAgentID);
            console.log(DestDN);
        
            if (DestAgentID == InputuserID.value && DestDN == InputDN.value) {
               alert("동일한 아이디/DN 로그인으로 인해 로그아웃되었습니다.");
              location.reload(); 
               return;
             } else if (DestAgentID == InputuserID.value) {
              alert("내선번호 : " + DestDN + "님의 로그인으로 인해 로그아웃되었습니다.");
               location.reload(); 
               return;
             } else if (DestDN == InputDN.value) {
               alert("아이디 : " + DestAgentID + "님의 로그인으로 인해 로그아웃되었습니다.");
               location.reload(); 
               return;
              }
            } else {
              console.log("EVENT : 강제 로그아웃 실패");
            }
          }
          break;
      default:
          console.log("알 수 없는 이벤트:", event);
          
  }
}