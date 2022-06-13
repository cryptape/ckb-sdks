pragma solidity ^0.6.10;

contract fallbackAndReceive {

    uint256 internal _value;
    event fallbackEvent(bytes);
    event receiveEvent(bytes,uint256);
    function public_func() public view returns(uint256) {
        return 1;
    }

    function setValue(uint256 _number) public {
        _value = _number;
    }

    function getValue() public view returns (uint256) {
        return _value;
    }

    fallback() external {
        _value = 1;
        emit fallbackEvent(msg.data);
    }
    receive() external payable {
        _value = 2;
        emit receiveEvent(msg.data,msg.value);
    }
}

contract fallbackAndReceiveOnlyHaveFallback {

    uint256 internal _value;
    event fallbackEvent(bytes);
    function public_func() public view returns(uint256) {
        return 1;
    }

    function setValue(uint256 _number) public {
        _value = _number;
    }

    function getValue() public view returns (uint256) {
        return _value;
    }

    fallback() external payable{
        _value = 1;
        emit fallbackEvent(msg.data);

    }
}
contract NoFallbackAndReceive{

}