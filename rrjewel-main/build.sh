#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Building..."
./node_modules/.bin/vite build

echo "Build complete!"
