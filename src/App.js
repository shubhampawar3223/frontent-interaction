import React,{ useEffect, useState } from "react";
import { ethers } from 'ethers';
import {contract_address,contract_abi} from './GFTAbi'

function App() {

  const [error,setError] = useState(null)
  const [account,setNewAccount] = useState(null)
  const [balance,setBalance] = useState(null)
  const [provider, setProvider] = useState(null)
  const [symbol,setSymbol] = useState(null)
  const [name,setName] = useState(null)
  const [supply, setSupply] = useState(null)
  const [decimal, setDecimal] = useState(null)

  useEffect(()=>{
    if(window.ethereum){
      window.ethereum.on("accountsChanged",accountsChange)
      window.ethereum.on("chainChanged",chainChanged)
    }    
    getContractInfo()
  })

  const getContractInfo = async()=>{
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    const gftToken = new ethers.Contract(contract_address, contract_abi,provider) 
    let accounts = await provider.send("eth_requestAccounts", []);
    console.log("accounts",accounts,provider)
    console.log("name",await gftToken.name())
    setSymbol(await gftToken.symbol())
    setName(await gftToken.name())
    setSupply(await gftToken.totalSupply())
    setDecimal(await gftToken.decimal())
  }

  const connect = async() => {
    if (window.ethereum) {
      try{
        let res = await window.ethereum.request({method:"eth_requestAccounts"})
        console.log(res)
        await accountsChange(res[0]);        
      }
      catch(err){
        console.log(err.message)
        setError("Problem connecting with the metamask.")   
      }
    }
    else {
      setError("Install Metamask")
    }
  }

  const accountsChange =async (newAccount)=>{
      setNewAccount(newAccount)
      try{
        let balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [newAccount.toString(),"latest"]
        }) 
        console.log("balance: ",ethers.utils.formatEther(balance))
        setBalance(ethers.utils.formatEther(balance)) 
      }
      catch(error){
        console.log("error:",error.message)
        setError("Problem connecting with the metamask.")        
      }
  }

  const chainChanged = async() =>{
    setError(null)
    setNewAccount(null);
    setBalance(null);
  }

  return (
    <div className="container">
    <div className="offset-5 mt-5">  
    {
      error ?
      <p >{error}</p>
      : <></>
    }
    <button onClick={connect} >Connect To Metamask</button>
    {
      account ?
      <div>
        <p>Account No: {account}</p>
        <p>Balance: {balance}</p>
      </div>
      :<></>
    }

     <div>
     <table class="table">
  <thead>
    <tr>
      Token Information
    </tr>
  </thead>
  <tbody>
   <tr>
      <td>Token Name</td>
      <td>{name}</td>
    </tr>
    <tr>
      <td>Token Symbol</td>
      <td>{symbol}</td>
    </tr>
    <tr>
      <td>Total Token Supply</td>
      <td>{supply}</td>
    </tr>
    <tr>
      <td>Decimals</td>
      <td>{supply}</td>
    </tr>
  </tbody>
</table> 

      </div> 
    </div>
    </div>
  );
}

export default App;
