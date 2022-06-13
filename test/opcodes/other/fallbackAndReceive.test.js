const {ethers} = require("hardhat");
const {expect} = require("chai");

//fallback
// receive

describe("fallback and receive", function () {
    this.timeout(100000)

    

    describe("fallbackAndReceive", function () {

        let fallbackAndReceiveContract
        // let fallbackAndReceiveOnlyHaveFallbackContract;
        // let NoFallbackAndReceive
        before(async function () {
            const contractInfo = await ethers.getContractFactory("fallbackAndReceive");
            fallbackAndReceiveContract = await contractInfo.deploy();
            await fallbackAndReceiveContract.deployed();
            // const fallbackAndReceiveOnlyHaveFallbackContractInfo = await ethers.getContractFactory("fallbackAndReceiveOnlyHaveFallback");
            // fallbackAndReceiveOnlyHaveFallbackContract = await fallbackAndReceiveOnlyHaveFallbackContractInfo.deploy()
            // await fallbackAndReceiveOnlyHaveFallbackContract.deployed();
            // const NoFallbackAndReceiveInfo = await ethers.getContractFactory("NoFallbackAndReceive")
            // const NoFallbackAndReceive = await NoFallbackAndReceive.deployed()
            // await NoFallbackAndReceive.deployed();
        });

        
        it("0x 不带value=>receive", async () => {
            let result = await ethers.provider.send("eth_sendTransaction", [{
                "from": fromUserAddress,
                "to": fallbackAndReceiveContract.address,
                "data": "0x",
                "value": "0x11",
            }, "latest"])
            console.log(result)
            
            
        })

        it("0x 带value", async () => {

        })

        it("0xasda,不带value", async () => {

        })

        it("0xasda,带value", async () => {

        })

    })

    describe("OnlyHavefallback", function () {

        it("0x 不带value", async () => {

        })
        it("0x 带value", async () => {

        })

        it("0xsada，不带value", async () => {

        })

        it("0xsada ,带value", async () => {

        })
    })

    describe("NoFallbackAndReceive", function () {
        it("0x ,value", async () => {

        })

        it("0xsada,", async () => {

        })

        it("0xxxas,value", async () => {

        })
    })

}
