const bip39 = require('bip39');
const HDWallet = require('ethereum-hdwallet');
const {BigNumber} = require("ethers");
const {ethers} = require("hardhat");
const {getTxReceipt} = require("../test/rpc/utils/tx");
const {expect} = require("chai");

let mnemonic;
let gasPrice = "0x174876e800";
let priKeys;
let ethAddrs;

describe("wallet", function () {

    before("generate mnemonic", async function () {
        mnemonic = bip39.generateMnemonic();
        console.log("mnemonic:" + mnemonic + "\n");
    })

    it.skip("getAddress", async ()=>{
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const wallet = HDWallet.fromSeed(seed);
        for (let i = 0; i < 10; i++) {
            console.log('=============地址' + (i + 1) + '=================');
            const key = wallet.derive("m/44'/60'/0'/0/" + i);
            console.log("PrivateKey = " + key.getPrivateKey().toString('hex'));
            console.log("PublicKey = " + key.getPublicKey().toString('hex'));
            const toAddress = '0x' + key.getAddress().toString('hex');
            console.log('ETH Address = ' + toAddress);
            await transfer(toAddress, getHex(BigNumber.from("100000000").mul(gasPrice).toHexString()));
        }
    }).timeout(200000)

    it.skip("transferOnOtherNode", async ()=>{
        let tos = ["0x71cbb6c39cd7c51591481f8aec7402428100d2fe",
            "0x715cd124f5986fe3abfedf85a13366a324c10d3f",
            "0x13a2ffb90f7e706f6eeefdcb3fadb777f01275bd",
            "0xe856ba0ff5a01906767f27dfaceb417cc63ef229",
            "0x0f07d6dc6eb9fbd18e5a7fb81885ec39f26c7d5f",
            "0x33a94d7343be6c186e118eb3eb0ce823582cba18",
            "0x2022e1657c6c96b6b3ee9b9523863805a2a0823e",
            "0x0b1f1b209eb98a92a494276fd4170986f2a9403d",
            "0x76351568eacba045b72a463156e08bb71d14a402",
            "0xee46a636ced4f443531d347af6bc3fbb32491929"];
        for (let i = 0; i < tos.length; i++) {
            await transfer(tos[i], getHex(BigNumber.from("100000000").mul(gasPrice).toHexString()));
        }
    }).timeout(200000)

})

async function transfer(to, value, data) {
    let fromAccount = await ethers.provider.getSigner(0).getAddress();
    let tx = await ethers.provider.send("eth_sendTransaction", [{
        fromAccount,
        to,
        "gas": "0x76c000",
        "gasPrice": gasPrice,
        "value": value,
        "data": data
    }]);
    let response = await getTxReceipt(ethers.provider, tx, 100);
    expect(response.status).to.be.equal(1);
    console.log("tranfer succ!!!");
    return response;
}

function getHex(hexString) {
    return "0x" + hexString.replace(/0x0*/, "");
}