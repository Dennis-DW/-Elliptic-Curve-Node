import { useState } from "react";
import server from "./server";
import { ec as EC } from "elliptic";
import { keccak256 } from "ethereum-cryptography/keccak";

const ec = new EC("secp256k1");

// Fallback for ethers.utils.toUtf8Bytes
const toUtf8Bytes = (str) => new TextEncoder().encode(str);

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  // Sign a transaction
  async function signTransaction(sender, recipient, amount, privateKey) {
    try {
      const transaction = { sender, recipient, amount: Number(amount) };
      const key = ec.keyFromPrivate(privateKey, "hex");

      // Convert transaction to Uint8Array format
      const msgBytes = toUtf8Bytes(JSON.stringify(transaction));
      const msgHash = keccak256(msgBytes);

      const signature = key.sign(msgHash);
      console.log('Sender:', sender);
      console.log('Recipient:', recipient);
      console.log('PrivateKey:', privateKey);
      console.log('Amount:', amount);
      console.log("Signature:", signature);
      console.log('Transaction:',transaction)
      return {
        transaction,
        signature: {
          r: signature.r.toString("hex"),
          s: signature.s.toString("hex"),
          v: signature.recoveryParam,
        },
      };
      

    } catch (error) {
      console.error("Error signing transaction:", error);
      return null;
    }
  }

  async function transfer(evt) {
    evt.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validation for empty fields and invalid amount
      if (!recipient || !sendAmount || isNaN(sendAmount) || parseFloat(sendAmount) <= 0) {
        setError("Please provide a valid recipient address and a positive amount.");
        return;
      }

      const trimmedRecipient = recipient.trim();

      // Validate recipient address format
      const isValidAddress = (address) => /^0x[a-fA-F0-9]{40}$/.test(address);
      if (!isValidAddress(trimmedRecipient)) {
        setError("Invalid recipient address format.");
        return;
      }

      if (!privateKey) {
        setError("Private key is required to sign the transaction.");
        return;
      }

      // Sign the transaction
      const result = await signTransaction(address, trimmedRecipient, sendAmount, privateKey);

      if (!result || !result.transaction || !result.signature) {
        setError("Error signing the transaction or missing transaction details.");
        return;
      }

      const { transaction, signature } = result;

      // Send the signed transaction to the server
      const response = await server.post("/send", { transaction, signature });

      if (response && response.data) {
        const { senderBalance, recipientBalance } = response.data;
        setBalance(senderBalance);
        setSendAmount(""); 
        setRecipient("");    
      } else {
        setError("Invalid response from the server.");
      }
    } catch (ex) {
      console.error("Error during transfer:", ex);
      setError(ex.message || "An error occurred during the transfer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      {error && <div className="error-message">{error}</div>}

      <label>
        Send Amount
        <input
          type="number"
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
          min="0.01"
          step="any"
          disabled={loading}
        />
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
          disabled={loading}
        />
      </label>

      <input
        type="submit"
        className="button"
        value={loading ? "Processing..." : "Transfer"}
        disabled={loading}
      />
    </form>
  );
}

export default Transfer;

