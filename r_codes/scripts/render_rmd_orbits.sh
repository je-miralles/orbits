#!/bin/bash

# Set the first argument as variable file    
file=$1

filename=$(basename "$file")
extension="${filename##*.}"
filename="${filename%.*}"

Rscript -e "library(knitr); rmarkdown::render('$file')"

mv ${filename}.html html/${filename}.html