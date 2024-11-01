/* eslint-disable @typescript-eslint/no-explicit-any */
// components/PageId1.js
"use client";
import { Button, Stack } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { MediaConnection, Peer } from "peerjs";
import { useRef, useState } from "react";

export default function PageId1() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [incomingCall, setIncomingCall] = useState<MediaConnection | null>(null);
  const [streamInstance, setStreamInstance] = useState<MediaStream | null>(null);

  useShallowEffect(() => {
    // Membuat instance Peer untuk id1
    const peer = new Peer("id1x", {
      host: "wibu-stream-server.wibudev.com",
      port: 443,
      secure: true,
      path: "/wibu/stream",
    });

    // Menangani panggilan yang masuk
    peer.on("call", (call) => {
      // Meminta akses ke kamera dan mikrofon
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStreamInstance(stream); // Simpan instance stream untuk mengakhirinya nanti
          call.answer(stream); // Menjawab panggilan dengan stream audio/video
          setIncomingCall(call); // Simpan instance call untuk mengakhirinya nanti

          // Menampilkan stream dari peer lain
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

          // Menangani akhir panggilan secara otomatis
          call.on("close", () => {
            endCall(); // Bersihkan sumber daya saat panggilan berakhir
          });
        })
        .catch((err) => {
          console.error("Failed to get local stream", err);
        });
    });

    peer.on("disconnected", endCall);
    peer.on("error", (err) => {
      console.error("PeerJS error", err);
      endCall();
    });

    return () => {
      peer.destroy();
    };
  }, []);

  const endCall = () => {
    // Menghentikan stream dan mengakhiri panggilan
    if (incomingCall) {
      incomingCall.close();
      setIncomingCall(null);
    }

    if (streamInstance) {
      streamInstance.getTracks().forEach((track) => track.stop());
      setStreamInstance(null);
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  };

  return (
    <Stack h={"100vh"} align="center" justify="center">
      <h1>Peer ID1 - Mengirim Stream</h1>
      <video ref={videoRef} controls autoPlay style={{ width: "100%", maxWidth: "600px" }} />
      {incomingCall && (
        <Button onClick={endCall} color="red">
          End Call
        </Button>
      )}
    </Stack>
  );
}
