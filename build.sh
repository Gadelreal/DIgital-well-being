#!/bin/bash
mkdir -p public
cp -r *.html public/
cp -r css public/
cp -r js public/
cp -r assets public/
echo "Build completed successfully"
