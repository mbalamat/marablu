import { canonicalize, util } from "./deps.ts";

console.log("Hello Marablu!");
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const HelloMessage = {
  type: "hello",
  agent: "marablu 0.3.1",
  version: "0.3.1",
};

interface Peer {
  hostname: string;
  port: number;
}

const peers: string[] = [
  "keftes.di.uoa.gr:18018",
];

const parsePeerFromString = (_peer: string) => {
  // TODO implement, validate inputs, check if addresses are indeed addresses
  return { hostname: "keftes.di.uoa.gr", port: 18018 } as Peer;
};

const handleIncomingConnection = async (connection: Deno.Conn) => {
  const buffer = new Uint8Array(1024);
  await connection.read(buffer);
  console.log("Received: ", decoder.decode(buffer));
  await connection.write(encoder.encode("OK!"));
  connection.close();
};

const _startListener = async () => {
  const hostname = "0.0.0.0";
  const port = 18018;
  const listener = Deno.listen({ hostname, port });
  console.log(`Listening on ${hostname}:${port}`);
  for await (const conn of listener) {
    handleIncomingConnection(conn);
  }
};

interface ConnectionState {
  state: string;
}

const handleIncomingMessage = async (
  connnection: Deno.Conn,
  state: ConnectionState,
  message: string,
) => {
  console.log(
    `Incoming message from ${
      JSON.stringify(connnection.remoteAddr)
    }: ${message}`,
  );
  // TODO validate incoming message
  if (state.state === "initial") {
    console.log(state.state);
    const outgoingMessage = canonicalize(HelloMessage);
    console.log(
      `Outgoing message to ${
        JSON.stringify(connnection.remoteAddr)
      }: ${outgoingMessage}`,
    );
    await connnection.write(encoder.encode(outgoingMessage + "\n"));
    state.state = "getpeers";
  }
};

const connectToPeer = async (peer: string) => {
  console.log("connecting to peer");
  const { hostname, port } = parsePeerFromString(peer);
  const con = await Deno.connect({ hostname, port });
  const connectionState: ConnectionState = {
    state: "initial",
  };
  const iter = util.iter(con);
  for await (const chunk of iter) {
    handleIncomingMessage(con, connectionState, decoder.decode(chunk));
  }
};

// startListener();
connectToPeer(peers[0]);
