import { canonicalize, util } from "./deps.ts";

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

export const isValidAndCanonicalized = (message: string) => {
  let messageTmp;
  try {
    messageTmp = canonicalize(JSON.parse(message));
  } catch {
    return false;
  }
  return message === messageTmp;
};

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
  if (!isValidAndCanonicalized(message)) {
    const errorMessage = {
      type: "error",
      error:
        `Can't parse or validate ${message}, make sure it's a valid canonicalized JSON`,
    };
    await connnection.write(
      encoder.encode(JSON.stringify(errorMessage) + "\n"),
    );
    await connnection.close();
  }
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

export const connectToPeer = async (peer: string) => {
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
