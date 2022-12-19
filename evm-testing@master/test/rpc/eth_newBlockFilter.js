const {ethers} = require("hardhat");
const {expect} = require("chai");
const { sendTxToAddBlockNum} = require("./utils/tx");

describe("newBlockFilter", function () {
    let fallbackAndReceiveContract;
    let logContract;
    before(async function () {
        fallbackAndReceiveContract = await ethers.getContractFactory("fallbackAndReceive");
        logContract = await ethers.getContractFactory("LogContract");
    });


    describe("newBlockFilter", function () {

        it("filter => begin from latest",async ()=>{
            // await sendTxToAddBlockNum(ethers.provider,10)
            const filterId = await ethers.provider.send("eth_newBlockFilter",[]);
            let txs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
            expect(txs.length).to.be.lt(2)
        })

        it("demo", async () => {

            let beginNum = await ethers.provider.getBlockNumber();
            const filterId = await ethers.provider.send("eth_newBlockFilter",[]);
            await ethers.provider.send("eth_getFilterChanges", [filterId]);
            // expect(txs.length).to.be.equal(0)
            await sendTxToAddBlockNum(ethers.provider,1)
            txs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
            let endNum = await ethers.provider.getBlockNumber();
            console.log("begin:",beginNum,"end:",endNum)
            expect(txs.length).to.be.gt(0)
        }).timeout(100000000)
    })

})