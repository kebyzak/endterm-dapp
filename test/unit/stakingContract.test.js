const { assert, expect } = require("chai")
const { ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
// тест в локальной сети
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("SwapContract unit tests", () => {
          // describe no need to be async
          let deployer, StakingContract, stakingContract

          const chainId = network.config.chainId

          beforeEach(async function () {
              deployer = await ethers.getSigners()
              StakingContract = await ethers.getContractFactory("StakingContract")
              stakingContract = await StakingContract.deploy("1000000000000000000000".toNumber())
          })

          describe("constructor", () => {
              it("check Deployer token balance", async () => {
                  const balanceOfDeployer = await stakingContract.balanceOf(deployer.address)
                  console.log(balanceOfDeployer)
                  assert(balanceOfDeployer.toString(), "1000000000000000000000")
              })
          })
          // IN PROCESS
      })
