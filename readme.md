
---

## ECDSA Node

This project demonstrates the use of a client-server architecture to facilitate transfers between different addresses, incorporating **Public Key Cryptography** for security. Transfers are signed using **Elliptic Curve Digital Signatures (ECDSA)**, ensuring that only the legitimate owner of an address can authorize transactions.

### Project Overview

In this centralized setup, a single server on the back end handles all transfer requests. While distributed consensus isn’t addressed here, we’ve implemented signature verification to simulate the essential security component in a blockchain environment. Only transactions signed with the correct private key can execute, as the server verifies each transfer request’s authenticity.

### Video Instructions
For an overview of this project as well as getting started instructions, check out the following video:

https://www.loom.com/share/0d3c74890b8e44a5918c4cacb3f646c4

---

### Client

The client folder contains a [React app](https://reactjs.org/) built using [Vite](https://vitejs.dev/). To get started:

1. Open up a terminal in the `/client` folder.
2. Run `npm install` to install all dependencies.
3. Run `npm run dev` to start the application.
4. Now you should be able to visit the app at http://127.0.0.1:5173/.

### Server

The server folder contains a Node.js server using [Express](https://expressjs.com/), with the added functionality of verifying digital signatures to secure transfers. Follow these steps to run the server:

1. Open a terminal within the `/server` folder.
2. Run `npm install` to install all dependencies.
3. Run `node index` to start the server.

The client should connect to the server on the default port (3042) automatically!

---

### Signature Verification

To enhance security, we incorporated **Elliptic Curve Digital Signature Algorithm (ECDSA)** using the `secp256k1` curve. The server verifies the digital signatures provided with each transaction by:
1. Hashing the transaction data.
2. Using the `secp256k1` elliptic curve to recover the public key from the signature.
3. Checking that the recovered address matches the sender’s address, ensuring only the rightful owner can authorize transfers.

### Development Tip

To automatically restart the server on code changes, use [nodemon](https://www.npmjs.com/package/nodemon) instead of `node`.

---

