/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { initStream } from "@/lib/stream/initStream";
import { Button, Group, Stack, Title } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import Peer, { MediaConnection } from "peerjs";
import { useRef, useState } from "react";

export default function Page() {
  const [peerInstance, setPeerInstance] = useState<Peer | null>(null);
  const [command, setCommand] = useState<Record<string, any>>({});
  const ref = useRef<HTMLVideoElement>(null);
  let localStreamInstance: MediaStream | null = null;
  let remoteStreamInstance: MediaStream | null = null;
  let mediaConnectionInstance: MediaConnection | null = null;
  let timeOut: NodeJS.Timeout | null = null;

  useShallowEffect(() => {
    const peer = initStream({ phone: "6289697338822" });
    if (peer) {
      setPeerInstance(peer);
    }

    peer.on("call", (call) => {
      const localStream = navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      localStream.then((stream) => {
        console.log("localStream.id", stream.id);
        localStreamInstance = stream;
        call.answer(stream);
        mediaConnectionInstance = call;
        call.on("stream", (remoteStream) => {
          remoteStreamInstance = remoteStream;
          console.log("remoteStream.id", remoteStream.id);
          if (ref.current) {
            ref.current.srcObject = remoteStream;
            ref.current.style.display = "block";
            timeOut = setTimeout(() => {
              ref
                .current!.play()
                .catch((err) =>
                  err.name !== "AbortError"
                    ? console.error("Error playing remote video:", err)
                    : null
                );
            }, 10);
          }
        });
        call.on("close", () => {
          console.log("Call closed");
          if (mediaConnectionInstance) {
            mediaConnectionInstance.close();
          }
          if (localStreamInstance) {
            localStreamInstance.getTracks().forEach((track) => track.stop());
          }
          if (remoteStreamInstance) {
            remoteStreamInstance.getTracks().forEach((track) => track.stop());
          }
          if (ref.current) {
            ref.current.pause();
            ref.current.srcObject = null;
            ref.current.style.display = "none"; // Hide the video element
          }
          
        })
      });
    });

    if (command) {
      if (command.type === "call-end") {
        if (mediaConnectionInstance) {
          mediaConnectionInstance.close();
        }
        if (localStreamInstance) {
          localStreamInstance.getTracks().forEach((track) => track.stop());
        }
        if (remoteStreamInstance) {
          remoteStreamInstance.getTracks().forEach((track) => track.stop());
        }
        if (ref.current) {
          ref.current.pause();
          ref.current.srcObject = null;
          ref.current.style.display = "none"; // Hide the video element
        }
      }
    }

    return () => {
      if (peerInstance) {
        peerInstance.destroy();
      }

      if (timeOut) {
        clearTimeout(timeOut);
      }
    };
  }, [command]);
  return (
    <Stack>
      {peerInstance && (
        <div>
          <div>{peerInstance.id}</div>
        </div>
      )}
      <Group>
        <Stack>
          <Title>client2</Title>
          <Button>call</Button>
          <Button onClick={() => setCommand({ type: "call-end" })}>
            en call
          </Button>
        </Stack>
      </Group>
      <video ref={ref} autoPlay style={{ display: "none" }} />
    </Stack>
  );
}
