const {ethers} = require("hardhat");
const {expect} = require("chai");
const { sendTxCount} = require("./utils/tx");

describe("newPendingTransactionFilter", function () {
    let fallbackAndReceiveContract;
    let logContract;
    before(async function () {
        fallbackAndReceiveContract = await ethers.getContractFactory("fallbackAndReceive");
        logContract = await ethers.getContractFactory("LogContract");

    });


    describe("demo", function () {

        it("eth_getFilterChanges query filterId from eth_newPendingTransactionFilter inconsistent with other chains(https://github.com/nervosnetwork/godwoken-web3/issues/272)",async ()=>{
            let  filterId = await ethers.provider.send("eth_newPendingTransactionFilter",[]);
            await sendTxCount(ethers.provider,10)
            const logs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
            expect(logs.length).to.be.gte(10)
        }).timeout(50000)

    })

})