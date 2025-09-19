#!/bin/bash
# This script ensures dependencies are installed using stable, absolute paths.

# Exit immediately if a command fails
set -e

# Get the absolute path to the project's root directory (where the script is)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Project root identified as: $PROJECT_ROOT"
echo "Starting dependency installation..."

# --- Install Frontend Dependencies ---
echo "Installing frontend dependencies..."
# Use --prefix with the absolute path to the frontend directory
npm install --prefix "$PROJECT_ROOT/frontend"

# --- Install Backend Dependencies ---
echo "Installing backend dependencies..."
# Use --prefix with the absolute path to the backend directory
npm install --prefix "$PROJECT_ROOT/backend"

echo "✅ All dependencies installed successfully!"
