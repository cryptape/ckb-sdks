const {ethers} = require("hardhat");
const {expect} = require("chai");
const {getGasPrice} = require("./utils/tx.js");
const {RLP} = require("ethers/lib/utils"); // NodeJS

const noRegisterAddress = "0xA768cB32724eE05cd9A4d6fd5818E77c269a45Ed"
describe("eth_call", function () {
    this.timeout(100000)
    let fallbackAndReceiveContract;
    let logContract;
    let fromUserAddress;
    // before(async function () {
    //     fromUserAddress = await ethers.provider.getSigner(0).getAddress()
    //     let fallbackAndReceiveContractInfo = await ethers.getContractFactory("fallbackAndReceive");
    //     let logContractInfo = await ethers.getContractFactory("LogContract");
    //     logContract = await logContractInfo.deploy()
    //     await logContract.deployed()
    //     fallbackAndReceiveContract = await fallbackAndReceiveContractInfo.deploy()
    //     await fallbackAndReceiveContract.deployed();
    //
    // });

    describe("tx.from", async function () {
        it("from address not exist = > from id not exist ", async () => {
            try {
                let result = await ethers.provider.send("eth_call", [{
                    "from": noRegisterAddress,
                    "to": fromUserAddress,
                }, "latest"]);
                console.log(result)
            } catch (e) {
                expect(e.toString()).to.be.contains("from id not found")
                return
            }
            expect("").to.be.equal("failed")
        })
    })

    describe("tx.to", async function () {
        it("to is EOA Address =>  to address is not a valid contract! ", async () => {
            let gasPrice = await getGasPrice(ethers.provider);
            console.log("gasPrice:", gasPrice)
            try {
                await ethers.provider.send("eth_call", [{
                    "from": fromUserAddress,
                    "to": fromUserAddress,
                }, "latest"]);
            } catch (e) {
                expect(e.toString()).to.be.contains("to address is not a valid contract.")
                return
            }
            expect("").to.be.equal("failed")
        })

        it("deploy tx => failed(to address is null) ", async () => {
            try {
                let result = await ethers.provider.send("eth_call", [{
                    "data": logContract.bytecode,
                }, "latest"]);
            } catch (e) {
                expect(e.toString()).to.be.contains("to address")
            }
        })
    })

    describe("from, to ,value,data", async () => {

        it("from is contract address", async () => {
            let result = await ethers.provider.send("eth_call", [{
                "from": fallbackAndReceiveContract.address,
                "to": fallbackAndReceiveContract.address,
                "data": "0x2a9e9ea8"
            }, "latest"])
            expect(result.toString()).to.be.equal("0x0000000000000000000000000000000000000000000000000000000000000001")
        })

        it("from is register eoa address", async () => {
            try {
                let result = await ethers.provider.send("eth_call", [{
                    "from": fromUserAddress,
                    "to": fallbackAndReceiveContract.address,
                    "data": "0x2a9e9ea8"
                }, "latest"])
                console.log("result:", result)
            } catch (e) {
            }


            result = await ethers.provider.send("eth_estimateGas", [{
                "to": fallbackAndReceiveContract.address,
                "data": "0x2a9e9ea8"
            }])
            console.log("result:", result)

        }).timeout(500000)
    })

    describe("ethCall block msg tx", async function () {
        const getMsgFnSign = "0xb5fdeb23"
        let ethCallContract
        before(async function () {
            let ethCallContractInfo = await ethers.getContractFactory("ethCallContract");
            ethCallContract = await ethCallContractInfo.deploy()
            await ethCallContract.deployed()
        })


        it("latest", async () => {
            let result = await ethers.provider.send("eth_call", [{
                "from": fromUserAddress,
                "to": ethCallContract.address,
                "data": getMsgFnSign
            }, "latest"])
            console.log("result:", result)
            // ethCallContract.
            let eth_call_msg = decodeGetMsg(result)
            console.log(eth_call_msg)
            expect(eth_call_msg.msgSender,)
        })

        function decodeGetMsg(decodeData){
            console.log("decodeGetMsg:",decodeData)
            //  function getMsg() public payable returns(address msgSender,uint256 msgValue,uint256 gasLimit,uint256 blockNumber,uint256 txGasPrice,address txOrigin)
            let ret = ethers.utils.defaultAbiCoder.decode([
                "address",
                "uint256",
                "uint256",
                "uint256",
                "uint256",
                "address"],
                decodeData)
            console.log(ret)
            let msgSender = ret[0];
            let msgValue = ret[1];
            let gasLimit = ret[2];
            let blockNumber = ret[3];
            let txGasPrice = ret[4];
            let txOrigin = ret[5];
            return {msgSender,msgValue,gasLimit,blockNumber,txGasPrice,txOrigin}
        }

    })


})