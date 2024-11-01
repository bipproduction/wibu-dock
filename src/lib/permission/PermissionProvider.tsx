"use client";
import { useEffect } from "react";

export function PermissionProvider() {
  useEffect(() => {
    // Mengecek apakah izin sudah diminta sebelumnya
    const permissionsRequested = localStorage.getItem("permissionsRequested");

    if (!permissionsRequested) {
      // Fungsi untuk meminta akses kamera dan mikrofon
      const requestPermissions = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });

          // Setelah izin diberikan, bisa mematikan stream untuk menghemat sumber daya
          stream.getTracks().forEach((track) => track.stop());

          // Menyimpan status bahwa izin sudah diminta
          localStorage.setItem("permissionsRequested", "true");
        } catch (error) {
          // Jika izin ditolak
          console.error("Izin kamera atau mikrofon ditolak", error);
        }
      };

      requestPermissions();
    }
  }, []);

  return <></>;
}
