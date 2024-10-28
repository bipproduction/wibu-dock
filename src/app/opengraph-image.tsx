import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "green",
          color: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div style={{
          fontSize: 128,
        }}>WIBU DOCK</div>
        <p style={{ fontSize: 24 }}>Comprehensive Dock for Wibu web app.</p>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
