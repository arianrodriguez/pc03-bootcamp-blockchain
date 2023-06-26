import { BigNumber, Contract, providers, ethers, utils } from "ethers";

var usdcTknAbi = require('../artifacts/contracts/USDCoin.sol/USDCoin.json').abi;
var miPrimerTknAbi = require('../artifacts/contracts/MiPrimerToken.sol/MyTokenMiPrimerToken.json').abi;
var publicSaleAbi = require('../artifacts/contracts/PublicSale.sol/PublicSale.json').abi;
var nftTokenAbi = require('../artifacts/contracts/NFT.sol/MiPrimerNft.json').abi;

window.ethers = ethers;

var provider, signer, account;
var usdcTkContract, miPrTokenContract, nftTknContract, pubSContract;

async function initSCsGoerli() {
  provider = new providers.Web3Provider(window.ethereum);
  var miPrimerTokenAddress = '0x90cAAdF2148cED44f2313e1921477196d0dAb220';
  var usdcCoinAddress = '';
  var publicSaleAddress = '';

  miPrTokenContract = new ethers.Contract(miPrimerTokenAddress, miPrimerTknAbi, provider);
  usdcTkContract = new ethers.Contract(usdcCoinAddress, usdcTknAbi, provider);
  pubSContract = new ethers.Contract(publicSaleAddress, publicSaleAbi, provider);

  //miPrTokenContract = new ethers.Contract(miPrTknAdd, miPrimerTknAbi, provider);
  //pubSContract = new ethers.Contract(pubSContractAdd, publicSaleAbi, provider);
}

// OPTIONAL
// No require conexion con Metamask
// Usar JSON-RPC
// Se pueden escuchar eventos de los contratos usando el provider con RPC
function initSCsMumbai() {
  var nftAddress = '';
  nftTknContract = new Contract(nftAddress, nftTokenAbi, provider);
}

function setUpListeners() {
  // Connect to Metamask
  var bttn = document.getElementById("connect");
  bttn.addEventListener("click", async function () {
    if (window.ethereum) {
      let [billetera] = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Billetera metamask", billetera);
      account = billetera;
      // provider: Metamask: estamos usando window.ethereum
      provider = new providers.Web3Provider(window.ethereum);
      // signer: el que va a firmar las tx
      signer = provider.getSigner(billetera);
      window.signer = signer;
    }
  });

  var btnSwitch = document.getElementById('switch');
  btnSwitch.addEventListener('click', async function() {
      if (window.ethereum && window.ethereum.isConnected()) {
        try {
          // cambiando a la red Mumbai (chain ID: 80001)
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }], // chain ID de Mumbai
          });
    
          console.log('Se ha cambiado a la red de Mumbai en MetaMask');
        } catch (e) {
          console.error('Error al cambiar a la red de Mumbai:', e);
        }
      } else {
        console.error('Metamask no está instalado o no está conectado');
      }
  });
  
  var usdcUpdate = document.getElementById('usdcUpdate');
  usdcUpdate.addEventListener('click', ()=> {
    console.log('Balance en USDCoin: ', usdcTkContract.balanceOf());
  });


  var miPrimerTokenUpdate = document.getElementById('miPrimerTknUpdate');
  miPrimerTokenUpdate.addEventListener('click', ()=>{
    console.log('Balance en MiPrimerToken: ', miPrTokenContract.balanceOf());
  });

  var approveBtn = document.getElementById('approveButton');
  approveBtn.addEventListener('click',async function() {
    let input = document.getElementById('approveInput').value;
    try {
      var tx = await miPrTokenContract
        .connect(signer)
        .approve(input);

        var response = await tx.wait();
        var transactionHash = response.transactionHash;
        console.log("Tx Hash", transactionHash);
    }catch(e) {
      console.error(e.reason);
    }
  });
}
function setUpEventsContracts() {
  // nftTknContract.on  
  nftTknContract.on('mintNFT', (to, id) => {
    console.log(`NFT acuñado! para ${to}, con id ${id}`);
  })
}

async function setUp() {
  initSCsGoerli();
  //initSCsMumbai();
  await setUpListeners();
  setUpEventsContracts();
}

setUp()
  .then()
  .catch((e) => console.log(e));
