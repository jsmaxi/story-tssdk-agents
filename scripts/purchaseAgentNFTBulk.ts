import { Address } from 'viem';
import {  client } from './utils/utils'

async function main(ipaID : Address) {
  const response = await client.license.mintLicenseTokens({
    licenseTermsId: "95", 
    licensorIpId: ipaID,
    receiver: undefined, // optional. if not provided, it will go to the tx sender
    amount: 1,
    maxMintingFee: BigInt(0), // disabled
    maxRevenueShare: 100, // default
    txOptions: { waitForTransaction: true }
  });

  console.log(`License Token minted at transaction hash ${response.txHash}, License IDs: ${response.licenseTokenIds}`)
}

main("0x9174d739d88c1bD5af5e39fd6D0cE81204B9097C");
// main("0x38058fc7DB15322fA690A36735d84493194d8935");
// main("0x8fF4a26BBaf488241019f39758B1d33eB46F3969");
// main("0x00FecB388Cf39F119e78447956cb9d820337c577");
// main("0x0F60A52Bd8Ee1682C2ff492982ef0488944E5E9C");

