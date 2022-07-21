const {ethers} = require("hardhat");
const {expect} = require("chai");

const noRegisterAddress = "0xA168cB32724eE05cd9A4d6fd5818E77c269a45E1"
describe("estimateGas  ", function () {
    this.timeout(600000)
    let fallbackAndReceiveContract;
    let logContract;
    let fromUserAddress;
    before(async function () {
        fromUserAddress = await ethers.provider.getSigner(0).getAddress()
        fallbackAndReceiveContract = await ethers.getContractFactory("fallbackAndReceive");
        logContract = await ethers.getContractFactory("LogContract");
    });

    describe("tx.from", async function () {
        it("from address not exist = > from id not found", async () => {
            try {
                let result = await ethers.provider.send("eth_estimateGas", [{
                    "from": noRegisterAddress,
                    "data": logContract.bytecode,
                }]);
                console.log('result:',result)
            } catch (e) {
                console.log('e:tostring:',e.toString())
                expect(e.toString()).to.be.contains("from id not found")
                return
            }
            expect("").to.be.contains("failed")
        })
    })


    describe("tx.to", async function () {

        it("deploy tx => successful", async () => {
            let result = await ethers.provider.send("eth_estimateGas", [{
                "data": logContract.bytecode,
            }]);
            expect(result.toString()).to.be.contains("0x")
        })
    })

    describe("from, to ,value,data", async () => {

        let contract;
        let public_func_sign = "0x2a9e9ea8"
        before(async function () {
            fallbackAndReceiveContract = await ethers.getContractFactory("fallbackAndReceive");
            contract = await fallbackAndReceiveContract.deploy()
            await contract.deployed()
        });

        it("empty", async () => {
            try {
                await ethers.provider.send("eth_estimateGas", [{}]);
                expect("").to.be.equal("failed")
            } catch (e) {
                expect(e.toString()).to.be.include("UNPREDICTABLE_GAS_LIMIT")
            }
        })



        it("no payable method invoke=> success", async () => {


            await ethers.provider.send("eth_estimateGas",[{
                "to":contract.address,
                "data":public_func_sign,
            }]);


        })
        it("no payable method with value invoke=> failed",async ()=>{
            try {
                await ethers.provider.send("eth_estimateGas",[{
                    "to":contract.address,
                    "data":public_func_sign,
                    "value":"0x1",
                }])
            }catch (e){
                expect(e.toString()).to.be.include("revert")
            }
        })
    })


})