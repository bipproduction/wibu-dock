/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { WibuRealtime } from "wibu-pkg";

const NEXT_PUBLIC_WIBU_REALTIME_TOKEN =
  process.env.NEXT_PUBLIC_WIBU_REALTIME_TOKEN!;
export default function Page() {
  useShallowEffect(() => {
    WibuRealtime.init({
      onData: (data: any) => {
        console.log(data);
      },
      project: "test",
      WIBU_REALTIME_TOKEN: NEXT_PUBLIC_WIBU_REALTIME_TOKEN
    });
  }, []);
  return (
    <div>
      <Button
        onClick={() => {
          WibuRealtime.setData({
            name: "wibu",
            age: 10
          });
        }}
      >
        tekan
      </Button>
    </div>
  );
}
