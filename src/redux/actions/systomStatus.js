import * as systomStatus from "constants/systomStatus";

export const unfold = (state) => ({ type: systomStatus.SIDER_UNFOLD, state });

let websocket, prevEvent;
export const newSocket = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  return (dispatch) => {
    dispatch({ type: "FETCH_TOTOS" });
    console.log(config);
    // websocket = new WebSocket(`ws://k9app.hcfdev.cn/ws/webSocketServer?userId=${user.id}`);
    websocket = user && new WebSocket(`${config.host}/ws/webSocketServer?userId=${user.id}`);
    if (websocket) {
      websocket.onopen = () => {
        // websocket.send(JSON.stringify({ msgType:"map_start"}));
        websocket.onmessage = (event) => {
          // if(event != prevEvent) {
          dispatch(reaciveMsg(event));
          //  prevEvent = event;
          //}
          // debugger;
        };
      };
    }
  };
};

export const reWebsocket = () => {
  return websocket;
};

export const reaciveMsg = (event) => {
  // debugger
  return {
    type: systomStatus.NEW_SOCKET,
    socketMsg: event && JSON.parse(event.data),
  };
};
export const socketon = (msg) => {
  websocket.send(JSON.stringify(msg));
  return {
    type: Symbol(),
  };
};

export const leaveHome = () => {
  websocket.send(JSON.stringify({ msgType: "map_end" }));
  return {
    type: Symbol(),
  };
};

export const closeSocket = () => {
  websocket.close();
  return {
    type: Symbol(),
  };
};

// WEBPACK FOOTER //
// ./src/redux/actions/systomStatus.js
