const elliptic = require("elliptic");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

const ec = new elliptic.ec("secp256k1");

const keyPair = ec.genKeyPair();
const privateKey = keyPair.getPrivate("hex");

const publicKey = keyPair.getPublic(false, "hex");

// Hash the public key with Keccak-256 and take the last 20 bytes for the Ethereum address
const address = "0x" + toHex(keccak256(Buffer.from(publicKey, "hex")).slice(-20));

console.log("Private Key:", privateKey);
console.log("Public Key:", publicKey);
console.log("Ethereum Address:", address);


// Private Key: b09ba99adfcfe0b68383e144e9b1cbb459599f714294b2103cbfbf2dd37e7d4b
// Public Key: 042b7ac2fe6076fb9715b33635970eea5ed892c614b9a4484b8caad2c57e66151b3159d5dcfa9faa0d926b24365ac310b16c565e7c9cecb474a65a2902f34b3dc4
// Ethereum Address: 0x02a393f72773b044d47ed186644b41308a2e0760

// Private Key: 9ad7b08c91c3e8b0522f23e0a46141673f7ef41aa62e42dad823d988a1306efa
// Public Key: 04d116dcdd36281aa7f49b94e58dc898895b70471e9878120e915330e57c89331f4d25ef6741b8844bc2dff7524894b6b5e4c0989f6796af2f1d50ded403d376ae
// Ethereum Address: 0x17a74bd6673e914276317b3965f032390bb459da

// Private Key: 306f2c05b3e5304c985e4d63b75558c780d25258449adb9a1bb260fc6bb4bef9
// Public Key: 046816c54be77961a5b8bf2506f48f0e4416d87a5b558713f8f9ff503a9b6e9df9208fa67fd85f006a5a185c4dd7ab6d6383bdcc00107b37ddc2610ff1a326b7f2
// Ethereum Address: 0xc103a098a93ecf0e5ebcf65e77931d5ce007887b