// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Moderation is Ownable {
    struct Proposal {
        string description;
        uint256 votes;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) public votes;
    uint256 public proposalCount;

    event ProposalCreated(uint256 id, string description);
    event Voted(uint256 id, address voter);

    function createProposal(string memory description) public onlyOwner {
        proposalCount++;
        proposals[proposalCount] = Proposal(description, 0, false);
        emit ProposalCreated(proposalCount, description);
    }

    function vote(uint256 proposalId) public {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");
        require(!votes[msg.sender][proposalId], "Already voted");

        proposals[proposalId].votes++;
        votes[msg.sender][proposalId] = true;
        emit Voted(proposalId, msg.sender);
    }
}
