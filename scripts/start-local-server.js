#!/usr/bin/env node

const { LocalDevelopmentServer } = require('../src/lib/services/local-server');
const path = require('path');
const fs = require('fs');

// Configuration
const config = {
  port: 3001, // Different port from Next.js dev server
  host: 'localhost',
  ssl: false,
  sslCert: path.join(__dirname, '..', 'certs', 'cert.pem'),
  sslKey: path.join(__dirname, '..', 'certs', 'key.pem')
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

async function startServer() {
  log('Starting local development server...');
  
  try {
    // Check if SSL certificates exist if SSL is enabled
    if (config.ssl) {
      if (!fs.existsSync(config.sslCert) || !fs.existsSync(config.sslKey)) {
        log('SSL certificates not found. Please run npm run setup-local first.', 'error');
        process.exit(1);
      }
    }

    // Create server instance
    const server = new LocalDevelopmentServer(config);
    
    // Start server
    await server.start();
    
    log('Local development server started successfully!', 'success');
    log('\nServer information:');
    log(`- URL: http${config.ssl ? 's' : ''}://*.localhost:${config.port}`);
    log(`- Main domain: http${config.ssl ? 's' : ''}://localhost:${config.port}`);
    
    // Handle process termination
    process.on('SIGINT', async () => {
      log('\nShutting down server...', 'warning');
      await server.stop();
      process.exit(0);
    });
    
  } catch (error) {
    log(`Failed to start server: ${error.message}`, 'error');
    process.exit(1);
  }
}

startServer(); 