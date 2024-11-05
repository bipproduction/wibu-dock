import { DataConnection } from "peerjs";

export function IncomingDataConnection({
  inComingDataConnection
}: {
  inComingDataConnection: DataConnection | null;
}) {
  return <div>{inComingDataConnection?.peer}</div>;
}
