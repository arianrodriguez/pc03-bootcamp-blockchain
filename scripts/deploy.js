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
  var myTokenContract = await deploySCNoUp("MyTokenMiPrimerToken");
  var usdCoinContract = await deploySCNoUp("USDCoin");

  await ex(
    myTokenContract,
    "setGnosisAddress",
    [gnosis.address],
    "Setter address Gnosis Safe fallido"
  )
  .then(console.log("MyTokenMiPrimerToken deployed en Goerli"));

  await ex(
    usdCoinContract,
    "setGnosisAddress",
    [gnosis.address],
    "Setter address Gnosis Safe fallido"
  )
  .then(console.log("USDCoin deployed en Goerli"));
}

// deployMumbai()
deployGoerli()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
