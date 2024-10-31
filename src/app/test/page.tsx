"use client";
import { Stack } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { Peer } from "peerjs";

const peer = new Peer("id1");
export default function Page() {
  useShallowEffect(() => {
    peer.on("connection", (conn) => {
      conn.on("data", (data) => {
        // Will print 'hi!'
        console.log(data);
      });
      conn.on("open", () => {
        conn.send("hello!");
      });
    });

    return () => {
      peer.destroy();
    };
  }, []);
  return <Stack h={"100vh"}></Stack>;
}
