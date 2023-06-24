// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyTokenMiPrimerToken is ERC20, Ownable {
    constructor() ERC20("MyTokenMiPrimerToken", "MPRTKN") {}
    address public gnosisAddress;
    function setGnosisAddress(address _gnosisAddress) public {
        gnosisAddress = _gnosisAddress;
    }
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
     function decimals() public pure override returns(uint8) {
        return 18;
    }
}
