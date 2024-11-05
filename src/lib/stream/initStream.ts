import Peer from "peerjs";
import { v4 } from "uuid";

export function initStream({ phone }: { phone: string }) {
  const peerId = `wibu${phone}-` + v4();
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
