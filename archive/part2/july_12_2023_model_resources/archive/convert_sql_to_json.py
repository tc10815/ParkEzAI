import re
import json
import sys

def convert_sql_to_json(input_file, output_file):
    with open(input_file, 'r') as f:
        lines = f.readlines()

    result = {}
    # Adjusting the pattern to capture the correct JSON data
    pattern = r"'(camfeeds/coldwatermi/.+?)'.+?'.+?'.+?','(.+?)','"

    for line in lines:
        matches = re.findall(pattern, line)
        if matches:
            filename = matches[0][0].split('/')[-1]
            
            try:
                data = json.loads(matches[0][1])
                result[filename] = data
            except json.JSONDecodeError:
                print(f"Failed to parse JSON for {filename}. Skipping this entry.")

    with open(output_file, 'w') as f:
        json.dump(result, f, indent=2)

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: script_name.py input_file.txt output_file.json")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]

    convert_sql_to_json(input_file, output_file)
