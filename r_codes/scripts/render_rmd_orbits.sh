  #!/bin/bash

if [ $# -eq 0 ] || [ "$1" == "-h" ]; then
  echo "Usage: `basename $0` [Rmd_filename]"
  exit 0
fi

# Set the first argument as variable file
file=$1

filename=$(basename "$file")
dirname=$(dirname "$file")
extension="${filename##*.}"
filename="${filename%.*}"

echo ${dirname}
pushd ${dirname}
Rscript -e "library(knitr); rmarkdown::render('$filename.$extension')"
popd
mv ${dirname}/${filename}.html ../docs/${filename}.html
