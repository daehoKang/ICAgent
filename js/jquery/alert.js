  function getAlertMessage(result){
    let str;
    switch(result){
      case 0: str = "성공"; break;
            case 1001: str = "이미 사용중"; break;
            case 1002: str = "발견하지 못함"; break;
            case 1003: str = "라이센스 초과"; break;
            case 1004: str = "여유공간 초과"; break;
            case 1005: str = "유효하지 않은 상태"; break;
            case 1006: str = "이미 처리중"; break;
            case 1007: str = "이미 할당됨"; break;
            case 1008: str = "부정확한 정보"; break;
            case 2000: str = "IC Server와 Version 정보가 일치 하지 않습니다"; break;
            case 2001: str = "사용중인 Device"; break;
            case 2002: str = "사용중인 사용자"; break;
            case 2003: str = "비 수신대기인 사용자"; break;
            case 2004: str = "통화중인 Device"; break;
            case 2006: str = "이미 로그인 중인 사용자"; break;
            case 2101: str = "Device  찾을 수 없음"; break;
            case 2102: str = "App ID 찾을 수 없음"; break;
            case 2103: str = "Tenant 찾을 수 없음"; break;
            case 2104: str = "Mornitor ID 찾을 수 없음"; break;
            case 2105: str = "사용자 찾을 수 없음"; break;
            case 2106: str = "Group 찾을 수 없음"; break;
            case 2107: str = "Queue 찾을 수 없음"; break;
            case 2108: str = "Skill 찾을 수 없음"; break;
            case 2109: str = "사유코드 찾을 수 없음"; break;
            case 2110: str = "Connection 찾을 수 없음"; break;
            case 2111: str = "Call 찾을 수 없음"; break;
            case 2112: str = "DNIS 찾을 수 없음"; break;
            case 2113: str = "UCID 찾을 수 없음"; break;
            case 2114: str = "Media ID 찾을 수 없음"; break;
            case 2115: str = "Subscribe ID 찾을 수 없음"; break;
            case 2116: str = "GroupSkill 찾을 수 없음"; break;
            case 2201: str = "시스템 라이선스 Full"; break;
            case 2202: str = "Tenant 라이선스 Full"; break;
            case 2203: str = "Connection 개수 Full"; break;
            case 2301: str = "Device 개수 초과"; break;
            case 2302: str = "UserData 허용 크기 초과"; break;
            case 2303: str = "Virtual Media 허용 크기 초과"; break;
            case 2304: str = "UserCdr 허용 크기 초과"; break;
            case 2401: str = "유효하지 않는 App ID"; break;
            case 2402: str = "유효하지 않는 사용자 상태"; break;
            case 2403: str = "유효하지 않는 Device 상태"; break;
            case 2404: str = "유효하지 않는 사유 코드"; break;
            case 2405: str = "유효하지 않는 Connection"; break;
            case 2406: str = "유효하지 않는 UCID"; break;
            case 2407: str = "유효하지 않는 Option"; break;
            case 2501: str = "올바르지 않은 범위"; break;
            case 2502: str = "올바르지 않은 패스워드"; break;
            case 2503: str = "올바르지 않은 Device"; break;
            case 2504: str = "올바르지 않은 사용자"; break;
            case 2505: str = "올바르지 않은 상태코드"; break;
            case 2506: str = "올바르지 않은 Call	"; break;
            case 2601: str = "지원하지 않는 Media Type"; break;
            case 2701: str = "MCS Unknown Consult 실패"; break;
            case 2702: str = "MCS Busy Consult 실패"; break;
            case 2703: str = "MCS NoAnswer Consult 실패"; break;
            case 2704: str = "MCS Select Consult 실패"; break;
            case 2705: str = "MCS UserAbort Consult 실패"; break;
            case 2706: str = "MCS Reconnect 실패"; break;
            case 2707: str = "MCS Transfer 실패"; break;
            case 2708: str = "MCS Unknown SGTransfer 실패"; break;
            case 2709: str = "MCS Busy SGTransfer 실패"; break;
            case 2710: str = "MCS NoAnswer SGTransfer 실패"; break;
            case 2711: str = "MCS Select SGTransfer 실패"; break;
            case 2712: str = "MCS UserAbort SGTransfer 실패"; break;
            case 2713: str = "MCS Unknown Reroute 실패"; break;
            case 2714: str = "MCS Busy Reroute 실패"; break;
            case 2715: str = "MCS NoAnswer Reroute 실패"; break;
            case 2716: str = "MCS Select Reroute 실패"; break;
            case 2717: str = "MCS UserAbort Reroute 실패"; break;
            case 2801: str = "BSR 무효"; break;
            case 2802: str = "BSR 찾을 수 없음"; break;
            case 2803: str = "Node In Service"; break;
            case 2804: str = "Node Out Service"; break;
            case -1: str = "Register 된 DN를 찾지 못하였습니다"; break;
            case -2: str = "Socket 연결이 끊겼습니다"; break;
            case -3: str = "Out형 변수의 값이 NULL 입니다"; break;
            case -4: str = "DN 값이 잘못된 형식입니다.(DN 은 0~9, *, # 문자만 가능합니다"; break;
            case -5: str = "Password 암호화 실패"; break;
            case -6: str = "소켓 에러"; break;
            case -7: str = "데이터 전송 실패"; break;
            case -8: str = "Event 대기 실패"; break;
            case -9: str = "Response 실패"; break;
            case -10: str = "Thread 생성 실패"; break;
            case -11: str = "이미 연결 되어 있음"; break;
            case -12: str = "핸들값 에러"; break;
            case -13: str = "Extension Data 처리 오류"; break;
            case -14: str = "데이터 전송 실패"; break;
            case -15: str = "Thread Stop 실패"; break;
            case -16: str = "대기 시간 초과"; break;
            case -17: str = "Memory 할당 실패"; break;
            case -18: str = "보내려는 패킷크기가 너무 큽니다"; break;
            case -19: str = "재접속 시도중입니다"; break;
            case -20: str = "OpenServer 최대 개수 초과"; break;
            case -21: str = "입력값 중에 NULL값 또는 잘못된 데이터가 있습니다"; break;
            case -22: str = "이미 연결되어 있는 Socket 의 IP와 지금 연결 하려는 IP 정보가 다릅니다"; break;
            case -23: str = "OCX의 Event 를 전달 받을 HWND 핸들이 없습니다"; break;
            case -24: str = "IC Server 와 Interface Version 이 다릅니다"; break;
                default: str = "알수 없는 에러 코드 : [" + String(result)+ "]"; break;

    }
    console.log("getAlertMessage 반환값:", str); // 반환값 확인
    return str;
  }