import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dartFile = path.join(__dirname, '../../lib/data/shine_villages.dart');
const outputFile = path.join(__dirname, '../src/data/shine_villages.json');

console.log('Reading Dart file from:', dartFile);

// Check if Dart file exists
if (!fs.existsSync(dartFile)) {
    console.error('❌ Dart file not found:', dartFile);
    process.exit(1);
}

// Read the Dart file
const dartContent = fs.readFileSync(dartFile, 'utf-8');

// Extract all ShineVillage entries
const villages = [];

// Pattern to match each ShineVillage block
const pattern = /ShineVillage\(\s*([\s\S]*?)\)\s*[,)]/g;
let match;

while ((match = pattern.exec(dartContent)) !== null) {
    const block = match[1];
    
    // Extract fields using regex
    const shineCode = block.match(/shineCode:\s*"([^"]+)"/)?.[1];
    const panchayat = block.match(/panchayat:\s*"([^"]+)"/)?.[1];
    const panchayatLgdCode = block.match(/panchayatLgdCode:\s*"([^"]+)"/)?.[1];
    const revenueVillage = block.match(/revenueVillage:\s*"([^"]+)"/)?.[1];
    const rvLgdCode = block.match(/rvLgdCode:\s*"([^"]+)"/)?.[1];
    const tehsil = block.match(/tehsil:\s*"([^"]+)"/)?.[1];
    const blockField = block.match(/block:\s*"([^"]+)"/)?.[1];
    const district = block.match(/district:\s*"([^"]+)"/)?.[1];
    const state = block.match(/state:\s*"([^"]+)"/)?.[1];
    const praTeam = block.match(/praTeam:\s*"([^"]+)"/)?.[1];
    const emailCount = block.match(/emailCount:\s*(\d+)/)?.[1];
    const email1 = block.match(/email1:\s*"([^"]+)"/)?.[1];
    const email2 = block.match(/email2:\s*"([^"]+)"/)?.[1];
    
    if (shineCode && revenueVillage) {
        villages.push({
            shineCode,
            panchayat: panchayat || '',
            panchayatLgdCode: panchayatLgdCode || '',
            revenueVillage,
            rvLgdCode: rvLgdCode || '',
            tehsil: tehsil || '',
            block: blockField || '',
            district: district || '',
            state: state || '',
            praTeam: praTeam || '',
            emailCount: emailCount ? parseInt(emailCount) : null,
            email1: email1 || null,
            email2: email2 || null
        });
    }
}

// Ensure output directory exists
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Write to JSON file
fs.writeFileSync(outputFile, JSON.stringify(villages, null, 2));
console.log(`✅ Synced ${villages.length} SHINE villages`);
console.log(`📁 JSON saved to: ${outputFile}`);