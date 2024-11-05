/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionIcon, Card, Flex, Skeleton, Stack, Text, Title } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import Peer from "peerjs";
import { Dispatch, SetStateAction, useState } from "react";
import { MdAccountCircle, MdRefresh } from "react-icons/md";
import { loadDataContact } from "../loadContact";

export function ContactContainer({
  setSelectedContact,
  peerConnection
}: {
  setSelectedContact: Dispatch<SetStateAction<string | null>>;
  peerConnection: Peer | null;
}) {
  const [listDataContact, setListDataContact] = useState<any[] | null>(null);

  useShallowEffect(() => {
    if (peerConnection) {
      loadDataContact({ peerConnection, setListDataContact });
    }
  }, [peerConnection]);

  if (!listDataContact) return <Skeleton height={300} />;
  return (
    <Card>
      <Stack p={"md"}>
        <Flex gap={"md"} align={"center"}>
          <Title order={2}>Contact</Title>
          <ActionIcon
            variant="subtle"
            onClick={() =>
              loadDataContact({ setListDataContact, peerConnection })
            }
          >
            <MdRefresh />
          </ActionIcon>
        </Flex>
        {listDataContact.map((item: any) => (
          <Flex
            onClick={() => setSelectedContact(item.streamId)}
            gap={"md"}
            key={item.streamId}
            style={{
              fontSize: 24,
              cursor: "pointer"
            }}
            align={"center"}
          >
            <MdAccountCircle radius={100} />
            <Text>{item.streamId.split("-")[0]}</Text>
          </Flex>
        ))}
      </Stack>
    </Card>
  );
}
