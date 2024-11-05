import { Stack, Flex, ActionIcon, Text } from "@mantine/core";
import Peer from "peerjs";
import { Dispatch, SetStateAction } from "react";
import { MdArrowBack } from "react-icons/md";
import { VideoCallContainer } from "./VideoContainer";

export function ActivityContainer({
  selectedContact,
  setSelectedContact,
  peerConnection
}: {
  selectedContact: string | null;
  setSelectedContact: Dispatch<SetStateAction<string | null>>;
  peerConnection: Peer | null;
}) {
  return (
    <Stack p={"md"}>
      <Flex gap={"md"} align={"center"}>
        <ActionIcon variant="outline" onClick={() => setSelectedContact(null)}>
          <MdArrowBack />
        </ActionIcon>
        <Text>{selectedContact?.split("-")[0]}</Text>
      </Flex>
      <VideoCallContainer
        peerConnection={peerConnection}
        selectedContact={selectedContact}
      />
    </Stack>
  );
}
