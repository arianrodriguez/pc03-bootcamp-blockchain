var hre = require("hardhat");

async function deployContracts() {
    var USDCSC = await hre.ethers.getContractFactory('USDCoin');
    var usdcSC = await USDCSC.deploy();
    var tx = await usdcSC.deployed();
    console.log('Contract USDCoin deployed, address: ', usdcSC.address);
    await tx.deployTransaction.wait(5);
}

deployContracts()
    .then(()=> process.exit(0))
    .catch((e)=> {
        console.error(e);
        process.exit(1);
    });