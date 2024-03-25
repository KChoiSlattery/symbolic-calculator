# Symbolic Calculator

## Creating the conda file to clone:
conda list --explicit > spec-file.txt

## Cloning:
conda create --name myenv --file conda-spec-file.txt
conda install --name myenv --file conda-spec-file.txt