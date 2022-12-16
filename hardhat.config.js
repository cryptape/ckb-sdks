require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
var ethers = require("ethers").ethers;
// var initHre = require("./hardhat/hardhat").initHre;

const INFURA_PROJECT_ID = "719d739434254b88ac95d53e2b6ac997";
const ALCHEMY_API_KEY = "TJ9LWVZHHucwF6QhokTZRLv1PW-ji_-A";
//eth_address: 0x9DD3c285F8c253fB6327549E46f82E3DEdf59E34
const GOERLI_PRIVATE_KEY = "3bba3cb79a08ab876685eea32f9b749c3717e499a2ae7fd4127c39fdb96f1fb3";

// eth_address: 0x4866f8c3d21CDb7CFf6689576cAeA91A475EA98a
const PRIVATE_KEY = "300d786d3e31e5c928332f4cc62318ac613252938c64ebf1213f5e6a6ccf4bad";

// 0x66bf05FDA3d5fA21dbf72e418a320A24fAC799c6
const PRIVATE_KEY2 = "bb2f7df4868c09050313e8de72d26360cb52f441b078316ffc07f35bcb7282c6"


// eth_address: 0xb3d645264a3cc2A0224A2331E6c1B4ca8b2cadFc
const PRIVATE_KEY3 = "0090e235be7a79858e108af8fbb04c084a81460674b48411f600a82521a177c4"

// eth_address: 0x9dfBaaF3f328D9a7abe2916cf65B11BAba6D0248
const PRIVATE_KEY4 = "ed6e3fc8de3b34c692575631612b4d1258becf61edfba5be1313274ec3ff9f79"

//0x75B8EF89dB9376EC7003F6EC79D14C49a9aF10db
const PRIVATE_KEY5 = "8b9adda837c9f2f26be59f3712226d41734e3f150842faf459cefdec5af489b3"

// eth_address: 0x3402959Ae126abbEf7a9F61772b5003015B19837
const PRIVATE_KEY6 = "1645b6af3e8c08278351194cdcb8198a21aca22ed097a1c7a83ac8d9eb6d11c4"

// unregister address
const PRIVATE_KEY7 = "29785e7e193781be1a0d5a75e1ed603739efe91a268e32690313f1606154609b"

const PRIVATE_KEY8 = ethers.Wallet.createRandom().privateKey

const PRIVATE_KEY9 = ethers.Wallet.createRandom().privateKey

const PRIVATE_KEYS = [
    "a450a5a112f44ecc5616efc6c040e2179ba0ee9bbf2701c83a1744821415fb8c",
    "00f0d084b9b2ddafb3108e0d8dfcc07cec275077d0f326ac799f8c89c8d32952",
    "31b5ef51e3def921d1b0723bcb5a594524eab64388e788425ce565b852a47ad1",
    "19e26e5b11ea84a6845b598f23ac97d90e43629a5cc9ba2e54845d87f49c2598",
    "b9a8ec1fb2c090df851538835bda1215caf1d27c87341c252a6c838478678430",
    "f57cda11b45e135c78d6fcdbfaab96954d55540f5de754cd824aa376578f67f6",
    "3047e6112e43e5fa0fb98ce457f295ae1e63a518c3b6215e06446100c1a34ef8",
    "b847069c96bbfc9cad335553f57e5fee3b84ebaf4dde3337e22afb44b40ca193",
    "1d8124a4e5f16c1f0059a74831cb4d71e32f19a3d3dbae78459c731100ea03bf",
    "cf0b447128221521fdc7b96975ed512c9a813e0bfe56fdfa2f3bcd2ba46fc75"
]

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

        axon_remote: {
            url: 'http://192.168.10.174:8000',
            // gasMultiplier: 2,
            gas: 5000000,
            accounts: {
                mnemonic: "test test test test test test test test test test test junk",
                path: "m/44'/60'/0'/0",
                initialIndex: 0,
                count: 20,
                passphrase: "",
            },
        },
        bsc_test: {
            url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
            accounts: [`0x${PRIVATE_KEY}`, `0x${PRIVATE_KEY2}`, `0x${PRIVATE_KEY3}`, `0x${PRIVATE_KEY4}`, `0x${PRIVATE_KEY5}`, `0x${PRIVATE_KEY6}`]
        },

        axon_test: {
            url: 'http://localhost:8000',
            accounts: {
                mnemonic: "test test test test test test test test test test test junk",
                path: "m/44'/60'/0'/0",
                initialIndex: 2,
                count: 10,
                passphrase: "",
            },
        },
