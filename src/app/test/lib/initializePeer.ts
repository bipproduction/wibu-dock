/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Peer, { DataConnection, MediaConnection } from "peerjs";

export const initializePeer = ({
  peerId,
  host = "wibu-stream-server.wibudev.com",
  port = 443,
  path = "/wibu-stream",
  onCall,
  onConnection,
  onOpen,
  onError
}: {
  peerId: string;
  host: string;
  port: number;
  path: string;
  onCall?: (call: MediaConnection) => void;
  onConnection?: (conn: DataConnection) => void;
  onOpen?: (id: string) => void;
  onError?: (err: any) => void;
}) => {
  // const peerId = `wibu6289697338821-${v4()}`; // Generate a unique ID for the peer
  const newPeer = new Peer(peerId, {
    host,
    port,
    secure: true,
    path
  });

  // Setup event listeners for PeerJS
  if (onCall) newPeer.on("call", onCall);
  if (onConnection) newPeer.on("connection", onConnection);
  if (onOpen) newPeer.on("open", onOpen);
  if (onError) newPeer.on("error", onError);

  let reconnectInterval: NodeJS.Timeout | null = null;
  newPeer.on("disconnected", () => {
    console.warn("Peer disconnected. Attempting to reconnect...");

    // Set up a 3-second interval to attempt reconnection
    if (!reconnectInterval) {
      reconnectInterval = setInterval(() => {
        if (newPeer.disconnected) {
          console.log("Reconnecting...");
          newPeer.reconnect();
        }
      }, 3000);
    }
  });

  const cleanup = () => {
    if (reconnectInterval) {
      clearInterval(reconnectInterval);
      reconnectInterval = null;
    }
    newPeer.destroy();
  };

  return { peerInstance: newPeer, cleanup };
};
