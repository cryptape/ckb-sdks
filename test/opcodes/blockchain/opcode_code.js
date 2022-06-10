const {ethers} = require("hardhat");
const {expect} = require("chai");

//ext_code_size
//ext_code_copy
//code_copy
describe("opcode_code.js opcode -code ", function () {
    this.timeout(100000)

    let contract;

    beforeEach(async function () {
        const contractInfo = await ethers.getContractFactory("opcode_code");
        contract = await contractInfo.deploy();
        await contract.deployed();
        console.log("contractAddress:", contract.address);
    });

    it("code ", async () => {
        try {
            await contract.ass(33, 4, 32);
            expect("").to.be.contains("godwoken is  failed tx")
        } catch (e) {

        }

    });

    it("code store", async () => {
        try {
            let tx = await contract.storeData(33, 4, 32);
            await tx.wait();
        } catch (error) {
            expect(error.toString()).to.be.contains("gas")
        }
        let ab = await contract.getAB();
        expect(ab[0]).to.be.equal("0x")
        expect(ab[1]).to.be.equal("0x")
    })

})

