console.log("Hello Marablu!");
const encoder = new TextEncoder();
const decoder = new TextDecoder();

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

const connectToPeer = async () => {
  console.log("connecting to peer");
  const { hostname, port } = parsePeerFromString(peers[0]);
  const con = await Deno.connect({ hostname, port });
  await con.write(encoder.encode('{"type":"hello"}'));
  const buf = new Uint8Array(1024);
  await con.read(buf);
  console.log("Peer - Response:", decoder.decode(buf));
  // con.close();
};

// startListener();
connectToPeer();
