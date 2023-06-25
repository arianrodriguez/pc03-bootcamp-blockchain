// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MiPrimerNft is ERC721, AccessControl, Pausable, ERC721Burnable {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant RELAYER_ROLE = keccak256("RELAYER_ROLE");

    uint256 private constant COMMONS_GROUP = 10;
    uint256 private constant RARES_GROUP = 20;
    uint256 private constant LEGENDARIES_GROUP = 30;
    address public gnosisAddress;
    address public relayerOZ;

    constructor(address _relayerOZ) ERC721("MyTokenMiPrimerToken", "MPRTKN") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);    
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(RELAYER_ROLE, msg.sender);
        relayerOZ = _relayerOZ;
    }

    modifier onlyRelayer() {
        require(msg.sender == relayerOZ, "NFT: not relayer insufficient permission");
        _;
    }

    function setGnosisAddress(address _gnosisAddress) public {
        gnosisAddress = _gnosisAddress;
    }

    function _baseURI() internal pure override returns (string memory) {
         return "ipfs://QmWU4yb225aTpyWkBQKAffjLaPhFKyWYiiPKbUvJPx6eou/";
    }

    function pause() public onlyRelayer {
        _pause();
    }

    function unpause() public onlyRelayer {
        _unpause();
    }

    function safeMint(address to, uint256 id) public onlyRelayer {
        // Se hacen dos validaciones
        // 1 - Dicho id no haya sido acuñado antes
        require(!_exists(id), "Token ID has been minted before");
        // 2 - Id se encuentre en el rando inclusivo de 1 a 30
        //      * Mensaje de error: "Public Sale: id must be between 1 and 30"
        require(id<30, "Public Sale: id must be between 1 and 30");
        _safeMint(to, id);
    }

    function tokenGroup(uint256 id) public pure returns (string memory) {
        require(id<30, "Invalid id");
        if (id < COMMONS_GROUP) {
            return "Commons";
        } else if (id < RARES_GROUP) {
            return "Rares";
        } else {
            return "Legendaries";
        }
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(
         bytes4 interfaceId
    ) public view override(ERC721, AccessControl) returns (bool) {
         return super.supportsInterface(interfaceId);
    }
}
