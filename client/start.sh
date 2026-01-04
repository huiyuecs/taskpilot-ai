#!/bin/bash
# Set environment variables to avoid permission issues
export ESLINT_NO_DEV_ERRORS=true
export ESLINT_CACHE=false
export DISABLE_ESLINT_PLUGIN=true
export ESLINT_USE_FLAT_CONFIG=false

# Start React app
npm start

