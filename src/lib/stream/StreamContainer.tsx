"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Flex, Stack, Text } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import Peer, { DataConnection, MediaConnection } from "peerjs";
import { useState } from "react";
import { MdPeople } from "react-icons/md";
import { ActivityContainer } from "./component/ActivityContainer";
import { ContactContainer } from "./component/ContactContainer";
import { IncomingDataConnection } from "./component/IncomingDataConnection";
import { IncomMingMediaConnection } from "./component/IncomingMediaConnection";
import { initStream } from "./initStream";

export function StreamContainer({ phone }: { phone: string }) {
  const [inComingDataConnection, setInComingDataConnection] =
    useState<DataConnection | null>(null);
  const [inComingMediaConnection, setInComingMediaConnection] =
    useState<MediaConnection | null>(null);
  const [peerConnection, setPeerConnection] = useState<Peer | null>(null);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  let interval: NodeJS.Timeout | null = null;
  useShallowEffect(() => {
    const peerInstance = initStream({ phone });

    if (peerInstance) {
      peerInstance.on("open", () => {
        console.log("Connected to server");
        setPeerConnection(peerInstance);
      });

      peerInstance.on("connection", (conn) => setInComingDataConnection(conn));

      peerInstance.on("call", (call) => setInComingMediaConnection(call));
      peerInstance.on("disconnected", () => {
        interval = setInterval(() => {
          peerInstance.reconnect();
        }, 3000);
      });
    }
    return () => {
      if (peerInstance) {
        peerInstance.destroy();
        setPeerConnection(null);
        setInComingDataConnection(null);
        setInComingMediaConnection(null);
      }
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };
  }, []);

  if (inComingDataConnection) {
    return (
      <Stack>
        <IncomingDataConnection
          inComingDataConnection={inComingDataConnection}
        />
      </Stack>
    );
  }

  if (inComingMediaConnection) {
    return (
      <Stack>
        <IncomMingMediaConnection
          setInComingMediaConnection={setInComingMediaConnection}
          inComingMediaConnection={inComingMediaConnection}
        />
      </Stack>
    );
  }

  if (selectedContact) {
    return (
      <ActivityContainer
        peerConnection={peerConnection}
        selectedContact={selectedContact}
        setSelectedContact={setSelectedContact}
      />
    );
  }

  return (
    <Stack p={"md"}>
      <Flex gap={"md"} p={"md"} align={"center"} justify={"end"}>
        <MdPeople radius={100} size={32} />
        <Text>{peerConnection?.id.split("-")[0]}</Text>
      </Flex>
      <ContactContainer
        setSelectedContact={setSelectedContact}
        peerConnection={peerConnection}
      />
    </Stack>
  );
}
