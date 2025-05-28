#!/usr/bin/env node

/**
 * Build Script untuk SmartSaku 
 * 
 * Script ini bertugas untuk melakukan build project frontend,
 * dan memindahkan hasil build ke folder yang sesuai.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Konfigurasi
const sourceDir = 'dist';
const targetDir = '../dist';

// Warna untuk logging
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

console.log(`${colors.bright}${colors.cyan}SmartSaku Build Tool${colors.reset}`);
console.log(`${colors.yellow}====================${colors.reset}\n`);

try {
    // Step 1: Build project
    console.log(`${colors.blue}[1/3]${colors.reset} Building the project...`);
    execSync('npm run build', { stdio: 'inherit' });
    console.log(`${colors.green}✓ Build successful!${colors.reset}\n`);

    // Step 2: Create target directory if doesn't exist
    console.log(`${colors.blue}[2/3]${colors.reset} Preparing directories...`);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
        console.log(`  Created directory: ${targetDir}`);
    }
    console.log(`${colors.green}✓ Directories ready!${colors.reset}\n`);

    // Step 3: Copy files
    console.log(`${colors.blue}[3/3]${colors.reset} Deploying to ${targetDir}...`);

    // Function to copy directory recursively
    function copyFolderRecursiveSync(source, target) {
        // Check if source exists
        if (!fs.existsSync(source)) {
            return;
        }

        // Create target folder if doesn't exist
        if (!fs.existsSync(target)) {
            fs.mkdirSync(target, { recursive: true });
        }

        // Copy each file
        fs.readdirSync(source).forEach(item => {
            const sourcePath = path.join(source, item);
            const targetPath = path.join(target, item);

            if (fs.lstatSync(sourcePath).isDirectory()) {
                copyFolderRecursiveSync(sourcePath, targetPath);
            } else {
                fs.copyFileSync(sourcePath, targetPath);
                console.log(`  Copied: ${item}`);
            }
        });
    }

    // Copy the dist folder to target
    copyFolderRecursiveSync(sourceDir, targetDir);
    console.log(`${colors.green}✓ Deployment successful!${colors.reset}\n`);

    console.log(`${colors.bright}${colors.green}Build Complete!${colors.reset}`);
    console.log(`Files are available in the ${colors.bright}${targetDir}${colors.reset} directory.\n`);

} catch (error) {
    console.error(`${colors.bright}${colors.red}Error:${colors.reset} ${error.message}`);
    process.exit(1);
}
