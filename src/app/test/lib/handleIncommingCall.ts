/* eslint-disable @typescript-eslint/no-explicit-any */
import { MediaConnection } from "peerjs";
import { MutableRefObject } from "react";

export const handleIncomingCall = ({
  call,
  localVideoRef,
  remoteVideoRef,
  onLocalStream,
  onRemoteStream,
  onCallClosed,
  onCallIceStateChange,
  onCallError
}: {
  call: MediaConnection;
  localVideoRef: MutableRefObject<HTMLVideoElement | null>;
  remoteVideoRef: MutableRefObject<HTMLVideoElement | null>;
  onLocalStream?: (stream: MediaStream) => void;
  onRemoteStream?: (stream: MediaStream) => void;
  onCallClosed?: () => void;
  onCallIceStateChange?: (state: RTCIceConnectionState) => void;
  onCallError?: (err: any) => void;
}) => {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((localStream) => {
      // Handle local stream
      if (onLocalStream) onLocalStream(localStream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
        localVideoRef.current.style.display = "block"; // Show the local video element
        localVideoRef.current.play().catch((err) => {
          if (err.name !== "AbortError") {
            console.error("Error playing local video:", err);
          }
        });
      }

      // Answer the call with the local stream
      call.answer(localStream);

      // Handle the remote stream
      call.on("stream", (remoteStream) => {
        if (onRemoteStream) onRemoteStream(remoteStream);

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.style.display = "block"; // Show the remote video element
          remoteVideoRef.current.play().catch((err) => {
            if (err.name !== "AbortError") {
              console.error("Error playing remote video:", err);
            }
          });
        }
      });

      if (onCallError) call.on("error", onCallError);
      if (onCallIceStateChange)
        call.on("iceStateChanged", onCallIceStateChange);

      // Handle call end
      call.on("close", () => {
        if (call) call.close();

        if (localVideoRef.current) {
          localVideoRef.current.pause();
          localVideoRef.current.srcObject = null;
          localVideoRef.current.style.display = "none"; // Hide the video element
        }

        if (remoteVideoRef.current) {
          remoteVideoRef.current.pause();
          remoteVideoRef.current.srcObject = null;
          remoteVideoRef.current.style.display = "none"; // Hide the video element
        }

        if (onCallClosed) onCallClosed();
      });
    })
    .catch((err) => console.error("Failed to get local stream", err));
};
