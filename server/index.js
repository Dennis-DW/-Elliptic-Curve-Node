const express = require("express");
const { keccak256 } = require("ethereum-cryptography/keccak");
const cors = require("cors");
const elliptic = require("elliptic");
const { Buffer } = require("buffer");
const { toHex } = require("ethereum-cryptography/utils");

const ec = new elliptic.ec("secp256k1");

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x02a393f72773b044d47ed186644b41308a2e0760": 100,
  "0x17a74bd6673e914276317b3965f032390bb459da": 50,
  "0xc103a098a93ecf0e5ebcf65e77931d5ce007887b": 75,
};

function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  if (!isValidAddress(address)) {
    return res.status(400).send({ message: "Invalid Ethereum address format!" });
  }
  const balance = balances[address] || 0;
  res.send({ balance });
});

function verifySignature(transaction, signature, expectedSender) {
  // Hash the transaction data
  const msgHash = keccak256(Buffer.from(JSON.stringify(transaction), "utf8"));
  console.log("Transaction:", transaction);
  console.log("Signature:", signature);
  console.log("Message Hash:", msgHash);

  // Convert signature components to Buffer
  const r = signature.r.toString("hex");
  const s = signature.s.toString("hex");
  const v = signature.v;

  const pubKey = ec.recoverPubKey(msgHash, { r, s }, v);
  const recoveredPublicKey = ec.keyFromPublic(pubKey).getPublic();

  const pubKeyUncompressed = recoveredPublicKey.encode('hex', false);
  console.log('Recovered Public Key (Uncompressed):', pubKeyUncompressed);

  // Hash the public key with Keccak-256 and take the last 20 bytes for the Ethereum address
  const recoveredAddress = "0x" + toHex(keccak256(Buffer.from(pubKeyUncompressed, "hex")).slice(-20));
  console.log("Recovered Address:", recoveredAddress);
  console.log("Expected Sender:", expectedSender);

  if (recoveredAddress.toLowerCase() !== expectedSender.toLowerCase()) {
    throw new Error("Invalid signature: Sender address mismatch!");
  }

  return true;
}

app.post("/send", (req, res) => {
  const { transaction, signature } = req.body;
  const { sender, recipient, amount } = transaction;

  console.log("Received transaction:", transaction);
  console.log("Received signature:", signature);

  if (!isValidAddress(sender) || !isValidAddress(recipient)) {
    return res.status(400).send({ message: "Invalid Ethereum address format!" });
  }

  if (isNaN(amount) || amount <= 0) {
    return res.status(400).send({ message: "Amount must be a positive number!" });
  }

  try {
    verifySignature(transaction, signature, sender);

    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      return res.status(400).send({ message: "Not enough funds!" });
    }

    balances[sender] -= amount;
    balances[recipient] += amount;

    console.log("Updated sender balance:", balances[sender]);
    console.log("Updated recipient balance:", balances[recipient]);

    res.send({
      senderBalance: balances[sender],
      recipientBalance: balances[recipient],
    });
  } catch (error) {
    console.log("Error during transfer:", error.message);
    res.status(400).send({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
