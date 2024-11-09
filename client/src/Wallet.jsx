import { ec as EC } from "elliptic";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex } from "ethereum-cryptography/utils";
import server from "./server";

const ec = new EC("secp256k1");

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const newPrivateKey = evt.target.value.trim(); 

    // Validate the private key format (64 hex characters)
    if (!/^[a-fA-F0-9]{64}$/.test(newPrivateKey)) {
      alert("Invalid private key format. Ensure it's a 64-character hexadecimal string.");
      return;
    }

    setPrivateKey(newPrivateKey);

    try {
      // Generate the public key from the private key
      const key = ec.keyFromPrivate(newPrivateKey, "hex");
      const publicKey = key.getPublic().encode("array", false); 
      const publicKeyUint8Array = new Uint8Array(publicKey);

      // Derive the address by hashing the public key with keccak256
      const derivedAddress = "0x" + toHex(keccak256(publicKeyUint8Array).slice(-20));
      setAddress(derivedAddress);

      const { data } = await server.get(`balance/${derivedAddress}`);
      setBalance(data.balance || 0); 
    } catch (error) {
      console.error("Error generating address or fetching balance:", error);
      alert("Error generating address or fetching balance. Please try again.");
      setAddress("");
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <div>
        Address: {address ? `${address.slice(0, 10)}...${address.slice(-10)}` : "Not available"}
      </div>

      <label>
        Private Key
        <input
          type="text"
          placeholder="Type in your Private Key"
          value={privateKey}
          onChange={onChange}
        />
      </label>

      <div className="balance">Balance: {balance !== null ? balance : "Loading..."}</div>
    </div>
  );
}

export default Wallet;

