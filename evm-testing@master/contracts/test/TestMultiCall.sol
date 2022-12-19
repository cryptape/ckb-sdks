// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract TestMultiCall {
    struct MyStruct {
        uint num1;uint num2;uint num3;uint num4;uint num5;uint num6;uint num7;uint num8;uint num9;uint num10;
        uint num11;uint num12;uint num13;uint num14;uint num15;uint num16;uint num17;uint num18;uint num19;uint num20;
        uint num21;uint num22;uint num23;uint num24;uint num25;uint num26;uint num27;uint num28;uint num29;uint num30;
        uint num31;uint timestamp;
    }

    event Log(address indexed sender, MyStruct message);

    function test(uint _i) external returns (MyStruct memory) {
        MyStruct memory myStruct = MyStruct(_i, _i, _i, _i, _i, _i, _i, _i, _i, _i, _i, _i, _i, _i, _i, _i, _i, _i, _i, _i, _i, _i, _i, _i, _i, _i, _i, _i, _i, _i, _i, block.timestamp);
        emit Log(msg.sender, myStruct);
        return myStruct;
    }

    function getData(uint _i) external pure returns (bytes memory) {
        return abi.encodeWithSelector(this.test.selector, _i);
    }

    function decodeData(bytes calldata data) external pure returns (uint){
        return abi.decode(data[4 :], (uint));
    }
}