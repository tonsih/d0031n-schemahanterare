# Introduction

This tool is designed to help users extract course data from LTU's TimeEdit
system. Using the Playwright framework, the application navigates the site,
scrapes relevant data, and extracts it into a CSV file.

# Getting Started

To get started with Course Data Scraper, please follow these steps:

1. Download the `ltu_course_data_scraper-1.0.0.jar` file from the [GitHub
   releases page](https://github.com/tonsih/d0031n-schemahanterare).
2. Run the application using the command:

   ```bash
   java -jar course_data_scraper-1.0.0.jar [inputFile] [outputPath]
   ```

## Optional Parameters

    Input File: Specify a TXT file containing course codes, each on a separate
    line, to extract specific courses. If no input file is provided, the
    application will automatically download information for 1000 current
    courses listed in the TimeEdit system (only 1000 due to TimeEdit's response
    size limit).

    Example usage:

    ```bash
    java -jar course_data_scraper-1.0.0.jar courses.txt
    ```

Output Location: Specify the file path for the generated CSV file. If no
filepath is provided in the second argument, the application will default to
writing the CSV file to ../db/kurser.csv.

Example usage:

```bash
java -jar course_data_scraper-1.0.0.jar courses.txt courses.csv
