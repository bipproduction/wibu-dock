'use client'
import { useShallowEffect } from "@mantine/hooks";

export function PermissionProvider() {
  useShallowEffect(() => {
    // Fungsi untuk meminta akses kamera dan mikrofon
    const requestPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        // Setelah izin diberikan, bisa mematikan stream untuk menghemat sumber daya
        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        // Jika izin ditolak
        console.error("Izin kamera atau mikrofon ditolak", error);
      }
    };

    requestPermissions();
  }, []);
  return <></>;
}
