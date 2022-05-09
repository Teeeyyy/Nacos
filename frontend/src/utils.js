import algosdk from "algosdk";
import MyAlgoConnect from "@randlabs/myalgo-connect";

const myAlgoConnect = new MyAlgoConnect();
const algodClient = new algosdk.Algodv2(
  "",
  "https://node.testnet.algoexplorerapi.io",
  ""
);
const indexerClient = new algosdk.Indexer(
  "",
  "https://algoindexer.testnet.algoexplorerapi.io",
  ""
);

export { algodClient, myAlgoConnect, indexerClient };
