// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//errors
error StakingContract__IncorrectNumberOfAmounts();
error StakingContract__NoStakedBalance();

contract StakingContract is ERC20 {
    mapping(address => uint256) public s_stakedBalanceOf;
    mapping(address => uint256) private s_stakedTimeOf;
    uint256 public s_rewards;
    uint256 private constant DEPOSIT_RATE = 2 * 1 hours; // депозит: 50 процентов за час

    constructor(uint256 initialSupply) ERC20("MyERC20Token", "MET") {
        _mint(msg.sender, initialSupply);
    }

    //events
    event Stakings(address indexed from, uint256 indexed value);

    //functions
    function stake(uint256 amount) external {
        if (amount <= 0 || balanceOf(msg.sender) < amount) {
            revert StakingContract__IncorrectNumberOfAmounts();
        }
        _transfer(msg.sender, address(this), amount);
        if (s_stakedBalanceOf[msg.sender] > 0) {
            makeReward();
        }
        s_stakedTimeOf[msg.sender] = block.timestamp;
        s_stakedBalanceOf[msg.sender] += amount;
        emit Stakings(msg.sender, s_stakedBalanceOf[msg.sender]);
    }

    function unstake(uint256 amount) external {
        if (amount <= 0 || s_stakedBalanceOf[msg.sender] < amount) {
            revert StakingContract__IncorrectNumberOfAmounts();
        }
        makeReward();
        _mint(msg.sender, s_rewards);
        _transfer(address(this), msg.sender, amount);
        s_rewards = 0;
        s_stakedBalanceOf[msg.sender] -= amount;
        s_stakedTimeOf[msg.sender] = block.timestamp;
    }

    function harvest() external {
        makeReward();
        _mint(msg.sender, s_rewards);
        s_rewards = 0;
        s_stakedTimeOf[msg.sender] = block.timestamp;
    }

    function makeReward() public {
        if (s_stakedBalanceOf[msg.sender] <= 0) {
            revert StakingContract__NoStakedBalance();
        }
        uint256 interval = block.timestamp - s_stakedTimeOf[msg.sender];
        s_rewards += ((interval * s_stakedBalanceOf[msg.sender]) / DEPOSIT_RATE);
    }

    function stakedBalanceOf(address _accountAddress) public view returns (uint256) {
        return s_stakedBalanceOf[_accountAddress];
    }
}
