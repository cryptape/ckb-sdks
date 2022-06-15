const {ethers} = require("hardhat");
const {expect} = require("chai");
const {getTxReceipt} = require("../rpc/utils/tx.js");

describe("bug",function (){

    this.timeout(600000)
    it("out of gas tx(https://github.com/RetricSu/godwoken-kicker/issues/279)",async ()=>{
        let eventTestContractInfo = await ethers.getContractFactory("eventTestContract");
        let contract = await eventTestContractInfo.deploy()
        await contract.deployed()
        let tx = await contract.testEvent(2,7,1,17500,{gasLimit:"0x989680"})
        let response = await getTxReceipt(ethers.provider,tx.hash,10)
        expect(response.status).to.be.equal(0)
    }).timeout(60000)

    it("eth_call  Backend must update nonce(https://github.com/nervosnetwork/godwoken-web3/issues/398)",async ()=>{
        // deploy contract
        let eventTestContractInfo = await ethers.getContractFactory("eventTestContract");
        let contract = await eventTestContractInfo.deploy()
        await contract.deployed()
        // one thread send tx
        let tx = sendTx(contract,10)
        // one thread invoke eth_call
        let ethCallTx = eth_call(contract, 400)
        let eth_gasTx = eth_gas(contract,400)
        await tx
        await ethCallTx
        await eth_gasTx
    })
    async function eth_gas(contract,loopCount){
        for (let i = 0; i < loopCount; i++) {
            let response = await ethers.provider.send("eth_estimateGas",[{
                "to":contract.address,
                "data":"0xffffff"
            }])
            expect(response).to.be.include("0x")
        }
    }

    async function eth_call(contract,loopCount){
        for (let i = 0; i < loopCount; i++) {
            let response = await ethers.provider.send("eth_call",[{
                "to":contract.address,
                "data":"0xffffff"
            },'latest'])
            expect(response).to.be.equal("0x")
        }
    }
    async function sendTx(contract,loopCount){
        for (let i = 0; i < loopCount; i++) {
            await contract.testEvent(2,7,1,1,{gasLimit:"0x989680"})
        }
    }

})