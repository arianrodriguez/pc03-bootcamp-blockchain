// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract PublicSale is
    Initializable,
    PausableUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    // Mi Primer Token
    // Crear su setter
    IERC20Upgradeable miPrimerToken;

    // 17 de Junio del 2023 GMT
    uint256 constant startDate = 1686960000;

    // Maximo price NFT
    uint256 constant MAX_PRICE_NFT = 50000 * 10 ** 18;

    // Gnosis Safe
    // Crear su setter
    address public gnosisSafeWallet;
    mapping(uint256 => bool) public nftSold;
    uint256 public nftCount;

    event DeliverNft(address winnerAccount, uint256 nftId);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function setGnosisSafeWallet(address _gnosisSafeWallet) public {
        gnosisSafeWallet = _gnosisSafeWallet;
    }

    function initialize(address _miPrimerToken, address _gnosisSafeWallet) public initializer {
        __Pausable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);

        miPrimerToken = IERC20Upgradeable(_miPrimerToken);
        gnosisSafeWallet = _gnosisSafeWallet;
    }

    function purchaseNftById(uint256 _id) external whenNotPaused {
        // Realizar 3 validaciones:
        // 1 - el id no se haya vendido. Sugerencia: llevar la cuenta de ids vendidos
        //         * Mensaje de error: "Public Sale: id not available"
        require(!nftSold[_id], "Public Sale: id not available");
        // 2 - el msg.sender haya dado allowance a este contrato en suficiente de MPRTKN
        //         * Mensaje de error: "Public Sale: Not enough allowance"

        // Obtener el precio segun el id
        uint256 priceNft = _getPriceById(_id);
        require(
            miPrimerToken.allowance(msg.sender, address(this)) >= priceNft,
            "Public Sale: Not enough allowance"
        );

        // 3 - el msg.sender tenga el balance suficiente de MPRTKN
        //         * Mensaje de error: "Public Sale: Not enough token balance"
        require(
            miPrimerToken.balanceOf(msg.sender) >= priceNft,
            "Public Sale: Not enough token balance"
        );

        // 4 - el _id se encuentre entre 1 y 30
        //         * Mensaje de error: "NFT: Token id out of range"
        require(_id < 30, "NFT: Token id out of range");

        nftSold[_id] = true;
        nftCount++;

        // Purchase fees
        // 10% para Gnosis Safe (fee)
        // 90% se quedan en este contrato (net)
        // from: msg.sender - to: gnosisSafeWallet - amount: fee
        // from: msg.sender - to: address(this) - amount: net
        
        miPrimerToken.transferFrom(msg.sender, gnosisSafeWallet, (priceNft*10)/100);
        miPrimerToken.transferFrom(msg.sender, address(this), (priceNft*90)/100);
        
        // EMITIR EVENTO para que lo escuche OPEN ZEPPELIN DEFENDER
        emit DeliverNft(msg.sender, _id);
    }

    function depositEthForARandomNft() public payable whenNotPaused {
        // Realizar 2 validaciones
        // 1 - que el msg.value sea mayor o igual a 0.01 ether
        require(msg.value >= 0.01 ether, "Public Sale: Insufficiente ether");
        // 2 - que haya NFTs disponibles para hacer el random
        require(nftCount<30, "Public Sale: All NFTs sold");

        // Escgoer una id random de la lista de ids disponibles
        uint256 nftId = _getRandomNftId();

        // Enviar ether a Gnosis Safe
        // SUGERENCIA: Usar gnosisSafeWallet.call para enviar el ether
        // Validar los valores de retorno de 'call' para saber si se envio el ether correctamente
        (bool success, ) = gnosisSafeWallet.call{value: msg.value}("");
        require(success, "Public Sale: Failed to send Ether to Gnosis Safe");

        // Dar el cambio al usuario
        // El vuelto seria equivalente a: msg.value - 0.01 ether
        if (msg.value > 0.01 ether) {
            // logica para dar cambio
            // usar '.transfer' para enviar ether de vuelta al usuario
            (bool refundSuccess, ) = msg.sender.call{
                value: msg.value - 0.01 ether
            }("");
            require(refundSuccess, "Public Sale: Failed to refund Ether");
        }

        nftCount++;
        // EMITIR EVENTO para que lo escuche OPEN ZEPPELIN DEFENDER
        emit DeliverNft(msg.sender, nftId);
    }

    // PENDING
    // Crear el metodo receive
    receive() external payable {
        // lógica para manejar la recepción de Ether
        if (msg.value >= 0.01 ether) {
            depositEthForARandomNft();
        }
    }


    ////////////////////////////////////////////////////////////////////////
    /////////                    Helper Methods                    /////////
    ////////////////////////////////////////////////////////////////////////

    // Devuelve un id random de NFT de una lista de ids disponibles
    function _getRandomNftId() internal view returns (uint256) {
        // Implementar lógica para obtener un ID de NFT aleatorio
        // Puedes usar block.timestamp o algún generador de números aleatorios externo
        // Recuerda que debes garantizar que el ID generado no haya sido vendido antes
        // y que existan NFTs disponibles con ese ID.
        uint256 availableCount = 30 - nftCount;
        require(availableCount > 0, "Public Sale: No more available NFTs");

        uint256 randomSeed = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.difficulty,
                    block.coinbase,
                    block.number
                )
            )
        );

        uint256 randomIndex = randomSeed % availableCount;
        uint256 nftId = randomIndex + 1;

        while (nftSold[nftId]) {
            randomIndex = (randomIndex + 1) % availableCount;
            nftId = randomIndex + 1;
        }

        return nftId;
    }


    // Según el id del NFT, devuelve el precio. Existen 3 grupos de precios
    function _getPriceById(uint256 _id) internal view returns (uint256) {
        if (_id > 0 && _id < 11) {
            return 500 * 10 ** 18; // Precio para grupo común
        } else if (_id > 10 && _id < 21) {
            return _id * 1000 * 10 ** 18; // Precio para grupo raro
        } else {
            uint256 hoursPassed = (block.timestamp - startDate) / 3600;
            uint256 price = (10000 * 10 ** 18) + (hoursPassed * 1000 * 10 ** 18);
            return price > MAX_PRICE_NFT ? MAX_PRICE_NFT : price; // Precio para grupo legendario
        }
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyRole(UPGRADER_ROLE) {}
}
