const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("getBlockByHash  ", function () {
    this.timeout(600000)

    before(async function () {
        let fallbackAndReceiveContract = await ethers.getContractFactory("fallbackAndReceive");
        let logContract = await ethers.getContractFactory("LogContract");
        await (await fallbackAndReceiveContract.deploy()).deployed()
        await (await logContract.deploy()).deployed()
    });

    it("getBlockByHash not exist hash => null", async () => {
        let response = await ethers.provider.send("eth_getBlockByHash", ["0xb2fea9c4b24775af6990237aa90228e5e092c56bdaee74496992a53c208da1ee", true])
        expect(response).to.be.equal(null)
    })

    it("getBlockByHash not exist hash => null", async () => {
        let response = await ethers.provider.send("eth_getBlockByHash", ["0xb2fea9c4b24775af6990237aa90228e5e092c56bdaee74496992a53c208da1ee", false])
        expect(response).to.be.equal(null)
    })

    it("getBlockByHash ", async () => {
        // let number = await ethers.provider.getBlockNumber();
        let response = await ethers.provider.getBlock("latest")

        // hash
        let responseByTxhashTrue = await ethers.provider.send("eth_getBlockByHash", [response.hash, true])
        let responseByTxhashFalse = await ethers.provider.send("eth_getBlockByHash", [response.hash, false])
        expect(responseByTxhashTrue.hash).to.be.equal(response.hash)
        expect(responseByTxhashFalse.hash).to.be.equal(response.hash)

        // parentHash
        responseByTxhashTrue = await ethers.provider.send("eth_getBlockByHash", [response.parentHash, true])
        responseByTxhashFalse = await ethers.provider.send("eth_getBlockByHash", [response.parentHash, false])
        expect(responseByTxhashTrue.hash).to.be.equal(response.parentHash)
        expect(responseByTxhashFalse.hash).to.be.equal(response.parentHash)
    }).timeout(40000)
})