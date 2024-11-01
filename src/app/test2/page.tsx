"use client";
import { useEffect, useRef, useState } from "react";
import { Stack, Button } from "@mantine/core";
import { Peer, MediaConnection } from "peerjs";

export default function PageId2() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [peerInstance, setPeerInstance] = useState<Peer | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callInstance, setCallInstance] = useState<MediaConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Membuat instance Peer untuk id2
    const peer = new Peer("id2x", {
      host: "wibu-stream-server.wibudev.com",
      port: 443,
      secure: true,
      path: "/wibu/stream",
    });
    setPeerInstance(peer);

    peer.on("error", (err) => {
      console.error("PeerJS error:", err);
      handleEndCall(); // Mengakhiri panggilan jika ada error pada PeerJS
    });

    peer.on("disconnected", () => {
      handleEndCall(); // Mengakhiri panggilan jika koneksi peer terputus
    });

    return () => {
      peer.destroy();
    };
  }, []);

  const handleCall = () => {
    if (!peerInstance) return;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);

        const call = peerInstance.call("id1x", stream);

        if (call) {
          setCallInstance(call);

          call.on("stream", (remoteStream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = remoteStream;

              // Pastikan `play()` dipanggil setelah `srcObject` selesai diatur
              setTimeout(() => {
                videoRef.current?.play().catch((err) => {
                  if (err.name !== "AbortError") {
                    console.error("Error playing video:", err);
                  }
                });
              }, 0);
            }
          });

          setIsCalling(true);
        } else {
          console.error("Failed to initiate call");
        }
      })
      .catch((err) => {
        console.error("Failed to get local stream", err);
      });
  };

  const handleEndCall = () => {
    if (callInstance) {
      // Mengakhiri panggilan
      callInstance.close();
      setCallInstance(null);
    }

    if (localStream) {
      // Menghentikan semua track pada stream lokal untuk mematikan kamera dan mikrofon
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    if (videoRef.current) {
      // Menghentikan pemutaran video
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setIsCalling(false);
  };

  return (
    <Stack h={"100vh"} align="center" justify="center">
      <h1>Peer ID2 - Menerima Stream</h1>
      <Button onClick={handleCall} disabled={isCalling}>
        {isCalling ? "Calling..." : "Call ID1"}
      </Button>
      {isCalling && (
        <Button onClick={handleEndCall} color="red">
          End Call
        </Button>
      )}
      <video
        ref={videoRef}
        controls
        autoPlay
        style={{ width: "100%", maxWidth: "600px" }}
      />
    </Stack>
  );
}
