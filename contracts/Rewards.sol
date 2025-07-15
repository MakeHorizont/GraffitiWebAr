// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Rewards is Ownable {
    mapping(address => uint256) public rewards;

    function addReward(address user, uint256 amount) public onlyOwner {
        rewards[user] += amount;
    }
}
