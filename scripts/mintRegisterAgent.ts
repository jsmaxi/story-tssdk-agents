import { SPGNFTContractAddress, client } from './utils/utils'
import { uploadJSONToIPFS } from './utils/uploadToIpfs'
import { createHash } from 'crypto'
import { LicenseTerms } from '@story-protocol/core-sdk';
import { zeroAddress, zeroHash } from 'viem';
import { LicensingConfig } from '@story-protocol/core-sdk/dist/declarations/src/types/common';

const main = async function () {
    // 1. Set up your IP Metadata
    //
    // Docs: https://docs.story.foundation/docs/ipa-metadata-standard
    const ipMetadata = {
        "title": "Story AI Agent",
        "description": "This is an example AI Agent registered on Story.",
        "createdAt": "1740005219",
        "creators": [
          {
            "name": "Jacob Tucker",
            "address": "0xA2f9Cf1E40D7b03aB81e34BC50f0A8c67B4e9112",
            "contributionPercent": 100
          }
        ],
        "image": "https://ipfs.io/ipfs/bafybeigi3k77t5h5aefwpzvx3uiomuavdvqwn5rb5uhd7i7xcq466wvute",
        "imageHash": "0x64ccc40de203f218d16bb90878ecca4338e566ab329bf7be906493ce77b1551a",
        "mediaUrl": "https://ipfs.io/ipfs/bafybeigi3k77t5h5aefwpzvx3uiomuavdvqwn5rb5uhd7i7xcq466wvute",
        "mediaHash": "0x64ccc40de203f218d16bb90878ecca4338e566ab329bf7be906493ce77b1551a",
        "mediaType": "image/webp",
        "aiMetadata": {
          "characterFileUrl": "https://ipfs.io/ipfs/bafkreic6eu4hlnwx46soib62rgkhhmlieko67dggu6bzk7bvtfusqsknfu",
          "characterFileHash": "0x5e253875b6d7e7a4e407da899473b168229def8cc6a783957c35996928494d2d"
        },
        "ipType": "AI Agent", // experimental field
        "tags": ["AI Agent", "Twitter bot", "Smart Agent"] // experimental field
      }

    // 2. Set up your NFT Metadata
    //
    // Docs: https://docs.opensea.io/docs/metadata-standards#metadata-structure
    const nftMetadata = {
        name: 'Story AI Agent',
        description: 'This is an example AI Agent registered on Story.',
        image: 'https://cdn2.suno.ai/image_large_8bcba6bc-3f60-4921-b148-f32a59086a4c.jpeg',
        media: [
            {
                name: 'AI Agent',
                url: 'https://ipfs.io/ipfs/bafybeigi3k77t5h5aefwpzvx3uiomuavdvqwn5rb5uhd7i7xcq466wvute',
                mimeType: 'image/webp',
            },
        ],
        attributes: [
            {
                key: 'Creator',
                value: 'Jacob Tucker',
            },
            {
                key: 'Creator Wallet',
                value: '0xA2f9Cf1E40D7b03aB81e34BC50f0A8c67B4e9112',
            },
        ],
    }

    // 3. Upload your IP and NFT Metadata to IPFS
    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)
    const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex')
    const nftIpfsHash = await uploadJSONToIPFS(nftMetadata)
    const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex')

    // Extra terms and licence
    const commercialTerms: LicenseTerms = {
        transferable: true,
        royaltyPolicy: '0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E', // RoyaltyPolicyLAP address from https://docs.story.foundation/docs/deployed-smart-contracts
        defaultMintingFee: BigInt(0),
        expiration: BigInt(0),
        commercialUse: true,
        commercialAttribution: true,
        commercializerChecker: zeroAddress,
        commercializerCheckerData: zeroAddress,
        commercialRevShare: 50, // can claim 50% of derivative revenue
        commercialRevCeiling: BigInt(0),
        derivativesAllowed: true,
        derivativesAttribution: true,
        derivativesApproval: false,
        derivativesReciprocal: true,
        derivativeRevCeiling: BigInt(0),
        currency: '0x1514000000000000000000000000000000000000', // $WIP address from https://docs.story.foundation/docs/deployed-smart-contracts
        uri: '',
      }
      
      const licensingConfig: LicensingConfig = {
        isSet: false,
        mintingFee: BigInt(0),
        licensingHook: zeroAddress,
        hookData: zeroHash,
        commercialRevShare: 0,
        disabled: false,
        expectMinimumGroupRewardShare: 0,
        expectGroupRewardPool: zeroAddress,
      };

    // 4. Register the NFT as an IP Asset
    //
    // Docs: https://docs.story.foundation/docs/sdk-ipasset#mintandregisterip
    const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: SPGNFTContractAddress,
        licenseTermsData: [{ terms: commercialTerms, licensingConfig }], // IP already has non-commercial social remixing terms. You can add more here.
        allowDuplicates: true,
        ipMetadata: {
            ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
            ipMetadataHash: `0x${ipHash}`,
            nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
            nftMetadataHash: `0x${nftHash}`,
        },
        txOptions: { waitForTransaction: true },
    })
    console.log(`Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}, License Terms ID: ${response.licenseTermsIds}`)
    console.log(`View on the explorer: https://aeneid.explorer.story.foundation/ipa/${response.ipId}`)
}

main()
