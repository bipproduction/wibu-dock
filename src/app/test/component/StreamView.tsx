/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/PageId1.js
"use client";

import {
  Box,
  Button,
  Card,
  SimpleGrid,
  Stack,
  Text,
  Title
} from "@mantine/core";
import { DataConnection, MediaConnection, Peer } from "peerjs";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { ChatView } from "./ChatView";
import { ClientActive } from "./ClientActive";
import { useShallowEffect } from "@mantine/hooks";

export function StreamView({
  peerConnection,
  dataConnection,
  setDataConnection,
  mediaConnection,
  setMediaConnection
}: {
  peerConnection: Peer;
  dataConnection: DataConnection | null;
  setDataConnection: Dispatch<SetStateAction<DataConnection | null>>;
  mediaConnection: MediaConnection | null;
  setMediaConnection: Dispatch<SetStateAction<MediaConnection | null>>;
}) {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [localMediaStream, setLocalMediaStream] = useState<MediaStream | null>(
    null
  );
  const [remoteMediaStream, setRemoteMediaStream] =
    useState<MediaStream | null>(null);

  const [listChat, setListChat] = useState<any[]>([]);

  useShallowEffect(() => {
    if (mediaConnection) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((localStream) => {
          setLocalMediaStream(localStream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
            localVideoRef.current.style.display = "block"; // Show the local video element
            localVideoRef.current
              .play()
              .catch((err) =>
                err.name !== "AbortError"
                  ? console.error("Error playing local video:", err)
                  : null
              );
          }
          mediaConnection.answer(localStream);
          mediaConnection.on("stream", (remoteStream) => {
            setRemoteMediaStream(remoteStream);
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
        });

      mediaConnection.on("close", handleClose);
      mediaConnection.on("error", (err) => handleClose());
    }
  }, [mediaConnection]);

  function handleClose() {
    setMediaConnection(null);

    if (localMediaStream) {
      localMediaStream.getTracks().forEach((track) => track.stop());
      setLocalMediaStream(null);
    }

    if (remoteMediaStream) {
      remoteMediaStream.getTracks().forEach((track) => track.stop());
      setRemoteMediaStream(null);
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
  }

  useShallowEffect(() => {
    if (dataConnection) {
      dataConnection.on("data", (data) => {
        console.log(data);
      });
    }
  });
  return (
    <Stack p={"md"}>
      <Title order={1}>Stream View</Title>
      {dataConnection && (
        <Card>
          <Stack>
            <Card>Connect to: {dataConnection.peer}</Card>
            <ChatView
              dataConnection={dataConnection}
              setDataConnection={setDataConnection}
              listChat={listChat}
              setListChat={setListChat}
            />
          </Stack>
        </Card>
      )}
      <Text>{peerConnection.id}</Text>
      <ClientActive
        listChat={listChat}
        setListChat={setListChat}
        peerConnection={peerConnection}
      />
      <Stack display={mediaConnection ? "block" : "none"}>
        <Button onClick={() => handleClose()}>Close Stream</Button>
        <SimpleGrid cols={2}>
          <Stack>
            <Text>Local</Text>
            <video
              ref={localVideoRef}
              controls
              autoPlay
              style={{ width: "100%" }}
            />
          </Stack>
          <Stack>
            <Text>Remote</Text>
            <video
              ref={remoteVideoRef}
              controls
              autoPlay
              style={{ width: "100%" }}
            />
          </Stack>
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}
