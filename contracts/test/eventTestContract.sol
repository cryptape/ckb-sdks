pragma solidity ^0.8.4;

contract eventTestContract{

    event blockHashEvent(bytes32);

    function testEvent(uint256 begin,uint rd,uint256 mid ,uint end) public {

        for(uint256 i=0;i<begin;i++){
            emit blockHashEvent(bytes32(0));
        }

        for(uint256 i=rd;i<rd+mid;i++){
            emit blockHashEvent(sha256(abi.encode(i)));
        }
        for(uint256 i=0;i<end;i++){
            emit blockHashEvent(bytes32(0));
        }
    }


}