/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Camera.js
"use client"; // Pastikan menggunakan "use client" untuk mengakses API browser

import { useEffect, useRef } from "react";

const Camera = () => {
  const videoRef = useRef<any | null>(null);

  useEffect(() => {
    // Meminta akses ke kamera
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((err: any) => {
            console.error("Error playing video:", err);
          });
        }
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });

    // Membersihkan stream saat komponen tidak digunakan lagi
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach((track: MediaStreamTrack) => {
          track.stop();
        });
      }
    };
  }, []);

  return (
    <div>
      <h1>Live Camera Feed</h1>
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }} />
    </div>
  );
};

export default Camera;
