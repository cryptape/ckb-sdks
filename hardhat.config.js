require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
// var initHre = require("./hardhat/hardhat").initHre;

const INFURA_PROJECT_ID = "719d739434254b88ac95d53e2b6ac997";
// eth_address: 0x0c1efcca2bcb65a532274f3ef24c044ef4ab6d73
const PRIVATE_KEY = "dd50cac37ec6dd12539a968c1a2cbedda75bd8724f7bcad486548eaabb87fc8b";

// 0x40711aDc577DE17232DD6F997022F68BE6BE8560
const PRIVATE_KEY2 = "5f571783b4be167c4b8d80aaabc74e15c5b954f2d815fbdeadae01421501119f"


// eth_address: 0x934F1EbCB57ce1D9985A4c4f8811D17B04342067
const PRIVATE_KEY3 = "31227350280dbcb27d2976c900faf62ce92c2ad0b982541cc837fb9236b3b415"

// eth_address: 0xC4A4281378FE711d2e02480Cb7568952EB249fdF
const PRIVATE_KEY4 = "9269aa582ad09351383b32e7981f84f6efa5f94a9322813f63894caff74166a0"

// eth_address: 0x6B75801d17BcB7dbA0bDfE1d989e49A722e020e6
const PRIVATE_KEY5 = "b7900989d6fa12c9048e331eeb7f4cb34f224a5cb951ab88a8a289fddc3bec91"

// eth_address: 0x8974eD1cfA93B1E28E11005E3eA88AF81452113a
const PRIVATE_KEY6 = "7645889bd8772bad4daeca099a72c90e476865d1f06275dbbc5cad1e3259163a"


/**
 * @type import('hardhat/config').HardhatUserConfig
 *
 * */
module.exports = {
    networks: {

        hardhat: {
            loggingEnabled: true,
            allowUnlimitedContractSize: true
        },
        bsc_test: {
            url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
            accounts: [`0x${PRIVATE_KEY}`, `0x${PRIVATE_KEY2}`,`0x${PRIVATE_KEY3}`,`0x${PRIVATE_KEY4}`,`0x${PRIVATE_KEY5}`,`0x${PRIVATE_KEY6}`]
        },

        gw_local_kit_net_v1: {
            url: `http://127.0.0.1:8024`,
            accounts: [`0x${PRIVATE_KEY}`, `0x${PRIVATE_KEY2}`,`0x${PRIVATE_KEY3}`,`0x${PRIVATE_KEY4}`,`0x${PRIVATE_KEY5}`,`0x${PRIVATE_KEY6}`]
        },
        gw_testnet_v1: {
            url: `https://godwoken-testnet-web3-v1-rpc.ckbapp.dev`,
            accounts: [`0x${PRIVATE_KEY}`, `0x${PRIVATE_KEY2}`,`0x${PRIVATE_KEY3}`,`0x${PRIVATE_KEY4}`,`0x${PRIVATE_KEY5}`,`0x${PRIVATE_KEY6}`]
        },
        gw_testnet_v11: {
            url: `https://godwoken-betanet-v1.ckbapp.dev`,
            accounts: [`0x${PRIVATE_KEY}`, `0x${PRIVATE_KEY2}`,`0x${PRIVATE_KEY3}`,`0x${PRIVATE_KEY4}`,`0x${PRIVATE_KEY5}`,`0x${PRIVATE_KEY6}`]
        },
        gw_testnet_v0: {
            url: `https://godwoken-testnet-web3-rpc.ckbapp.dev`,
            chainId: 71393,
            accounts: [`0x${PRIVATE_KEY}`, `0x${PRIVATE_KEY2}`]
        },
        gw_alphanet_v1: {
                url: `https://godwoken-alphanet-v1.ckbapp.dev`,
                accounts: [`0x${PRIVATE_KEY}`, `0x${PRIVATE_KEY2}`,`0x${PRIVATE_KEY3}`,`0x${PRIVATE_KEY4}`,`0x${PRIVATE_KEY5}`,`0x${PRIVATE_KEY6}`]
            },
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
            accounts: [`0x${PRIVATE_KEY}`]
            // gas: 1_000_000_000_000_001, // Infura seems to cap it at 19981536.
            // gasPrice: 1
        },
        mainnet: {
            url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
            accounts: [`0x${PRIVATE_KEY}`]
        },
        kovan: {
            url: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
            accounts: [`0x${PRIVATE_KEY}`]
        }
        // hardhat: {
        //   gas: 1000000000000, // Infura seems to cap it at 19981536.
        //   gasPrice: 1
        // }
    },
    //bsc_test
    // defaultNetwork: "gw_alphanet_v1", //gw_local_kit_net_v1 gw_testnet_v11
    // defaultNetwork: "rinkeby",
    defaultNetwork: "gw_local_kit_net_v1",
    solidity: {
        compilers: [
            { // for polyjuice contracts
                version: "0.6.6",
                settings: {}
            },
            {version: "0.4.24"},
            {version: "0.5.14"},
            {version: "0.6.12"},
            {version: "0.7.3"},
            {version: "0.7.5"},
            {version: "0.8.4"},
            {version: "0.8.6"}

        ], overrides: {},
        settings: {
            optimizer: {
                enabled: true,
                runs: 2000
            }
        },
        allowUnlimitedContractSize :true
    },
    mocha: {
        /** Reporter name or constructor. */
        reporter: "mochawesome"
        // timeout: 5000000,
        // /** Reporter settings object. */
        // reporterOptions: {
        //     output: "test-results-1.json"
        // },
        // reporterOptions: {
        //     reportFilename: "[status]_[datetime]-[name]-report",
        //     timestamp: "longDate"
        // }
        // mochawesome:{
        //     reporterOptions: {
        //         reportFilename: "[status]_[datetime]-[name]-report",
        //         timestamp: "longDate"
        //     }
        // }

    }
};
// extendEnvironment((hre) => {
//     // const Web3 = require('web3');
//     // const HttpProxyAgent = require('http-proxy-agent');
//     // console.log('-----web3--init-----');
//     // hre.network.provider is an EIP1193-compatible provider.
//     // hre.web3 = new Web3(hre.network.networks);
//     // this.web3Provider.httpAgent = new HttpProxyAgent(process.env.HTTP_PROXY)
//     // hre.web3.currentProvider.agent = new HttpProxyAgent('http://localhost:5555');
//     // hre.web3.eth.subscribe('logs', options [, callback]);
//     // hre.web3 = new Web3(hre.network.networks);
//     // console.log(hre.web3);
//     // console.log()
//     // console.log('-----web3--end-----');
//     // initHre(hre);
//
//
//
//     // hre.ethers.provider.on('debug', (info) => {
//     //     console.log("begin ------------------")
//     //     console.log("action:", info.action);
//     //     console.log("request", info.request);
//     //     console.log("response:", info.response);
//     //     console.log("end ------------------")
//     // });
// });