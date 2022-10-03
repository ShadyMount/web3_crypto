import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { contractAbi, CONTRACT_ADDRESS } from '../../utils/constans'
import { createContext } from 'react'
const { ethereum } = window
export const TransactionContext = createContext()

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const transactionContract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer)
    return transactionContract
}

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('')
    const [isLoading, setIsloading] = useState(false)
    const [transactions, setTransactions] = useState([])
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'))
    const [formData, setFormData] = useState({
        addressTo: '',
        amount: '',
        keyword: '',
        message: ''
    })

    const handleChange = (e, name) => {
        setFormData((prev) => ({ ...prev, [name]: e.target.value }))
    }

    const getAllTransactions = async () => {
        try {
            if (!ethereum) return alert('Install metamsk')
            const transactionContract = getEthereumContract()
            const availableTransactions = await transactionContract.getAllTransactions()
            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18),

            }))
            setTransactions(structuredTransactions)
        } catch (error) {
            console.log(error);
            throw new Error('No eth obj')
        }

    }

    const checkIfWalletConnected = async () => {
        try {
            if (!ethereum) return alert('Install metamsk')

            const accounts = await ethereum.request({ method: "eth_accounts" })
            if (accounts.length) {
                setCurrentAccount(accounts[0])
                getAllTransactions()
            } else {
                console.log('No accounts');
            }
        } catch (error) {
            console.log(error);
            throw new Error('No eth obj')
        }
    }

    const checkIfTransactionsExist = async () => {
        try {
            const transactionContract = getEthereumContract()
            const transactionCount = await transactionContract.getTransactionsCount()
            window.localStorage.setItem('transactionCount', transactionCount)

        } catch (error) {
            console.log(error);
            throw new Error('No eth obj')
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert('Install metamsk')

            const accounts = await ethereum.request({ method: "eth_requestAccounts" })
            setCurrentAccount(accounts[0])
            console.log(accounts)
        } catch (error) {
            console.log(error);
            throw new Error('No eth obj')
        }

    }

    const sendTransaction = async () => {
        try {
            if (!ethereum) return alert('Install metamsk')
            const { addressTo, amount, keyword, message } = formData
            const transactionContract = getEthereumContract()
            const parsedAmount = ethers.utils.parseEther(amount)

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208',
                    value: parsedAmount._hex,

                }]
            })

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword)
            setIsloading(true)
            await transactionHash.wait()
            setIsloading(false)
            console.log(`Success - ${transactionHash.hash}`);
            setFormData({
                addressTo: '',
                amount: '',
                keyword: '',
                message: ''
            })
            const transactionCount = await transactionContract.getTransactionsCount()
            setTransactionCount(transactionCount.toNumber())
        } catch (error) {
            console.log(error);
            throw new Error('No eth obj')
        }
    }

    useEffect(() => {
        checkIfWalletConnected()
        checkIfTransactionsExist()
        return () => {

        }
    }, [])

    return (
        <TransactionContext.Provider
            value={{
                connectWallet,
                currentAccount,
                handleChange,
                sendTransaction,
                formData,
                transactions,
                isLoading
            }}
        >
            {children}
        </TransactionContext.Provider>
    )
}