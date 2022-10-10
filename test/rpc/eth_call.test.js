const {ethers} = require("hardhat");
const {expect} = require("chai");
const {getGasPrice} = require("./utils/tx.js");
const {BigNumber} = require("ethers"); // NodeJS

const noRegisterAddress = "0xA768cB32724eE05cd9A4d6fd5818E77c269a4511"
describe("eth_call", function () {
    this.timeout(600000)
    let fallbackAndReceiveContract;
    let logContract;
    let fromUserAddress;
    before(async function () {
        fromUserAddress = await ethers.provider.getSigner(0).getAddress()
        let fallbackAndReceiveContractInfo = await ethers.getContractFactory("fallbackAndReceive");
        let logContractInfo = await ethers.getContractFactory("LogContract");
        logContract = await logContractInfo.deploy()
        await logContract.deployed()
        fallbackAndReceiveContract = await fallbackAndReceiveContractInfo.deploy()
        await fallbackAndReceiveContract.deployed();

    });

    describe("tx.from", async function () {
        it("from address not exist = > from id not exist ", async () => {
                let result = await ethers.provider.send("eth_call", [{
                    "from": noRegisterAddress,
                    "to": fallbackAndReceiveContract.address,
                }, "latest"]);
                expect(result).to.be.equal('0x')
        })
    })

    describe("tx.to", async function () {
        it("to is EOA Address =>  should return 0x ", async () => {
            let gasPrice = await getGasPrice(ethers.provider);
            let response =  await ethers.provider.send("eth_call", [{
                    "from": fromUserAddress,
                    "to": fromUserAddress,
                }, "latest"]);
            expect(response).to.be.equal('0x')
        })

        it("deploy tx => failed(to address is null) ", async () => {
            try {
                await ethers.provider.send("eth_call", [{
                    "data": logContract.bytecode,
                }, "latest"]);
            } catch (e) {
                expect(e.toString()).to.be.contains("to address")
            }
        })
    })

    describe("from, to ,value,data", async () => {

        it("from is contract address(https://github.com/nervosnetwork/godwoken-web3/pull/416)", async () => {
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
        let deployTxReceipt;
        before(async function () {
            let ethCallContractInfo = await ethers.getContractFactory("ethCallContract");
            ethCallContract = await ethCallContractInfo.deploy()
            await ethCallContract.deployed()
            deployTxReceipt = await ethCallContract.deployTransaction.wait(3)
            console.log("deployTxReceipt:",deployTxReceipt)
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
            expect(eth_call_msg.msgSender).to.be.equal(fromUserAddress)
            expect(eth_call_msg.msgValue.toString()).to.be.equal("0")
            expect(eth_call_msg.txOrigin).to.be.equal(fromUserAddress)
            // geth is 0
            // expect(eth_call_msg.txGasPrice).to.be.equal("1")
        })

        it("earliest", async () => {
            try {
                await ethers.provider.send("eth_call", [{
                    "from": fromUserAddress,
                    "to": ethCallContract.address,
                    "data": getMsgFnSign
                }, "earliest"])
            }catch (e) {
                expect(e.toString()).to.be.include("to address is not a valid contract")
            }
        })

        it(" in deploy num",async ()=>{
            // deployTxReceipt
            let result = await ethers.provider.send("eth_call", [{
                "from": fromUserAddress,
                "to": ethCallContract.address,
                "data": getMsgFnSign
            }, BigNumber.from(deployTxReceipt.blockNumber).toHexString()])

            let eth_call_msg = decodeGetMsg(result)
            console.log(eth_call_msg)
            expect(eth_call_msg.blockNumber.toHexString()).to.be.equal(BigNumber.from(deployTxReceipt.blockNumber).toHexString())
        })



        it("deploy  num +1",async ()=>{
            let result = await ethers.provider.send("eth_call", [{
                "from": fromUserAddress,
                "to": ethCallContract.address,
                "data": getMsgFnSign
            }, BigNumber.from(deployTxReceipt.blockNumber+1).toHexString()])
            // ethCallContract.
            let eth_call_msg = decodeGetMsg(result)
            console.log(eth_call_msg)
            expect(eth_call_msg.blockNumber.toHexString()).to.be.equal( BigNumber.from(deployTxReceipt.blockNumber+1).toHexString())

        })

        it("larger than the latest block" ,async ()=>{
            try {
                let num = await ethers.provider.getBlockNumber()
                await ethers.provider.send("eth_call", [{
                    "from": fromUserAddress,
                    "to": ethCallContract.address,
                    "data": getMsgFnSign
                }, BigNumber.from(num+100).toHexString()])
                expect("").to.be.equal("failed")
            }catch (e){
                expect(e.toString()).to.be.include("header not found")

            }
        })

        it("value",async ()=>{
            let result = await ethers.provider.send("eth_call", [{
                "from": fromUserAddress,
                "to": ethCallContract.address,
                "value":"0x11",
                "data": getMsgFnSign
            }, "latest"])
            console.log("result:", result)
            // ethCallContract.
            let eth_call_msg = decodeGetMsg(result)
            console.log(eth_call_msg)
            expect(eth_call_msg.msgValue.toHexString()).to.be.equal("0x11")
        })

        it("gas",async ()=>{
            let result = await ethers.provider.send("eth_call", [{
                "from": fromUserAddress,
                "to": ethCallContract.address,
                "value":"0x11",
                "gas": "0xffff",
                "data": getMsgFnSign
            }, "latest"])
            console.log("result:", result)
            // ethCallContract.
            let eth_call_msg = decodeGetMsg(result)
            console.log(eth_call_msg)
        })

        it("gas - very big (godwoken-exceeds rpc gas limit of)",async ()=>{
            try{
                await ethers.provider.send("eth_call", [{
                    "from": fromUserAddress,
                    "to": ethCallContract.address,
                    "value":"0x11",
                    "gas": "0xffffffffffff",
                    "data": getMsgFnSign
                }, "latest"])
            }catch (e){
                expect(e.toString()).to.be.include("exceeds rpc gas limit of")
            }
        })

        it("gas - out of gas  ",async ()=>{
            try{
                await ethers.provider.send("eth_call", [{
                    "from": fromUserAddress,
                    "to": ethCallContract.address,
                    "value":"0x11",
                    "gas": "0x5248",
                    "data": getMsgFnSign
                }, "latest"])
            }catch (e){
                expect(e.toString()).to.be.include("execution reverted")
                return
            }
            expect("").to.be.equal("failed")

        })

        it("gasPrice",async ()=>{
            let result = await ethers.provider.send("eth_call", [{
                "from": fromUserAddress,
                "to": ethCallContract.address,
                "value":"0x11",
                "gasPrice":"0x11",
                "data": getMsgFnSign
            }, "latest"])
            console.log("result:", result)
            // ethCallContract.
            let eth_call_msg = decodeGetMsg(result)
            console.log(eth_call_msg)
        })
        it("gasPrice-very big",async ()=>{
            try {
                await ethers.provider.send("eth_call", [{
                    "from": fromUserAddress,
                    "to": ethCallContract.address,
                    "value":"0x11",
                    "gasPrice":"0xffffffffffffffffffffffff",
                    "data": getMsgFnSign
                }, "latest"])
            }catch (e){
                // expect(e.toString().toLowerCase()).to.be.include("insufficient")
                return
            }
            expect("").to.be.equal("failed")

        })
        it("gasPrice- out of very big",async ()=>{
            try {
                await ethers.provider.send("eth_call", [{
                    "from": fromUserAddress,
                    "to": ethCallContract.address,
                    "value":"0x11",
                    "gasPrice":"0x1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
                    "data": getMsgFnSign
                }, "latest"])
            }catch (e){
                return
            }
            expect("").to.be.equal("failed")


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
