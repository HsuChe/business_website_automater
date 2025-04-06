#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration
const config = {
  port: 3000,
  domain: 'localhost',
  ssl: false,
  hostsPath: os.platform() === 'win32' 
    ? 'C:\\Windows\\System32\\drivers\\etc\\hosts'
    : '/etc/hosts'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

function log(message, type = 'info') {
  const color = type === 'success' ? colors.green 
    : type === 'warning' ? colors.yellow 
    : type === 'error' ? colors.red 
    : colors.reset;
  
  console.log(`${color}${message}${colors.reset}`);
}

function checkRequirements() {
  log('Checking requirements...');
  
  // Check if running with admin/sudo privileges
  if (process.getuid && process.getuid() !== 0) {
    log('This script requires administrator privileges to modify hosts file.', 'error');
    process.exit(1);
  }

  // Check if hosts file exists and is writable
  try {
    fs.accessSync(config.hostsPath, fs.constants.R_OK | fs.constants.W_OK);
  } catch (error) {
    log(`Cannot access hosts file at ${config.hostsPath}`, 'error');
    process.exit(1);
  }

  log('Requirements check passed!', 'success');
}

function setupHostsFile() {
  log('Setting up hosts file...');
  
  try {
    // Read current hosts file
    const hostsContent = fs.readFileSync(config.hostsPath, 'utf8');
    
    // Check if our entries already exist
    if (hostsContent.includes(`127.0.0.1 ${config.domain}`)) {
      log('Hosts file already configured.', 'warning');
      return;
    }

    // Add our entries
    const newEntries = `
# Local development subdomains
127.0.0.1 ${config.domain}
127.0.0.1 *.${config.domain}
`;
    
    // Write back to hosts file
    fs.writeFileSync(config.hostsPath, hostsContent + newEntries);
    
    log('Hosts file configured successfully!', 'success');
  } catch (error) {
    log(`Failed to configure hosts file: ${error.message}`, 'error');
    process.exit(1);
  }
}

function setupSSL() {
  if (!config.ssl) {
    log('SSL is disabled, skipping SSL setup.', 'warning');
    return;
  }

  log('Setting up SSL certificates...');
  
  const certsDir = path.join(__dirname, '..', 'certs');
  
  // Create certificates directory if it doesn't exist
  if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir);
  }

  try {
    // Generate SSL certificate using mkcert
    execSync('mkcert -install', { stdio: 'inherit' });
    execSync(`mkcert -key-file ${path.join(certsDir, 'key.pem')} -cert-file ${path.join(certsDir, 'cert.pem')} "*.${config.domain}" ${config.domain}`, { stdio: 'inherit' });
    
    log('SSL certificates generated successfully!', 'success');
  } catch (error) {
    log(`Failed to generate SSL certificates: ${error.message}`, 'error');
    process.exit(1);
  }
}

function createDeploymentDirectory() {
  log('Creating deployment directory...');
  
  const deploymentDir = path.join(__dirname, '..', 'deployments');
  
  try {
    if (!fs.existsSync(deploymentDir)) {
      fs.mkdirSync(deploymentDir);
    }
    
    // Create .gitkeep to ensure directory is tracked by git
    fs.writeFileSync(path.join(deploymentDir, '.gitkeep'), '');
    
    log('Deployment directory created successfully!', 'success');
  } catch (error) {
    log(`Failed to create deployment directory: ${error.message}`, 'error');
    process.exit(1);
  }
}

function main() {
  log('Setting up local development environment...\n');
  
  checkRequirements();
  setupHostsFile();
  setupSSL();
  createDeploymentDirectory();
  
  log('\nLocal development environment setup complete!', 'success');
  log('\nTo test the setup:');
  log(`1. Start your development server on port ${config.port}`);
  log(`2. Visit http://${config.domain} (or https:// if SSL is enabled)`);
  log('3. Test subdomains like http://test.localhost:3000');
}

main(); 