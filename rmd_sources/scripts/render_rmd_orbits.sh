#!/bin/bash

Rscript -e "library(knitr); rmarkdown::render('index.Rmd')"
mv index.html ../docs/
for d in */ ; do
    for file in ./$d*.Rmd; do
        if [[ ! -e "$file" ]]; then continue; fi
        echo $file
        Rscript -e "library(knitr); rmarkdown::render('$file')"
        mv $d/$(basename "$file" .Rmd).html ../docs/
    done
done
