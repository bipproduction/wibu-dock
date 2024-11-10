import Peer from "peerjs";

export function initStream({ phone }: { phone: string }) {
  const peerId = `wibu${phone}-xxxxx-xxxxx`;
  const host = "wibu-stream-server.wibudev.com";
  const port = 443;
  const secure = true;
  const path = "/wibu-stream";
  const newPeer = new Peer(peerId, {
    host,
    port,
    secure,
    path
  });
  return newPeer;
}
