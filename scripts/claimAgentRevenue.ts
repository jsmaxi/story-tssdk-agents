import { WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk'
import {  client } from './utils/utils'

async function main() {
  const claimRevenue = await client.royalty.claimAllRevenue({
    // IP Asset 3's ipId
    ancestorIpId: '0xDa03c4B278AD44f5a669e9b73580F91AeDE0E3B2',
    // whoever owns the royalty tokens associated with IP Royalty Vault 3
    // (most likely the associated ipId, which is IP Asset 3's ipId)
    claimer: '0xDa03c4B278AD44f5a669e9b73580F91AeDE0E3B2',
    currencyTokens: [WIP_TOKEN_ADDRESS],
    childIpIds: [],
    royaltyPolicies: [],
    claimOptions: {
      // If the wallet claiming the revenue is the owner of the 
      // IP Account/IP Asset (in other words, the owner of the 
      // IP's underlying NFT), `claimAllRevenue` will transfer all 
      // earnings to the user's external wallet holding the NFT 
      // instead of the IP Account, for convenience. You can disable it here.
      autoTransferAllClaimedTokensFromIp: true,
      // Unwraps the claimed $WIP to $IP for you
      autoUnwrapIpTokens: true
    }
  })

  console.log(`Claimed revenue: ${claimRevenue.claimedTokens}`);
}

main();