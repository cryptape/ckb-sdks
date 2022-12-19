const {ethers} = require("hardhat");
const {expect} = require("chai");

//https://github.com/cryptape/acceptance-internal/issues/65
describe("return big data", function () {
    let TestMultiCall, testMultiCallAddress, TestMultiCall1, testMultiCall1Address, Multicall3, multicall3Address,
        multicall3;
    before(async function () {
        this.timeout(120000);
        const chainId = (await ethers.provider.getNetwork()).chainId
        switch (chainId) {
            //goerli 5 用于对比
            case 5:
                console.log("in goerli")
                testMultiCallAddress = "0x28B6f6a8CDB323048AA66847e194028A4B0aDA5d";
                testMultiCall1Address = "0x7752dcd7c6ce4aed048c028021d635cbec6c001d";
                multicall3Address = "0xd0af3b233cc76229e00f5ac82f9e9db8da34ca05";
                break;
            //gw_testnet_v1 71401
            case 71401:
                console.log("in gw_testnet_v1")
                testMultiCallAddress = "0xd907b959e9de1852d6dddd8b5bf26a6ec54387f1";
                testMultiCall1Address = "0xa42b2bd703cd199ef02284eb751cdf50a837fd3c";
                multicall3Address = "0xcA11bde05977b3631167028862bE2a173976CA11";
                break;
            // gw_alphanet_v1 202206
            case 202206:
                console.log("in gw_alphanet_v1")
                testMultiCallAddress = "0xa13dD253b66183C3253E0A68E90956c299F5644b";
                testMultiCall1Address = "0xF844671d992113910971BcA62889CC35ab57968F";
                multicall3Address = "0x24dC617c22Fb31C2724Ad7d700fdfeC2f5aAc7d9";
                break;
            default:
                console.log(`in chain ${chainId}`)
                const TestMultiCall = await ethers.getContractFactory("TestMultiCall");
                const TestMultiCall1 = await ethers.getContractFactory("TestMultiCall1");
                const Multicall3 = await ethers.getContractFactory("Multicall3");
                const contract = await TestMultiCall.deploy();
                const contract1 = await TestMultiCall1.deploy();
                const multicallContract = await Multicall3.deploy();
                await contract.deployed();
                await contract1.deployed();
                await multicallContract.deployed();
                testMultiCallAddress = contract.address;
                testMultiCall1Address = contract1.address;
                multicall3Address = multicallContract.address;
        }
        TestMultiCall = await ethers.getContractFactory('TestMultiCall');
        TestMultiCall1 = await ethers.getContractFactory('TestMultiCall1');
        Multicall3 = await ethers.getContractFactory('Multicall3');
        multicall3 = await Multicall3.attach(multicall3Address);
        console.log(`testMultiCallAddress：${testMultiCallAddress}\ntestMultiCall1Address：${testMultiCall1Address}\nmulticall3Address：${multicall3Address}`)
    });

    it("return data < 128k", async () => {
        //最多支持120kb
        const call = getCall(120, testMultiCallAddress);
        const result = await multicall3.callStatic.aggregate(call)
        // console.log("result:", result)
        const resultSize = (result.returnData[0].length - 2) / 2 / 1024 * result.returnData.length
        expect(result.returnData.length).to.be.equal(call.length)
        expect(resultSize).to.be.equal(call.length)
    }).timeout(60000)

    it("return data > 128k", async () => {
        const call = getCall(129, testMultiCallAddress);
        try {
            await multicall3.callStatic.aggregate(call)
        } catch (e) {
            console.log(e);
            expect(e.toString()).to.include("CALL_EXCEPTION");
        }
    }).timeout(60000)

    it("call contains 500 addresses", async () => {
        //最多支持682个地址
        const call = getCall(500, testMultiCall1Address);
        const result = await multicall3.callStatic.aggregate(call)
        // console.log("result:", result)
        const resultSize = (result.returnData[0].length - 2) / 2 / 1024 * result.returnData.length
        console.log(`resultSize:${resultSize}kb`)
        expect(result.returnData.length).to.be.equal(call.length)
    }).timeout(60000)

    //https://github.com/godwokenrises/godwoken-internal/issues/1073
    // it("call contains 500 addresses sendRawTransaction", async () => {
    //     const call = getCall(500, testMultiCall1Address);
    //     await multicall3.aggregate(call)
    // }).timeout(60000)

    it("return data < 128k sendRawTransaction", async () => {
        try{
            const call = getCall(120, testMultiCallAddress);
            await multicall3.aggregate(call)
        }catch(e){
            expect(e.toString().toLowerCase()).to.include("out of gas")
            return
        }

    }).timeout(60000)

    it("return data > 128k sendRawTransaction", async () => {
        const call = getCall(129, testMultiCallAddress);
        try {
            await multicall3.aggregate(call)
        } catch (e) {
            console.log(e);
            // expect(e.toString()).to.include("cannot estimate gas")
            // expect(e.toString()).to.include("out of gas");
        }
    }).timeout(60000)
})

function getCall(callLength, contractAddress) {
    let call = new Array();
    for (let i = 0; i < callLength; i++) {
        let number = (i + 1).toString(16)
        const baseStr = "0x29e99f07000000000000000000000000000000000000000000000000000000000000000";
        let callElement = [contractAddress, baseStr.slice(0, baseStr.length - number.length + 1) + number]
        call[i] = callElement;
    }
    // console.log(call)
    return call;
}