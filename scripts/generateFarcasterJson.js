const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Variables de entorno
const DOMAIN_WITH_PROTOCOL = process.env.NEXT_PUBLIC_URL || 'https://front-jade-seven.vercel.app';
const DOMAIN = DOMAIN_WITH_PROTOCOL.endsWith('/') ? DOMAIN_WITH_PROTOCOL.slice(0, -1) : DOMAIN_WITH_PROTOCOL;
const DOMAIN_WITHOUT_PROTOCOL = DOMAIN.replace('https://', '').replace('http://', '');

// Contenido dinámico del archivo
const farcasterJson = {
  accountAssociation: {
    header: "eyJmaWQiOjEzNjQzNzAsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg3RDkwNzhCRWU2RDJBNTk3ODk3MDZiZjgxYjY0ODYzQTJhZThiM2NmIn0",
    payload: `eyJkb21haW4iOiJmcm9udC10aHJlZS1oZW5uYS52ZXJjZWwuYXBwIn0`,
    signature: "LsO+AtAWW70BcfS33ZGCojbqKCOWC8Pb6ZNqIrwBK7TbaNY0aN/dZzw0l1NjYWy+LI0AGw3oMzrhE2JkRvIjks9iXD0jcIDZ/QGRw="
  },
  baseBuilder: {
    allowedAddresses: ["0x63C1dAc1aD0f2e3552CD6d2296f17cF5C2E34674"]
  },
  miniapp: {
    version: "1",
    name: "Merch MVP",
    homeUrl: `${DOMAIN}`,
    iconUrl: `${DOMAIN}/icon.png`,
    splashImageUrl: `${DOMAIN}/splash.png`,
    splashBackgroundColor: "#0052ff",
    webhookUrl: `${DOMAIN}/api/webhook`,
    subtitle: "SBT and Premium NFT System",
    description: "Claim event attendance SBTs and mint premium companion NFTs on Base. Built with signature-based validation for gasless transactions.",
    screenshotUrls: [
      `${DOMAIN}/screenshot1.png`,
      `${DOMAIN}/screenshot2.png`,
      `${DOMAIN}/screenshot3.png`
    ],
    primaryCategory: "social",
    tags: ["sbt", "nft", "events", "base", "ethereum"],
    heroImageUrl: `${DOMAIN}/hero.png`,
    tagline: "Claim your event SBTs instantly",
    ogTitle: "Merch MVP - Event SBT System",
    ogDescription: "Claim event attendance SBTs and mint premium companion NFTs on Base Sepolia.",
    ogImageUrl: `${DOMAIN}/og-image.png`,
    canonicalDomain: DOMAIN.replace('https://', '').replace('http://', ''),
    requiredChains: ["eip155:84532"],
    requiredCapabilities: ["actions.ready", "context"],
    noindex: true
  }
};

// Ruta de salida
const outputPath = path.join(__dirname, '../public/.well-known/farcaster.json');

// Crear el archivo
fs.writeFileSync(outputPath, JSON.stringify(farcasterJson, null, 2));
console.log('Archivo farcaster.json generado correctamente en:', outputPath);