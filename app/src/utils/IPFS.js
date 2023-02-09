export const getIPFS_CID = async (businessName, industryName) => {
    const IPFS = require('ipfs-http-client')

    // Connect to the IPFS network
    const ipfs = IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
    
    const content = customStringConcat(businessName, industryName)

    // Add the strings to IPFS and return CID
    async function storeInIpfs(string) {
        const results = await ipfs.add({ content: Buffer.from(string) })
        return results[0].path
    }

    return (await storeInIpfs(content))
}

function customStringConcat(businessName, industryName) {
    return industryName + '||' + businessName
}