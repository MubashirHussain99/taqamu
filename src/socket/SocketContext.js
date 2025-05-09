import { createContext, useContext } from "react";

const SocketContext = createContext({
  getSocket() {},
  socketStatus: "",
  socket: null,
  connected() {},
});

export const useSocket = () => useContext(SocketContext);
export default SocketContext;
