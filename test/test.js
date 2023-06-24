const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

const { getRole, deploySC, deploySCNoUp, ex, pEth } = require("../utils");

const MINTER_ROLE = getRole("MINTER_ROLE");
const BURNER_ROLE = getRole("BURNER_ROLE");

// 17 de Junio del 2023 GMT
var startDate = 1686960000;

var makeBN = (num) => ethers.BigNumber.from(String(num));

describe("MI PRIMER TOKEN TESTING", function () {
  var nftContract, publicSale, miPrimerToken, usdc;
  var owner, gnosis, alice, bob, carl, deysi;
  var name = "Mi Primer NFT";
  var symbol = "MPRNFT";

  before(async () => {
    [owner, gnosis, alice, bob, carl, deysi] = await ethers.getSigners();
  });

  // Estos dos métodos a continuación publican los contratos en cada red
  // Se usan en distintos tests de manera independiente
  // Ver ejemplo de como instanciar los contratos en deploy.js
  async function deployNftSC() {}

  async function deployPublicSaleSC() {}

  describe("Mi Primer Nft Smart Contract", () => {
    // Se publica el contrato antes de cada test
    beforeEach(async () => {
      await deployNftSC();
    });

    it("Verifica nombre colección", async () => {});

    it("Verifica símbolo de colección", async () => {});

    it("No permite acuñar sin privilegio", async () => {});

    it("No permite acuñar doble id de Nft", async () => {});

    it("Verifica rango de Nft: [1, 30]", async () => {
      // Mensaje error: "NFT: Token id out of range"
    });

    it("Se pueden acuñar todos (30) los Nfts", async () => {});
  });

  describe("Public Sale Smart Contract", () => {
    // Se publica el contrato antes de cada test
    beforeEach(async () => {
      await deployPublicSaleSC();
    });

    it("No se puede comprar otra vez el mismo ID", async () => {});

    it("IDs aceptables: [1, 30]", async () => {});

    it("Usuario no dio permiso de MiPrimerToken a Public Sale", async () => {});

    it("Usuario no tiene suficientes MiPrimerToken para comprar", async () => {});

    describe("Compra grupo 1 de NFT: 1 - 10", () => {
      it("Emite evento luego de comprar", async () => {
        // modelo para validar si evento se disparo con correctos argumentos
        // var tx = await publicSale.purchaseNftById(id);
        // await expect(tx)
        //   .to.emit(publicSale, "DeliverNft")
        //   .withArgs(owner.address, counter);
      });

      it("Disminuye balance de MiPrimerToken luego de compra", async () => {
        // Usar changeTokenBalance
        // source: https://ethereum-waffle.readthedocs.io/en/latest/matchers.html#change-token-balance
      });

      it("Gnosis safe recibe comisión del 10% luego de compra", async () => {});

      it("Smart contract recibe neto (90%) luego de compra", async () => {});
    });

    describe("Compra grupo 2 de NFT: 11 - 20", () => {
      it("Emite evento luego de comprar", async () => {});

      it("Disminuye balance de MiPrimerToken luego de compra", async () => {});

      it("Gnosis safe recibe comisión del 10% luego de compra", async () => {});

      it("Smart contract recibe neto (90%) luego de compra", async () => {});
    });

    describe("Compra grupo 3 de NFT: 21 - 30", () => {
      it("Disminuye balance de MiPrimerToken luego de compra", async () => {});

      it("Gnosis safe recibe comisión del 10% luego de compra", async () => {});

      it("Smart contract recibe neto (90%) luego de compra", async () => {});
    });

    describe("Depositando Ether para Random NFT", () => {
      it("Método emite evento (30 veces) ", async () => {});

      it("Método falla la vez 31", async () => {});

      it("Envío de Ether y emite Evento (30 veces)", async () => {});

      it("Envío de Ether falla la vez 31", async () => {});

      it("Da vuelto cuando y gnosis recibe Ether", async () => {
        // Usar el método changeEtherBalances
        // Source: https://ethereum-waffle.readthedocs.io/en/latest/matchers.html#change-ether-balance-multiple-accounts
        // Ejemplo:
        // await expect(
        //   await owner.sendTransaction({
        //     to: publicSale.address,
        //     value: pEth("0.02"),
        //   })
        // ).to.changeEtherBalances(
        //   [owner.address, gnosis.address],
        //   [pEth("-0.01"), pEth("0.01")]
        // );
      });
    });
  });
});
