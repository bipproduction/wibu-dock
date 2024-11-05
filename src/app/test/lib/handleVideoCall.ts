import Peer from "peerjs";
import { MutableRefObject } from "react";

export async function handleVideoCall({
  peerConnection,
  remotePeerId,
  localVideoRef,
  remoteVideoRef,
  onLocalStream,
  onRemoteStream
}: {
  peerConnection: Peer;
  remotePeerId: string;
  localVideoRef: MutableRefObject<HTMLVideoElement | null>;
  remoteVideoRef: MutableRefObject<HTMLVideoElement | null>;
  onLocalStream?: (stream: MediaStream) => void;
  onRemoteStream?: (stream: MediaStream) => void;
}) {
  if (!peerConnection) {
    console.error("Peer connection not found");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    // Handle local stream setup
    if (onLocalStream) onLocalStream(stream);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.style.display = "block";
      localVideoRef.current
        .play()
        .catch((err) =>
          err.name !== "AbortError"
            ? console.error("Error playing local video:", err)
            : null
        );
    }

    // Initiate the call with the remote peer
    const call = peerConnection.call(remotePeerId, stream);
    if (!call) {
      console.error("Failed to initiate call");
      return;
    }

    // Handle the remote stream
    call.on("stream", (remoteStream) => {
      if (onRemoteStream) onRemoteStream(remoteStream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current
          .play()
          .catch((err) =>
            err.name !== "AbortError"
              ? console.error("Error playing remote video:", err)
              : null
          );
      }
    });

    // Handle call errors
    call.on("error", (err) => {
      console.error("Error during the call:", err);
    });
  } catch (err) {
    console.error("Failed to get local stream", err);
  }
}
