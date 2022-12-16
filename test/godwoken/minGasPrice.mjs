import hardhat from "hardhat"

const {ethers} = hardhat

describe("minGasPrice", function () {
    it("get gasPrice", async () => {
        let gasPrice = await getGasPrice(ethers.provider);
        let ethGasPrice = ethers.utils.formatEther(parseInt(gasPrice, 16));
        let latestBlock = await ethers.provider.getBlockNumber();
        console.log(ethGasPrice, latestBlock);
    }).timeout(50000)
})

async function getGasPrice(provider) {
    let gasPrice = await provider.getGasPrice();
    return gasPrice.toHexString().replaceAll("0x0", "0x");
}