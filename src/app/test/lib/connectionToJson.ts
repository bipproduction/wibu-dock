import { WibuConnection } from "@/types/WibuConnection";

export function toJSON(connection: WibuConnection) {
  
    return {
      peer: connection.peer,
      open: connection.open,
      connectionId: connection.connectionId,
      label: connection.label,
      metadata: connection.metadata,
      options: connection.options,
      peerConnection: {
        canTrickleIceCandidates: connection.peerConnection?.canTrickleIceCandidates,
        connectionState: connection.peerConnection?.connectionState,
        currentLocalDescription: connection.peerConnection?.currentLocalDescription,
        currentRemoteDescription: connection.peerConnection?.currentRemoteDescription,
        iceConnectionState: connection.peerConnection?.iceConnectionState,
        iceGatheringState: connection.peerConnection?.iceGatheringState,
        localDescription: connection.peerConnection?.localDescription,
        pendingLocalDescription: connection.peerConnection?.pendingLocalDescription,
        pendingRemoteDescription: connection.peerConnection?.pendingRemoteDescription,
        remoteDescription: connection.peerConnection?.remoteDescription,
        sctp: {
          maxChannels: connection.peerConnection?.sctp?.maxChannels,
          maxMessageSize: connection.peerConnection?.sctp?.maxMessageSize,
          state: connection.peerConnection?.sctp?.state,
          iceTransport: {
            gatheringState: connection.peerConnection?.sctp?.transport.iceTransport?.gatheringState,
            state: connection.peerConnection?.sctp?.transport.iceTransport?.state,
          },
        },
        signalingState: connection.peerConnection?.signalingState,
      },
      dataChannel: {
        binaryType: connection.dataChannel?.binaryType,
        bufferedAmount: connection.dataChannel?.bufferedAmount,
        bufferedAmountLowThreshold: connection.dataChannel?.bufferedAmountLowThreshold,
        id: connection.dataChannel?.id,
        label: connection.dataChannel?.label,
        maxPacketLifeTime: connection.dataChannel?.maxPacketLifeTime,
        maxRetransmits: connection.dataChannel?.maxRetransmits,
        negotiated: connection.dataChannel?.negotiated,
        ordered: connection.dataChannel?.ordered,
        protocol: connection.dataChannel?.protocol,
        readyState: connection.dataChannel?.readyState,
      },
    };
  }
  