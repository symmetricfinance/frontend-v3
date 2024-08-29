import { ethers } from 'ethers';

const nftABI = [
  'function tokenURI(uint256 _tokenId) public view returns (string memory)',
  'function tokenOfOwnerByIndex(address _owner, uint256 _index) public view returns (uint256)',
];

const nftAddress = '0x5c00D81F7E00188751258a0DA0dd8198681D1fFA';

export const resolveTekikaAvatar = async (
  provider: ethers.providers.JsonRpcProvider,
  address: string
) => {
  const contract = new ethers.Contract(nftAddress, nftABI, provider);

  let avatar = '';
  try {
    const tokenId = await contract.tokenOfOwnerByIndex(address, 0);
    avatar = `https://tekika-nfts.s3.amazonaws.com/tokens/${tokenId}/${tokenId}.webp`;
  } catch (error) {
    console.log('No Tekika found :(');
  }
  return avatar;
};
