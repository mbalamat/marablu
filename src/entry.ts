import { connectToPeer } from "./main.ts";
console.log("Starting Marabu node: Marablu!");

const peers: string[] = [
  "keftes.di.uoa.gr:18018",
];
// startListener();
connectToPeer(peers[0]);
