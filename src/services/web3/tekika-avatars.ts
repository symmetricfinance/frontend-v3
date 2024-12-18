import { ethers } from 'ethers';

const nftABI = [
  'function tokenURI(uint256 _tokenId) public view returns (string memory)',
  'function tokenOfOwnerByIndex(address _owner, uint256 _index) public view returns (uint256)',
];

const nftAddress = '0xB8a0d67Ecc01E0ADee394a1FD95F87D96A9680a2';

export const resolveTekikaAvatar = async (
  provider: ethers.providers.JsonRpcProvider,
  address: string
) => {
  const contract = new ethers.Contract(nftAddress, nftABI, provider);

  let avatar = '';
  try {
    const tokenId = await contract.tokenOfOwnerByIndex(address, 0);
    avatar = `https://tekika-nfts.s3.amazonaws.com/tokens/${tokenId}-2/${tokenId}-2.webp`;
  } catch (error) {
    console.log('No Tekika found :(');
  }
  return avatar;
};
