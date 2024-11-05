import {
  Button,
  Card,
  Container,
  Group,
  Stack,
  Text,
  Title
} from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { MediaConnection } from "peerjs";
import { Dispatch, SetStateAction, useRef, useState } from "react";

export function IncomMingMediaConnection({
  inComingMediaConnection,
  setInComingMediaConnection
}: {
  inComingMediaConnection: MediaConnection | null;
  setInComingMediaConnection: Dispatch<SetStateAction<MediaConnection | null>>;
}) {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  // const [localMediaStream, setLocalMediaStream] = useState<MediaStream | null>(
  //   null
  // );
  const [remoteMediaStream, setRemoteMediaStream] =
    useState<MediaStream | null>(null);
  const [mediaConnection, setMediaConnection] =
    useState<MediaConnection | null>(inComingMediaConnection);
  let playTimeout: NodeJS.Timeout | null = null;

  useShallowEffect(() => {
    if (inComingMediaConnection) {
      setMediaConnection(inComingMediaConnection);
      startStream();
    }
  }, [inComingMediaConnection, mediaConnection]);

  function startStream() {
    if (!mediaConnection) return;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((localStream) => {
        if (localVideoRef.current) {
          // setLocalMediaStream(localStream);
          localVideoRef.current.srcObject = localStream;
          localVideoRef.current.style.display = "block";
          localVideoRef.current.play().catch((err) => {
            if (err.name !== "AbortError") {
              console.error("Error playing local video:", err);
            }
          });
        }

        // Answer the call with the local stream
        mediaConnection.answer(localStream);
        // Handle the remote stream
        mediaConnection.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) {
            setRemoteMediaStream(remoteStream);
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.style.display = "block";
            if (playTimeout) clearTimeout(playTimeout);
            playTimeout = setTimeout(() => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.play().catch((err) => {
                  if (err.name !== "AbortError") {
                    console.error("Error playing remote video:", err);
                  }
                });
              }
            }, 100);
          }
        });

        mediaConnection.on("close", () => {
          console.log("Media connection closed");
          localStream?.getTracks().forEach((track) => track.stop());
          remoteMediaStream?.getTracks().forEach((track) => track.stop());
          setInComingMediaConnection(null);
        });
      })
      .catch((err) => console.error("Failed to get local stream", err));
  }

  function handleClose() {
    inComingMediaConnection?.close();
  }

  return (
    <Stack p={"md"}>
      <Card>
        <Stack>
          <Title order={2}>Video Stream</Title>
          <Text>{inComingMediaConnection?.peer.split("-")[0]}</Text>
          <Group>
            <Button variant="subtle" size="compact-xs" onClick={handleClose}>
              Close
            </Button>
          </Group>
          <Container>
            <Card>
              <Stack pos={"relative"}>
                <video
                  ref={remoteVideoRef}
                  // controls
                  autoPlay
                  style={{ width: "100%", height: "100%" }}
                />
                <video
                  ref={localVideoRef}
                  // controls
                  autoPlay
                  style={{
                    width: "30%",
                    position: "absolute",
                    bottom: "10px",
                    right: "10px"
                  }}
                />
              </Stack>
            </Card>
          </Container>
        </Stack>
      </Card>
    </Stack>
  );
}
