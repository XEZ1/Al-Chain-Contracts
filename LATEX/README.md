This directory contains the LaTeX source files and related documents for the dissertation project.

## Directory Structure

- `.gitignore` - Specifies files and directories to be ignored by Git.
- `Appendices/` - Contains supplementary materials and appendices for the report.
- `Chapters/` - Contains individual chapter files for the report.
- `FrontMatter/` - Contains front matter sections such as title page, abstract, and table of contents.
- `informatics-report.cls` - The LaTeX class file defining the formatting for the report.
- `references.bib` - The bibliography file containing all references cited in the report.
- `report.pdf` - The compiled PDF version of the report.
- `report.tex` - The main LaTeX source file for the report.

## Instructions

### Compiling the Report

To compile the LaTeX report, ensure you have a LaTeX distribution installed (e.g., TeX Live, MikTeX). Navigate to this directory and run the following command:

```bash
pdflatex report.tex
bibtex report
pdflatex report.tex
pdflatex report.tex
```

This will generate the report.pdf file from the report.tex source file.