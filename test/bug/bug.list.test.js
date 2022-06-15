const {ethers} = require("hardhat");
const {expect} = require("chai");
const {getTxReceipt} = require("../rpc/utils/tx.js");

describe("bug",function (){


    it("out of gas tx(https://github.com/RetricSu/godwoken-kicker/issues/279)",async ()=>{
        let eventTestContractInfo = await ethers.getContractFactory("eventTestContract");
        contract = await eventTestContractInfo.deploy()
        await contract.deployed()
        let tx = await contract.testEvent(2,7,1,17500,{gasLimit:"0x989680"})
        let response = await getTxReceipt(ethers.provider,tx.hash,10)
        expect(response.status).to.be.equal(0)
    }).timeout(60000)

})