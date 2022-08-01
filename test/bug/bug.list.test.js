const {ethers} = require("hardhat");
const {expect} = require("chai");
const {getTxReceipt, getGasPrice} = require("../rpc/utils/tx.js");
const {sendTxToAddBlockNum} = require("../rpc/utils/tx");
const {BigNumber} = require("ethers");

describe("bug", function () {
    this.timeout(600000)
    it("out of gas tx(https://github.com/RetricSu/godwoken-kicker/issues/279)", async () => {
        let eventTestContractInfo = await ethers.getContractFactory("eventTestContract");
        let contract = await eventTestContractInfo.deploy()
        await contract.deployed()
        let tx = await contract.testEvent(2, 7, 1, 17500, {gasLimit: "0x989680"})
        let response = await getTxReceipt(ethers.provider, tx.hash, 10)
        expect(response.status).to.be.equal(0)
    }).timeout(60000)

    it("eth_call  Backend must update nonce(https://github.com/nervosnetwork/godwoken-web3/issues/398)", async () => {
        // deploy contract
        let eventTestContractInfo = await ethers.getContractFactory("eventTestContract");
        let contract = await eventTestContractInfo.deploy()
        await contract.deployed()
        // one thread send tx
        let tx = sendTx(contract, 10)
        // one thread invoke eth_call
        let ethCallTx = eth_call(contract, 70)
        let eth_gasTx = eth_gas(contract, 70)

        await ethCallTx
        await eth_gasTx
        await tx
    })

    async function eth_gas(contract, loopCount) {
        for (let i = 0; i < loopCount; i++) {
            let response = await ethers.provider.send("eth_estimateGas", [{
                "to": contract.address,
                "data": "0xffffff"
            }])
            expect(response).to.be.include("0x")
        }
    }

    async function eth_call(contract, loopCount) {
        for (let i = 0; i < loopCount; i++) {
            try {

                let response = await ethers.provider.send("eth_call", [{
                    "to": contract.address,
                    "data": "0xffffff"
                }, 'latest'])
                expect(response).to.be.equal("0x")
            } catch (e) {
                expect(e.toString()).to.be.not.include("Backend must update nonce")
            }

        }
    }

    async function sendTx(contract, loopCount) {
        for (let i = 0; i < loopCount; i++) {
            await contract.testEvent(2, 7, 1, 1, {gasLimit: "0x989680"})
        }
    }

    it("oz(https://github.com/nervosnetwork/godwoken-web3/issues/301)", async () => {

        let contractInfo = await ethers.getContractFactory("BugProxyTest");
        console.log("1. deploy BugProxyTest contract ")
        let contract = await contractInfo.deploy();
        await contract.deployed();
        console.log("2. invoke BugProxyTest.TestProxy()")
        let tx = await contract.TestProxy();
        await tx.wait()
        console.log("3. proxyAddress = BugProxyTest.proxy()")
        let proxyAddress = await contract.proxy();
        let Implementation2ContractInfo = await ethers.getContractFactory("Implementation2");
        let account = await ethers.getSigners();
        console.log("4. invoke Implementation2(proxyAddress).getValue()")
        let Implementation2ContractProxy = Implementation2ContractInfo.connect(account[0]).attach(proxyAddress);
        let getValue = await Implementation2ContractProxy.getValue();
        console.log("getValue:", getValue)
        console.log("5. invoke Implementation2(proxyAddress).setValue(433)")
        tx = await Implementation2ContractProxy.setValue(433);
        await tx.wait()
        getValue = await Implementation2ContractProxy.getValue();
        console.log("getValue:", getValue)
        expect(getValue.toString()).to.be.equal("433");
    })


    it.skip("https://github.com/nervosnetwork/godwoken-web3/issues/245", async () => {
        const blockInfoContract = await ethers.getContractFactory("create2_test");
        let contract = await blockInfoContract.deploy();
        await contract.deployed();
        let tx = await contract.test_create2_destruct();
        let receipt = await tx.wait();
        expect(receipt.events[2].args[1].toString()).to.be.not.equal("0x0000000000000000000000000000000000000000")
        tx = await contract.test_create2_destruct();
        receipt = await tx.wait();
        expect(receipt.events[2].args[1].toString()).to.be.not.equal("0x0000000000000000000000000000000000000000")
    })

    it("the error message is not as friendly as other blockchain platforms(https://github.com/nervosnetwork/godwoken-web3/issues/247)", async () => {
        //https://github.com/nervosnetwork/godwoken-web3/issues/247
        //curl -X POST --data '{"jsonrpc":"2.0",  "method":"eth_newFilter",  "params":[{"topics":["0x12341234"]}],  "id":73}' https://godwoken-testnet-web3-v1-rpc.ckbapp.dev -H "Content-Type: application/json"
        try {
            await ethers.provider.send("eth_newFilter", [{"topics": ["0x12341234"]}])
        } catch (e) {
            expect(e.toString()).to.be.contains("invalid")
            expect(e.toString()).to.be.contains("32")
        }
    })

    it("gasLimit has no upper limit(https://github.com/nervosnetwork/godwoken-web3/issues/259)", async () => {
        let fallbackAndReceiveContract = await ethers.getContractFactory("fallbackAndReceive");
        let gasPrice = await getGasPrice(ethers.provider);
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
    })
    it("(eth_getFilterChanges query filterId from eth_newBlockFilter inconsistent with other chains)(https://github.com/nervosnetwork/godwoken-web3/issues/271)", async () => {
        const filterId = await ethers.provider.send("eth_newBlockFilter", []);
        const txs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
        expect(txs.length).to.be.equal(0)
    })

    it("eth_getFilterChanges query filterId from eth_newFilter inconsistent with other chains(https://github.com/nervosnetwork/godwoken-web3/issues/273)", async () => {
        let BeginBlkNum = await ethers.provider.getBlockNumber();
        const filterId = await ethers.provider.send("eth_newFilter", [{}]);
        await sendTxToAddBlockNum(ethers.provider, 1)
        const logs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
        let endBlkNum = await ethers.provider.getBlockNumber();
        console.log("begin blkNum:", BeginBlkNum.toString())
        console.log("end blkNum:", endBlkNum.toString())
        console.log("=====eth_getFilterChanges==========")
        let latestBlkNum = 0;
        let latestBlkIdx = 0;
        let latestLogIdx = 0;
        for (let i = 0; i < logs.length; i++) {
            console.log("blockNumber:", BigNumber.from(logs[i].blockNumber.toString()).toString(), "blkIdx:", logs[i].transactionIndex, "logIndex:", logs[i].logIndex)
            let nowBlkNum = BigNumber.from(logs[i].blockNumber);
            let nowBlkIdx = BigNumber.from(logs[i].transactionIndex);
            let nowLogIdx = BigNumber.from(logs[i].logIndex);
            expect(BigNumber.from(nowBlkNum * 10000 * 10000 + nowBlkIdx * 10000 + nowLogIdx)).to.be.gt(BigNumber.from(latestBlkNum * 10000 * 10000 + latestBlkIdx * 10000 + latestLogIdx));
            latestBlkNum = nowBlkNum;
            latestBlkIdx = nowBlkIdx;
            latestLogIdx = nowLogIdx;
        }
    })

    it("eth_estimateGas return data out-of-bounds(https://github.com/nervosnetwork/godwoken-web3/issues/286)", async () => {
        let contractInfo = await ethers.getContractFactory("CallReceiverMock");
        console.log("begin")
        let contract = await contractInfo.deploy();
        await contract.deployed();
        console.log("invoke assert method")
        try {
            let tx = await contract.mockFunctionThrows();
            await tx.wait()
        } catch (e) {
            expect(e.toString()).to.be.contains("UNPREDICTABLE_GAS_LIMIT")
            return
        }
        expect("").to.be.contains("failed")
    })

    it("no return required error message(https://github.com/nervosnetwork/godwoken-web3/issues/291)", async () => {
        //https://github.com/nervosnetwork/godwoken-web3/issues/291

        let ReentrancyMockInfo = await ethers.getContractFactory("ReentrancyMock");
        let ReentrancyMockContract = await ReentrancyMockInfo.deploy()
        await ReentrancyMockContract.deployed()
        console.log("contract Address:", ReentrancyMockContract.address)
        let ReentrancyAttackInfo = await ethers.getContractFactory("ReentrancyAttack");
        let ReentrancyAttackContract = await ReentrancyAttackInfo.deploy();
        await ReentrancyAttackContract.deployed();
        console.log("ReentrancyAttackContract Address:", ReentrancyAttackContract.address)
        try {
            let tx = await ReentrancyMockContract.countAndCall(ReentrancyAttackContract.address);
            await tx.wait()
        } catch (e) {
            expect(e.toString()).to.be.contains("ReentrancyAttack: failed call")
            return
        }
        expect("").to.be.contains("failed")
    })
    it("eth_estimateGas deploy max code size(https://github.com/nervosnetwork/godwoken-web3/issues/305)", async () => {
        //https://github.com/nervosnetwork/godwoken-web3/issues/305
        try {
            await ethers.provider.send("eth_estimateGas", [{
                "data": "0x608060405234801561001057600080fd5b50616648806100206000396000f3fe60806040523480156200001157600080fd5b50600436106200003a5760003560e01c806364f402c9146200003f578063aa9449f21462000061575b600080fd5b6200004962000081565b604051620000589190620002a6565b60405180910390f35b6200007f600480360381019062000079919062000321565b620000a5565b005b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b8073ffffffffffffffffffffffffffffffffffffffff1663fc0c546a6040518163ffffffff1660e01b8152600401602060405180830381865afa158015620000f1573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000117919062000398565b600460108373ffffffffffffffffffffffffffffffffffffffff1663be20f8be6040518163ffffffff1660e01b8152600401602060405180830381865afa15801562000167573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200018d919062000423565b60006040516200019d906200020d565b620001ad959493929190620005e7565b604051809103906000f080158015620001ca573d6000803e3d6000fd5b506000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b615fb9806200065a83390190565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600062000266620002606200025a846200021b565b6200023b565b6200021b565b9050919050565b60006200027a8262000245565b9050919050565b60006200028e826200026d565b9050919050565b620002a08162000281565b82525050565b6000602082019050620002bd600083018462000295565b92915050565b600080fd5b6000620002d5826200021b565b9050919050565b6000620002e982620002c8565b9050919050565b620002fb81620002dc565b81146200030757600080fd5b50565b6000813590506200031b81620002f0565b92915050565b6000602082840312156200033a5762000339620002c3565b5b60006200034a848285016200030a565b91505092915050565b60006200036082620002c8565b9050919050565b620003728162000353565b81146200037e57600080fd5b50565b600081519050620003928162000367565b92915050565b600060208284031215620003b157620003b0620002c3565b5b6000620003c18482850162000381565b91505092915050565b6000620003d7826200021b565b9050919050565b6000620003eb82620003ca565b9050919050565b620003fd81620003de565b81146200040957600080fd5b50565b6000815190506200041d81620003f2565b92915050565b6000602082840312156200043c576200043b620002c3565b5b60006200044c848285016200040c565b91505092915050565b600082825260208201905092915050565b7f4f5a2d476f7665726e6f72000000000000000000000000000000000000000000600082015250565b60006200049e600b8362000455565b9150620004ab8262000466565b602082019050919050565b6000620004c38262000245565b9050919050565b6000620004d782620004b6565b9050919050565b620004e981620004ca565b82525050565b6000819050919050565b6000819050919050565b6000620005246200051e6200051884620004ef565b6200023b565b620004f9565b9050919050565b620005368162000503565b82525050565b6000819050919050565b600062000567620005616200055b846200053c565b6200023b565b620004f9565b9050919050565b620005798162000546565b82525050565b60006200058c826200026d565b9050919050565b6200059e816200057f565b82525050565b6000819050919050565b6000620005cf620005c9620005c384620005a4565b6200023b565b620004f9565b9050919050565b620005e181620005ae565b82525050565b600060c082019050818103600083015262000602816200048f565b9050620006136020830188620004de565b6200062260408301876200052b565b6200063160608301866200056e565b62000640608083018562000593565b6200064f60a0830184620005d6565b969550505050505056fe6101606040523480156200001257600080fd5b5060405162005fb938038062005fb98339818101604052810190620000389190620007f3565b808583868660008b8062000051620001b960201b60201c565b60008280519060200120905060008280519060200120905060007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f90508260e081815250508161010081815250504660a08181525050620000ba818484620001f660201b60201c565b608081815250503073ffffffffffffffffffffffffffffffffffffffff1660c08173ffffffffffffffffffffffffffffffffffffffff1681525050806101208181525050505050505080600090805190602001906200011b92919062000499565b50506200012e836200023260201b60201c565b6200013f826200027960201b60201c565b62000150816200030660201b60201c565b50505062000164816200034d60201b60201c565b508073ffffffffffffffffffffffffffffffffffffffff166101408173ffffffffffffffffffffffffffffffffffffffff168152505050620001ac81620003ee60201b60201c565b5050505050505062000b6d565b60606040518060400160405280600181526020017f3100000000000000000000000000000000000000000000000000000000000000815250905090565b6000838383463060405160200162000213959493929190620008eb565b6040516020818303038152906040528051906020012090509392505050565b7fc565b045403dc03c2eea82b81a0465edad9e2e7fc4d97e11421c209da93d7a93600254826040516200026792919062000948565b60405180910390a18060028190555050565b60008111620002bf576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620002b690620009fc565b60405180910390fd5b7f7e3f7f0708a84de9203036abaa450dccc85ad5ff52f78c170f3edb55cf5e882860035482604051620002f492919062000948565b60405180910390a18060038190555050565b7fccb45da8d5717e6c4544694297c4ba5cf151d455c9bb0ed4fc7a38411bc05461600454826040516200033b92919062000948565b60405180910390a18060048190555050565b7f08f74ea46ef7894f65eabfb5e6e695de773a000b47c529ab559178069b226401600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1682604051620003a292919062000a1e565b60405180910390a180600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b620003fe6200049060201b60201c565b81111562000443576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016200043a9062000ae7565b60405180910390fd5b60006007549050816007819055507f0553476bf02ef2726e8ce5ced78d63e26e602e4a2257b1f559418e24b463399781836040516200048492919062000948565b60405180910390a15050565b60006064905090565b828054620004a79062000b38565b90600052602060002090601f016020900481019282620004cb576000855562000517565b82601f10620004e657805160ff191683800117855562000517565b8280016001018555821562000517579182015b8281111562000516578251825591602001919060010190620004f9565b5b5090506200052691906200052a565b5090565b5b80821115620005455760008160009055506001016200052b565b5090565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620005b28262000567565b810181811067ffffffffffffffff82111715620005d457620005d362000578565b5b80604052505050565b6000620005e962000549565b9050620005f78282620005a7565b919050565b600067ffffffffffffffff8211156200061a576200061962000578565b5b620006258262000567565b9050602081019050919050565b60005b838110156200065257808201518184015260208101905062000635565b8381111562000662576000848401525b50505050565b60006200067f6200067984620005fc565b620005dd565b9050828152602081018484840111156200069e576200069d62000562565b5b620006ab84828562000632565b509392505050565b600082601f830112620006cb57620006ca6200055d565b5b8151620006dd84826020860162000668565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200071382620006e6565b9050919050565b6000620007278262000706565b9050919050565b62000739816200071a565b81146200074557600080fd5b50565b60008151905062000759816200072e565b92915050565b6000819050919050565b62000774816200075f565b81146200078057600080fd5b50565b600081519050620007948162000769565b92915050565b6000620007a782620006e6565b9050919050565b6000620007bb826200079a565b9050919050565b620007cd81620007ae565b8114620007d957600080fd5b50565b600081519050620007ed81620007c2565b92915050565b60008060008060008060c0878903121562000813576200081262000553565b5b600087015167ffffffffffffffff81111562000834576200083362000558565b5b6200084289828a01620006b3565b96505060206200085589828a0162000748565b95505060406200086889828a0162000783565b94505060606200087b89828a0162000783565b93505060806200088e89828a01620007dc565b92505060a0620008a189828a0162000783565b9150509295509295509295565b6000819050919050565b620008c381620008ae565b82525050565b620008d4816200075f565b82525050565b620008e58162000706565b82525050565b600060a082019050620009026000830188620008b8565b620009116020830187620008b8565b620009206040830186620008b8565b6200092f6060830185620008c9565b6200093e6080830184620008da565b9695505050505050565b60006040820190506200095f6000830185620008c9565b6200096e6020830184620008c9565b9392505050565b600082825260208201905092915050565b7f476f7665726e6f7253657474696e67733a20766f74696e6720706572696f642060008201527f746f6f206c6f7700000000000000000000000000000000000000000000000000602082015250565b6000620009e460278362000975565b9150620009f18262000986565b604082019050919050565b6000602082019050818103600083015262000a1781620009d5565b9050919050565b600060408201905062000a356000830185620008da565b62000a446020830184620008da565b9392505050565b7f476f7665726e6f72566f74657351756f72756d4672616374696f6e3a2071756f60008201527f72756d4e756d657261746f72206f7665722071756f72756d44656e6f6d696e6160208201527f746f720000000000000000000000000000000000000000000000000000000000604082015250565b600062000acf60438362000975565b915062000adc8262000a4b565b606082019050919050565b6000602082019050818103600083015262000b028162000ac0565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168062000b5157607f821691505b60208210810362000b675762000b6662000b09565b5b50919050565b60805160a05160c05160e0516101005161012051610140516153e362000bd6600039600081816118a6015281816119e4015261218b0152600061240401526000612446015260006124250152600061235a015260006123b0015260006123d901526153e36000f3fe6080604052600436106102085760003560e01c80637b3c71d311610118578063c59057e4116100a0578063ea0217cf1161006f578063ea0217cf14610844578063eb9019d41461086d578063ece40cc1146108aa578063f8ce560a146108d3578063fc0c546a146109105761024e565b8063c59057e414610786578063d33219b4146107c3578063dd4e2ba5146107ee578063deaaa7cc146108195761024e565b8063a890c910116100e7578063a890c9101461068f578063ab58fb8e146106b8578063b58131b0146106f5578063c01f9e3714610720578063c28bc2fa1461075d5761024e565b80637b3c71d3146105bf5780637d5e81e2146105fc57806397c3d33414610639578063a7713a70146106645761024e565b80633bccf4fd1161019b578063452115d61161016a578063452115d61461",
            }]);
        } catch (e) {
            expect(e.toString()).to.be.contains("UNPREDICTABLE_GAS_LIMIT")
            return
        }
        expect("").to.be.contains("failed")
    })

    describe.skip("Revert did not return an error message(https://github.com/nervosnetwork/godwoken-web3/issues/293)(https://github.com/nervosnetwork/godwoken-web3/issues/423)", function () {
        //https://github.com/nervosnetwork/godwoken-web3/issues/293

        it("error RpcError: Returned values aren't valid, did it run Out of Gas? You might also see this error if you are not using the correct ABI for the contract you are retrieving data from, requesting data from a block number that does not exist, or querying a node which is not fully synced. RpcError: Returned values aren't valid, did it run Out of Gas? You might also see this error if you are not using the correct ABI for the contract you are retrieving data from, " +
            "requesting data from a block number that does not exist, or querying a node which is not fully synced.\n", async () => {

            let contractInfo = await ethers.getContractFactory("RevertError");
            let contract = await contractInfo.deploy()
            await contract.deployed()
            console.log("contract Address:", contract.address)
            try {
                 await contract.testEmpty()
            } catch (e) {
                expect(e.data).to.be.include('0x3db2a12a')
                expect(e.errorName).to.be.equal('Empty')
                // expect(e.toString()).to.be.contains("reverted with custom error")
                return
            }
            expect('').to.be.include('failed')
        })

        it("overflow", async () => {
            //expected : execution reverted
            let contractInfo = await ethers.getContractFactory("RevertError");
            let contract = await contractInfo.deploy()
            await contract.deployed()
            console.log("contract Address:", contract.address)
            let result = await contract.addError(0);
            console.log("result:", result)
            try {
                await contract.addError(1);
            } catch (e) {
                // expect(e.toString()).to.be.contains("reverted with panic code 0x11")
                expect(e.errorName).to.be.include('Panic')
                expect(e.errorArgs[0]).to.be.equal('0x11')
                return
            }
            expect('').to.be.include('failed')
        })

    })

    it.skip("revert msg(https://github.com/nervosnetwork/godwoken-web3/issues/423)", async () => {
        let contractInfo = await ethers.getContractFactory("RevertContract");
        let contract = await contractInfo.deploy();
        await contract.deployed();

        let msg = "";
        for (let i = 0; i < 1000; i++) {
            msg = msg + "ssss"
        }
        try {
            // invoke method that contains revert
            await contract.revertMsg(msg);
            expect("").to.be.equal("failed")
        } catch (e) {
            expect(e.errorName).to.be.equal('Error')
            expect(e.args[0]).to.be.include('ssssssssssssssssssssssssssssss')
        }

    })

    it("cross call msg.data return REVERT (https://github.com/nervosnetwork/godwoken-polyjuice/issues/144)", async () => {

        let CmContractInfo;
        let CMockCallerInfo;
        CmContractInfo = await ethers.getContractFactory("ContextMock");
        CMockCallerInfo = await ethers.getContractFactory("ContextMockCaller");

        console.log("-----begin------")
        let ccContract = await CmContractInfo.deploy()
        let ccCallContract = await CMockCallerInfo.deploy();
        await ccContract.deployed();
        await ccCallContract.deployed();
        console.log("ccContract address:", ccCallContract.address)
        console.log("ccCallContract address:", ccCallContract.address)
        // function callData(
        //         ContextMock context,
        //         uint256 integerValue,
        //         string memory stringValue
        //     ) public {
        let tx = await ccCallContract.callData(ccContract.address, 1, "1234")
        let response = await tx.wait();
        expect(response.status).to.be.equal(1)

    })


})
