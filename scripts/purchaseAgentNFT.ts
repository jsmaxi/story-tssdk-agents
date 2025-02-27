import {  client } from './utils/utils'

async function main() {
  const response = await client.license.mintLicenseTokens({
    licenseTermsId: "95", 
    licensorIpId: "0xAF79894A7e838F198a9D88afE336c5A385e8f22f",
    receiver: undefined, // optional. if not provided, it will go to the tx sender
    amount: 1,
    maxMintingFee: BigInt(0), // disabled
    maxRevenueShare: 100, // default
    txOptions: { waitForTransaction: true }
  });

  console.log(`License Token minted at transaction hash ${response.txHash}, License IDs: ${response.licenseTokenIds}`)
}

main();