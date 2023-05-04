#!/bin/bash

folder1="php"
folder2="ezphp"

for file in "$folder1"/*; do
    filename=$(basename "$file")
    if [ -e "$folder2/$filename" ]; then
        echo "Comparing $filename:"
        diff_output=$(diff "$file" "$folder2/$filename")
        if [ -z "$diff_output" ]; then
            echo "Files are identical"
        else
            echo "$diff_output"
        fi
    else
        echo "File $filename not found in folder2"
    fi
    echo "--------------------------------------"
done
