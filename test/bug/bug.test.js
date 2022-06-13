//invoke fallback func
//data is 0x

// https://github.com/nervosnetwork/godwoken-web3/issues/266 还有这个问题好像是只修复了一半？ 我这边手动测试发现好像有如下问题
//bug1
//没有recive 函数，或fallback()payable 也能给合约账户转钱
// bug2(recive+fallback)
// 调用0x 转钱成功,但没走recive函数
//bug3(只有fallback)
// 调用0x成功 不会走fallbak函数
//bug4(没有fallback和receive)
//没有fallbak 函数，调用成功