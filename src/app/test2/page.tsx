"use client";

import { StreamContainer } from "@/lib/stream/StreamContainer";

export default function Page() {
  return <StreamContainer phone="62896973388210" />;
}

// import { Stack, Text } from "@mantine/core";
// import { useShallowEffect } from "@mantine/hooks";
// import { v4 } from "uuid";
// import { useState } from "react";
// import Peer, { DataConnection, MediaConnection } from "peerjs";
// import { initializePeer } from "../test/lib/initializePeer";
// import { StreamView } from "../test/component/StreamView";

// export default function Page() {
//   const [peerConnection, setPeerConnection] = useState<Peer | null>(null);
//   const [dataConnection, setDataConnection] = useState<DataConnection | null>(
//     null
//   );

//   const [mediaConnection, setMediaConnection] =
//     useState<MediaConnection | null>(null);

//   useShallowEffect(() => {
//     const wibuId = `wibu62896973388210-` + v4();
//     const { peerInstance, cleanup } = initializePeer({
//       host: "wibu-stream-server.wibudev.com",
//       path: "/wibu-stream",
//       peerId: wibuId,
//       port: 443,
//       onConnection(conn) {
//         conn.on("data", (data) => {
//           console.log(data);
//         });
//         conn.on("open", () => {
//           setDataConnection(conn);
//         });
//         conn.on("close", () => {
//           setDataConnection(null);
//         });
//       }
//     });

//     setPeerConnection(peerInstance);

//     return () => {
//       if (peerInstance) {
//         cleanup();
//       }
//     };
//   }, []);

//   if (!peerConnection) return <Text>loading ...</Text>;
//   return (
//     <Stack>
//       <StreamView
//         mediaConnection={mediaConnection}
//         setMediaConnection={setMediaConnection}
//         setDataConnection={setDataConnection}
//         dataConnection={dataConnection}
//         peerConnection={peerConnection}
//       />
//     </Stack>
//   );
// }
