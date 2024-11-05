import {
  ActionIcon,
  Card,
  Container,
  Flex,
  Stack
} from "@mantine/core";
import Peer, { MediaConnection } from "peerjs";
import { useRef, useState } from "react";
import { BiVideoOff } from "react-icons/bi";
import { CiVideoOn } from "react-icons/ci";

export function VideoCallContainer({
  peerConnection,
  selectedContact
}: {
  peerConnection: Peer | null;
  selectedContact: string | null;
}) {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [localMediaStream, setLocalMediaStream] = useState<MediaStream | null>(
    null
  );
  const [remoteMediaStream, setRemoteMediaStream] =
    useState<MediaStream | null>(null);
  const [mediaConnection, setMediaConnection] =
    useState<MediaConnection | null>(null);
  // const [loading, setLoading] = useState(false);
  let playTimeout: NodeJS.Timeout | null = null;


  function handleClose() {
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
      localVideoRef.current.style.display = "none";
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.pause();
      remoteVideoRef.current.srcObject = null;
      remoteVideoRef.current.style.display = "none";
    }

    if (mediaConnection) mediaConnection.close();
    setMediaConnection(null);
  }

  async function findStreamId(selectedContact: string) {
    try {
      const url = `https://wibu-stream-server.wibudev.com/api/client/${
        selectedContact?.split("-")[0]
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch client data");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching stream ID:", error);
      return null;
    }
  }

  async function onVideoCall() {
    if (!selectedContact) {
      console.error("No contact selected");
      return;
    }

    // setLoading(true);

    try {
      const stream = await findStreamId(selectedContact);
      if (!stream || !stream.isOnline) {
        console.log("Streaming ID not found or user is offline");
        return;
      }
      streamingStart(stream.streamId);
    } catch (error) {
      console.error("Error starting video call:", error);
    } finally {
      // setLoading(false);
    }
  }

  async function streamingStart(streamId: string) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalMediaStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.style.display = "block";
        await localVideoRef.current.play();
      }

      const call = peerConnection?.call(streamId, stream);
      if (call) {
        setMediaConnection(call);
        call.on("stream", (remoteStream) => {
          setRemoteMediaStream(remoteStream);
          if (remoteVideoRef.current) {
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

        call.on("close", () => {
          stream.getTracks().forEach((track) => track.stop());
          remoteMediaStream?.getTracks().forEach((track) => track.stop());
          setMediaConnection(null);
          call.close();
        });
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }

  return (
    <Stack>
      <Flex gap="md" justify={"center"} align={"center"}>
        <ActionIcon
          variant="subtle"
          size={64}
          display={mediaConnection === null ? "block" : "none"}
          onClick={onVideoCall}
        >
          <CiVideoOn size={64} />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          size={64}
          display={mediaConnection === null ? "none" : "block"}
          onClick={handleClose}
        >
          <BiVideoOff size={64} />
        </ActionIcon>
      </Flex>
      <Container display={mediaConnection !== null ? "block" : "none"}>
        <Card miw={460}>
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
  );
}
