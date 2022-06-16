pragma solidity ^0.8.0;

contract RevertError{
    error Empty();

    function testEmpty() public view returns(bool){
        revert Empty();
        return true;
    }

    function addError(uint256 b) public view returns(uint256){
        return type(uint256).max + b;
    }

}