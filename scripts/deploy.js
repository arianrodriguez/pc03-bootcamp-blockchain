require("dotenv").config();

const {
  getRole,
  verify,
  ex,
  printAddress,
  deploySC,
  deploySCNoUp,
} = require("../utils");

var MINTER_ROLE = getRole("MINTER_ROLE");
var BURNER_ROLE = getRole("BURNER_ROLE");

async function deployMumbai() {
  var relayerAddress = "0xeb0868cf925105ac466c2b19039301e904061514";
  var name = "Mi Primer NFT";
  var symbol = "MPRNFT";
  var nftContract = await deploySC("MiPrimerNft", [name, symbol]);
  var implementation = await printAddress("NFT", nftContract.address);

  // set up
  await ex(nftTknContract, "grantRole", [MINTER_ROLE, relayerAddress], "GR");

  await verify(implementation, "MiPrimerNft", []);
}

async function deployGoerli() {
  // gnosis safe
  // Crear un gnosis safe en https://gnosis-safe.io/app/
  // Extraer el address del gnosis safe y pasarlo al contrato con un setter
  var gnosis = { address: "0x48600E6167B74B01Ad4a364FF1bAf683F88a5daF" };

  var firstokenSC = await deploySC("MyTokenMiPrimerToken", []);
  var contractAd = await printAddress("FirstToken", firstokenSC.address);
  await verify(contractAd, "MyTokenMiPrimerToken", []);

  var publicSaleSC = await deploySC("PublicSale", [firstokenSC.address, gnosis.address]);
  var contractAd = await printAddress("publicSaleContract", publicSaleSC.address);
  // set up 
 // await ex(publicSaleSC, "setAddressMiPrimerToken", [firstokenSC.address], "AMPT");
  //await ex(publicSaleSC, "setGnosisSafeWallet", [gnosis.address], "GW");

  await verify(contractAd, "publicSaleContract", []);

  var usdCoinSCNoUp = await deploySCNoUp("USDCoin", ["USD Coin", "USDC"]);
  await verify(usdCoinSCNoUp.address, "USDCoin", []);
}

//deployMumbai();
deployGoerli()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
