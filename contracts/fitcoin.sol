// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;


contract fitcoin {

    string public constant name = "FITCOIN";
    string public constant symbol = "FC";
    uint8 public constant decimals = 2;  
   
  
    address ERCowner; //#1
    
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Transfer(address indexed from, address indexed to, uint tokens);

    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;
    uint256 totalSupply_;

    using SafeMath for uint256;


    constructor() {  
        totalSupply_ = 10000;
        balances[msg.sender] = totalSupply_;
        ERCowner = msg.sender; //#2
    }  

    function totalSupply() public view returns (uint256) {
	return totalSupply_;
    }
    
    function balanceOf(address tokenOwner) public view returns (uint) {
        return balances[tokenOwner];
    }
    
    function transfer(address receiver, uint numTokens, address sender) payable public returns (bool) {
        require(numTokens <= balances[sender]);
        balances[sender] = balances[sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(sender, receiver, numTokens);
        return true;
    }

    function approve(address contractAdd, uint numTokens, address sender) public returns (bool) {
        allowed[sender][contractAdd] = numTokens;
        emit Approval(msg.sender, contractAdd, numTokens);
        return true;
    }

    function allowance(address owner, address contractAdd) public view returns (uint) {
        return allowed[owner][contractAdd];
    }

    function transferFrom(address buyer, address seller, uint numTokens, address contractAdd) public returns (bool) {
        require(numTokens <= balances[buyer]);    
        require(numTokens <= allowed[buyer][contractAdd]);
    
        balances[buyer] = balances[buyer].sub(numTokens);
        allowed[buyer][contractAdd] = allowed[buyer][contractAdd].sub(numTokens);
        balances[seller] = balances[seller].add(numTokens);
        emit Transfer(buyer, seller, numTokens);
        return true;
    }
}

library SafeMath { 
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }
    
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
}