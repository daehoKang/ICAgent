(function (module, global) {
    var ipron = module;

    ipron.GetWebAPIVersion = function () {
        return "6.2.0.0";
    }

    ipron.socket1 = null;
    ipron.socket2 = null;
    ipron.HBTime = 5000;
    ipron.s1HAState = ["EMPTY", "EMPTY", "EMPTY"];
    ipron.s1HATime = [new Date(), new Date(), new Date()];
    ipron.s2HAState = ["EMPTY", "EMPTY", "EMPTY"];
    ipron.s2HATime = [new Date(), new Date(), new Date()];
    ipron.SocketID = "0";
    ipron.appId = 0;
    ipron.hbtimer = 0;
    ipron.evtCB = null;
    ipron.resCB = null;
    ipron.isEnd = false;
    ipron.isWork = false;

    ipron.hbreq1 = new Date();
    ipron.hbreq2 = new Date();
    ipron.hbres1 = new Date();
    ipron.hbres2 = new Date();

    ipron.diIplist = new Array();
    ipron.diport = "9020";
    ipron.diprotocol = "http";

    ipron.gwaddr1 = "";
    ipron.gwaddr2 = "";
    ipron.worker = null;

    ipron.arrExt = {};
    ipron.extensionIndex = 0; 
    ipron.monIds = new Map();

    ipron.init = function(url1, url2) {
        ipron.srv1 = url1;
        ipron.srv2 = url2;
    }

    var diBaseURL = '/v1/';

    ipron.APIMethod = {
        OPENSERVER: 1000,
        CLOSESERVER: 1002,
        REGIADDR: 1004,
        UNREGIADDR: 1006,
        ANSWERCALL: 1008,
        CLEARCALL: 1010,
        MAKECALL: 1012,
        HOLDCALL: 1014,
        RETRIEVECALL: 1016,
        SINGLESTEP_TRANSFER: 1018,
        MUTE_TRANSFER: 1020,
        SINGLESTEP_CONFERENCE: 1022,
        CONFERENCE: 1024,
        AGENTLOGIN: 1030,
        AGENTLOGOUT: 1032,
        SETAGENTSTATE: 1034,
        GETAGENTSTATE: 1036,
        HEARTBEAT: 1038,
        GETSTATE_SUBCODE: 1040,
        GETAGENTLIST: 1042,
        GETAGENTINFO: 1044,
        GETROUTEABLE: 1046,
        SETAFTCALLSTATE: 1048,
        GETQUEUETRAFFIC: 1050,
        ITMSG_SENDMSG: 1052,
        ITMSG_ARRIVED: 1054,
        GETGROUPLIST: 1056,
        GETQUEUELIST: 1058,
        GROUP_REGIADDR: 1061,
        GROUP_UNREGIADDR: 1063,
        UPDATE_USERDATA: 1065,
        DELETE_KEY_USERDATA: 1067,
        DELETE_ALL_USERDATA: 1069,
        SEND_USEREVENT: 1071,
        GRPICKUP: 1073,
        AGENT_REPORT: 1077,
        JOINCALL: 1079,
        TENANT_REPORT: 1081,
        DEFLECTCALL: 1083,
        SETSKILL_ENABLE: 1085,
        GETAGENT_SKILLLIST: 1087,
        GETCONNECTION: 1089,
        GET_USERDATA: 1091,
        GETCONNSTATE: 1093,
        FORCE_SETAGTSTATE: 1095,
        GROUP_REPORT: 1099,
        GETAGENT_QUEUELIST: 1101,
        GETQUEUEORDER: 1103,
        GETQUEUEORDER_EX: 1105,
        SET_ANI_USERDATA: 1111,
        QUEUE_REPORT: 1117,
        DNIS_REPORT: 1119,
        SEND_SOCKETID: 1139,
        QUEUE_PICKUP: 1140,
        MEDIA_ATTACH: 1142,
        MEDIA_DEATTACH: 1144,
        MEDIA_PLAY: 1146,
        MEDIA_COLLECT: 1148,
        SET_UCID_USERDATA: 1150,
        MCS_CONSULTCALL: 1156,
        MCS_RECONNECTCALL: 1158,
        MCS_TRANSFERCALL: 1160,
        MCS_ONESTEP_TRANSFERCALL: 1162,
        MCS_REROUTE: 1164,
        GETAGENTINFO_EX: 1166,
        BSR: 1170,
        EAS_GETAUTHKEY: 1180,
        EAS_SETAUTHKEY: 1182,
        EAS_REGIADDR: 1184,
        EAS_UNREGIADDR: 1186,
        EAS_GROUP_REGIADDR: 1188,
        EAS_GROUP_UNREGIADDR: 1190,
        EAS_AGETN_LOGIN: 1192,
        AGENTCALL: 1194,
        DTMF_PLAY: 1196,

        GETAGENTLIST_EX: 1200,
        GETGROUPLIST_EX: 1202,
        GETQUEUELIST_EX: 1204,
        GETAGENT_SKILLLIST_EX: 1206,
        GETAGENT_QUEUELIST_EX: 1208,

        AGENT_SUBSCRIBE: 1220,
        GROUP_SUBSCRIBE: 1222,
        QUEUE_SUBSCRIBE: 1224,
        TENANT_SUBSCRIBE: 1226,
        DNIS_SUBSCRIBE: 1228,
        CLOSE_SUBSCRIBE: 1230,

        VIRTUAL_QUEUE: 1300,
        SET_CALLBACK: 1302,
        MEDIA_DND: 1304,
        RESERVED_AGENT_STATE: 1306,
        SEND_GLOBAL_EVENT: 1308,
        GET_MEDIA_ACTIVATE: 1310,
        GETROUTEPOLICY: 1312,
        SET_MEDIAREADY_STATE: 1314,
        GET_MEDIAREADY_STATE: 1316,
        GET_USER_CDR: 1318,
        SET_USER_CDR: 1320,
        SET_MUTE_ENABLE: 1322,
        GETCATEGORY_LIST: 1324,
        GETCATEGORY_INFO: 1326,
        RESERVE_IR_ATTR: 1328,
        FIND_WAIT_IR: 1330,
        GETCONNECTION_EX: 1332,
        GETCALL_INFO: 1334,
        GET_USER_CDR_EX: 1336,
        SET_USER_CDR_EX: 1338,
        ADNLOGIN: 1340,
        SETAGENTSTATE_DATA: 1342,
        HOLDCALL_EX: 1344,
        GETAGENT_MASTERQUEUEINFO: 1346,
        SETAFTCALLSTATE_EX: 1348,
        OPENSERVER_MOBILE: 1350,
        GET_DEVICE_ACTIVATE: 1352,
        SET_USER_CDR_V5: 1354,
        GET_MEDIA_OPTION: 1356,
        SET_MEDIA_OPTION: 1358,
        MUTE_TRANSFER_EX: 1360,
        GET_GROUPSKILL_LIST: 1362,
        GET_DEVICE_LIST: 1364,
        GET_CALLINFO_EX: 1366,
        AGENT_JOINCALL: 1368,
        SET_AFT_RECALLSTATE: 1370,
        GET_TENANT_LIST: 1372,
        AGENTCALL_EX: 1374,
        GET_CALL_POSITION: 1376,
        GET_QUEUE_TRAFFIC_EX: 1378,
        AGENT_REPORT_EX: 1382,
        AGENT_SUBSCRIBE_EX: 1384,
        GET_IR_STATE: 1386,
        GET_DR_STATE: 1388,
        AGENTLOGIN_EX: 1390,
        AGENTLOGIN_DUP: 1392,
        GROUPLOGIN: 1394,
        GROUPLOGOUT: 1396,
        SETSKILL_ALL_ENABLE: 1405,
        SET_IE_DND: 1407,
        GET_IE_DND: 1409,
        SET_IE_VOICE_RECORD: 1411,
        SET_IE_AGC: 1413,
        GET_IE_AGC: 1415,
        DI_AGENT_REPORT: 1417,
        SETSKILL_ENABLE_EX: 1419
    }

    ipron.APIResponse = {
        OPENSERVER_RES: 1001,
        CLOSESERVER_RES: 1003,
        REGIADDR_RES: 1005,
        UNREGIADDR_RES: 1007,
        ANSWERCALL_RES: 1009,
        CLEARCALL_RES: 1011,
        MAKECALL_RES: 1013,
        HOLDCALL_RES: 1015,
        RETRIEVECALL_RES: 1017,
        SINGLESTEP_TRANSFER_RES: 1019,
        MUTE_TRANSFER_RES: 1021,
        SINGLESTEP_CONFERENCE_RES: 1023,
        CONFERENCE_RES: 1025,
        AGENTLOGIN_RES: 1031,
        AGENTLOGOUT_RES: 1033,
        SETAGENTSTATE_RES: 1035,
        GETAGENTSTATE_RES: 1037,
        HEARTBEAT_RES: 1039,
        GETSTATE_SUBCODE_RES: 1041,
        GETAGENTLIST_RES: 1043,
        GETAGENTINFO_RES: 1045,
        GETROUTEABLE_RES: 1047,
        SETAFTCALLSTATE_RES: 1049,
        GETQUEUETRAFFIC_RES: 1051,
        ITMSG_SENDMSG_RES: 1053,
        ITMSG_ARRIVED_RES: 1055,
        GETGROUPLIST_RES: 1057,
        GETQUEUELIST_RES: 1059,
        GROUP_REGIADDR_RES: 1062,
        GROUP_UNREGIADDR_RES: 1064,
        UPDATE_USERDATA_RES: 1066,
        DELETE_KEY_USERDATA_RES: 1068,
        DELETE_ALL_USERDATA_RES: 1070,
        SEND_USEREVENT_RES: 1072,
        GRPICKUP_RES: 1074,
        AGENT_REPORT_RES: 1078,
        JOINCALL_RES: 1080,
        TENANT_REPORT_RES: 1082,
        DEFLECTCALL_RES: 1084,
        SETSKILL_ENABLE_RES: 1086,
        GETAGENT_SKILLLIST_RES: 1088,
        GETCONNECTION_RES: 1090,
        GET_USERDATA_RES: 1092,
        GETCONNSTATE_RES: 1094,
        FORCE_SETAGTSTATE_RES: 1096,
        GROUP_REPORT_RES: 1100,
        GETAGENT_QUEUELIST_RES: 1102,
        GETQUEUEORDER_RES: 1104,
        GETQUEUEORDER_EX_RES: 1106,
        SET_ANI_USERDATA_RES: 1112,
        QUEUE_REPORT_RES: 1118,
        DNIS_REPORT_RES: 1120,
        QUEUE_PICKUP_RES: 1141,
        MEDIA_ATTACH_RES: 1143,
        MEDIA_DEATTACH_RES: 1145,
        MEDIA_PLAY_RES: 1147,
        MEDIA_COLLECT_RES: 1149,
        SET_UCID_USERDATA_RES: 1151,
        MCS_CONSULTCALL_RES: 1157,
        MCS_RECONNECTCALL_RES: 1159,
        MCS_TRANSFERCALL_RES: 1161,
        MCS_ONESTEP_TRANSFERCALL_RES: 1163,
        MCS_REROUTE_RES: 1165,
        GETAGENTINFO_EX_RES: 1167,
        BSR_RES: 1171,
        EAS_GETAUTHKEY_RES: 1181,
        EAS_SETAUTHKEY_RES: 1183,
        EAS_REGIADDR_RES: 1185,
        EAS_UNREGIADDR_RES: 1187,
        EAS_GROUP_REGIADDR_RES: 1189,
        EAS_GROUP_UNREGIADDR_RES: 1191,
        EAS_AGENT_LOGIN_RES: 1193,
        AGENTCALL_RES: 1195,
        DTMF_PLAY_RES: 1197,
        GETAGENTLIST_EX_RES: 1201,
        GETGROUPLIST_EX_RES: 1203,
        GETQUEUELIST_EX_RES: 1205,
        GETAGENT_SKILLLIST_EX_RES: 1207,
        GETAGENT_QUEUELIST_EX_RES: 1209,
        AGENT_SUBSCRIBE_RES: 1221,
        GROUP_SUBSCRIBE_RES: 1223,
        QUEUE_SUBSCRIBE_RES: 1225,
        TENANT_SUBSCRIBE_RES: 1227,
        DNIS_SUBSCRIBE_RES: 1229,
        CLOSE_SUBSCRIBE_RES: 1231,
        VIRTUAL_QUEUE_RES: 1301,
        SET_CALLBACK_RES: 1303,
        MEDIA_DND_RES: 1305,
        RESERVED_AGENT_STATE_RES: 1307,
        SEND_GLOBAL_EVENT_RES: 1309,
        GET_MEDIA_ACTIVATE_RES: 1311,
        GETROUTEPOLICY_RES: 1313,
        SET_MEDIAREADY_STATE_RES: 1315,
        GET_MEDIAREADY_STATE_RES: 1317,
        GET_USER_CDR_RES: 1319,
        SET_USER_CDR_RES: 1321,
        SET_MUTE_ENABLE_RES: 1323,
        GETCATEGORY_LIST_RES: 1325,
        GETCATEGORY_INFO_RES: 1327,
        RESERVE_IR_ATTR_RES: 1329,
        FIND_WAIT_IR_RES: 1331,
        GETCONNECTION_EX_RES: 1333,
        GETCALL_INFO_RES: 1335,
        GET_USER_CDR_EX_RES: 1337,
        SET_USER_CDR_EX_RES: 1339,
        ADNLOGIN_RES: 1341,
        SETAGENTSTATE_DATA_RES: 1343,
        HOLDCALL_EX_RES: 1345,
        GETAGENT_MASTERQUEUEINFO_RES: 1347,
        SETAFTCALLSTATE_EX_RES: 1349,
        OPENSERVER_MOBILE_RES: 1351,
        GET_DEVICE_ACTIVATE_RES: 1353,
        SET_USER_CDR_V5_RES: 1355,
        GET_MEDIA_OPTION_RES: 1357,
        SET_MEDIA_OPTION_RES: 1359,
        MUTE_TRANSFER_EX_RES: 1361,
        GET_GROUPSKILL_LIST_RES: 1363,
        GET_DEVICE_LIST_RES: 1365,
        GET_CALLINFO_EX_RES: 1367,
        AGENT_JOINCALL_RES: 1369,
        SET_AFT_RECALLSTATE_RES: 1371,
        GET_TENANT_LIST_RES: 1373,
        AGENTCALL_EX_RES: 1375,
        GET_CALL_POSITION_RES: 1377,
        GET_QUEUE_TRAFFIC_EX_RES: 1379,
        GET_NODEAGENT_LIST_RES: 1380,
        GET_NODEAGENT_STATE_RES: 1381,
        AGENT_REPORT_EX_RES: 1383,
        AGENT_SUBSCRIBE_EX_RES: 1385,
        GET_IR_STATE_RES: 1387,
        GET_DR_STATE_RES: 1389,
        AGENTLOGIN_EX_RES: 1391,
        AGENTLOGIN_DUP_RES: 1393,
        GROUPLOGIN_RES: 1395,
        GROUPLOGOUT_RES: 1397,
        FCVIRTUALCALL_RES: 1398,
        FCVIRTUALCALLINFO_RES: 1399,
        FCCALLBACK_RES: 1400,
        FCCALLBACKLIST_RES: 1401,
        FCCALLBACKEND_RES: 1402,
        FCCALLBACK_CLEARCALL_RES: 1403,
        FCVIRTUAL_CLEARCALL_RES: 1404,
        SETSKILL_ALL_ENABLE_RES: 1406,
        SET_IE_DND_RES: 1408,
        GET_IE_DND_RES: 1410,
        SET_IE_VOICE_RECORD_RES: 1412,
        SET_IE_AGC_RES: 1414,
        GET_IE_AGC_RES: 1416,
        DI_AGENT_REPORT_RES : 1418,
        SETSKILL_ENABLE_EX_RES:1420
    }

    ipron.APIEvent = {
        TCPACK: 1,
        RINGING: 2000,
        ESTABLISHED: 2001,
        RELEASED: 2002,
        DIALING: 2003,
        ABANDONED: 2004,
        DESTBUSY: 2005,
        HELD: 2006,
        RETRIEVED: 2007,
        PARTYADDED: 2008,
        PARTYCHANGED: 2009,
        PARTYDELETED: 2010,
        QUEUED: 2011,
        DIVERTED: 2012,
        ACDAGENT_LOGGEDON: 2013,
        ACDAGENT_LOGGEDOFF: 2014,
        ACDAGENT_NOTREADY: 2015,
        ACDAGENT_READY: 2016,
        ACDAGENT_WORKAFTCALL: 2017,
        AGENTLOGIN: 2018,
        AGENTLOGOUT: 2019,
        AGENTREADY: 2020,
        AGENTNOTREADY: 2021,
        AGENTACW: 2022,
        LINKCONNECTED: 2023,
        LINKDISCONNECTED: 2024,
        CTIDISCONNECTED: 2025,
        REGISTERED: 2026,
        UNREGISTERED: 2027,
        UPDATE_USERDATA: 2028,
        USEREVENT: 2029,
        INITIATED: 2030,
        AGENTINREADY: 2031,
        AGENTOUTREADY: 2032,
        MEDIAPLAY: 2033,
        MEDIACOLLECT: 2034,
        BANISHMENT: 2035,
        ACDAGENT_BUSY: 2036,
        FAILED: 2037,
        MCS_CONSULTED: 2041,
        MCS_RECONNECTED: 2042,
        MCS_TRANSFERRED: 2043,
        MCS_ONESTEP_TRANSFERRED: 2044,
        MCS_REROUTE: 2045,
        EAS_REGISTERED: 2051,
        EAS_UNREGISTERED: 2052,
        MEDIA_ENABLED: 2053,
        MEDIA_READY: 2054,
        DEVICE_DND: 2060,
        DEVICE_OUT_OF_SERVICE: 2061,
        DEVICE_BACK_IN_SERVICE: 2062,
        AGENTBUSY: 2063,
        GROUPAGTNOTREADY: 2070,
        GROUPAGTREADY: 2071,
        GROUPAGTINREADY: 2072,
        GROUPAGTOUTREADY: 2073,
        GROUPAGTACW: 2074,
        GROUPAGTBUSY: 2075,
        GROUPAGTSTS: 2076,
        VIRTUAL_MEDIA_CREATE: 3000,
        VIRTUAL_MEDIA_DISTRIBUTE: 3001,
        VIRTUAL_MEDIA_DELETE: 3002,
        HASTATE_CHANGED: 3003,
        AGENT_SSCRIBE_PUSH: 3004,
        GROUP_SSCRIBE_PUSH: 3005,
        QUEUE_SSCRIBE_PUSH: 3006,
        TENANT_SSCRIBE_PUSH: 3007,
        DNIS_SSCRIBE_PUSH: 3008,
        NEW_NOTICE: 3009,
        CALLBACK_DISTRIBUTE: 3010,

        ACTIVE_TIMEOUT: 3100,
        OPENSRVSUCCESS: 3101,
        GLOBAL_EVENT: 3102,
        NODE_OUT_SERVICE: 3103,
        NODE_IN_SERVICE: 3104,
        NODE_DR_STATE: 3105,
        AGENT_SSCRIBE_EX_PUSH: 3107,
        RESOURCE_CHANGE: 3108
    }

    ipron.MsgType = {
        COMMAND: 0,
        ICResponse: 1,
        ICEvent: 2,
        Notice: 3
    }

    ipron.DiReqType = {
        ServerStatus: "serverstatus",
        Info: "info",
        State: "state",
        List: "list",
        Monitor: "monitor",
        Auth: "auth",
        Report: "report",
        AGENTSTATE: "agentstate",
        ICAPI: "icapi"
    }

    ipron.DiRequest = {
        Agent: "agent",
        Group: "group",
        Skill: "skill",
        Queue: "queue",
        Dnis: "dnis",
        Bsr: "bsr",
        Tenant: "tenant",
        QBS: "qbs",
        BDQ: "bdq",
        QTT: "qtt",
        BsrRepQueue: "bsrrepqueue",
        Node: "node",
        Traffic: "traffic",
        IVR: "ivr",
        QSA: "qsa",
        AgentReport:"agentreport"
    }

    ipron.DIField = {
        STATE_VOIP: "iStateVoip",
        STATE_VOIP_SUB: "iStateRsnVoip",
        STATE_CHAT: "iStateChat",
        STATE_CHAT_SUB: "iStateRsnChat",
        STATE_VVOICE: "iStateVideoVoice",
        STATE_VVOICE_SUB: "iStateRsnVideoVoice",
        STATE_VCHAT: "iStateVideoChat",
        STATE_VCHAT_SUB: "iStateRsnVideoChat",
        STATE_EMAIL: "iStateEmail",
        STATE_EMAIL_SUB: "iStateRsnEmail",
        STATE_FAX: "iStateFax",
        STATE_FAX_SUB: "iStateRsnFax",
        STATE_MVOIP: "iStateMVoip",
        STATE_MVOIP_SUB: "iStateRsnMVoip",
        STATE_WEB: "iStateWeb",
        STATE_WEB_SUB: "iStateRsnWeb",
        IN_TOTAL: "IN_TOTAL",
        IN_SUCCESS: "IN_SUCCESS",
        IN_INT_SUC: "IN_INT_SUC",
        IN_EXT_SUC: "IN_EXT_SUC",
        IN_CON_SUC: "IN_CON_SUC",
        IN_TALK_TIME: "IN_TALK_TIME",
        OUT_TOTAL: "OUT_TOTAL",
        OUT_SUCCESS: "OUT_SUCCESS",
        OUT_EXT_SUC: "OUT_EXT_SUC",
        OUT_INT_SUC: "OUT_INT_SUC",
        OUT_CON_SUC: "OUT_CON_SUC",
        OUT_TALK_TIME: "OUT_TALK_TIME",
        TRNS_IN_TALK_TIME: "TRNS_IN_TALK_TIME",
        TRNS_IN_SUCCESS: "TRNS_IN_SUCCESS",
        RINGING_TIME: "RINGING_TIME",
        ACW_TIME: "ACW_TIME",
        ACW_COUNT: "ACW_COUNT",
        DIALING_TIME: "DIALING_TIME",
        READY_TIME: "READY_TIME",
        READY_COUNT: "READY_COUNT",
        NOTREADY_TIME: "NOTREADY_TIME",
        NOTREADY_COUNT: "NOTREADY_COUNT",
        TRANSFER_CALLS: "TRANSFER_CALLS",
        LOGIN_TIME: "LOGIN_TIME",
        LOGOUT_TIME: "LOGOUT_TIME",
        EXTENSION_DATA:"EXTENSION_DATA",
        EXTENSION_DATA_LEN: "EXTENSION_DATA_LEN",
        IN_DIT_TRY: "IN_DIT_TRY",
        IN_DIT_SUC: "IN_DIT_SUC",
        DIT_TALK_TIME: "DIT_TALK_TIME"
    }

    // 탭전환시 interval 멈춤에 따른 web worker 전환
    ipron.startWorker = function() {
        if (ipron.worker) {
            //console.log('Worker가 이미 실행 중입니다.');
            return;
        }
    
        // Web Worker 코드를 문자열로 정의
        var workerCode = `
        intervalId = null;
        intervalId2 = null;

        onmessage = function(e) {
            if (e.data != 0) {
                //console.log(e.data);
                //console.log('Worker: 주기적인 작업 시작');
                this.intervalId = setInterval(function () {
                    postMessage('hb');
                }, e.data); 

                this.intervalId2 = setInterval(function () {
                    postMessage('ha');
                }, 1000); // 1초마다 메시지 전송
            } else if (e.data == 0) {
                //console.log('Worker: 주기적인 작업 중지');
                clearInterval(this.intervalId);
                clearInterval(this.intervalId2);
                this.intervalId = null;
                this.intervalId2 = null;
            }
        }
        `;

        // Blob을 사용하여 Worker용 스크립트를 만들고, URL로 변환
        var blob = new Blob([workerCode], { type: 'application/javascript' });
        var workerURL = URL.createObjectURL(blob);
    
        // Web Worker 생성
        ipron.worker = new Worker(workerURL);
    
        // Worker로부터 메시지를 받는 부분
        ipron.worker.onmessage = function(e) {
            if(e.data == "hb") {
                ipron.heartbeat();
            } else if(e.data == "ha") {
                ipron.checkActiveTimeout();
            }
        };
    
        // Worker에서 발생하는 에러 처리
        ipron.worker.onerror = function(error) {
            //console.error('Worker에서 에러 발생:', error.message);
        };

        ipron.sendMessageToWorker(ipron.HBTime);
    
        //console.log('Worker가 시작되었습니다.');
    }
    
    // Web Worker 종료 함수
    ipron.stopWorker = function() {
        if (ipron.worker) {
            ipron.sendMessageToWorker(0);
            ipron.worker.terminate(); // Worker 종료
            ipron.worker = null;
            //console.log('Worker가 종료되었습니다.');
        } else {
            //console.log('Worker가 실행 중이지 않습니다.');
        }
    }
    
    // Worker에 메시지 보내기
    ipron.sendMessageToWorker = function(message) {
        if (ipron.worker) {
            ipron.worker.postMessage(message);
        } else {
            //console.log('Worker가 실행 중이지 않습니다.');
        }
    }

    ipron.OpenServer = function(cb_evt, cb_res) {
        if(ipron.isWork) {
            //console.log('isWork Return');
            return false;
        }

        if(ipron.socket1 != null ) {
            //console.log(ipron.socket1.readyState);
            if(ipron.socket1.readyState != WebSocket.CLOSED){
                return false;
            }
        }

        if(ipron.socket2 != null) {
            if(ipron.socket2.readyState != WebSocket.CLOSED){
                return false;
            }
        }

        ipron.evtCB = cb_evt;
        ipron.resCB = cb_res;

        ipron.hbreq1 = new Date();
        ipron.hbreq2 = new Date();
        ipron.hbres1 = new Date();
        ipron.hbres2 = new Date();
        ipron.isEnd = false;
        ipron.isWork = true;

        ipron.s1HAState = ["EMPTY", "EMPTY", "EMPTY"];
        ipron.s1HATime = [new Date(), new Date(), new Date()];
        ipron.s2HAState = ["EMPTY", "EMPTY", "EMPTY"];
        ipron.s2HATime = [new Date(), new Date(), new Date()];

        if(ipron.srv1 != ipron.srv2) {
            ipron.connectSocket1(ipron.srv1);
            ipron.connectSocket2(ipron.srv2);
        } else {
            ipron.connectSocket1(ipron.srv1);
        }

        return true;
    }

    // 종료
    ipron.CloseServer = function() {
        var req = {};
        req.METHOD = ipron.APIMethod.CLOSESERVER;
        req.APPID = ipron.appId;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetIRState = function(tenant, destdn, privatedata, nodeid) {
        var req = {};
        req.METHOD = ipron.APIMethod.GET_IR_STATE;
        req.APPID = ipron.appId;
        req.DEST_DN = destdn;
        req.PRIVATE_DATA = privatedata;
        req.TENANT_NAME = tenant;
        req.NODE_ID = nodeid;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetDRState = function(privatedata, nodeid) {
        var req = {};
        req.METHOD = ipron.APIMethod.GET_DR_STATE;
        req.APPID = ipron.appId;
        req.PRIVATE_DATA = privatedata;
        req.NODE_ID = nodeid;

        ipron.sendMessageToBoth(req);
    }

    ipron.Register = function (dn, tenant) {
        var req = {};
        req.METHOD = ipron.APIMethod.REGIADDR;
        req.APPID = ipron.appId;
        req.THIS_DN = dn;
        req.TENANT_NAME = tenant;

        ipron.sendMessageToBoth(req);
    }

    ipron.Unregister = function(dn, tenant) {
        var req = {};
        req.METHOD = ipron.APIMethod.UNREGIADDR;
        req.APPID = ipron.appId;
        req.THIS_DN = dn;
        req.TENANT_NAME = tenant;

        // if exist MonitorID Add it
        req.MONITOR_ID = ipron.monIds.get(dn);

        ipron.sendMessageToBoth(req);
    }

    ipron.GroupRegister = function(startDn, endDn, tenant) {
        var req = {};
        req.METHOD = ipron.APIMethod.GROUP_REGIADDR;
        req.APPID = ipron.appId;
        req.START_DN = startDn;
        req.END_DN = endDn;
        req.TENANT_NAME = tenant;

        ipron.sendMessageToBoth(req);
    }

    ipron.GroupUnregister = function(startDn, endDn, tenant) {
        var req = {};
        req.METHOD = ipron.APIMethod.GROUP_UNREGIADDR;
        req.APPID = ipron.appId;
        req.START_DN = startDn;
        req.END_DN = endDn;
        req.TENANT_NAME = tenant;

        ipron.sendMessageToBoth(req);
    }

    ipron.AnswerCall = function(dn, connectionId, extension, mediaType) {
        var req = {};
        req.METHOD = ipron.APIMethod.ANSWERCALL;
        req.APPID = ipron.appId;
        req.THIS_DN = dn;
        req.CONNECTION_ID = connectionId;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); // NOT USED
        req.MEDIA_TYPE = mediaType;

        ipron.sendMessageToBoth(req);
        console.log(req);
    }

    ipron.ClearCall = function(dn, connectionId, extension, mediaType) {
        var req = {};
        req.METHOD = ipron.APIMethod.CLEARCALL;
        req.APPID = ipron.appId;
        req.THIS_DN = dn;
        req.CONNECTION_ID = connectionId;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); // NOT USED
        req.MEDIA_TYPE = mediaType;

        ipron.sendMessageToBoth(req);
    }

    ipron.MakeCall = function(thisDn, destDn, obCallingDn, skillLevel, priority, relationAgentDn, relationAgentId,
        relationMethod, routeMethod, routeSkillId, routeGroupId, Ucid, extension, mediaType, usePrevAgent, useDesignatedAgent,
        relationTimeout, hop) {
            
        var req = {};
        req.METHOD = ipron.APIMethod.MAKECALL;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.DEST_DN = destDn;
        req.OB_CALLING_DN = obCallingDn;
        req.SKILL_LEVEL = skillLevel;
        req.PRIORITY = priority;
        req.RELATION_AGENT_DN = relationAgentDn;
        req.RELATION_AGENT_ID = relationAgentId;
        req.RELATION_METHOD = relationMethod;
        req.ROUTE_METHOD = routeMethod;
        req.ROUTE_SKILL_ID = routeSkillId;
        req.ROUTE_GROUP_ID = routeGroupId;
        req.UCID = Ucid;
        req.USEPREVAGENT = usePrevAgent;
        req.USEDESIGNATEDAGENT = useDesignatedAgent;
        req.RELATION_TIMEOUT = relationTimeout;
        req.HOP = hop;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;
        req.MEDIA_TYPE = mediaType;

        ipron.sendMessageToBoth(req);
        console.log("Makecall", req);
    }

    ipron.HoldCall = function(dn, connectionId, extension, mediaType) {
        var req = {};
        req.METHOD = ipron.APIMethod.HOLDCALL;
        req.APPID = ipron.appId;
        req.THIS_DN = dn;
        req.CONNECTION_ID = connectionId;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;
        req.MEDIA_TYPE = mediaType;

        ipron.sendMessageToBoth(req);
    }

    ipron.HoldCallEx = function(dn, connectionId, extension, mediaType, mediaOption) {
        var req = {};
        req.METHOD = ipron.APIMethod.HOLDCALL_EX;
        req.APPID = ipron.appId;
        req.THIS_DN = dn;
        req.CONNECTION_ID = connectionId;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;
        req.MEDIA_TYPE = mediaType;
        req.MEDIA_OPTION = mediaOption

        ipron.sendMessageToBoth(req);
    }

    ipron.RetrieveCall = function(dn, connectionId, extension, mediaType) {
        var req = {};
        req.METHOD = ipron.APIMethod.RETRIEVECALL;
        req.APPID = ipron.appId;
        req.THIS_DN = dn;
        req.CONNECTION_ID = connectionId;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;
        req.MEDIA_TYPE = mediaType;

        ipron.sendMessageToBoth(req);
    }

    ipron.GroupPickup = function(dn, extension, mediaType) {
        var req = {};
        req.METHOD = ipron.APIMethod.GRPICKUP;
        req.APPID = ipron.appId;
        req.THIS_DN = dn;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;
        req.MEDIA_TYPE = mediaType;

        ipron.sendMessageToBoth(req);
    }

    ipron.QueuePickup = function(dn, callId, extension) {
        var req = {};
        req.METHOD = ipron.APIMethod.QUEUE_PICKUP;
        req.APPID = ipron.appId;
        req.THIS_DN = dn;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;
        req.CALL_ID = callId;

        ipron.sendMessageToBoth(req);
    }

    ipron.JoinCall = function(thisDn, destDn, partyType, extension, mediaType) {
        var req = {};
        req.METHOD = ipron.APIMethod.JOINCALL;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.DEST_DN = destDn;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;
        req.PARTY_TYPE = partyType;
        req.MEDIA_TYPE = mediaType;

        ipron.sendMessageToBoth(req);
    }

    ipron.AgentJoinCall = function(tenantName, thisDn, destDn, destAgentId, partyType, extension, mediaType) {
        var req = {};
        req.METHOD = ipron.APIMethod.AGENT_JOINCALL;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.DEST_DN = destDn;
        req.TENANT_NAME = tenantName;
        req.DEST_AGENT_ID = destAgentId;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;
        req.PARTY_TYPE = partyType;
        req.MEDIA_TYPE = mediaType;

        ipron.sendMessageToBoth(req);
    }

    ipron.SinglestepTransfer = function(thisDn, connectionId, destDn, obCallingDn, skillLevel, priority, relationAgentDn,
        relationAgentId, relationMethod, routeMethod, routeSkillId, routeGroupId, extension, mediaType, usePrevAgent, useDesignatedAgent,
        relationTimeout) {

        var req = {};
        req.METHOD = ipron.APIMethod.SINGLESTEP_TRANSFER;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.CONNECTION_ID = connectionId;
        req.DEST_DN = destDn;
        req.OB_CALLING_DN = obCallingDn;
        req.SKILL_LEVEL = skillLevel;
        req.PRIORITY = priority;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;
        req.RELATION_AGENT_DN = relationAgentDn;
        req.RELATION_AGENT_ID = relationAgentId;
        req.RELATION_METHOD = relationMethod;
        req.RELATION_TIMEOUT = relationTimeout;
        req.ROUTE_METHOD = routeMethod;
        req.ROUTE_SKILL_ID = routeSkillId;
        req.ROUTE_GROUP_ID = routeGroupId;
        req.USEPREVAGENT = usePrevAgent;
        req.USEDESIGNATEDAGENT = useDesignatedAgent;
        req.MEDIA_TYPE = mediaType;
    
        ipron.sendMessageToBoth(req);
    }

    ipron.MuteTransfer = function(thisDn, connectionId, destDn, extension, mediaType) {
        var req = {};
        req.METHOD = ipron.APIMethod.MUTE_TRANSFER;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.CONNECTION_ID = connectionId;
        req.DEST_DN = destDn;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;
        req.MEDIA_TYPE = mediaType;

        ipron.sendMessageToBoth(req);
    }

    ipron.SinglestepConference = function(thisDn, connectionId, destDn, obCallingDn, partyType, extension, mediaType) {
        var req = {};
        req.METHOD = ipron.APIMethod.SINGLESTEP_CONFERENCE;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.CONNECTION_ID = connectionId;
        req.DEST_DN = destDn;
        req.OB_CALLING_DN = obCallingDn;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;
        req.PARTY_TYPE = partyType;
        req.MEDIA_TYPE = mediaType;

        ipron.sendMessageToBoth(req);
    }

    ipron.Conference = function(thisDn, connectionId, destDn, obCallingDn, partyType, extension, mediaType) {
        var req = {};
        req.METHOD = ipron.APIMethod.CONFERENCE;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.CONNECTION_ID = connectionId;
        req.DEST_DN = destDn;
        req.OB_CALLING_DN = obCallingDn;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;
        req.PARTY_TYPE = partyType;
        req.MEDIA_TYPE = mediaType;

        ipron.sendMessageToBoth(req);
    }

    ipron.DeflectCall = function(thisDn, connectionId, destDn, obCallingDn, skillLevel, priority, relationAgentDn,
        relationAgentId, relationMethod, routeMethod, routeSkillId, routeGroupId, mediaOption, extension, mediaType, usePrevAgent,
        useDesignatedAgent, relationTimeout) {
        
        var req = {};
        req.METHOD = ipron.APIMethod.DEFLECTCALL;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.CONNECTION_ID = connectionId;
        req.DEST_DN = destDn;
        req.OB_CALLING_DN = obCallingDn;
        req.SKILL_LEVEL = skillLevel;
        req.PRIORITY = priority;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;
        req.RELATION_AGENT_DN = relationAgentDn;
        req.RELATION_AGENT_ID = relationAgentId;
        req.RELATION_METHOD = relationMethod;
        req.RELATION_TIMEOUT = relationTimeout;
        req.ROUTE_METHOD = routeMethod;
        req.ROUTE_SKILL_ID = routeSkillId;
        req.ROUTE_GROUP_ID = routeGroupId;
        req.USEPREVAGENT = usePrevAgent;
        req.USEDESIGNATEDAGENT = useDesignatedAgent;
        req.MEDIA_TYPE = mediaType;
        req.MEDIA_OPTION = mediaOption;
        
        ipron.sendMessageToBoth(req);
    }

    ipron.AgentLogin = function(agentDn, agentId, agentPassword, tenantName, agentState, agentStateSub, extension, passwdType, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.AGENTLOGIN;
        req.APPID = ipron.appId;
        req.AGENT_DN = agentDn;
        req.AGENT_ID = agentId;
        req.AGENT_PASSWORD = agentPassword;
        req.TENANT_NAME = tenantName;
        req.AGENT_STATE = agentState;
        req.AGENT_STATE_SUB = agentStateSub;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;
        req.PASSWORD_TYPE = passwdType;
        req.MEDIA_SET = String(mediaSet);

        ipron.sendMessageToBoth(req);
    }

    /**
     * @param {string} agentDn - login DN
     * @param {string} agentId - login ID
     * @param {string} agentPassword - login password
     * @param {string} tenantName - tenant name
     * @param {int} agentState - login state
     * @param {int} agentStateSub - login state subcode
     * @param {int} extension - not used
     * @param {int} passwdType - login password encrypt type
     * @param {string} mediaSet - login state working medias
     * @param {int} dupPoint - duplicate login check option
     */
    ipron.AgentLoginEx = function(agentDn, agentId, agentPassword, tenantName, agentState, agentStateSub, extension, passwdType, mediaSet, dupPoint) {
        var req = {};
        req.METHOD = ipron.APIMethod.AGENTLOGIN_EX;
        req.APPID = ipron.appId;
        req.AGENT_DN = agentDn;
        req.AGENT_ID = agentId;
        req.AGENT_PASSWORD = agentPassword;
        req.TENANT_NAME = tenantName;
        req.AGENT_STATE = agentState;
        req.AGENT_STATE_SUB = agentStateSub;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;
        req.PASSWORD_TYPE = passwdType;
        req.MEDIA_SET = String(mediaSet);
        req.AGENT_DUP = dupPoint;

        ipron.sendMessageToBoth(req);
        console.log(req);
    }

    /**
     * @param {string} agentDn - login DN
     * @param {string} agentId - login ID
     * @param {string} agentPassword - login password
     * @param {string} tenantName - tenant name
     * @param {int} agentState - login state
     * @param {int} agentStateSub - login state subcode
     * @param {int} extension - not used
     * @param {int} passwdType - login password encrypt type
     * @param {string} mediaSet - login state working medias
     */
    ipron.AgentLoginDupChk = function(agentDn, agentId, agentPassword, tenantName, agentState, agentStateSub, extension, passwdType, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.AGENTLOGIN_DUP;
        req.APPID = ipron.appId;
        req.AGENT_DN = agentDn;
        req.AGENT_ID = agentId;
        req.AGENT_PASSWORD = agentPassword;
        req.TENANT_NAME = tenantName;
        req.AGENT_STATE = agentState;
        req.AGENT_STATE_SUB = agentStateSub;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;
        req.PASSWORD_TYPE = passwdType;
        req.MEDIA_SET = String(mediaSet);

        ipron.sendMessageToBoth(req);
    }

    /**
     * @param {string} agentDn - login DN
     * @param {string} agentId - login ID
     * @param {string} tenantName - tenant name
     * @param {int} extension - not used
     */
    ipron.AgentLogout = function(agentDn, agentId, tenantName, extension) {
        var req = {};
        req.METHOD = ipron.APIMethod.AGENTLOGOUT;
        req.APPID = ipron.appId;
        req.AGENT_DN = agentDn;
        req.AGENT_ID = agentId;
        req.TENANT_NAME = tenantName;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.GroupLogin = function(groupId, startDn, endDn, tenantName, agentState, agentStateSub, extension, passwdType, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.GROUPLOGIN;
        req.APPID = ipron.appId;
        req.GROUP_ID = groupId;
        req.START_DN = startDn;
        req.END_DN = endDn;
        req.TENANT_NAME = tenantName;
        req.AGENT_STATE = agentState;
        req.AGENT_STATE_SUB = agentStateSub;
        req.PASSWORD_TYPE = passwdType;
        req.MEDIA_SET = String(mediaSet);
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.GroupLogout = function(groupId, startDn, endDn, tenantName, extension) {
        var req = {};
        req.METHOD = ipron.APIMethod.GROUPLOGOUT;
        req.APPID = ipron.appId;
        req.GROUP_ID = groupId;
        req.START_DN = startDn;
        req.END_DN = endDn;
        req.TENANT_NAME = tenantName;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.SetAFTCallState = function(agentId, tenantName, agentState, agentStateSub, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.SETAFTCALLSTATE;
        req.APPID = ipron.appId;
        req.AGENT_ID = agentId;
        req.AGENT_STATE = agentState;
        req.AGENT_STATE_SUB = agentStateSub;
        req.TENANT_NAME = tenantName;
        req.MEDIA_SET = String(mediaSet);

        ipron.sendMessageToBoth(req);
    }

    ipron.SetAFTCallStateEx = function(agentId, tenantName, inboundAgentState, inboundAgentStateSub, outboundAgentState, outboundAgentStateSub, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.SETAFTCALLSTATE_EX;
        req.APPID = ipron.appId;
        req.AGENT_ID = agentId;
        req.INBOUND_AGENT_STATE = inboundAgentState;
        req.INBOUND_AGENT_STATE_SUB = inboundAgentStateSub;
        req.OUTBOUND_AGENT_STATE = outboundAgentState;
        req.OUTBOUND_AGENT_STATE_SUB = outboundAgentStateSub;
        req.TENANT_NAME = tenantName;
        req.MEDIA_SET = String(mediaSet);

        ipron.sendMessageToBoth(req);
    }

    ipron.SetAgentState = function(agentId, tenantName, agentState, agentStateSub, extension, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.SETAGENTSTATE;
        req.APPID = ipron.appId;
        req.AGENT_ID = agentId;
        req.AGENT_STATE = agentState;
        req.AGENT_STATE_SUB = agentStateSub;
        req.TENANT_NAME = tenantName;
        req.MEDIA_SET = String(mediaSet);
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.ForceSetAgentState = function(agentId, tenantName, agentState, agentStateSub, extension, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.FORCE_SETAGTSTATE;
        req.APPID = ipron.appId;
        req.AGENT_ID = agentId;
        req.AGENT_STATE = agentState;
        req.AGENT_STATE_SUB = agentStateSub;
        req.TENANT_NAME = tenantName;
        req.MEDIA_SET = String(mediaSet);
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.AgentReport = function(agentId, tenantName, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.AGENT_REPORT;
        req.APPID = ipron.appId;
        req.AGENT_ID = agentId;
        req.TENANT_NAME = tenantName;
        req.MEDIA_SET = String(mediaSet);

        ipron.sendMessageToBoth(req);
    }
        
    ipron.AgentReportEx = function(agentId, tenantName, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.AGENT_REPORT_EX;
        req.APPID = ipron.appId;
        req.AGENT_ID = agentId;
        req.TENANT_NAME = tenantName;
        req.MEDIA_SET = String(mediaSet);

        ipron.sendMessageToBoth(req);
    }

    ipron.GroupReport = function(tenantName, groupIdSet, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.GROUP_REPORT;
        req.APPID = ipron.appId;
        req.GROUP_ID_SET = groupIdSet;
        req.TENANT_NAME = tenantName;
        req.MEDIA_SET = String(mediaSet);

        ipron.sendMessageToBoth(req);
    }

    ipron.QueueReport = function(tenantName, queueDnSet, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.QUEUE_REPORT;
        req.APPID = ipron.appId;
        req.QUEUE_DN_SET = queueDnSet;
        req.TENANT_NAME = tenantName;
        req.MEDIA_SET = String(mediaSet);

        ipron.sendMessageToBoth(req);
    }

    ipron.TenantReport = function(tenantName, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.TENANT_REPORT;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.MEDIA_SET = String(mediaSet);

        ipron.sendMessageToBoth(req);
    }

    ipron.DNISReport = function(dnisSet, privateData) {
        var req = {};
        req.METHOD = ipron.APIMethod.DNIS_REPORT;
        req.APPID = ipron.appId;
        req.DNIS_SET = dnisSet;
        req.PRIVATE_DATA = privateData;

        ipron.sendMessageToBoth(req);
    }

    ipron.SetSkillEnable = function(agentId, skillId, skillEnable) {
        var req = {};
        req.METHOD = ipron.APIMethod.SETSKILL_ENABLE;
        req.APPID = ipron.appId;
        req.AGENT_ID = agentId;
        req.SKILL_ID = skillId;
        req.SKILL_ENABLE = skillEnable;

        ipron.sendMessageToBoth(req);
    }

    ipron.SetSkillEnableEx = function(agentId, skillIdSet, skillEnable) {
        var req = {};
        req.METHOD = ipron.APIMethod.SETSKILL_ENABLE_EX;
        req.APPID = ipron.appId;
        req.AGENT_ID = agentId;
        req.SKILL_ID_SET = skillIdSet;
        req.SKILL_ENABLE = skillEnable;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetGroupList = function(tenantName, privateData) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETGROUPLIST;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.PRIVATE_DATA = privateData;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetQueueList = function(tenantName, privateData) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETQUEUELIST;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.PRIVATE_DATA = privateData;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetAgentList = function(tenantName, groupIdSet, queueDnSet, privateData, agentState, mediaType) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETAGENTLIST;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.GROUP_ID_SET = groupIdSet;
        req.QUEUE_DN_SET = queueDnSet;
        req.PRIVATE_DATA = privateData;
        req.AGENT_STATE = agentState;
        req.MEDIA_TYPE = mediaType;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetAgentInfo = function(tenantName, destAgentId, privateData) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETAGENTINFO;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.DEST_AGENT_ID = destAgentId;
        req.PRIVATE_DATA = privateData;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetRouteable = function(tenantName, destAgentId, extension, mediaType) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETROUTEABLE;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.DEST_AGENT_ID = destAgentId;
        req.MEDIA_TYPE = mediaType;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetAgentState = function(tenantName, destAgentId, privateData, extension, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETAGENTSTATE;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.DEST_AGENT_ID = destAgentId;
        req.PRIVATE_DATA = privateData;
        req.MEDIA_SET = String(mediaSet);
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetQueueTraffic = function(tenantName, queueDn, skillId, privateData, extension, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETQUEUETRAFFIC;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.QUEUE_DN = queueDn;
        req.SKILL_ID = skillId;
        req.PRIVATE_DATA = privateData;
        req.MEDIA_SET = String(mediaSet);
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetStateSubcode = function(tenantName, agentState) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETSTATE_SUBCODE;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.AGENT_STATE = agentState;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetAgentSkillList = function(tenantName, destAgentId) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETAGENT_SKILLLIST;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.DEST_AGENT_ID = destAgentId;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetConnection = function(destDn, extension) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETCONNECTION;
        req.APPID = ipron.appId;
        req.DEST_DN = destDn;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetAgentQueueList = function(tenantName, destAgentId) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETAGENT_QUEUELIST;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.DEST_AGENT_ID = destAgentId;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetQueueOrder = function(tenantName, queueDn, skillId, priorityBound, privateData, extension, mediaType) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETQUEUEORDER;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.QUEUE_DN = queueDn;
        req.SKILL_ID = skillId;
        req.PRIORITY_BOUND = priorityBound;
        req.PRIVATE_DATA = privateData;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;
        req.MEDIA_TYPE = mediaType;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetQueueOrderEx = function(tenantName, callId, queueDn, skillId, priorityBound, privateData, extension, mediaType) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETQUEUEORDER_EX;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.CALL_ID = callId;
        req.QUEUE_DN = queueDn;
        req.SKILL_ID = skillId;
        req.PRIORITY_BOUND = priorityBound;
        req.PRIVATE_DATA = privateData;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;
        req.MEDIA_TYPE = mediaType;

        ipron.sendMessageToBoth(req);
    }

    ipron.UpdateUserdata = function(agentDn, tenantName, connectionId, extension) {
        var req = {};
        req.METHOD = ipron.APIMethod.UPDATE_USERDATA;
        req.APPID = ipron.appId;
        req.AGENT_DN = agentDn;
        req.TENANT_NAME = tenantName;
        req.CONNECTION_ID = connectionId;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.DeleteKeyUserdata = function(agentDn, tenantName, connectionId, extension) {
        var req = {};
        req.METHOD = ipron.APIMethod.DELETE_KEY_USERDATA;
        req.APPID = ipron.appId;
        req.AGENT_DN = agentDn;
        req.TENANT_NAME = tenantName;
        req.CONNECTION_ID = connectionId;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.DeleteAllUserdata = function(agentDn, tenantName, connectionId) {
        var req = {};
        req.METHOD = ipron.APIMethod.DELETE_ALL_USERDATA;
        req.APPID = ipron.appId;
        req.AGENT_DN = agentDn;
        req.TENANT_NAME = tenantName;
        req.CONNECTION_ID = connectionId;

        ipron.sendMessageToBoth(req);
    }

    ipron.SendUserEvent = function(agentDn, tenantName, destDn, extension) {
        var req = {};
        req.METHOD = ipron.APIMethod.SEND_USEREVENT;
        req.APPID = ipron.appId;
        req.AGENT_DN = agentDn;
        req.TENANT_NAME = tenantName;
        req.DEST_DN = destDn;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetUserdata = function(tenantName, thisDn, connectionId, extension) {
        var req = {};
        req.METHOD = ipron.APIMethod.GET_USERDATA;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.TENANT_NAME = tenantName;
        req.CONNECTION_ID = connectionId;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetConnState = function(thisDn, connectionId, extension) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETCONNSTATE;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.CONNECTION_ID = connectionId;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.SetANIUserdata = function(agentDn, aniNumber, extension) {
        var req = {};
        req.METHOD = ipron.APIMethod.SET_ANI_USERDATA;
        req.APPID = ipron.appId;
        req.AGENT_DN = agentDn;
        req.ANI_NUMBER = aniNumber;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.SetUCIDUserdata = function(agentDn, ucid, extension) {
        var req = {};
        req.METHOD = ipron.APIMethod.SET_UCID_USERDATA;
        req.APPID = ipron.appId;
        req.AGENT_DN = agentDn;
        req.UCID = ucid;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.MediaAttach = function(thisDn, callId, extension) {
        var req = {};
        req.METHOD = ipron.APIMethod.MEDIA_ATTACH;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.CALL_ID = callId;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.MediaDeattach = function(thisDn, callId, extension) {
        var req = {};
        req.METHOD = ipron.APIMethod.MEDIA_DEATTACH;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.CALL_ID = callId;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.MediaPlay = function(thisDn, callId, mediaId, duration, extension) {
        var req = {};
        req.METHOD = ipron.APIMethod.MEDIA_PLAY;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.CALL_ID = callId;
        req.MEDIA_ID = mediaId;
        req.DURATION = duration;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.MediaCollect = function(thisDn, callId, mediaId, duration, termDigits, minDigits, maxDigits, extension) {
        var req = {};
        req.METHOD = ipron.APIMethod.MEDIA_COLLECT;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.CALL_ID = callId;
        req.MEDIA_ID = mediaId;
        req.DURATION = duration;
        req.TERM_DIGITS = termDigits;
        req.MIN_DIGITS = minDigits;
        req.MAX_DIGITS = maxDigits;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.MCSConsultCall = function(thisDn, destDn, obCallingDn, connectionId, extension) {
        var req = {};
        req.METHOD = ipron.APIMethod.MCS_CONSULTCALL;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.DEST_DN = destDn;
        req.OB_CALLING_DN = obCallingDn;
        req.CONNECTION_ID = connectionId;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.MCSReconnectCall = function(thisDn, connectionId) {
        var req = {};
        req.METHOD = ipron.APIMethod.MCS_RECONNECTCALL;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.CONNECTION_ID = connectionId;

        ipron.sendMessageToBoth(req);
    }

    ipron.MCSTransferCall = function(thisDn, connectionId) {
        var req = {};
        req.METHOD = ipron.APIMethod.MCS_TRANSFERCALL;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.CONNECTION_ID = connectionId;

        ipron.sendMessageToBoth(req);
    }

    ipron.MCSOnestepTransferCall = function(thisDn, destDn, obCallingDn, connectionId) {
        var req = {};
        req.METHOD = ipron.APIMethod.MCS_ONESTEP_TRANSFERCALL;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.DEST_DN = destDn;
        req.OB_CALLING_DN = obCallingDn;
        req.CONNECTION_ID = connectionId;

        ipron.sendMessageToBoth(req);
    }

    ipron.MCSReroute = function(thisDn, destDn, obCallingDn, connectionId, virtualMediaId, failRouteDn, extension) {
        var req = {};
        req.METHOD = ipron.APIMethod.MCS_REROUTE;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.DEST_DN = destDn;
        req.OB_CALLING_DN = obCallingDn;
        req.CONNECTION_ID = connectionId;
        req.VIRTUAL_MEDIA_ID = virtualMediaId;
        req.GDN = failRouteDn;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.BSR = function(thisDn, queueDn) {
        var req = {};
        req.METHOD = ipron.APIMethod.BSR;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.QUEUE_DN = queueDn;
    
        ipron.sendMessageToBoth(req);
    }

    ipron.AdGetAgentSkillList = function(tenantName, destAgentId) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETAGENT_SKILLLIST_EX;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.DEST_AGENT_ID = destAgentId;
    
        ipron.sendMessageToBoth(req);
    }

    ipron.AdGetAgentQueueList = function(tenantName, destAgentId) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETAGENT_QUEUELIST_EX;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.DEST_AGENT_ID = destAgentId;
    
        ipron.sendMessageToBoth(req);
    }

    ipron.AdGetAgentList = function(tenantName, groupIdSet, queueDnSet, privateData, agentState, media_type) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETAGENTLIST_EX;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.GROUP_ID_SET = groupIdSet;
        req.QUEUE_DN_SET = queueDnSet;
        req.PRIVATE_DATA = privateData;
        req.AGENT_STATE = agentState;
        req.MEDIA_TYPE = media_type;
    
        ipron.sendMessageToBoth(req);
    }

    ipron.AdGetGroupList = function(tenantName, privateData) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETGROUPLIST_EX;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.PRIVATE_DATA = privateData;

        ipron.sendMessageToBoth(req);
    }

    ipron.AdGetQueueList = function(tenantName, privateData) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETQUEUELIST_EX;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.PRIVATE_DATA = privateData;

        ipron.sendMessageToBoth(req);
    }

    ipron.AgentRptSubscribe = function(tenantName, agentId, duration, subscribeType, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.AGENT_SUBSCRIBE;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.AGENT_ID = agentId;
        req.DURATION = duration;
        req.SUBSCRIBE_TYPE = subscribeType;
        req.MEDIA_SET = String(mediaSet);

        ipron.sendMessageToBoth(req);
    }

    ipron.AgentRptSubscribeEx = function(tenantName, agentId, duration, subscribeType, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.AGENT_SUBSCRIBE_EX;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.AGENT_ID = agentId;
        req.DURATION = duration;
        req.SUBSCRIBE_TYPE = subscribeType;
        req.MEDIA_SET = String(mediaSet);

        ipron.sendMessageToBoth(req);
    }

    ipron.GroupRptSubscribe = function(tenantName, groupIdSet, duration, subscribeType, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.GROUP_SUBSCRIBE;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.GROUP_ID_SET = groupIdSet;
        req.DURATION = duration;
        req.SUBSCRIBE_TYPE = subscribeType;
        req.MEDIA_SET = String(mediaSet);

        ipron.sendMessageToBoth(req);
    }

    ipron.QueueRptSubscribe = function(tenantName, queueDnSet, duration, subscribeType, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.QUEUE_SUBSCRIBE;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.QUEUE_DN_SET = queueDnSet;
        req.DURATION = duration;
        req.SUBSCRIBE_TYPE = subscribeType;
        req.MEDIA_SET = String(mediaSet);

        ipron.sendMessageToBoth(req);
    }

    ipron.TenantRptSubscribe = function(tenantName, duration, subscribeType, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.TENANT_SUBSCRIBE;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.DURATION = duration;
        req.SUBSCRIBE_TYPE = subscribeType;
        req.MEDIA_SET = String(mediaSet);

        ipron.sendMessageToBoth(req);
    }

    ipron.DNISRptSubscribe = function(dnisSet, privateData, duration, subscribeType) {
        var req = {};
        req.METHOD = ipron.APIMethod.DNIS_SUBSCRIBE;
        req.APPID = ipron.appId;
        req.DNIS_SET = dnisSet;
        req.PRIVATE_DATA = privateData;
        req.DURATION = duration;
        req.SUBSCRIBE_TYPE = subscribeType;

        ipron.sendMessageToBoth(req);
    }

    ipron.CloseSubscribe = function (subscribeId) {
        var req = {};
        req.METHOD = ipron.APIMethod.CLOSE_SUBSCRIBE;
        req.APPID = ipron.appId;
        req.SUBSCRIBE_ID = subscribeId;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetAgentInfoEx = function(tenantName, destAgentId, destDn, pbxLoginDn, privateData) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETAGENTINFO_EX;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.DEST_AGENT_ID = destAgentId;
        req.DEST_DN = destDn;
        req.PBX_LOGIN_DN = pbxLoginDn;
        req.PRIVATE_DATA = privateData;

        ipron.sendMessageToBoth(req);
    }

    ipron.DtmfPlay = function(thisDn, callId, duration, pauseDuration, playDigit, extension) {
        var req = {};
        req.METHOD = ipron.APIMethod.DTMF_PLAY;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.CALL_ID = callId;
        req.DURATION = duration;
        req.PAUSE_DURATION = pauseDuration;
        req.PLAY_DIGITS = playDigit;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.VirtualQueueRouting = function(destDn, connectionId, callId, privateData, mediaType, extension) {
        var req = {};
        req.METHOD = ipron.APIMethod.VIRTUAL_QUEUE;
        req.APPID = ipron.appId;
        req.DEST_DN = destDn;
        req.CONNECTION_ID = connectionId;
        req.CALL_ID = callId;
        req.PRIVATE_DATA = privateData;
        req.MEDIA_TYPE = mediaType;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    /*
    * NOT USED
    */
    ipron.SetCallback = function(tenantName, agentId, groupId, skillId, dateTime, ucid, srcMediaType, destMediaType, destInfo1, destInfo2, destInfo3) {
        var req = {};
        req.METHOD = ipron.APIMethod.SET_CALLBACK;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.AGENT_ID = agentId;
        req.GROUP_ID = groupId;
        req.SKILL_ID = skillId;
        req.DATE_TIME = dateTime;
        req.UCID = ucid;
        req.SRC_MEDIA_TYPE = srcMediaType;
        req.DEST_MEDIA_TYPE = destMediaType;
        req.DESTINFO1 = destInfo1;
        req.DESTINFO2 = destInfo2;
        req.DESTINFO3 = destInfo3;

        ipron.sendMessageToBoth(req);
    }

    ipron.MediaDndReq = function(tenantName, agentId, mediaType, distribute) {
        var req = {};
        req.METHOD = ipron.APIMethod.MEDIA_DND;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.AGENT_ID = agentId;
        req.MEDIA_TYPE = mediaType;
        req.DISTRIBUTE = distribute

        ipron.sendMessageToBoth(req);
    }

    ipron.ReservedAgentState = function(tenantName, agentId, agentState, agentStateSub, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.RESERVED_AGENT_STATE;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.AGENT_ID = agentId;
        req.AGENT_STATE = agentState;
        req.AGENT_STATE_SUB = agentStateSub;
        req.MEDIA_SET = String(mediaSet);
        
        ipron.sendMessageToBoth(req);
    }

    ipron.SendGlobalEvent = function(agentDn, ucid, extension) {
        var req = {};
        req.METHOD = ipron.APIMethod.SEND_GLOBAL_EVENT;
        req.APPID = ipron.appId;
        req.AGENT_DN = agentDn;
        req.UCID = ucid;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;
        
        ipron.sendMessageToBoth(req);
    }

    ipron.AgentCall = function(thisDn, destDn, obCallingDn, skillLevel, priority, relationAgentDn, relationAgentId,
    relationMethod, routeMethod, routeSkillId, routeGroupId, ucid, extension, mediaType, usePrevAgent, useDesignatedAgent,
    relationTimeout, hop) {
        var req = {};
        req.METHOD = ipron.APIMethod.AGENTCALL;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.DEST_DN = destDn;
        req.OB_CALLING_DN = obCallingDn;
        req.SKILL_LEVEL = skillLevel;
        req.PRIORITY = priority;
        req.RELATION_AGENT_DN = relationAgentDn;
        req.RELATION_AGENT_ID = relationAgentId;
        req.RELATION_METHOD = relationMethod;
        req.RELATION_TIMEOUT = relationTimeout;
        req.ROUTE_METHOD = routeMethod;
        req.ROUTE_SKILL_ID = routeSkillId;
        req.ROUTE_GROUP_ID = routeGroupId;
        req.UCID = ucid;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;
        req.MEDIA_TYPE = mediaType;
        req.USEPREVAGENT = usePrevAgent;
        req.USEDESIGNATEDAGENT = useDesignatedAgent;
        req.HOP = hop;
        
        ipron.sendMessageToBoth(req);
    }

    ipron.GetMediaActivate = function() {
        var req = {};
        req.METHOD = ipron.APIMethod.GET_MEDIA_ACTIVATE;
        req.APPID = ipron.appId;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetRoutePolicy = function(tenantName, destDn, destAgentId, queueDn, skillId, mediaType, privateData) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETROUTEPOLICY;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.DEST_DN = destDn;
        req.DEST_AGENT_ID = destAgentId;
        req.QUEUE_DN = queueDn;
        req.SKILL_ID = skillId;
        req.MEDIA_TYPE = mediaType;
        req.PRIVATE_DATA = privateData;

        ipron.sendMessageToBoth(req);
    }

    ipron.SetMediaReadyState = function(tenantName, agentId, mediaType, mediaReady) {
        var req = {};
        req.METHOD = ipron.APIMethod.SET_MEDIAREADY_STATE;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.AGENT_ID = agentId;
        req.MEDIA_TYPE = mediaType;
        req.MEDIA_READY = mediaReady;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetMediaReadyState = function(tenantName, agentId, mediaType) {
        var req = {};
        req.METHOD = ipron.APIMethod.GET_MEDIAREADY_STATE;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.AGENT_ID = agentId;
        req.MEDIA_TYPE = mediaType;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetUserCdr = function(connectionId, privateData) {
        var req = {};
        req.METHOD = ipron.APIMethod.GET_USER_CDR;
        req.APPID = ipron.appId;
        req.CONNECTION_ID = connectionId;
        req.PRIVATE_DATA = privateData;

        ipron.sendMessageToBoth(req);
    }

    ipron.SetUserCdr = function(connectionId, userCdr, privateData) {
        var req = {};
        req.METHOD = ipron.APIMethod.SET_USER_CDR;
        req.APPID = ipron.appId;
        req.CONNECTION_ID = connectionId;
        req.PRIVATE_DATA = privateData;
        req.USER_CDR = userCdr;

        ipron.sendMessageToBoth(req);
    }

    ipron.SetDeviceMuteEnable = function(thisDn, connectionId, privateData, mediaType, enable) {
        var req = {};
        req.METHOD = ipron.APIMethod.SET_MUTE_ENABLE;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.CONNECTION_ID = connectionId;
        req.PRIVATE_DATA = privateData;
        req.MEDIA_TYPE = mediaType;
        req.ENABLE = enable;

        ipron.sendMessageToBoth(req);
    }

    ipron.ReserveIrAttr = function(privateData, aniNumber, skillLevel, priority, usePrevAgent, useDesignatedAgent,
        relationAgentDn, relationAgentId, relationMethod, relationTimeout, routeMethod, routeSkillId, routeGroupId, mediaType) {

        var req = {};
        req.METHOD = ipron.APIMethod.RESERVE_IR_ATTR;
        req.APPID = ipron.appId;
        req.PRIVATE_DATA = privateData;
        req.ANI_NUMBER = aniNumber;
        req.SKILL_LEVEL = skillLevel;
        req.PRIORITY = priority;
        req.RELATION_AGENT_DN = relationAgentDn;
        req.RELATION_AGENT_ID = relationAgentId;
        req.RELATION_METHOD = relationMethod;
        req.RELATION_TIMEOUT = relationTimeout;
        req.ROUTE_METHOD = routeMethod;
        req.ROUTE_SKILL_ID = routeSkillId;
        req.ROUTE_GROUP_ID = routeGroupId;
        req.MEDIA_TYPE = mediaType;
        req.USEPREVAGENT = usePrevAgent;
        req.USEDESIGNATEDAGENT = useDesignatedAgent;
        
        ipron.sendMessageToBoth(req);
    }

    ipron.FindWaitIr = function(privateData, aniNumber) {
        var req = {};
        req.METHOD = ipron.APIMethod.FIND_WAIT_IR;
        req.APPID = ipron.appId;
        req.PRIVATE_DATA = privateData;
        req.ANI_NUMBER = aniNumber;
       
        ipron.sendMessageToBoth(req);
    }

    ipron.GetConnectionEx = function(destDn) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETCONNECTION_EX;
        req.APPID = ipron.appId;
        req.DEST_DN = destDn;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetCallInfo = function(callId) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETCALL_INFO;
        req.APPID = ipron.appId;
        req.CALL_ID = callId;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetCallInfoEx = function(callId) {
        var req = {};
        req.METHOD = ipron.APIMethod.GET_CALLINFO_EX;
        req.APPID = ipron.appId;
        req.CALL_ID = callId;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetUserCdrEx = function(connectionId, userCdrIndex, privateData) {
        var req = {};
        req.METHOD = ipron.APIMethod.GET_USER_CDR_EX;
        req.APPID = ipron.appId;
        req.CONNECTION_ID = connectionId;
        req.USER_CDR_INDEX = userCdrIndex;
        req.PRIVATE_DATA = privateData;

        ipron.sendMessageToBoth(req);
    }

    ipron.SetUserCdrEx = function(connectionId, userCdrIndex, userCdr, privateData) {
        var req = {};
        req.METHOD = ipron.APIMethod.SET_USER_CDR_EX;
        req.APPID = ipron.appId;
        req.CONNECTION_ID = connectionId;
        req.USER_CDR_INDEX = userCdrIndex;
        req.PRIVATE_DATA = privateData;
        req.USER_CDR = userCdr;

        ipron.sendMessageToBoth(req);
    }

    ipron.AgentAdnLogin = function(tenantName, agentDn, pbxLoginDn, agentId, agentPassword, passwdType, agentState, agentStateSub, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.ADNLOGIN;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.AGENT_DN = agentDn;
        req.PBX_LOGIN_DN = pbxLoginDn;
        req.AGENT_ID = agentId;
        req.AGENT_PASSWORD = agentPassword;
        req.PASSWORD_TYPE = passwdType;
        req.AGENT_STATE = agentState;
        req.AGENT_STATE_SUB = agentStateSub;
        req.MEDIA_SET = String(mediaSet);

        ipron.sendMessageToBoth(req);
    }

    ipron.SetAgentStateData = function(tenantName, agentId, agentState, agentStateSub, mediaSet, customData1, customData2, customData3) {
        var req = {};
        req.METHOD = ipron.APIMethod.SETAGENTSTATE_DATA;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.AGENT_ID = agentId;
        req.AGENT_STATE = agentState;
        req.AGENT_STATE_SUB = agentStateSub;
        req.MEDIA_SET = String(mediaSet);
        req.CUSTOM_DATA1 = customData1;
        req.CUSTOM_DATA2 = customData2;
        req.CUSTOM_DATA3 = customData3;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetCategoryList = function(tenantName, privateData) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETCATEGORY_LIST;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.PRIVATE_DATA = privateData;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetCategoryInfo = function(tenantName, privateData, categoryId) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETCATEGORY_INFO;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.PRIVATE_DATA = privateData;
        req.CATEGORY_ID = categoryId;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetAgentMasterQueueInfo = function(tenantName, destDn, destAgentId, privateData, mediaType) {
        var req = {};
        req.METHOD = ipron.APIMethod.GETAGENT_MASTERQUEUEINFO;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.DEST_DN = destDn;
        req.DEST_AGENT_ID = destAgentId;
        req.PRIVATE_DATA = privateData;
        req.MEDIA_TYPE = mediaType;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetDeviceActivate = function(tenantName, destDn, mediaType, privateData) {
        var req = {};
        req.METHOD = ipron.APIMethod.GET_DEVICE_ACTIVATE;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.DEST_DN = destDn;
        req.PRIVATE_DATA = privateData;
        req.MEDIA_TYPE = mediaType;

        ipron.sendMessageToBoth(req);
    }

    ipron.SetUserCdrV5 = function(connectionId, userCdrType, userCdrIndex, userCdr, privateData) {
        var req = {};
        req.METHOD = ipron.APIMethod.SET_USER_CDR_V5;
        req.APPID = ipron.appId;
        req.CONNECTION_ID = connectionId;
        req.USER_CDR_TYPE = userCdrType;
        req.USER_CDR_INDEX = userCdrIndex;
        req.USER_CDR = userCdr;
        req.PRIVATE_DATA = privateData;

        ipron.sendMessageToBoth(req);
    }

    ipron.MuteTransferEx = function(thisDn, ActiveConnId, HeldConnId, destDn, extension, mediaType) {
        var req = {};
        req.METHOD = ipron.APIMethod.MUTE_TRANSFER_EX;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.ACTIVE_CONN_ID = ActiveConnId;
        req.HELD_CONN_ID = HeldConnId;
        req.DEST_DN = destDn;
        req.MEDIA_TYPE = mediaType;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetMediaOption = function(tenantName, agentId) {
        var req = {};
        req.METHOD = ipron.APIMethod.GET_MEDIA_OPTION;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.AGENT_ID = agentId;

        ipron.sendMessageToBoth(req);
    }

    ipron.SetMediaOption = function(tenantName, agentId, mediaSet, agtMediaWeight, agtMediaMax) {
        var req = {};
        req.METHOD = ipron.APIMethod.SET_MEDIA_OPTION;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.AGENT_ID = agentId;
        req.MEDIA_SET = String(mediaSet);
        req.AGT_MEDIA_WEIGHT = agtMediaWeight;
        req.AGT_MEDIA_MAX = agtMediaMax;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetGroupSkillList = function(tenantName, groupid) {
        var req = {};
        req.METHOD = ipron.APIMethod.GET_GROUPSKILL_LIST;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.GROUP_ID = groupid;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetDeviceList = function(tenantName, devicetype) {
        var req = {};
        req.METHOD = ipron.APIMethod.GET_DEVICE_LIST;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.DEVICE_TYPE = devicetype;

        ipron.sendMessageToBoth(req);
    }

    ipron.SetAftReCallState = function(tenantName, AgentId, AgentState, AgentStateSub, MediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.SET_AFT_RECALLSTATE;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.AGENT_ID = AgentId;
        req.AGENT_STATE = AgentState;
        req.AGENT_STATE_SUB = AgentStateSub;
        req.MEDIA_SET = String(MediaSet);

        ipron.sendMessageToBoth(req);
    }

    ipron.GetTenantList = function() {
        var req = {};
        req.METHOD = ipron.APIMethod.GET_TENANT_LIST;
        req.APPID = ipron.appId;

        ipron.sendMessageToBoth(req);
    }

    ipron.AgentCallEx = function(thisDn, destDn, obCallingDn, skillLevel, priority, relationAgentDn, relationAgentId,
    relationMethod, routeMethod, routeSkillId, routeGroupId, Ucid, extension, mediaType, usePrevAgent, useDesignatedAgent,
    relationTimeout, dnis, hop) {
        var req = {};
        req.METHOD = ipron.APIMethod.AGENTCALL_EX;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.DEST_DN = destDn;
        req.OB_CALLING_DN = obCallingDn;
        req.SKILL_LEVEL = skillLevel;
        req.PRIORITY = priority;
        req.RELATION_AGENT_DN = relationAgentDn;
        req.RELATION_AGENT_ID = relationAgentId;
        req.RELATION_METHOD = relationMethod;
        req.RELATION_TIMEOUT = relationTimeout;
        req.ROUTE_METHOD = routeMethod;
        req.ROUTE_SKILL_ID = routeSkillId;
        req.ROUTE_GROUP_ID = routeGroupId;
        req.UCID = Ucid;
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;
        req.MEDIA_TYPE = mediaType;
        req.USEPREVAGENT = usePrevAgent;
        req.USEDESIGNATEDAGENT = useDesignatedAgent;
        req.HOP = hop;
        req.DNIS = dnis;
        
        ipron.sendMessageToBoth(req);
    }

    ipron.GetCallPosition = function(callid) {
        var req = {};
        req.METHOD = ipron.APIMethod.GET_CALL_POSITION;
        req.APPID = ipron.appId;
        req.CALL_ID = callid;
        
        ipron.sendMessageToBoth(req);
    }

    ipron.GetQueueTrafficEx = function(tenantName, queueDnSet, skillId, privateData, extension, mediaSet) {
        var req = {};
        req.METHOD = ipron.APIMethod.GET_QUEUE_TRAFFIC_EX;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.QUEUE_DN_SET = queueDnSet;
        req.SKILL_ID = skillId;
        req.PRIVATE_DATA = privateData;
        req.MEDIA_SET = String(mediaSet);
        req.EXTENSION_DATA = ipron.GetExtensionData(extension); 
        req.EXTENSION_DATA_LEN = req.EXTENSION_DATA.length;

        ipron.sendMessageToBoth(req);
    }

    ipron.SetIEDnd = function(tenantName, thisDn, enable, privateData){
        var req = {};
        req.METHOD = ipron.APIMethod.SET_IE_DND;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.THIS_DN = thisDn;
        req.ENABLE = enable;
        req.PRIVATE_DATA = privateData;

        ipron.sendMessageToBoth(req);
    }

    ipron.GetIEDnd = function(tenantName, thisDn, privateData){
        var req = {};
        req.METHOD = ipron.APIMethod.GET_IE_DND;
        req.APPID = ipron.appId;
        req.TENANT_NAME = tenantName;
        req.THIS_DN = thisDn;
        req.PRIVATE_DATA = privateData;

        ipron.sendMessageToBoth(req);
    }

    ipron.SetSkillAllEnable = function (agentId, skillEnable) {
        var req = {};
        req.METHOD = ipron.APIMethod.SETSKILL_ALL_ENABLE;
        req.APPID = ipron.appId;
        req.AGENT_ID = agentId;
        req.SKILL_ENABLE = skillEnable;

        ipron.sendMessageToBoth(req);
    }

    ipron.SetIEVoiceRecord = function (thisDn, connId, privateData) {
        var req = {};
        req.METHOD = ipron.APIMethod.SET_IE_VOICE_RECORD;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.CONNECTION_ID = connId;
        req.PRIVATE_DATA = privateData;

        ipron.sendMessageToBoth(req);
    }

    ipron.SetIEAgc = function (tenantName, thisDn, mediagainuse, defaultlevel, gaincomp, privateData){
        var req = {};
        req.METHOD = ipron.APIMethod.SET_IE_AGC;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.TENANT_NAME = tenantName;
        req.PRIVATE_DATA = privateData;
        req.GAIN_COMP = Number(gaincomp);
        req.DEFAULT_LEVEL = Number(defaultlevel);
        req.MEDIA_USE_GAIN = Number(mediagainuse);

        ipron.sendMessageToBoth(req);
    }

    ipron.GetIEAgc = function (tenantName, thisDn, privateData){
        var req = {};
        req.METHOD = ipron.APIMethod.GET_IE_AGC;
        req.APPID = ipron.appId;
        req.THIS_DN = thisDn;
        req.TENANT_NAME = tenantName;
        req.PRIVATE_DATA = privateData;

        ipron.sendMessageToBoth(req);
    }

    // Extensions
    ipron.SetExtensionData = function(data) {
        var handle = ipron.EXTCreateExtension();
        ipron.arrExt[handle] = data;
        return handle;
    }

    ipron.IsValidExtHdl = function(handle) {
        if (handle > 0 && handle < 1025)
            return true;
        else
            return false;
    }

    ipron.EXTCreateExtension = function() {
        ipron.extensionIndex++;
        if (ipron.extensionIndex > 1024) {
            ipron.extensionIndex = 1;
        }

        ipron.arrExt[ipron.extensionIndex] = {};
        return ipron.extensionIndex;
    }

    ipron.GetExtensionData = function(extension) {
        if(extension <= 0) {
            return "";
        }

        return JSON.stringify(ipron.arrExt[extension]);
    }

    ipron.EXTDeleteExtension = function(handle) {
        ipron.arrExt[handle] = {};
    }

    ipron.EXTAddRecord = function(handle, key, value) {
        var extension = ipron.arrExt[handle];
        if (extension == undefined) {
            extension = {};
        }

        if (extension["" + key] == undefined) {
            extension["" + key] = value;
        } else {
            if (ipron.isArray(extension["" + key])) {
                extension["" + key].push(value);
            }
            else {
                var arr = new Array();
                arr.push(extension["" + key]);
                arr.push(value);

                extension["" + key] = arr;
            }
        }

        ipron.arrExt[handle] = extension;
    }

    ipron.EXTDeleteRecord = function(handle, key) {
        var extension = ipron.arrExt[handle];

        if (extension["" + key] != undefined) {
            delete extension["" + key];
        }

        ipron.arrExt[handle] = extension;
    }

    ipron.EXTDeleteValue = function(handle, key, value) {
        var extension = ipron.arrExt[handle];
        if (Array.isArray(extension["" + key])) {
            extension["" + key] = extension["" + key].filter(function (x) { return x != value; });
            if (extension["" + key].length == 0) {
                delete extension["" + key];
            }
        }
        else {
            delete extension["" + key];
        }

        ipron.arrExt[handle] = extension;
    }

    ipron.EXTGetRecordCount = function(handle) {
        if (handle == undefined || handle == 0) {
            return 0;
        }

        var extension = ipron.arrExt[handle];

        if (Object.keys) {
            return Object.keys(extension).length;
        }

        var cnt = 0;
        for (var i in extension) {
            cnt++;
        }
        return cnt;
    }

    ipron.EXTGetValueCountForRecord = function(handle, record) {
        return ipron.EXTGetValueCountForKey(handle, ipron.EXTGetKey(handle, record));
    }

    ipron.EXTGetValueCountForKey = function(handle, key) {
        var extension = ipron.arrExt[handle];
        if (ipron.isArray(extension["" + key])) {
            return extension["" + key].length;
        }

        if (extension["" + key] == undefined) {
            return 0;
        }
        
        return 1;
    }

    ipron.EXTGetKey = function(handle, record) {
        var extension = ipron.arrExt[handle];

        if (Object.keys) {
            return Object.keys(extension)[record];
        }

        var cnt = 0;
        for (var i in extension) {
            if (cnt == record) {
                return i;
            }
            cnt++;
        }
        
        return cnt;
    }

    ipron.EXTGetValueForRecord = function(handle, record, field) {
        return ipron.EXTGetValueForKey(handle, ipron.EXTGetKey(handle, record), field);
    }

    ipron.EXTGetValueForKey = function(handle, key, field) {
        var extension = ipron.arrExt[handle];
        if (ipron.isArray(extension["" + key])) {
            return extension["" + key][field];
        }

        if (field == 0) {
            return extension["" + key];
        }

        return undefined;
    }

    ipron.isArray = function(value) {
        return Object.prototype.toString.call(value) === "[object Array]";
    }

    // WebSocket 1 연결
    ipron.connectSocket1 = function(url) {
        if(ipron.isEnd) {
            return;
        }

        if(ipron.socket1 != null) {
            if(ipron.socket1.readyState == WebSocket.OPEN) {
                //console.log('websocket 1 already open return');
                return;
            }
        }

        ipron.socket1 = new WebSocket(url);

        ipron.socket1.onopen = function(event) {
            //console.log("WebSocket 1 연결됨");
        };

        ipron.socket1.onmessage = function(event) {
            var jsonData = JSON.parse(event.data);
            //console.log("WebSocket 1 메시지 수신: ", jsonData);
            ipron.workMessage(true, jsonData);
        };

        ipron.socket1.onerror = function(event) {
            ipron.updateHaState(true, "NULL");
            //console.error("WebSocket 1 오류 발생: ", event);
        };

        ipron.socket1.onclose = function(event) {
            //console.log("WebSocket 1 연결 종료됨: ", event);

            ipron.updateHaState(true, "NULL");

            if(ipron.socket1 != null && ipron.socket2 == null) {
                if ((ipron.socket1.readyState != WebSocket.OPEN) && ipron.isWork) {
                    setTimeout("ipron.activetimeout();", 1000);
                    return;
                }
            }
    
            if(ipron.socket1 != null && ipron.socket2 != null) {
                if ((ipron.socket2.readyState != WebSocket.OPEN && ipron.socket1.readyState != WebSocket.OPEN) && ipron.isWork) {
                    setTimeout("ipron.activetimeout();", 1000);
                    return;
                }
            }

            //console.log("conenctSocket Retry");

            setTimeout("ipron.connectSocket1(ipron.srv1)", 1000);
        };
    }

    // WebSocket 2 연결
    ipron.connectSocket2 = function(url) {
        if(ipron.isEnd) {
            return;
        }

        if(ipron.socket2 != null) {
            if(ipron.socket2.readyState == WebSocket.OPEN) {
                //console.log('websocket 2 already open return');
                return;
            }
        }

        ipron.socket2 = new WebSocket(url);

        ipron.socket2.onopen = function(event) {
            //console.log("WebSocket 2 연결됨");
        };

        ipron.socket2.onmessage = function(event) {
            var jsonData = JSON.parse(event.data);
            //console.log("WebSocket 2 메시지 수신: ", jsonData);
            ipron.workMessage(false, jsonData);
        };

        ipron.socket2.onerror = function(event) {
            ipron.updateHaState(false, "NULL");
            //console.error("WebSocket 2 오류 발생: ", event);
        };

        ipron.socket2.onclose = function(event) {
            //console.log("WebSocket 2 연결 종료됨: ", event);

            ipron.updateHaState(false, "NULL");

            if(ipron.socket1 != null && ipron.socket2 != null) {
                if ((ipron.socket2.readyState != WebSocket.OPEN && ipron.socket1.readyState != WebSocket.OPEN) && ipron.isWork) {
                    setTimeout("ipron.activetimeout();", 1000);
                    return;
                }
            }

            setTimeout("ipron.connectSocket2(ipron.srv2)", 1000);
        };
    }

    // WebSocket 1로 메시지 보내기
    ipron.sendMessageToSocket1 = function(message) {
        if(ipron.socket1 == null) {
            return;
        }

        if (ipron.socket1.readyState === WebSocket.OPEN) {
            ipron.socket1.send(message);
        } else {
            //console.error("WebSocket 1이 아직 열리지 않았습니다.");
        }
    }

    // WebSocket 2로 메시지 보내기
    ipron.sendMessageToSocket2 = function(message) {
        if(ipron.socket2 == null) {
            return;
        }

        if (ipron.socket2.readyState === WebSocket.OPEN) {
            ipron.socket2.send(message);
        } else {
            //console.error("WebSocket 2가 아직 열리지 않았습니다.");
        }
    }

    ipron.workMessage = function(one, message) {
        if (message.EXTENSION_DATA != undefined) {
            if(message.EXTENSION_DATA_LEN != undefined && message.EXTENSION_DATA_LEN > 0){
                message.EXTENSION_HANDLE = ipron.SetExtensionData(message.EXTENSION_DATA);
            }
        }

        if(message.METHOD == ipron.APIEvent.TCPACK) {
            ipron.sendSocketID(one, message);
            return;
        } else if(message.METHOD == ipron.APIResponse.CLOSESERVER_RES) {
            ipron.isEnd = true;
            ipron.isWork = false;
            ipron.closeSockets();
        } else if(message.METHOD == ipron.APIResponse.OPENSERVER_RES) {
            ipron.openserverRes(message);
        } else if(message.METHOD == ipron.APIResponse.HEARTBEAT_RES) {
            if(one) {
                ipron.hbres1 = new Date();
            } else {
                ipron.hbres2 = new Date();
            }
            return;
        } else if(message.METHOD == ipron.APIEvent.HASTATE_CHANGED) {
            ipron.updateHaState(one, message.HASTATE);

            if(message.DI_ADDR1 != undefined && message.DI_ADDR1 != "") {
                ipron.diIplist.push(message.DI_ADDR1);
            }

            if(message.DI_ADDR2 != undefined && message.DI_ADDR2 != "") {
                ipron.diIplist.push(message.DI_ADDR2);
            }

            if(message.DI_ADDR3 != undefined && message.DI_ADDR3 != "") {
                ipron.diIplist.push(message.DI_ADDR3);
            }

            if(message.DI_ADDR4 != undefined && message.DI_ADDR4 != "") {
                ipron.diIplist.push(message.DI_ADDR4);
            }

            ipron.RandDIServer();

            ipron.gwaddr1 = message.GW_ASIDE
            ipron.gwaddr2 = message.GW_BSIDE

            return;
        } else if(message.METHOD == ipron.APIEvent.REGISTERED) {
            ipron.monIds.set(message.THIS_DN, message.MONITOR_ID);
        } else if(message.METHOD == ipron.APIEvent.UNREGISTERED) {
            ipron.monIds.delete(message.THIS_DN);
        }

        var adLstHandle = 0;
        var extHandle = message.EXTENSION_HANDLE;

        if (message.METHOD == ipron.APIResponse.GETAGENTLIST_EX_RES) {
            adLstHandle = AdLstCreateList();
            for (var i = 0; i < ipron.EXTGetRecordCount(extHandle); i++) {
                var id = ipron.EXTGetKey(extHandle, i);
                var loginId, dn, name, state, stateSub, stateKeepTime, inOut, skillLevel;

                for (var j = 0; j < ipron.EXTGetValueCountForRecord(extHandle, i); j++) {
                    switch (j) {
                        case 0: loginId = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 1: dn = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 2: name = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 3: state = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 4: stateSub = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 5: stateKeepTime = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 6: inOut = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 7: skillLevel = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                    }
                }

                AdLstAddRow(adLstHandle, id, dn, loginId, name, state, stateSub, stateKeepTime, inOut, skillLevel, "", "");
            }
            message.advanceListHandle = adLstHandle;
        } else if (message.METHOD == ipron.APIResponse.GETGROUPLIST_EX_RES) {
            adLstHandle = AdLstCreateList();
            for (var i = 0; i < ipron.EXTGetRecordCount(extHandle); i++) {
                var id = ipron.EXTGetKey(extHandle, i);
                var name;

                for (var j = 0; j < ipron.EXTGetValueCountForRecord(extHandle, i); j++) {
                    switch (j) {
                        case 0: name = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                    }
                }

                AdLstAddRow(adLstHandle, id, "", "", name, "", "", "", "", "", "", "");
            }
            message.advanceListHandle = adLstHandle;
        } else if (message.METHOD == ipron.APIResponse.GETQUEUELIST_EX_RES) {
            adLstHandle = AdLstCreateList();
            for (var i = 0; i < ipron.EXTGetRecordCount(extHandle); i++) {
                var id = ipron.EXTGetKey(extHandle, i);
                var dn, name;

                for (var j = 0; j < ipron.EXTGetValueCountForRecord(extHandle, i); j++) {
                    switch (j) {
                        case 0: dn = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 1: name = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                    }
                }

                AdLstAddRow(adLstHandle, id, dn, "", name, "", "", "", "", "", "", "");
            }
            message.advanceListHandle = adLstHandle;
        } else if (message.METHOD == ipron.APIResponse.GETAGENT_SKILLLIST_EX_RES) {
            adLstHandle = AdLstCreateList();
            for (var i = 0; i < ipron.EXTGetRecordCount(extHandle); i++) {
                var id = ipron.EXTGetKey(extHandle, i);
                var name, skillEnable;

                for (var j = 0; j < ipron.EXTGetValueCountForRecord(extHandle, i); j++) {
                    switch (j) {
                        case 0: name = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 1: skillEnable = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                    }
                }

                AdLstAddRow(adLstHandle, id, "", "", name, "", "", "", "", "", "", skillEnable);
            }
            message.advanceListHandle = adLstHandle;
        } else if (message.METHOD == ipron.APIResponse.GETAGENT_QUEUELIST_EX_RES) {
            adLstHandle = AdLstCreateList();
            for (var i = 0; i < ipron.EXTGetRecordCount(extHandle); i++) {
                var id = ipron.EXTGetKey(extHandle, i);
                var name, dn, skillId;

                for (var j = 0; j < ipron.EXTGetValueCountForRecord(extHandle, i); j++) {
                    switch (j) {
                        case 0: name = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 1: dn = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 2: skillId = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                    }
                }

                AdLstAddRow(adLstHandle, id, dn, "", name, "", "", "", "", "", skillId, "");
            }
            message.advanceListHandle = adLstHandle;
        }

        if(message.MESSAGE_TYPE == 1) {
            ipron.resCB(message);
        } else {
            ipron.evtCB(message);
        }
    }

    ipron.heartbeat = function() {
        if(ipron.appId == 0) {
            return;
        }

        if(ipron.isEnd) {
            return;
        }

        var req = {};
        req.APPID = ipron.appId;
        req.METHOD = ipron.APIMethod.HEARTBEAT;
        ipron.sendMessageToBoth(req);

        ipron.hbreq1 = new Date();
        ipron.hbreq2 = new Date();
            
        if(ipron.hbreq1 - ipron.hbres1 > (ipron.HBTime *3)) {
            if(ipron.s1HAState == "ACTIVE") {
                ipron.activetimeout();
                return;
            }
        }

        if(ipron.hbreq2 - ipron.hbres2 > (ipron.HBTime *3)) {
            if(ipron.s2HAState == "ACTIVE") {
                ipron.activetimeout();
                return;
            }
        }
    }

    // Need Test
    ipron.activetimeout = function() {
        ipron.closeSockets();

        var message = {};
        message.APPID = ipron.appId;
        message.METHOD = ipron.APIEvent.ACTIVE_TIMEOUT;
        ipron.evtCB(message);
    }

    ipron.updateHaState = function(one, state) {
        if(state == "UNASSIGN") {
            state = "NULL"
        }

        if(one) {
            if(ipron.s1HAState[0] == state) {
                return;
            }

            ipron.s1HAState.pop();
            ipron.s1HATime.pop();

            ipron.s1HAState.unshift(state);
            ipron.s1HATime.unshift(new Date());

            return;
        } 

        if(ipron.s2HAState[0] == state) {
            return;
        }

        ipron.s2HAState.pop();
        ipron.s2HATime.pop();

        ipron.s2HAState.unshift(state);
        ipron.s2HATime.unshift(new Date());
    }

    ipron.checkActiveTimeout = function() {
        // icapiReq.cpp - IsActiveNotExist
        // icapiReq.cpp - IsDualActive
        // icapiReq.cpp - IsDoubleActive

        if(ipron.isActiveNotExist()) {
            //console.log("isActiveNotExist");
            ipron.activetimeout();
            return;
        }

        if(ipron.isDualActive(true)) {
            //console.log("isDualActive true");
            ipron.activetimeout();
            return;
        }

        if(ipron.isDualActive(false)) {
            //console.log("isDualActive false");
            ipron.activetimeout();
            return;
        }

        if(ipron.isDoubleActive()) {
            //console.log("isDoubleActive");
            ipron.activetimeout();
            return;
        }

        //console.log('checkActiveTimeout ok');
    }

    ipron.isActiveNotExist = function() {
        if(ipron.s1HAState[0] == "ACTIVE" || ipron.s2HAState[0] == "ACTIVE") {
            return false;
        }

        if(ipron.s1HAState[0] == "EMPTY" && ipron.s2HAState[0] == "EMPTY") {
            return false;
        }

        if(ipron.s1HAState[0] == "EMPTY" && ipron.s2HAState[0] != "EMPTY") {
            if(ipron.s2HAState[0] != "ACTIVE") {
                if(new Date() - ipron.s2HATime[0] > ipron.HaTimeout) {
                    return true;
                }

                return false;
            }

            return false;
        }

        if(ipron.s1HAState[0] != "EMPTY" && ipron.s2HAState[0] == "EMPTY") {
            if(ipron.s1HAState[0] != "ACTIVE") {
                if(new Date() - ipron.s1HATime[0] > ipron.HaTimeout) {
                    return true;
                }

                return false;
            }

            return false;
        }

        if(ipron.s1HAState[0] != "EMPTY" && ipron.s2HAState[0] != "EMPTY") {
            if(new Date() - ipron.s1HATime[0] <= ipron.HaTimeout) {
                return false;
            }

            if(new Date() - ipron.s2HATime[0] <= ipron.HaTimeout) {
                return false;
            }

            //console.log(new Date() - ipron.s1HATime[0])
            //console.log(new Date() - ipron.s2HATime[0])
        }

        return true;
    }

    ipron.isDualActive = function(bChkFirstCon) {
        if(ipron.s1HAState[0] == "STANDBY" && ipron.s1HAState[1] == "NULL" && ipron.s1HAState[2] == "ACTIVE" && 
            ipron.s2HAState[0] == "ACTIVE" && ipron.s2HAState[1] == "EMPTY"
        ) {
            return true;
        }

        if(ipron.s2HAState[0] == "STANDBY" && ipron.s2HAState[1] == "NULL" && ipron.s2HAState[2] == "ACTIVE" && 
            ipron.s1HAState[0] == "ACTIVE" && ipron.s1HAState[1] == "EMPTY"
        ) {
            return true;
        }

        if(ipron.s1HAState[0] == "ACTIVE" && ipron.s2HAState[0] == "NULL" && ipron.s1HAState[1] == "EMPTY" && ipron.s2HAState[1] == "ACTIVE") {
            return true;
        }

        if(ipron.s1HAState[0] == "NULL" && ipron.s2HAState[0] == "ACTIVE" && ipron.s1HAState[1] == "ACTIVE" && ipron.s2HAState[1] == "EMPTY") {
            return true;
        }

        if(ipron.s1HAState[0] != "ACTIVE" || ipron.s2HAState[0] != "ACTIVE") {
            return false;
        }

        var haTime = ipron.HaTimeout;

        if(bChkFirstCon) {
            if(ipron.s1HAState[0] != "NULL" && ipron.s1HAState[1] == "NULL" && ipron.s1HAState[2] == "NULL" && 
                ipron.s2HAState[0] != "NULL" && ipron.s2HAState[1] == "NULL" && ipron.s2HAState[2] == "NULL"
            ) {
                return true;
            }

            if(ipron.s1HAState[1] == "EMPTY" || ipron.s2HAState[1] == "EMPTY") {
                return true;
            }

            haTime = new Date();
        }

        if(new Date() - ipron.s1HATime[0] < new Date() - ipron.s2HATime[0]) {
            if(new Date() - ipron.s1HATime[0] > haTime) {
                return true;
            }
        } else {
            if(new Date() - ipron.s2HATime[0] > haTime) {
                return true;
            }
        }

        return false;
    }

    ipron.isDoubleActive = function() {
        if(ipron.s1HAState[0] == "ACTIVE" && ipron.s1HAState[1] == "NULL" && ipron.s1HAState[2] == "ACTIVE") {
            return true;
        }

        if(ipron.s2HAState[0] == "ACTIVE" && ipron.s2HAState[1] == "NULL" && ipron.s2HAState[2] == "ACTIVE") {
            return true;
        }

        return false;
    }

    // WebSocket 1과 2에 메시지 모두 보내기
    ipron.sendMessageToBoth = function(message) {
        var jsonData = JSON.stringify(message);
        //console.log("WebSocket 메시지 발신: ", jsonData);
        ipron.sendMessageToSocket1(jsonData);
        ipron.sendMessageToSocket2(jsonData);
    }

    // WebSocket 연결 종료
    ipron.closeSockets = function() {
        //console.log("closeSockets End");
        ipron.isEnd = true;
        ipron.isWork = false;
        ipron.appId = 0;
        ipron.SocketID = "0";

        //console.log("stopWorker Start");
        ipron.stopWorker();
        //console.log("stopWorker End");

        if (ipron.socket1) ipron.socket1.close();
        if (ipron.socket2) ipron.socket2.close();
    }

    ipron.sendSocketID = function(one, message) {
        ipron.HBTime = message.HBTIME_PERIOD * 1000;
        ipron.HaTimeout = message.HATIMEOUT;
        ipron.updateHaState(one, message.HASTATE);

        if(message.DI_ADDR1 != undefined && message.DI_ADDR1 != "") {
            ipron.diIplist.push(message.DI_ADDR1);
        }

        if(message.DI_ADDR2 != undefined && message.DI_ADDR2 != "") {
            ipron.diIplist.push(message.DI_ADDR2);
        }

        if(message.DI_ADDR3 != undefined && message.DI_ADDR3 != "") {
            ipron.diIplist.push(message.DI_ADDR3);
        }

        if(message.DI_ADDR4 != undefined && message.DI_ADDR4 != "") {
            ipron.diIplist.push(message.DI_ADDR4);
        }

        ipron.RandDIServer();

        ipron.gwaddr1 = message.GW_ASIDE
        ipron.gwaddr2 = message.GW_BSIDE

        if(ipron.SocketID == '0') {
            ipron.SocketID = message.SOCKET_ID;
        }

        if(message.HASTATE == "ACTIVE") {
            message.METHOD = ipron.APIMethod.OPENSERVER;
            ipron.sendMessageToBoth(message);

            ipron.startWorker();
        }

        if(ipron.appId != 0) {
            var req = {};
            req.APPID = ipron.appId;
            req.METHOD = ipron.APIMethod.SEND_SOCKETID;
            req.SOCKET_ID = ipron.SocketID;
            ipron.sendMessageToBoth(req);
        }
    }

    ipron.openserverRes = function(message) {
        ipron.appId = message.APPID;

        if(ipron.SocketID != "0") {
            var req = {};
            req.METHOD = ipron.APIMethod.SEND_SOCKETID;
            req.SOCKET_ID = ipron.SocketID;
            req.APPID = ipron.appId;
            ipron.sendMessageToBoth(req);
        }
    }

    // Advance List
    //var listOptionCnt = 11;
    var arrAdList = {};
    var adListIndex = 0; // 1 ~ 512
    function AdLstCreateList() {
        adListIndex++;
        if (adListIndex > 512) {
            adListIndex = 1;
        }
        arrAdList[adListIndex] = {};
        return adListIndex;
    }

    function AdLstAddRow(handle, id, dn, loginId, name, state, stateSub, stateKeepTime, inOut, skillLevel, skillId, skillEnable) {
        var adList = arrAdList[handle];
        if (adList == undefined) {
            adList = {};
        }

        var rowArr = new Array(id, dn, loginId, name, state, stateSub, stateKeepTime, inOut, skillLevel, skillId, skillEnable);

        var cnt = AdLstGetCount(handle);
        if (cnt != undefined) {
            adList[cnt] = rowArr;
        }
    }

    function AdLstAddRowArray(handle, arr) {
        var adList = arrAdList[handle];
        if (adList == undefined) {
            adList = {};
        }

        var cnt = AdLstGetCount(handle);
        if (cnt != undefined) {
            adList[cnt] = arr;
        }
    }

    function AdLstGetRow(handle, row) {
        var adList = arrAdList[handle];
        return adList[row];
    }

    function AdLstGetCount(handle) {
        if (handle == undefined || handle == 0)
            return;

        var rowArr = arrAdList[handle];
        if (Object.keys) {
            return Object.keys(rowArr).length;
        }
        else {
            var cnt = 0;
            for (var i in rowArr) {
                cnt++;
            }
            return cnt;
        }
    }

    ipron.GetListItem = function (listId, listIndex, listOption) {
        var adList = arrAdList[listId];
        var rowArr = adList[listIndex];
        return rowArr[listOption];
    }

    ipron.GetListItemFilter = function (listId, listOption, listFilter) {
        if (!((typeof listFilter == "string") && (listFilter.length > 0))) {
            return;
        }

        var filterHandle = 0;
        var filterLen = listFilter.length;
        var firstString = listFilter[0];
        var lastString = listFilter[filterLen - 1];
        var existData = false;

        if (firstString == "%" && lastString != "%") {
            var filterStr = listFilter.substring(1, filterLen);
            for (var i = 0; i < AdLstGetCount(listId); i++) {
                var listItem = ipron.GetListItem(listId, i, listOption);
                if (listItem.lastIndexOf(filterStr) >= 0) {
                    if (listItem.lastIndexOf(filterStr) + filterStr.length == listItem.length) {
                        if (existData == false) {
                            filterHandle = AdLstCreateList();
                            existData = true;
                        }
                        var rowArr = AdLstGetRow(listId, i);
                        AdLstAddRowArray(filterHandle, rowArr);
                    }
                }
            }
        }
        else if (firstString != "%" && lastString == "%") {
            var filterStr = listFilter.substring(0, filterLen - 1);
            for (var i = 0; i < AdLstGetCount(listId); i++) {
                var listItem = ipron.GetListItem(listId, i, listOption);
                if (listItem.indexOf(filterStr) == 0) {
                    if (existData == false) {
                        filterHandle = AdLstCreateList();
                        existData = true;
                    }
                    var rowArr = AdLstGetRow(listId, i);
                    AdLstAddRowArray(filterHandle, rowArr);
                }
            }
        }
        else if (firstString == "%" && lastString == "%") {
            var filterStr = listFilter.substring(1, filterLen - 1);
            for (var i = 0; i < AdLstGetCount(listId); i++) {
                var listItem = ipron.GetListItem(listId, i, listOption);
                if (listItem.indexOf(filterStr) != -1) {
                    if (existData == false) {
                        filterHandle = AdLstCreateList();
                        existData = true;
                    }
                    var rowArr = AdLstGetRow(listId, i);
                    AdLstAddRowArray(filterHandle, rowArr);
                }
            }
        }
        else if (firstString != "%" && lastString != "%") {
            var filterStr = listFilter;
            for (var i = 0; i < AdLstGetCount(listId); i++) {
                var listItem = ipron.GetListItem(listId, i, listOption);
                if (listItem == filterStr) {
                    if (existData == false) {
                        filterHandle = AdLstCreateList();
                        existData = true;
                    }
                    var rowArr = AdLstGetRow(listId, i);
                    AdLstAddRowArray(filterHandle, rowArr);
                }
            }
        }

        return filterHandle;
    }

    ipron.GetListItemCnt = function (listId) {
        return AdLstGetCount(listId);
    }

    const parseExtension = function(data) {
        const parts = data.split(String.fromCharCode(29)); // 데이터 분할 (\u001d)
        const jsonData = {};

        for (let i = 0; i < parts.length; i += 2) {
            const keyPart = parts[i];
            const valuePart = parts[i + 1] || ""; // 다음 요소가 없으면 빈 문자열로 처리

            if (keyPart.startsWith("<") && keyPart.includes(">")) {
                const key = keyPart.substring(1, keyPart.indexOf(">")); // "<"와 ">" 사이의 문자열을 키로 사용
                jsonData[key] = valuePart; // key와 value를 저장
                //console.log(`Key: ${key}, Value: ${valuePart}`);
            }
        }

        //console.log('Final Parsed Data:', jsonData);
        return jsonData;
    }

    ipron.GetDIAgentReport = function(destagentid, tenantname, mediaset) {
        if (ipron.isWork) {
            var url = ipron.diprotocol + '://' + ipron.diIp + ':' + ipron.diPort + diBaseURL + ipron.DiReqType.ICAPI + '/' + ipron.DiRequest.AgentReport;
            var data = { 'MEDIA_SET': String(mediaset), 'TENANT_NAME': tenantname, 'AGENT_ID': destagentid };
            ipron.SendDiRequest(ipron.APIResponse.DI_AGENT_REPORT_RES, url, data, 0);
        }

    }

    ipron.GetNodeAgentState = function (tenantname, destagentid, mediaset) {
        if (ipron.isWork) {
            var url = ipron.diprotocol + '://' + ipron.diIp + ':' + ipron.diPort + diBaseURL + ipron.DiReqType.AGENTSTATE;
            var data = { 'mediatype': mediaset, 'tntname': tenantname, 'loginid': destagentid };
            ipron.SendDiRequest(ipron.APIResponse.GET_NODEAGENT_STATE_RES, url, data, 0);
        }
    }

    ipron.GetNodeAgentList = function (agentstate, tenantname, groupidset, skillidset, mediatype, page) {
        if (ipron.isWork) {
            var url = ipron.diprotocol + '://' + ipron.diIp + ':' + ipron.diPort + diBaseURL + ipron.DiReqType.List + '/' + ipron.DiRequest.Agent;

            var filter = { 'mediatype': String(mediatype), 'tenantname': tenantname };

            if (groupidset.length > 0) {
                groupidset = groupidset.replace(/-/gi, ',');
                filter['groupid'] = groupidset;
            }

            if (skillidset.length > 0) {
                skillidset = skillidset.replace(/-/gi, ',');
                filter['skillid'] = skillidset;
            }

            if (mediatype == 0) {
                filter['state_voip'] = String(agentstate);
            } else if (mediatype == 10) {
                filter['state_chat'] = String(agentstate);
            } else if (mediatype == 20) {
                filter['state_vvoice'] = String(agentstate);
            } else if (mediatype == 30) {
                filter['state_vchat'] = String(agentstate);
            } else if (mediatype == 40) {
                filter['state_email'] = String(agentstate);
            } else if (mediatype == 50) {
                filter['state_fax'] = String(agentstate);
            } else if (mediatype == 61) {
                filter['state_mvoip'] = String(agentstate);
            } else if (mediatype == 80) {
                filter['state_web'] = String(agentstate);
            }

            var data = { 'filter': filter, 'page': page };

            ipron.SendDiRequest(ipron.APIResponse.GET_NODEAGENT_LIST_RES, url, data, 0);
        }
    }

    ipron.diIplist = new Array();
    ipron.diIp = "";
    ipron.diPort = 9020;
    ipron.diServerIdx = 0;
    ipron.diTimeout = 300;

    ipron.RandDIServer = function () {
        if (ipron.diIplist.length == 4) {
            if (ipron.diServerIdx == 0) {
                ipron.diServerIdx = 2;
            } else if (ipron.diServerIdx == 1) {
                ipron.diServerIdx = 3;
            } else if (ipron.diServerIdx == 2) {
                ipron.diServerIdx = 1;
            } else {
                ipron.diServerIdx = 0;
            }
        } else if (ipron.diIplist.length == 3) {
            if (ipron.diServerIdx == 0) {
                ipron.diServerIdx = 2;
            } else if (ipron.diServerIdx == 1) {
                ipron.diServerIdx = 2;
            } else {
                ipron.diServerIdx = 0;
            }
        } else if (ipron.diIplist.length == 2) {
            if (ipron.diServerIdx == 0) {
                ipron.diServerIdx = 1;
            } else {
                ipron.diServerIdx = 0;
            }
        } else {
            ipron.diServerIdx = 0;
        }

        ipron.diIp = ipron.diIplist[ipron.diServerIdx];
    }

    ipron.SetDiTimeout = function (timeoutms) {
        ipron.diTimeout = timeoutms;
    }

    ipron.SetDiPort = function (port) {
        ipron.diPort = port;
    }

    ipron.SetDiProtocol = function(protocol) {
        ipron.diprotocol = protocol
    }

    ipron.SendDiRequest = function (method, url, body, failcnt) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true); // 비동기 요청
        xhr.timeout = ipron.diTimeout;
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8'); // 요청 헤더 설정

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) { // 요청 완료 상태
                if (xhr.status >= 200 && xhr.status < 300) {
                    var data = JSON.parse(xhr.responseText);
                    // 성공 처리
                    var cbResult = {};
                    cbResult.METHOD = method;
                    cbResult.MESSAGE_TYPE = ipron.MsgType.ICResponse;
                    cbResult.RESULT = 0;

                    if (method == ipron.APIResponse.GET_NODEAGENT_STATE_RES) {
                        cbResult.DEST_AGENT_ID = body.loginid;
                        cbResult.TENANT_NAME = body.tntname;
                        cbResult.MEDIA_SET = body.mediatype;

                        if (data.count != 0) {
                            for (var i = 8; i < data.fields.length; i++) {
                                var value = data.datas[0][i];

                                if (value == 4294967295) {
                                    value = -1;
                                }

                                if (data.fields[i] == ipron.DIField.STATE_VOIP) {
                                    cbResult.VOIP_AGENT_STATE = value;
                                } else if (data.fields[i] == ipron.DIField.STATE_VOIP_SUB) {
                                    cbResult.VOIP_AGENT_STATE_SUB = value;
                                } else if (data.fields[i] == ipron.DIField.STATE_CHAT) {
                                    cbResult.CHAT_AGENT_STATE = value;
                                } else if (data.fields[i] == ipron.DIField.STATE_CHAT_SUB) {
                                    cbResult.CHAT_AGENT_STATE_SUB = value;
                                } else if (data.fields[i] == ipron.DIField.STATE_VVOICE) {
                                    cbResult.VVOICE_AGENT_STATE = value;
                                } else if (data.fields[i] == ipron.DIField.STATE_VVOICE_SUB) {
                                    cbResult.VVOICE_AGENT_STATE_SUB = value;
                                } else if (data.fields[i] == ipron.DIField.STATE_VCHAT) {
                                    cbResult.VCHAT_AGENT_STATE = value;
                                } else if (data.fields[i] == ipron.DIField.STATE_VCHAT_SUB) {
                                    cbResult.VCHAT_AGENT_STATE_SUB = value;
                                } else if (data.fields[i] == ipron.DIField.STATE_EMAIL) {
                                    cbResult.EMAIL_AGENT_STATE = value;
                                } else if (data.fields[i] == ipron.DIField.STATE_EMAIL_SUB) {
                                    cbResult.EMAIL_AGENT_STATE_SUB = value;
                                } else if (data.fields[i] == ipron.DIField.STATE_FAX) {
                                    cbResult.FAX_AGENT_STATE = value;
                                } else if (data.fields[i] == ipron.DIField.STATE_FAX_SUB) {
                                    cbResult.FAX_AGENT_STATE_SUB = value;
                                } else if (data.fields[i] == ipron.DIField.STATE_MVOIP) {
                                    cbResult.MVOIP_AGENT_STATE = value;
                                } else if (data.fields[i] == ipron.DIField.STATE_MVOIP_SUB) {
                                    cbResult.MVOIP_AGENT_STATE_SUB = value;
                                } else if (data.fields[i] == ipron.DIField.STATE_WEB) {
                                    cbResult.WEB_AGENT_STATE = value;
                                } else if (data.fields[i] == ipron.DIField.STATE_WEB_SUB) {
                                    cbResult.WEB_AGENT_STATE_SUB = value;
                                }
                            }
                        }
                    }

                    if (method == ipron.APIResponse.DI_AGENT_REPORT_RES) {

                        var handle = ipron.EXTCreateExtension();

                        cbResult.DEST_AGENT_ID = body.AGENT_ID;
                        cbResult.TENANT_NAME = body.TENANT_NAME;
                        cbResult.MEDIA_SET = body.MEDIA_SET;

                        if (data.EXTENSION_DATA) {
                            const extensionData = parseExtension(data.EXTENSION_DATA);
                            for (let key in extensionData) {
                                ipron.EXTAddRecord(handle, key, extensionData[key]);
                            }
                            cbResult.EXTENSION_HANDLE = handle;
                        }

                        if (data) {
                            for (let key in data) {
                                let value = data[key];

                                if (key === ipron.DIField.IN_TOTAL) {
                                    cbResult.IN_TOTAL = value;
                                } else if (key === ipron.DIField.IN_SUCCESS) {
                                    cbResult.IN_SUCCESS = value;
                                } else if (key === ipron.DIField.IN_INT_SUC) {
                                    cbResult.IN_INT_SUC = value;
                                } else if (key === ipron.DIField.IN_EXT_SUC) {
                                    cbResult.IN_EXT_SUC = value;
                                } else if (key === ipron.DIField.IN_CON_SUC) {
                                    cbResult.IN_CON_SUC = value;
                                } else if (key === ipron.DIField.IN_TALK_TIME) {
                                    cbResult.IN_TALK_TIME = value;
                                } else if (key === ipron.DIField.OUT_TOTAL) {
                                    cbResult.OUT_TOTAL = value;
                                } else if (key === ipron.DIField.OUT_SUCCESS) {
                                    cbResult.OUT_SUCCESS = value;
                                } else if (key === ipron.DIField.OUT_EXT_SUC) {
                                    cbResult.OUT_EXT_SUC = value;
                                } else if (key === ipron.DIField.OUT_INT_SUC) {
                                    cbResult.OUT_INT_SUC = value;
                                } else if (key === ipron.DIField.OUT_CON_SUC) {
                                    cbResult.OUT_CON_SUC = value;
                                } else if (key === ipron.DIField.OUT_TALK_TIME) {
                                    cbResult.OUT_TALK_TIME = value;
                                } else if (key === ipron.DIField.TRNS_IN_TALK_TIME) {
                                    cbResult.TRNS_IN_TALK_TIME = value;
                                } else if (key === ipron.DIField.TRNS_IN_SUCCESS) {
                                    cbResult.TRNS_IN_SUCCESS = value;
                                } else if (key === ipron.DIField.RINGING_TIME) {
                                    cbResult.RINGING_TIME = value;
                                } else if (key === ipron.DIField.ACW_TIME) {
                                    cbResult.ACW_TIME = value;
                                } else if (key === ipron.DIField.ACW_COUNT) {
                                    cbResult.ACW_COUNT = value;
                                } else if (key === ipron.DIField.DIALING_TIME) {
                                    cbResult.DIALING_TIME = value;
                                } else if (key === ipron.DIField.READY_TIME) {
                                    cbResult.READY_TIME = value;
                                } else if (key === ipron.DIField.READY_COUNT) {
                                    cbResult.READY_COUNT = value;
                                } else if (key === ipron.DIField.NOTREADY_TIME) {
                                    cbResult.NOTREADY_TIME = value;
                                } else if (key === ipron.DIField.NOTREADY_COUNT) {
                                    cbResult.NOTREADY_COUNT = value;
                                } else if (key === ipron.DIField.TRANSFER_CALLS) {
                                    cbResult.TRANSFER_CALLS = value;
                                } else if (key === ipron.DIField.LOGIN_TIME) {
                                    cbResult.LOGIN_TIME = value;
                                } else if (key === ipron.DIField.LOGOUT_TIME) {
                                    cbResult.LOGOUT_TIME = value;
                                } else if (key === ipron.DIField.IN_DIT_TRY) {
                                    cbResult.IN_DIT_TRY = value;
                                } else if (key === ipron.DIField.IN_DIT_SUC) {
                                    cbResult.IN_DIT_SUC = value;
                                } else if (key === ipron.DIField.DIT_TALK_TIME) {
                                    cbResult.DIT_TALK_TIME = value;
                                } 
                            }
                        }
                    }

                    if (method == ipron.APIResponse.GET_NODEAGENT_LIST_RES) {
                        var handle = ipron.EXTCreateExtension();

                        cbResult.GROUP_ID_SET = String(body.filter.groupid).replace(/,/gi, '-');
                        cbResult.SKILL_ID_SET = String(body.filter.skillid).replace(/,/gi, '-');
                        cbResult.TENANT_NAME = body.filter.tenantname;
                        //cbResult.agentstate = body.filter.;
                        cbResult.MEDIA_TYPE = body.filter.mediatype;

                        cbResult.EXTENSION_HANDLE = handle;
                        ipron.EXTAddRecord(handle, "pagecount", String(data.pagecount));
                        ipron.EXTAddRecord(handle, "count", String(data.count));
                        ipron.EXTAddRecord(handle, "totalitemcount", String(data.totalitemcount));

                        arritem = data.datas;

                        if (arritem != null) {
                            for (var i = 0; i < arritem.length; i++) {
                                itemkey = arritem[i][0].AgentId;
                                for (var j = 1; j < arritem[i].length; j++) {
                                    ipron.EXTAddRecord(handle, itemkey, arritem[i][j]);
                                }
                            }
                        }
                    }

                    ipron.resCB(cbResult);
                }
            }
        };

        xhr.onerror = function() {
            //console.log('Request failed');
            ipron.RetryDiRequest(method, url, body, failcnt + 1);
        };

        // 요청 타임아웃 발생 시 처리
        xhr.ontimeout = function() {
            //console.error('Request timed out');
            ipron.RetryDiRequest(method, url, body, failcnt + 1);
        };

        // 요청 전송
        xhr.send(JSON.stringify(body));
    }

    ipron.RetryDiRequest = function (method, url, body, failcnt) {
        if (ipron.diIplist.length == failcnt) {
            var cbResult = {};
            cbResult.METHOD = method;
            cbResult.MESSAGE_TYPE = ipron.MsgType.ICResponse;
            cbResult.RESULT = 'false';
            ipron.resCB(cbResult);
            return;
        }

        prevIp = ipron.diIp;
        ipron.RandDIServer();
        url = url.replace(prevIp, ipron.diIp);
        ipron.SendDiRequest(method, url, body, failcnt);
    }

    // Will Add FC Functions    
    ipron.FCVirtualCall = function (ucid, destQueuedn, ani, extension, privateData, nTimeout, priority) {
        if (ipron.isWork) {
            var data = { 'ani': ani, 'queue': destQueuedn, 'ucid': ucid, 'timeout':nTimeout, 'priority': priority, 'PRIVATE_DATA': privateData, 'uei': ipron.GetExtensionData(extension) };

            ipron.SendFCRequest('POST', ipron.APIResponse.FCVIRTUALCALL_RES, ipron.gwaddr1 + '/api/v1/welcome/v-waiting', data, 0);
        }
	}
	
	ipron.FCVirtualCallInfo = function (ani, privateData) {
        if (ipron.isWork) {
            var data = { 'PRIVATE_DATA': privateData };

            ipron.SendFCRequest('GET', ipron.APIResponse.FCVIRTUALCALLINFO_RES, ipron.gwaddr1 + '/api/v1/welcome/v-waiting/' + ani, data, 0);
        }
	}
	
	ipron.FCCallback = function (ani, privateData, reserve, reserveTime, destQueueDn, extension, ucid, priority) {
        if (ipron.isWork) {
            var data = { 'ani': ani, 'queue': destQueueDn, 'ucid': ucid, 'priority': priority, 'PRIVATE_DATA': privateData, 
                'uei': ipron.GetExtensionData(extension) , 'reserved': reserve, 'reservedTime': reserveTime };

            ipron.SendFCRequest('POST', ipron.APIResponse.FCCALLBACK_RES, ipron.gwaddr1 + '/api/v1/welcome/v-callback', data, 0);
        }
	}
	
	ipron.FCCallbackList = function () {
		if (ipron.isWork) {
            var data = '';
            ipron.SendFCRequest('GET', ipron.APIResponse.FCCALLBACKLIST_RES, ipron.gwaddr1 + '/api/v1/welcome/v-callback', data, 0);
        }
	}
	
	ipron.FCCallbackEnd = function(ucid, result, reserve, reserveTime, privateData) {
		if (ipron.isWork) {
            var data = { 'reason': result, 'ucid': ucid, 'PRIVATE_DATA': privateData , 'reserved': reserve, 'reservedTime': reserveTime };

            ipron.SendFCRequest('POST', ipron.APIResponse.FCCALLBACKEND_RES, ipron.gwaddr1 + '/api/v1/welcome/v-callback/confirm', data, 0);
        }
	}
	
	ipron.FCCallbackClearCall = function (ucid, privateData) {
		if (ipron.isWork) {
            var data = { 'PRIVATE_DATA': privateData };

            ipron.SendFCRequest('GET', ipron.APIResponse.FCCALLBACK_CLEARCALL_RES, ipron.gwaddr1 + '/api/v1/welcome/v-waiting/' + ucid, data, 0);
        }
	}
	
	ipron.FCVirtualClearCall = function (ani, privateData) {
		if (ipron.isWork) {
            var data = { 'PRIVATE_DATA': privateData };

            ipron.SendFCRequest('GET', ipron.APIResponse.FCVIRTUAL_CLEARCALL_RES, ipron.gwaddr1 + '/api/v1/welcome/v-waiting/' + ani, data, 0);
        }
	}

    ipron.SendFCRequest = function (action, method, url, body, failcnt) {
        var xhr = new XMLHttpRequest();
        xhr.open(action, url, true); // 비동기 요청
        xhr.timeout = 1000;
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8'); // 요청 헤더 설정

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) { // 요청 완료 상태
                if (xhr.status >= 200 && xhr.status < 300) {
                    var data = JSON.parse(xhr.responseText);
                    // 성공 처리
                    var cbResult = {};
                    cbResult.METHOD = method;
                    cbResult.MESSAGE_TYPE = ipron.MsgType.ICResponse;
                    cbResult.RESULT = data.reasonCode;
                    cbResult.UCID = data.UCID;
                    cbResult.PRIVATE_DATA = body.PRIVATE_DATA;

                    if(data.data.length > 0) {
                        if(method == ipron.APIResponse.FCVIRTUALCALLINFO_RES) {
                            var handle = ipron.EXTCreateExtension();

                            ipron.EXTAddRecord(handle, "ucid", String(data.data.ucid));
                            ipron.EXTAddRecord(handle, "ani", String(data.data.ani));
                            ipron.EXTAddRecord(handle, "lastQueueDn", String(data.data.lastQueueDn));
                            ipron.EXTAddRecord(handle, "createTime", String(data.data.createTime));
                            ipron.EXTAddRecord(handle, "hop", String(data.data.hop));
                            ipron.EXTAddRecord(handle, "lastNodeId", String(data.data.lastNodeId));
                            ipron.EXTAddRecord(handle, "state", String(data.data.state));
                            ipron.EXTAddRecord(handle, "id", String(data.data.id));
                            ipron.EXTAddRecord(handle, "priority", String(data.data.priority));
                            ipron.EXTAddRecord(handle, "waitCount", String(data.data.waitCount));

                            cbResult.EXTENSION_HANDLE = handle;
                        } else if (method == ipron.APIResponse.FCCALLBACKLIST_RES) {
                            var handle = ipron.EXTCreateExtension();

                            for (var i = 0; i < data.data.length; i++) {
                                var arr = data.data[i];
                                var key = arr.UCID;

                                ipron.EXTAddRecord(handle, key, String(arr.RequestTime));
                                ipron.EXTAddRecord(handle, key, String(arr.FirstInQTime));
                                ipron.EXTAddRecord(handle, key, String(arr.FirstInQDn));
                                ipron.EXTAddRecord(handle, key, String(arr.ConnectTime));
                                ipron.EXTAddRecord(handle, key, String(arr.EndWorkTime));
                                ipron.EXTAddRecord(handle, key, String(arr.ResultTime));
                                ipron.EXTAddRecord(handle, key, String(arr.CallId));
                                ipron.EXTAddRecord(handle, key, String(arr.TenantId));
                                ipron.EXTAddRecord(handle, key, String(arr.FirstInQId));
                                ipron.EXTAddRecord(handle, key, String(arr.FirstInQNodeId));
                                ipron.EXTAddRecord(handle, key, String(arr.TargetAgentId));
                                ipron.EXTAddRecord(handle, key, String(arr.Reserved));
                                ipron.EXTAddRecord(handle, key, String(arr.State));
                                ipron.EXTAddRecord(handle, key, String(arr.Result));
                                ipron.EXTAddRecord(handle, key, String(arr.Priority));
                            }

                            cbResult.EXTENSION_HANDLE = handle;
                        }
                    }

                    ipron.resCB(cbResult);
                }
            }
        };

        xhr.onerror = function() {
            //console.log('Request failed');
            ipron.RetryFCRequest(action, method, url, body, failcnt + 1);
        };

        // 요청 타임아웃 발생 시 처리
        xhr.ontimeout = function() {
            //console.error('Request timed out');
            ipron.RetryFCRequest(action, method, url, body, failcnt + 1);
        };

        // 요청 전송
        xhr.send(JSON.stringify(body));
    }

    ipron.RetryFCRequest = function (action, method, url, body, failcnt) {
        if (2 < failcnt) {
            return;
        }

        if (2 == failcnt) {
            var cbResult = {};
            cbResult.METHOD = method;
            cbResult.MESSAGE_TYPE = ipron.MsgType.ICResponse;
            cbResult.RESULT = 'false';
            cbResult.PRIVATE_DATA = body.PRIVATE_DATA;
            ipron.resCB(cbResult);
            return;
        }

        url = url.replace(ipron.gwaddr1, ipron.gwaddr2);
        ipron.SendFCRequest(action, method, url, body, failcnt);
    }
})((this.ipron = {}), this);