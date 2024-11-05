/* eslint-disable @typescript-eslint/no-explicit-any */
import Peer from "peerjs";
import { Dispatch, SetStateAction } from "react";

export async function loadDataContact({
    peerConnection,
    setListDataContact
  }: {
    peerConnection: Peer | null;
    setListDataContact: Dispatch<SetStateAction<any[] | null>>;
  }) {
    const url = "https://wibu-stream-server.wibudev.com/api/client-active";
    const listData = await fetch(url);
    if (!listData.ok) {
      console.log("Error get list data client active");
      return;
    }
    const data: any[] = await listData.json();
    const streamId = peerConnection?.id.split("-")[0];
    const newData = data.filter((item) => item.id !== streamId);
    setListDataContact(newData);
  }