import { SPGNFTContractAddress, client } from './utils/utils'
import { uploadJSONToIPFS } from './utils/uploadToIpfs'
import { createHash } from 'crypto'
import { LicenseTerms } from '@story-protocol/core-sdk';
import { zeroAddress, zeroHash } from 'viem';
import { LicensingConfig } from '@story-protocol/core-sdk/dist/declarations/src/types/common';

const main = async function (name: string, desc: string, fileUrl: string) {

    const ipMetadata1 = {
        "title": "Podcast AI Agent " + name,
        "description": desc,
        "createdAt": "1740005219",
        "creators": [
          {
            "name": "Podcaster",
            "address": "0x4d76f8a4d8Dd30d1FAE6bD461590276748E2CB63",
            "contributionPercent": 100
          }
        ],
        "image": "https://gateway.pinata.cloud/ipfs/bafkreid5c3npfoigwrnkaejgbqqmlrypp4jy2jpgv7ghctf3zjwlr7ww7m",
        "mediaUrl": "https://gateway.pinata.cloud/ipfs/bafkreid5c3npfoigwrnkaejgbqqmlrypp4jy2jpgv7ghctf3zjwlr7ww7m",
        "mediaType": "image/webp",
        "aiMetadata": {
          "characterFileUrl": fileUrl,
        },
        "ipType": "AI Agent", // experimental field
        "tags": ["AI Agent", "Podcast", "Smart Agent"] // experimental field
      }

    const nftMetadata1 = {
        name: 'Podcast AI Agent ' + name,
        description: desc,
        image: 'https://gateway.pinata.cloud/ipfs/bafkreid5c3npfoigwrnkaejgbqqmlrypp4jy2jpgv7ghctf3zjwlr7ww7m',
        media: [
            {
                name: 'AI Agent',
                url: 'https://gateway.pinata.cloud/ipfs/bafkreid5c3npfoigwrnkaejgbqqmlrypp4jy2jpgv7ghctf3zjwlr7ww7m',
                mimeType: 'image/webp',
            },
        ],
        attributes: [
            {
                key: 'Creator',
                value: 'Podcaster',
            },
        ],
    }

    const ipIpfsHash1 = await uploadJSONToIPFS(ipMetadata1)
    const ipHash1 = createHash('sha256').update(JSON.stringify(ipMetadata1)).digest('hex')
    const nftIpfsHash1 = await uploadJSONToIPFS(nftMetadata1)
    const nftHash1 = createHash('sha256').update(JSON.stringify(nftMetadata1)).digest('hex')

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

    const response1 = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: SPGNFTContractAddress,
        licenseTermsData: [{ terms: commercialTerms, licensingConfig }], // IP already has non-commercial social remixing terms. You can add more here.
        allowDuplicates: true,
        ipMetadata: {
            ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash1}`,
            ipMetadataHash: `0x${ipHash1}`,
            nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash1}`,
            nftMetadataHash: `0x${nftHash1}`,
        },
        txOptions: { waitForTransaction: true },
    })
    console.log(`Root IPA created at transaction hash ${response1.txHash}, IPA ID: ${response1.ipId}, License Terms ID: ${response1.licenseTermsIds}`)
    console.log(`View on the explorer: https://aeneid.explorer.story.foundation/ipa/${response1.ipId}`)
}

// main("Elon", "Elon Musk", "https://gateway.pinata.cloud/ipfs/bafkreiaazpyxitqf2bvoa3zz74tgh6s5fr6szzeofsftzbl3dnzs453rmq");
// main("Albert", "Albert Einstein", "https://gateway.pinata.cloud/ipfs/bafkreick7tljv7bm7nyiz6dhgpq2elc3wsm44e35jd2zuyasqrw7i6f6m4");
// main("Mahatma", "Mahatma Gandhi", "https://gateway.pinata.cloud/ipfs/bafkreigl7gsn3hewxn3sjhnredyklyrv4dfc74nkw6b2krgs4mytearswi");
// main("Dalai", "Dalai Lama", "https://gateway.pinata.cloud/ipfs/bafkreicvottajszrx3skr4kvykeoj7tx5bstaghnh4syjaeqfve4wpvhne");
main("Genghis", "Genghis Khan", "https://gateway.pinata.cloud/ipfs/bafkreie7srew6aemcet6ykrzu6gc3chqe233g4obemm5rjvoelnarefy2m");

