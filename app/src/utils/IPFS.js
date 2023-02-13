var axios = require('axios');
const API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const API_SECRET = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
const JWT = process.env.NEXT_PUBLIC_JWT

export const getIPFS_CID = async (campaignID, businessName, industryName) => {
    // if it had be totally decentralized I would store it running my own node
    const pinata = new pinataSDK({ pinataApiKey: API_KEY, pinataSecretApiKey: API_SECRET });
    const content = customStringConcat(businessName, industryName)


    const body = {
        name: campaignID,
        message: content
    };
    const options = {
        pinataMetadata: {
            name: MyCustomName,
        },
        pinataOptions: {
            cidVersion: 0
        }
    };
    pinata.pinJSONToIPFS(body, options).then((result) => {
        //handle results here
        console.log(result);
    }).catch((err) => {
        //handle error here
        console.log(err);
    });
}

function customStringConcat(businessName, industryName) {
    return industryName + '||' + businessName
}