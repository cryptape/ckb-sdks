# evm-testing
Test suites for EVM compatible projects.


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