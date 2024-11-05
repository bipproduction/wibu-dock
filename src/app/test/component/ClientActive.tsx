/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ActionIcon,
  Button,
  Card,
  Flex,
  Group,
  SimpleGrid,
  Stack,
  Text
} from "@mantine/core";
import { useFetch, useShallowEffect } from "@mantine/hooks";
import Peer, { DataConnection, MediaConnection } from "peerjs";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { MdRefresh } from "react-icons/md";
import { ChatView } from "./ChatView";

function useLoadClient(selfId: string) {
  const { loading, data, refetch, error, abort } = useFetch<
    Record<string, string>[]
  >("https://wibu-stream-server.wibudev.com/api/client-active");

  const newData = data?.filter((item) => item.streamId !== selfId);
  return { loading, data: newData, refetch, error, abort } as const;
}

export function ClientActive({
  peerConnection,
  listChat,
  setListChat
}: {
  peerConnection: Peer;
  listChat: any[];
  setListChat: Dispatch<SetStateAction<any[]>>;
}) {
  const {
    loading,
    data: dataFetch,
    refetch
  } = useLoadClient(peerConnection?.id);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dataConnection, setDataConnection] = useState<DataConnection | null>(
    null
  );
  const [mediaConnection, setMediaConnection] =
    useState<MediaConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [localMediaStream, setLocalMediaStream] = useState<MediaStream | null>(
    null
  );
  const [remoteMediaStream, setRemoteMediaStream] =
    useState<MediaStream | null>(null);


  useShallowEffect(() => {  
    if(dataConnection) {
      
    }
  }, [])

  function onConnect(streamId: string) {
    setListChat([]);
    setSelectedId(streamId);
    const conn = peerConnection.connect(streamId);
    conn.on("open", () => {
      setDataConnection(conn);
    });
  }

  function onDisconnect() {
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
  async function onCall(streamId: string) {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    setLocalMediaStream(stream);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.style.display = "block";
      localVideoRef.current
        .play()
        .catch((err) =>
          err.name !== "AbortError"
            ? console.error("Error playing local video:", err)
            : null
        );
    }
    const call = peerConnection.call(streamId, stream);
    if (call) {
      setMediaConnection(call);
      call.on("stream", (remoteStream) => {
        setRemoteMediaStream(remoteStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.style.display = "block";
          remoteVideoRef.current
            .play()
            .catch((err) =>
              err.name !== "AbortError"
                ? console.error("Error playing remote video:", err)
                : null
            );
        }
      });
    }
  }

  return (
    <Stack p={"md"}>
      <Card>
        <Stack>
          <Group>
            <Text>Contact</Text>
            <ActionIcon
              loading={loading}
              variant="subtle"
              size="compact-xs"
              onClick={refetch}
            >
              <MdRefresh />
            </ActionIcon>
          </Group>
          {dataFetch?.map((item, k) => (
            <Flex gap={"xs"} key={k}>
              <Text>
                {k + 1 + ". "} {item.streamId}
              </Text>
              <Button
                disabled={dataConnection !== null}
                onClick={() => onConnect(item.streamId)}
                variant="subtle"
                size="compact-xs"
              >
                connect
              </Button>
              <Button
                disabled={mediaConnection !== null}
                onClick={() => onCall(item.streamId)}
                variant="subtle"
                size="compact-xs"
              >
                call
              </Button>
            </Flex>
          ))}
          {dataConnection && (
            <ChatView
              dataConnection={dataConnection}
              setDataConnection={setDataConnection}
              listChat={listChat}
              setListChat={setListChat}
              targetId={selectedId!}
            />
          )}
          <Stack display={mediaConnection ? "block" : "none"}>
            <Button onClick={onDisconnect}>Disconnect</Button>
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
      </Card>
    </Stack>
  );
}
