const {ethers} = require("hardhat");
const {expect} = require("chai");
const {getGasPrice, getTxReceipt, BigInterToHexString} = require("./utils/tx.js");
const {BigNumber} = require("ethers");


describe("sendRawTransaction ", function () {

    this.timeout(600000)
    let registerAccountAddress;
    let contract;
    let fallbackAndReceiveContract;
    let logContract;
    before(async function () {
        registerAccountAddress = (await ethers.getSigners())[0].address
        fallbackAndReceiveContract = await ethers.getContractFactory("fallbackAndReceive");
        logContract = await ethers.getContractFactory("LogContract");
        console.log('logContract.bytecode:', logContract.bytecode)
    });

    describe("to", async function () {

        it("to is EOA Address =>  return txHash ", async () => {
            let gasPrice = await getGasPrice(ethers.provider);
            console.log("gasPrice:", gasPrice)
              let tx  =  await ethers.provider.send("eth_sendTransaction", [{
                    "from": registerAccountAddress,
                    "to": registerAccountAddress,
                    "gas": "0x76c000",
                    "gasPrice": gasPrice,
                    "value": "0x9184e72a",
                    "data": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"
                }]);
            let response = await getTxReceipt(ethers.provider,tx,100)
            expect(response.status).to.be.equal(1)
        }).timeout(5000)

        it("to is not exist Address => return txHash", async () => {
                let gasPrice = await getGasPrice(ethers.provider);

                let tx = await ethers.provider.send("eth_sendTransaction", [{
                    "from": registerAccountAddress,
                    "to": "0x0c1efcca2bcb65a532274f3ef24c044ef4ab6d71",
                    "gas": "0xffffff",
                    "gasPrice": gasPrice,
                    "value": "0x9",
                    "data": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"
                }]);
                let response = await getTxReceipt(ethers.provider,tx,100)
                expect(response.status).to.be.equal(1)
        }).timeout(5000)

        it("to is  contract Address => invoke success ", async () => {
            let gasPrice = await getGasPrice(ethers.provider);

            contract = await fallbackAndReceiveContract.deploy();
            await contract.deployed();
            let tx = await ethers.provider.send("eth_sendTransaction", [{
                "from": registerAccountAddress,
                "to": contract.address,
                "gasPrice": gasPrice,
                "value": "0x1",
            }]);
            let response = await getTxReceipt(ethers.provider, tx, 100)
            console.log("response:", response)
            let balanceOfContract = await ethers.provider.getBalance(contract.address)
            expect(balanceOfContract).to.be.equal(1)
        }).timeout(100000)

        it("to is null => deploy tx", async () => {
            let gasPrice = await getGasPrice(ethers.provider);

            let tx = await ethers.provider.send("eth_sendTransaction", [{
                "from": registerAccountAddress,
                "gas": "0x76c000",
                "gasPrice": gasPrice,
                "data": fallbackAndReceiveContract.bytecode
            }]);
            let response = await getTxReceipt(ethers.provider, tx, 5)
            console.log("response:", response)
            expect(response.to).to.be.equal(null)
            expect(response.contractAddress).to.be.contains("0x")
        }).timeout(50000)

        it("to is 0x0 =>  zero address 0x0000000000000000000000000000000000000000 has no valid account_id!", async () => {
            let gasPrice = await getGasPrice(ethers.provider);
            try {
                await ethers.provider.send("eth_sendTransaction", [{
                    "from": registerAccountAddress,
                    "to": "0x0000000000000000000000000000000000000000",
                    "gas": "0x76c000",
                    "gasPrice": gasPrice,
                    // "value": "0x9184e72a",
                    "data": fallbackAndReceiveContract.bytecode
                }]);
                expect("").to.be.equal("no")
            } catch (e) {
                expect(e.toString()).to.be.contains("zero address 0x0000000000000000000000000000000000000000 has no valid account_id!")
            }

        }).timeout(50000)
    })

    describe("gasLimit", function () {

        it("gasLimit default => invoke succ", async () => {
            let gasPrice = await getGasPrice(ethers.provider);
            console.log("gasPrice:", gasPrice._hex)
            let tx = await ethers.provider.send("eth_sendTransaction", [{
                "from": registerAccountAddress,
                "gasPrice": gasPrice,
                "data": fallbackAndReceiveContract.bytecode
            }]);
            let response = await getTxReceipt(ethers.provider, tx, 5)
            console.log("tx:", tx)
            console.log("response:", response)
            expect(response.status).to.be.equal(1)
        }).timeout(50000)

        it("gasLimit very min => out of gas(https://github.com/nervosnetwork/godwoken-web3/issues/382)", async () => {

            try {
                let tx = await ethers.provider.send("eth_sendTransaction", [{
                    "gas": "0x1",
                    "data": fallbackAndReceiveContract.bytecode
                }]);
                console.log("tx:", tx)
            } catch (e) {
                expect(e.toString()).to.be.contains("Gas")
                return
            }
            expect("").to.be.include("expected throw out of gas")
        }).timeout(50000)

        it("gasLimit is 1 => out of gas(https://github.com/nervosnetwork/godwoken-web3/issues/382)", async () => {
            // let gasPrice = await getGasPrice(ethers.provider);
            console.log("begin")
            // console.log("gasPrice:",gasPrice._hex)
            try {
                let tx = await ethers.provider.send("eth_sendTransaction", [{
                    // "from": registerAccountAddress,
                    "gas": "0x1",
                    // "gasPrice": "0x1",
                    "data": fallbackAndReceiveContract.bytecode
                }]);
                console.log("tx:", tx)
            } catch (e) {
                console.log("e:", e)
                expect(e.toString()).to.be.contains("Gas")
                return
            }
            expect("").to.be.include("expected throw out of gas")
        }).timeout(50000)

        it.skip("gasLimit is 0 => out of gas", async () => {

            try {
                let tx = await ethers.provider.send("eth_sendTransaction", [{
                    "gas": "0x0",
                    "data": fallbackAndReceiveContract.bytecode
                }]);
                console.log("tx:", tx)
            } catch (e) {
                console.log("e:", e)
                expect(e.toString()).to.be.contains("gas")
                return
            }
            expect("").to.be.contains("expected throw out of gas")
        }).timeout(50000)

        it("gasLimit very large => exceeds  gas limit(https://github.com/nervosnetwork/godwoken-web3/issues/259)", async () => {
            let gasPrice = await getGasPrice(ethers.provider);
            console.log("begin")
            try {
                await ethers.provider.send("eth_sendTransaction", [{
                    "gas": "0xffffffffff",
                    "gasPrice": gasPrice,
                    "data": fallbackAndReceiveContract.bytecode
                }]);
            } catch (e) {
                expect(e.toString()).to.be.contains("exceeds")
                return
            }
            expect("").to.be.contains("expected throw out of gas ：https://github.com/nervosnetwork/godwoken-web3/issues/259")
        }).timeout(50000)


    })

    describe("gasPrice", function () {

        it("gasPrice is zero => to do( wait ) invoke success", async () => {
            try {
                await ethers.provider.send("eth_sendTransaction", [{
                    "gasPrice": "0x0",
                    "data": fallbackAndReceiveContract.bytecode
                }]);
            }catch (e){
                expect(e.message).to.be.include('price')
                return
            }
            expect('').to.be.equal('failed')

        }).timeout(50000)

        it("gasPrice is very max  => sender doesn't have enough funds to send tx", async () => {
            try {
                let tx = await ethers.provider.send("eth_sendTransaction", [{
                    "gasPrice": "0xfffffffffffffffff",
                    "data": fallbackAndReceiveContract.bytecode
                }]);
                console.log("tx:", tx)
                let response = await getTxReceipt(ethers.provider, tx, 100)
                console.log("response :", response)
                let txInfo = await ethers.provider.getTransaction(tx)
                console.log("txInfo:", txInfo)
            } catch (e) {
                // expect(e.toString().toLowerCase()).to.be.include("insufficient")
                return
            }
            expect("").to.be.contains("expected throw out of gas")
        }).timeout(50000)

    })

    describe("value", function () {

        it("value is 0=> normal tx", async () => {
            let account0Address = await ethers.provider.getSigner(0).getAddress()
            let beforeDeployBalance = await ethers.provider.getBalance(account0Address)
            let tx = await ethers.provider.send("eth_sendTransaction", [{
                "data": fallbackAndReceiveContract.bytecode,
                "gasPrice": "0x1",
                "value": null,
            }]);
            let response = await getTxReceipt(ethers.provider, tx, 20)

            let afterDeployBalance = await ethers.provider.getBalance(account0Address)
            expect(beforeDeployBalance.sub(response.gasUsed)).to.be.equal(afterDeployBalance);
        }).timeout(40000)

        it("value is 500 =>  to+500 ,from -500", async () => {
            let account0Address = await ethers.provider.getSigner(0).getAddress();
            let beforeDeployBalance = await ethers.provider.getBalance(account0Address)
            let tx = await ethers.provider.send("eth_sendTransaction", [{
                "data": logContract.bytecode,
                "gasPrice": "0x1",
                "value": "0x5",
            }]);
            let response = await getTxReceipt(ethers.provider, tx, 20)
            let afterDeployBalance = await ethers.provider.getBalance(account0Address)
            let contractBalance = await ethers.provider.getBalance(response.contractAddress)
            expect(beforeDeployBalance.sub(BigNumber.from("0x5")).sub(response.gasUsed)).to.be.equal(afterDeployBalance);
            expect(contractBalance).to.be.equal(BigNumber.from("0x5"));
        }).timeout(40000)


        it("value > from balance => faild tx:sender doesn't have enough funds to send tx", async () => {
            try {
                await ethers.provider.send("eth_sendTransaction", [{
                    "data": fallbackAndReceiveContract.bytecode,
                    "gasPrice": "0x0",
                    "value": "0x5000000000000000000000000000000",
                }]);
            } catch (e) {
                expect(e.toString().toLowerCase()).to.be.include("insufficient")
                return
            }
            expect('').to.be.equal('failed')
        })
    })
    describe("value gas gasPrice", function () {
        it("balance = balance-value-gasPrice*gasUsed", async () => {

            let beforeDeployBalance = await ethers.provider.getBalance(ethers.provider.getSigner(0).getAddress())
            let tx = await ethers.provider.send("eth_sendTransaction", [{
                "data": logContract.bytecode,
                "gasPrice": "0x5000",
                "value": "0x11",
            }]);
            let response = await getTxReceipt(ethers.provider, tx, 10)
            let afterDeployBalance = await ethers.provider.getBalance(ethers.provider.getSigner(0).getAddress())
            expect(beforeDeployBalance.sub(BigNumber.from("0x5000").mul(response.gasUsed)).sub(BigNumber.from("0x11"))).to.be.equal(afterDeployBalance);
        }).timeout(50000)
    })

    describe("data ,to ", function () {
        it("to has fallback func,data is 0x", async () => {
            let contract = await fallbackAndReceiveContract.deploy();
            await contract.deployed()
            console.log("address:", contract.address)
            let tx = await ethers.provider.send("eth_sendTransaction", [{
                "to": contract.address,
                "data": null,
            }]);
            let response = await getTxReceipt(ethers.provider, tx, 10)
            console.log("response:", response)
        }).timeout(50000)

        it("data payload to is null=> deploy", async () => {
            let tx = await ethers.provider.send("eth_sendTransaction", [{
                "to": null,
                "data": logContract.bytecode,
            }])
            let response = await getTxReceipt(ethers.provider, tx, 10)
            console.log("response-:", response)

        }).timeout(500000)

        describe("nonce", function () {
            it("tx is normal  => return nonce eq between pending and  latest ", async () => {

                let currentAddress = await ethers.provider.getSigner().getAddress();
                let sendBeforeNonces = await getTxCount(currentAddress);
                let penddingNonce = await ethers.provider.getTransactionCount(ethers.provider.getSigner().getAddress(), "pending")
                await ethers.provider.getSigner().sendTransaction({
                    "to": null,
                    "nonce": penddingNonce,
                    "data": logContract.bytecode,
                })
                let sendReturnHashNonces = await getTxCount(currentAddress);
                expect(sendBeforeNonces[0]).to.be.equal(sendBeforeNonces[1])
                expect(sendReturnHashNonces[0]).to.be.equal(sendReturnHashNonces[1])
                expect(sendBeforeNonces[0] + 1).to.be.equal(sendReturnHashNonces[1])
            }).timeout(5000000)

            it("tx is failed tx => pending and  latest  update ", async () => {

                let currentAddress = await ethers.provider.getSigner().getAddress();
                let sendBeforeNonces = await getTxCount(currentAddress);
                let penddingNonce = await ethers.provider.getTransactionCount(ethers.provider.getSigner().getAddress(), "pending")
                let tx = await ethers.provider.send("eth_sendTransaction", [{
                    "to": null,
                    "gas": "0xffffff",
                    "nonce": BigInterToHexString(BigNumber.from(penddingNonce)),
                    "data": "0x12122121121211212211",
                }])
                await getTxReceipt(ethers.provider, tx, 100)
                let sendReturnHashNonces = await getTxCount(currentAddress);
                expect(sendBeforeNonces[0]).to.be.equal(sendBeforeNonces[1])
                expect(sendReturnHashNonces[0]).to.be.equal(sendReturnHashNonces[1])
                expect(sendBeforeNonces[0] + 1).to.be.equal(sendReturnHashNonces[1])
            })

            async function getTxCount(address) {
                // for (let i = 0; i < 100; i++) {
                let pendingNonce = ethers.provider.getTransactionCount(address, "pending")
                let latestNonce = ethers.provider.getTransactionCount(address, "latest")
                console.log("pending:", await pendingNonce, ",latest:", await latestNonce)
                // await new Promise(r => setTimeout(r, 100));
                let nonces = []
                nonces.push(await pendingNonce);
                nonces.push(await latestNonce)
                return nonces;
            }


            it("nonce is too low  => invalid nonce ", async () => {
                let penddingNonce = await ethers.provider.getTransactionCount(ethers.provider.getSigner().getAddress(), "pending")
                console.log("pendding:", penddingNonce)
                try {
                    await ethers.provider.getSigner().sendTransaction({
                        "to": null,
                        "nonce": penddingNonce - 1,
                        "data": logContract.bytecode,
                    })
                } catch (e) {
                    expect(e.toString()).to.be.contains("invalid nonce")
                    return
                }
                expect("").to.be.equal("failed")
            })

            it("nonce is too max   => invalid nonce ", async () => {
                let penddingNonce = await ethers.provider.getTransactionCount(ethers.provider.getSigner().getAddress(), "pending")
                console.log("pendding:", penddingNonce)
                try {
                    let tx = await ethers.provider.getSigner().sendTransaction({
                        "to": null,
                        "nonce": penddingNonce + 1,
                        "data": logContract.bytecode,
                    })
                    console.log("tx:", tx)
                } catch (e) {
                    expect(e.toString()).to.be.contains("invalid nonce")
                    return
                }
                expect("").to.be.equal("failed")
            })
        })

    })

    describe("nonce gasprice", function () {

        it.skip("send 10 tx  that  nonce are same and  gasPrice  0 -> 10", async () => {
            let txs = []
            let pendingNonce = await ethers.provider.getTransactionCount(ethers.provider.getSigner().getAddress(), "pending")
            let gasPrice = BigNumber.from("0x11")
            for (let i = 0; i < 2; i++) {
                try {
                    gasPrice = gasPrice.add(BigNumber.from("0x11"))
                    console.log("gasPrice:", gasPrice.toString())

                    let tx = ethers.provider.getSigner().sendTransaction({
                        "to": null,
                        "nonce": pendingNonce,
                        "gasPrice": gasPrice.add(BigNumber.from("0x1")).toHexString(),
                        "data": logContract.bytecode,
                    })
                    txs.push(tx)
                } catch (e) {
                    console.log(e)
                }
            }
            console.log("--------")
            let responses = []
            for (let i = 0; i < txs.length; i++) {
                try {
                    let tx = await txs[i];
                    console.log("tx:", tx)
                    let response = await getTxReceipt(ethers.provider, tx.hash, 10)
                    responses.push(response)
                } catch (e) {
                    console.log("idx:", i, ",e:", e)
                }
            }
            console.log("print response ")
            for (let i = 0; i < responses.length; i++) {
                console.log("response:", responses[i])

            }
        }).timeout(100000)
    })
})
