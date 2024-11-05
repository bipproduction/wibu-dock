import Peer from "peerjs";
let reconnectTimeout: NodeJS.Timeout | null = null;
export function reconnect(peerInstance: Peer | null) {
  if (!peerInstance) {
    console.error("Peer instance is null, cannot attempt reconnection");
    return;
  }
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
  }
  reconnectTimeout = setTimeout(() => {
    try {
      if (peerInstance.disconnected) {
        peerInstance.reconnect();
        console.log("Attempting to reconnect...");
      } else {
        console.log("Peer instance is already connected, no need to reconnect");
      }
    } catch (error) {
      console.error("Error reconnecting:", error);
    }
  }, 3000); // Attempt to reconnect after 3 seconds
}
