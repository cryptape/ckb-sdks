const {ethers} = require("hardhat");
const {expect} = require("chai");
const {BigInterToHexString} = require("./utils/tx");
const {BigNumber} = require("ethers");

describe("getTransactionByBlockHashAndIndex", function () {
    this.timeout(600000)

    before(async function () {
        let fallbackAndReceiveContract = await ethers.getContractFactory("fallbackAndReceive");
        let logContract = await ethers.getContractFactory("LogContract");
        await (await fallbackAndReceiveContract.deploy()).deployed()
        await (await logContract.deploy()).deployed()
    });


    describe("block hash", async () => {
        it("not exist block hash", async () => {
            let response = await ethers.provider.send("eth_getTransactionByBlockHashAndIndex", ["0x3c82bc62179602b67318c013c10f99011037c49cba84e31ffe6e465a21c521a7", "0x0"])
            console.log("eth_getTransactionByBlockHashAndIndex response:", response)
            expect(response).to.be.equal(null)
        })
    })



    describe("exist blockHash", async () => {

        it("empty txs block ",async ()=>{
            let response = await ethers.provider.getBlock("earliest")
            let tx = await ethers.provider.send("eth_getTransactionByBlockHashAndIndex",[response.hash,"0x0"])
            expect(tx).to.be.equal(null)
        })

        it("first tx",async ()=>{
            let blockNum = await ethers.provider.getBlockNumber();
            let txResponse;
            do {
                txResponse = await  ethers.provider.getBlock(blockNum)
                blockNum = blockNum-1;
            }while (txResponse.transactions.length<=0)

            let tx = await ethers.provider.send("eth_getTransactionByBlockHashAndIndex",[txResponse.hash,"0x0"])
            expect(tx.blockHash).to.be.equal(txResponse.hash)
        }).timeout(500000)

        it("latest tx",async ()=>{
            let blockNum = await ethers.provider.getBlockNumber();
            let txResponse;
            do {
                txResponse = await  ethers.provider.getBlock(blockNum)
                blockNum = blockNum-1;
            }while (txResponse.transactions.length<1)
            let tx = await ethers.provider.send("eth_getTransactionByBlockHashAndIndex",[txResponse.hash,BigInterToHexString(BigNumber.from(txResponse.transactions.length-1))])
            expect(tx.blockHash).to.be.equal(txResponse.hash)
        }).timeout(500000)

        it("idx out of bound for block num", async () => {
            let blockNum = await ethers.provider.getBlockNumber();
            let txResponse;
            do {
                txResponse = await  ethers.provider.getBlock(blockNum)
                blockNum = blockNum-1;
            }while (txResponse.transactions.length<1)
            let tx = await ethers.provider.send("eth_getTransactionByBlockHashAndIndex",[txResponse.hash,BigInterToHexString(BigNumber.from(txResponse.transactions.length+1))])
            expect(tx).to.be.equal(null)
        }).timeout(500000)

    })


})