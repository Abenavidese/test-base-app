export async function GET() {
  const appUrl = 'https://front-three-henna.vercel.app';
  
  return Response.json({
      "accountAssociation": {
        "header": "eyJmaWQiOjEzNjQzNzAsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg3RDkwNzhCRWU2RDJBNTk3ODk3MDZiZjgxYjY0ODYzQTJhZThiM2NmIn0",
        "payload": "eyJkb21haW4iOiJmcm9udC10aHJlZS1oZW5uYS52ZXJjZWwuYXBwIn0",
        "signature": "AtAWW70BcfS33ZGCojbqKCOWC8Pb6ZNqIrwBK7TbaNY0aN+dkkphksn6hl56RZrUvKXjZJNjTfeZ62ZQWAGTRxs="
      },
      "baseBuilder": {
        "allowedAddresses": [
          "0x63C1dAc1aD0f2e3552CD6d2296f17cF5C2E34674"
        ]
      },
    "miniapp": {
      "version": "1",
      "name": "Merch MVP",
      "homeUrl": appUrl,
      "iconUrl": `${appUrl}/icon.png`,
      "splashImageUrl": `${appUrl}/splash.png`,
      "splashBackgroundColor": "#0052ff",
      "webhookUrl": `${appUrl}/api/webhook`,
      "subtitle": "SBT and Premium NFT System",
      "description": "Claim event attendance SBTs and mint premium companion NFTs on Base. Built with signature-based validation for gasless transactions.",
      "screenshotUrls": [
        `${appUrl}/screenshot1.png`,
        `${appUrl}/screenshot2.png`,
        `${appUrl}/screenshot3.png`
      ],
      "primaryCategory": "social",
      "tags": ["sbt", "nft", "events", "base", "ethereum"],
      "heroImageUrl": `${appUrl}/hero.png`,
      "tagline": "Claim event SBTs",
      "ogTitle": "Merch MVP - Event SBT System",
      "ogDescription": "Claim event attendance SBTs and mint premium companion NFTs on Base Sepolia.",
      "ogImageUrl": `${appUrl}/og-image.svg`,
      "canonicalDomain": new URL(appUrl).hostname,
      "requiredChains": ["eip155:84532"], // Base Sepolia
      "requiredCapabilities": [
        "actions.ready"
      ],
      "noindex": true
    }
  })
}