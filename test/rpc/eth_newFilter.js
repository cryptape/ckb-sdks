const {ethers} = require("hardhat");
const {BigNumber} = require("ethers");

describe("newFilter", function () {
    let fallbackAndReceiveContract;
    let logContract;
    before(async function () {
        fallbackAndReceiveContract = await ethers.getContractFactory("fallbackAndReceive");
        logContract = await ethers.getContractFactory("LogContract");
    });

    describe("newFilter",function (){

        it("demo", async ()=>{
            const filterId = await ethers.provider.send("eth_newFilter", [filter]);
            console.log(filterId);
            const logs = await provider.send("eth_getFilterChanges", [filterId]);
            console.log(logs);
        })

    })

    describe("from",function (){
        it("demo",async ()=>{
            let BeginBlkNum = await ethers.provider.getBlockNumber();
            const filterId = await ethers.provider.send("eth_newFilter", [{}]);
            // getTxCount(ethers.provider,ethers.provider.getSigner().getAddress())
            await sendTxToAddBlockNum(ethers.provider,3)
            const logs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
            let endBlkNum = await ethers.provider.getBlockNumber();

            // console.log("logs:",logs)
            console.log("begin blkNum:",BeginBlkNum.toString())
            console.log("end blkNum:",endBlkNum.toString())
            console.log("=====eth_getFilterChanges==========")
            for (let i = 0; i < logs.length; i++) {
                console.log("blockNumber:",BigNumber.from(logs[i].blockNumber.toString()).toString(),"blkIdx:",logs[i].transactionIndex,"logIndex:",logs[i].logIndex)
            }
        }).timeout(100000)
    })

    describe("toBlock",function (){

    })

    describe("address",function (){

    })
    describe("topics",function (){

        it("[]",async ()=>{

        })

        it("[A]",async ()=>{

        })

        it("[null,b]",async ()=>{

        })

        it("[a,b]",async ()=>{

        })

        it("[[A, B], [A, B]]",async ()=>{

        })


    })


})