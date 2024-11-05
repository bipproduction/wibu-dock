// "use client";

import { StreamContainer } from "@/lib/stream/StreamContainer";
import { Stack } from "@mantine/core";

// import { Stack, Text } from "@mantine/core";
// import { useShallowEffect } from "@mantine/hooks";
// import Peer, { DataConnection, MediaConnection } from "peerjs";
// import { useState } from "react";
// import { v4 } from "uuid";
// import { StreamView } from "./component/StreamView";
// import { initializePeer } from "./lib/initializePeer";

// export default function Page() {
//   const [peerConnection, setPeerConnection] = useState<Peer | null>(null);
//   const [dataConnection, setDataConnection] = useState<DataConnection | null>(
//     null
//   );
//   const [mediaConnection, setMediaConnection] =
//     useState<MediaConnection | null>(null);
//   useShallowEffect(() => {
//     const wibuId = `wibu6289697338821-` + v4();
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

//       },
//       onCall: (call) => setMediaConnection(call)
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
//         dataConnection={dataConnection}
//         setDataConnection={setDataConnection}
//         peerConnection={peerConnection}
//       />
//     </Stack>
//   );
// }

export default function Page() {
  return (
    <Stack>
      <StreamContainer phone="6289697338821" />
    </Stack>
  );
}
