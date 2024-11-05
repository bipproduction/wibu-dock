import { MediaConnection } from "peerjs";

export const handleEndCall = async ({
  incomingCall,
  localVideoRef,
  remoteVideoRef,
  streamInstance,
  setStreamInstance,
  setIncomingCall
}: {
  incomingCall: MediaConnection | null;
  localVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  streamInstance: MediaStream | null;
  setStreamInstance: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  setIncomingCall: React.Dispatch<React.SetStateAction<MediaConnection | null>>;
}) => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (incomingCall) {
    incomingCall.close();
    setIncomingCall(null);
  }

  if (streamInstance) {
    // Hentikan semua track di stream
    streamInstance.getTracks().forEach((track) => {
      track.stop(); // Stop each track
    });
    setStreamInstance(null);
  }

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

  // Log tambahan untuk memverifikasi pemanggilan endCall
  console.log("endCall called, stream and video resources cleaned up");
};
