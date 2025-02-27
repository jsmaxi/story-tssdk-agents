import { WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk'
import {  client } from './utils/utils'

async function main() {
  const payRoyalty = await client.royalty.payRoyaltyOnBehalf({
    receiverIpId: "0xDa03c4B278AD44f5a669e9b73580F91AeDE0E3B2", // parentIpId
    payerIpId: "0x0b825D9E5FA196e6B563C0a446e8D9885057f9B1", // childIpId
    token: WIP_TOKEN_ADDRESS,
    amount: 1,
    txOptions: { waitForTransaction: true },
  });

  console.log(`Paid royalty at transaction hash ${payRoyalty.txHash}`);
}

main();