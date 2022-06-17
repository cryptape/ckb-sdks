const {ethers} = require("hardhat");
const {sendTxToAddBlockNum} = require("./utils/tx.js");
const {getTxReceipt} = require("./utils/tx");

describe("newFilter", function () {
    this.timeout(600000)
    let fallbackAndReceiveContract;
    let logContract;
    before(async function () {
        fallbackAndReceiveContract = await ethers.getContractFactory("fallbackAndReceive");
        logContract = await ethers.getContractFactory("LogContract");
    });

    describe("newFilter",function (){

        it("demo", async ()=>{
            const filterId = await ethers.provider.send("eth_newFilter", [{}]);
            console.log(filterId);
            await sendTxToAddBlockNum(ethers.provider, 1)
            const logs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
            console.log(logs);
        })

        // it("test max",async() =>{
        //     //deploy contract
        //     const filterId = await ethers.provider.send("eth_newFilter", [{}]);
        //
        //     let contractInfo  = await ethers.getContractFactory("eventTestContract")
        //     let contract = await   contractInfo.deploy()
        //     for (let i = 0; i < 100; i++) {
        //         let tx = await contract.testLog(16000,{gasLimit:"0xb71b00"})
        //         // await getTxReceipt(ethers.provider,tx.hash,100)
        //     }
        //     const logs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
        //
        //     console.log(logs)
        //
        // })

        // it("test max1",async() =>{
        //     //deploy contract
        //     const filterId = await ethers.provider.send("eth_newFilter", [{}]);
        //
        //     let contractInfo  = await ethers.getContractFactory("eventTestContract")
        //     let contract = await  contractInfo.deploy()
        //     await contract.deployed()
        //     for (let i = 0; i < 100; i++) {
        //         try {
        //             let tx = await contract.transferAttack(5000,{gasLimit:"0xb71b00"})
        //         }catch (e){}
        //     }
        //     const logs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
        //     console.log(logs)
        //
        // })

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