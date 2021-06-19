console.log("Hello Marablu!");
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const _peers: string[] = [
  "keftes.di.uoa.gr:18018",
];

const handleConnection = async (connection: Deno.Conn) => {
  const buffer = new Uint8Array(1024);
  await connection.read(buffer);
  console.log("Received: ", decoder.decode(buffer));
  await connection.write(encoder.encode("OK!"));
  connection.close();
};

const hostname = "0.0.0.0";
const port = 18018;
const listener = Deno.listen({ hostname, port });
console.log(`Listening on ${hostname}:${port}`);
for await (const conn of listener) {
  handleConnection(conn);
}
