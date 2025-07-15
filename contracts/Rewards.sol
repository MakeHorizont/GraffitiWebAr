// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Rewards {
    mapping(address => uint256) public rewards;

    function addReward(address user, uint256 amount) public {
        rewards[user] += amount;
    }
}
