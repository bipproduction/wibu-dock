/* eslint-disable @typescript-eslint/no-explicit-any */
// Define the type for the RTCIceTransport object
interface RTCIceTransport {
    gatheringState?: RTCIceGatheringState;
    state?: RTCIceConnectionState;
  }
  
  // Define the type for the SCTP transport
  interface RTCDataChannelSCTPTransport {
    maxChannels?: number | null;
    maxMessageSize?: number;
    state?: string;
    transport: {
      iceTransport: RTCIceTransport;
    };
  }
  
  // Define the type for the PeerConnection object
  interface PeerConnection {
    canTrickleIceCandidates?: boolean | null;
    connectionState?: RTCPeerConnectionState;
    currentLocalDescription?: RTCSessionDescriptionInit | null;
    currentRemoteDescription?: RTCSessionDescriptionInit | null;
    iceConnectionState?: RTCIceConnectionState;
    iceGatheringState?: RTCIceGatheringState;
    localDescription?: RTCSessionDescriptionInit | null;
    pendingLocalDescription?: RTCSessionDescriptionInit | null;
    pendingRemoteDescription?: RTCSessionDescriptionInit | null;
    remoteDescription?: RTCSessionDescriptionInit | null;
    sctp?: RTCDataChannelSCTPTransport;
    signalingState?: RTCSignalingState;
  }
  
  // Define the type for the DataChannel object
  interface DataChannel {
    binaryType?: string;
    bufferedAmount?: number;
    bufferedAmountLowThreshold?: number;
    id?: number | null;
    label?: string;
    maxPacketLifeTime?: number | null;
    maxRetransmits?: number | null;
    negotiated?: boolean;
    ordered?: boolean;
    protocol?: string;
    readyState?: RTCDataChannelState;
  }
  
  // Define the type for the main Connection object
  export interface WibuConnection {
    peer: string;
    open: boolean;
    connectionId: string;
    label: string;
    metadata?: any; // Can be more specific if needed
    options?: any; // Can be more specific if needed
    peerConnection: PeerConnection;
    dataChannel: DataChannel;
  }
  