//https://godwoken-testnet-v1.ckbapp.dev/
        gw_local_kit_net_v1: {
            url: `http://127.0.0.1:8024`,
            accounts: [`0x${PRIVATE_KEY}`, `0x${PRIVATE_KEY2}`, `0x${PRIVATE_KEY3}`, `0x${PRIVATE_KEY4}`, `0x${PRIVATE_KEY5}`, `0x${PRIVATE_KEY6}`, `0x${PRIVATE_KEY7}`]
        },
        gw_testnet_v1: {
            url: `https://godwoken-testnet-v1.ckbapp.dev/`,
            accounts: [`0x${PRIVATE_KEY}`, `0x${PRIVATE_KEY2}`, `0x${PRIVATE_KEY3}`, `0x${PRIVATE_KEY4}`, `0x${PRIVATE_KEY5}`, `0x${PRIVATE_KEY6}`, `0x${PRIVATE_KEY7}`]
        },
        gw_testnet_v11: {
            url: `https://godwoken-betanet-v1.ckbapp.dev`,
            accounts: [`0x${PRIVATE_KEY}`, `0x${PRIVATE_KEY2}`, `0x${PRIVATE_KEY3}`, `0x${PRIVATE_KEY4}`, `0x${PRIVATE_KEY5}`, `0x${PRIVATE_KEY6}`, `0x${PRIVATE_KEY7}`]
        },
        gw_testnet_v0: {
            url: `https://godwoken-testnet-web3-rpc.ckbapp.dev`,
            chainId: 71393,
            accounts: [`0x${PRIVATE_KEY}`, `0x${PRIVATE_KEY2}`]
        },
        gw_alphanet_v1: {
            url: `https://gw-alphanet-v1.godwoken.cf/instant-finality-hack`,
            // accounts: [`0x${PRIVATE_KEY}`, `0x${PRIVATE_KEY2}`, `0x${PRIVATE_KEY3}`, `0x${PRIVATE_KEY4}`, `0x${PRIVATE_KEY5}`, `0x${PRIVATE_KEY6}`, `0x${PRIVATE_KEY7}`, `${PRIVATE_KEY8}`, `${PRIVATE_KEY9}`]
            accounts:[`0x${PRIVATE_KEYS[0]}`, `0x${PRIVATE_KEYS[1]}`, `0x${PRIVATE_KEYS[2]}`]
        },
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
            accounts: [`0x${PRIVATE_KEY}`]
            // gas: 1_000_000_000_000_001, // Infura seems to cap it at 19981536.
            // gasPrice: 1
        },
        //https://ropsten.infura.io/v3/
        ropsten: {
            url: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
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
        },
        goerli: {
            url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
            accounts: [`0x${GOERLI_PRIVATE_KEY}`]
        },
        gw_devnet_v1: {
            url: `http://18.162.235.225:8024`,
            accounts: [`0x${PRIVATE_KEY}`, `0x${PRIVATE_KEY2}`, `0x${PRIVATE_KEY3}`, `0x${PRIVATE_KEY4}`, `0x${PRIVATE_KEY5}`, `0x${PRIVATE_KEY6}`, `0x${PRIVATE_KEY7}`, `${PRIVATE_KEY8}`, `${PRIVATE_KEY9}`]
            // accounts:[`0x${PRIVATE_KEYS[0]}`, `0x${PRIVATE_KEYS[1]}`, `0x${PRIVATE_KEYS[2]}`]
        },
        localEth: {
            url: 'http://127.0.0.1:8545',
            accounts: {
                mnemonic: 'test test test test test test test test test test test junk',
                path: 'm/44\'/60\'/0\'/0',
                initialIndex: 0,
                count: 20,
                passphrase: '',
            },
        },
        // hardhat: {
        //   gas: 1000000000000, // Infura seems to cap it at 19981536.
        //   gasPrice: 1
        // }
    },


    //bsc_test
    defaultNetwork: "gw_alphanet_v1",
    // defaultNetwork: "localEth",

    // defaultNetwork: "ropsten", //gw_local_kit_net_v1 gw_testnet_v11
    // defaultNetwork: "axon_test",
    // defaultNetwork: "gw_devnet_v1",
    solidity: {
        compilers: [
            { // for polyjuice contracts
                version: "0.6.6",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 2000
                    }
                }
            },
            {version: "0.4.24"},
            {version: "0.5.14"},
            {version: "0.5.16"},
            {version: "0.6.12"},
            {version: "0.7.3"},
            {version: "0.7.5"},
            {version: "0.8.4"},
            {version: "0.8.6"},
            {version: "0.8.12"} //todo delete 0.8.12 && compile again

        ], overrides: {},
        settings: {
            optimizer: {
                enabled: true,
                runs: 2000
            }
        },
        allowUnlimitedContractSize: true
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
