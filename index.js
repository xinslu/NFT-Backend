const express = require('express')
const app = express()
const path = require('path');
const port = 8080;
const baseUri = "http://localhost:8080";
const contractAddress = "0x1d08e9f60A9e08ABCf13124f5B98Ac47cFbcB07d";
const Web3 = require('web3');
const DateToken = require("./StyleTransferImage.json");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545/"));
const contract = new web3.eth.Contract(DateToken.abi, contractAddress);
web3.eth.default_account = web3.eth.accounts[0]
contract.deploy({data: DateToken.bytecode})
let tokenID=2;


app.get("/:tokenid", async (req, res) => {
        let { tokenid } = req.params
        try{
            let meta =  await contract.methods.get(tokenid).call()
            res.json({
                productName: meta.productName,
                mlModel : meta.mlModel
            })
        } catch(error) {
            console.log(error)
        }
})

app.get("/:productName/:mlModel", async (req,res) => {
    try{
        let { productName, mlModel } = req.params
        console.log(productName,mlModel)
        let tokenId= await contract.methods.claim(productName,mlModel).call()
        console.log(tokenId)
        res.json({
                message: "NFT Created",
                contractAddress: contractAddress,
                productName: productName,
                mlModel: mlModel,
                tokenID: tokenID
        })
        tokenID++;
    } catch(error) {
        console.log(error)
    }

})



app.listen(port, () => {
    console.log(`Date Chain API listening port ${port}`)
})
