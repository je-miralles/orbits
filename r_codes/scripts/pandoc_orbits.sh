#!/bin/bash

# Set the first argument as variable file    
file=$1

filename=$(basename "$file")
extension="${filename##*.}"
filename="${filename%.*}"

pandoc ${filename}.md -f markdown -t latex -s -o ./${filename}.tex
pandoc ${filename}.tex -f latex -t html -o ./html/${filename}.html
