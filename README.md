# evm-testing
Test suites for EVM compatible projects.
[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)]("https://gitpod.io/#https://github.com/cryptape/evm-testing")

### actions -manual trigger
run workflow

branch:main(test case branch)

click run workflow
### report
https://cryptape.github.io/evm-testing/mochawesome.html

### past report
brach gh-pages

### add rpc log
use：package.json srcipts add "addRpcLog":"patch-package" && Run addRpcLog  
reduce：rm -rf node_modules/hardhat && npm install hardhat  
recover：Run addRpcLog
