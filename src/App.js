import { useEffect, useState } from "react"
import { ethers } from "ethers"
import StakingContractABI from "./constants/abi.json"
import "./App.css"
const stakingContractAddress = "0xDC0eb8881E7A7e836E2427191D4855A3E611D987"

function App() {
    const [accountAddress, setAccountAddress] = useState("")
    const [staked, setStaked] = useState(0)
    const [unstaked, setUnstaked] = useState(0)
    const [stakedBalance, setStakedBalance] = useState(0)

    useEffect(() => {
        connectAccount()
    }, [])

    async function connectAccount() {
        const connectedAccount = await window.ethereum.request({ method: "eth_requestAccounts" })
        setAccountAddress(connectedAccount)
        stakedBalanceOfAccount(connectedAccount)
    }

    async function stakedBalanceOfAccount(account) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(stakingContractAddress, StakingContractABI, signer)
        const balanceByAddress = await contract.stakedBalanceOf(account.toString())
        const stakedBal = convertToNumber(balanceByAddress)
        setStakedBalance(stakedBal)
    }

    async function stake() {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(stakingContractAddress, StakingContractABI, signer)
            try {
                const transactionResponse = await contract.stake((staked * power18()).toString())
                await transactionResponse.wait()
                const balanceByAddress = await contract.stakedBalanceOf(accountAddress.toString())
                const stakedBal = convertToNumber(balanceByAddress)
                setStakedBalance(stakedBal)
            } catch (error) {
                console.log("Error: ", error)
            }
        }
    }

    async function unstake() {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(stakingContractAddress, StakingContractABI, signer)
            try {
                const transactionResponse = await contract.unstake(
                    (unstaked * power18()).toString()
                )
                await transactionResponse.wait()
                const balanceByAddress = await contract.stakedBalanceOf(accountAddress.toString())
                const stakedBal = convertToNumber(balanceByAddress)
                setStakedBalance(stakedBal)
            } catch (error) {
                console.log("Error: ", error)
            }
        }
    }

    async function harvest() {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(stakingContractAddress, StakingContractABI, signer)
            try {
                const transactionResponse = await contract.harvest()
                await transactionResponse.wait()
            } catch (error) {
                console.log("Error: ", error)
            }
        }
    }

    function convertToNumber(amount) {
        return Number(amount) / power18()
    }

    function power18() {
        return 10 ** 18
    }

    return (
        <div className="App">
            <div className="App-header">
                <button onClick={connectAccount}>Connect account!</button>
                <h2>Account address: {accountAddress}</h2>
                <div className="description">
                    <h1>StakingContract.sol</h1>
                    <h3>Staking and Unstaking</h3>
                </div>
                <div className="custom-buttons">
                    <div>
                        <button onClick={stake} style={{ backgroundColor: "green" }}>
                            Stake
                        </button>
                        <input onChange={(e) => setStaked(e.target.value)} value={staked} />
                    </div>
                    <div>
                        <button onClick={unstake} style={{ backgroundColor: "red" }}>
                            Unstake
                        </button>
                        <input onChange={(e) => setUnstaked(e.target.value)} value={unstaked} />
                    </div>
                    <div>
                        <button onClick={harvest} style={{ backgroundColor: "brown" }}>
                            Harvest
                        </button>
                    </div>
                </div>
                <h2>Your staked balance: {stakedBalance}</h2>
            </div>
        </div>
    )
}

export default App
