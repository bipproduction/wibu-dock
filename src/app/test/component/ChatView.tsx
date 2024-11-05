/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  Flex,
  ScrollArea,
  Stack,
  Text,
  TextInput
} from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { DataConnection } from "peerjs";
import { Dispatch, SetStateAction, useState } from "react";

export function ChatView({
  dataConnection,
  setDataConnection,
  targetId,
  listChat,
  setListChat
}: {
  dataConnection: DataConnection | null;
  setDataConnection: Dispatch<SetStateAction<DataConnection | null>>;
  targetId?: string;
  listChat: any[];
  setListChat: Dispatch<SetStateAction<any[]>>;
}) {
  const [formText, setFormText] = useState("");
  async function sendChat() {
    if (dataConnection) {
      const message = {
        variant: "chat",
        senderId: dataConnection.peer,
        message: formText
      };
      dataConnection.send(message);
      setListChat((prev) => [...prev, message]);
      setFormText("");
    }
  }

  useShallowEffect(() => {
    if (dataConnection && targetId) {
      dataConnection.on("data", (data) => {
        setListChat((prev) => {
          const newData = new Set([...prev, data]);
          return Array.from(newData);
        });
      });
    } else {
      if (dataConnection) {
        dataConnection.on("data", (data) => {
          setListChat((prev) => {
            const newData = new Set([...prev, data]);
            return Array.from(newData);
          });
        });
      }
    }
  }, [dataConnection]);
  return (
    <Stack p={"md"}>
      <Card bg={"dark"} withBorder>
        <Flex justify={"space-between"}>
          <Text>Chat View</Text>
          {dataConnection && (
            <Button
              variant="subtle"
              size="compact-xs"
              onClick={() => {
                if (dataConnection && dataConnection.open) {
                  dataConnection.close();
                  setDataConnection(null);
                }
              }}
            >
              Close
            </Button>
          )}
        </Flex>
        <ScrollArea.Autosize h={300}>
          <Stack>
            {listChat.map((item, index) => (
              <Flex
                key={index}
                justify={
                  item.senderId === dataConnection?.peer ? "end" : "start"
                }
              >
                <Card>
                  <Text>{item.message}</Text>
                </Card>
              </Flex>
            ))}
          </Stack>
        </ScrollArea.Autosize>
      </Card>
      <Flex align={"center"} justify={"space-between"} gap={"md"}>
        <TextInput
          value={formText}
          onChange={(e) => setFormText(e.target.value)}
          flex={1}
        />
        <Button onClick={sendChat}>Send</Button>
      </Flex>
    </Stack>
  );
}
