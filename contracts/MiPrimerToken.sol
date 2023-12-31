// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";


contract MyTokenMiPrimerToken is Initializable, ERC20Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
    address public gnosisAddress;
    function initialize() public initializer {
        __ERC20_init("MyTokenMiPrimerToken", "MPRTKN");
        __Ownable_init();
        _mint(msg.sender, 0); // Mint 0 tokens to initialize the supply
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function setGnosisAddress(address _gnosisAddress) public {
        gnosisAddress = _gnosisAddress;
    }
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
     function decimals() public pure override returns(uint8) {
        return 18;
    }
    function balanceOf() public view  returns(uint256) {
        return ERC20Upgradeable.balanceOf(msg.sender);
    }
    function approve(uint256 _amount) public returns(bool) {
        return ERC20Upgradeable.approve(msg.sender, _amount);
    }
}
