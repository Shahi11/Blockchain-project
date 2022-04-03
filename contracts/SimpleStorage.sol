// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract SimpleStorage {
  uint storedData2;

  function set(uint x) public {
    storedData2 = x;
  }

  function get() public view returns (uint) {
    return storedData2;
  }
}
