#!/bin/bash

# Function to check if a string is in kebab-case
is_kebab_case() {
    local string="$1"
    string="${string%.*}"  # Remove file extension
    string="${string%.*}"  # Remove double file extension
    string="${string//[\[\]]/}"  # Remove special characters []
    if [[ "$string" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ || "$string" =~ ^[a-z0-9]+$ ]]; then
        return 0
    else
        echo "$string"
        return 1
    fi
}

# Function to check if a string is in SnakeCase
is_snake_case() {
    local string="$1"
    if [[ "$string" =~ ^[A-Z][a-zA-Z0-9]*$ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to check if a string is in camelCase
is_camel_case() {
    local string="$1"
    string="${string%.*}"  # Remove file extension
    
    if [[ "$string" =~ ^[a-z][a-zA-Z0-9]*$ ]]; then
        return 0
    else
        return 1
    fi
}

error=0
# Check all files and folders inside the src folder
for item in $(find src -type d -o -type f); do
    # Exclude .git, .next, and node_modules directories
    if [[ "$item" != ".git"* && "$item" != ".next"* && "$item" != "node_modules"* && "$item" != "src/locale/messages"* ]]; then
        # Check if it's a folder
        if [[ -d "$item" ]]; then
            # Check kebab-case naming for folders
            if ! is_kebab_case "$(basename "$item")"; then
                echo "Error: Folder '$item' does not follow kebab-case naming convention."
                error=1
            fi
        else
            # Check camelCase naming for files inside hooks folder
            if [[ "$item" == "src/client/hooks/"* ]]; then
                if ! is_camel_case "$(basename "$item")"; then
                    echo "Error: File '$item' does not follow camelCase naming convention."
                    error=1
                fi
            elif [[ "$item" == "src/client/components/"*".tsx" ]]; then
                # Check SnakeCase naming for .tsx files inside components folder
                if ! is_snake_case "$(basename "$item" .tsx)"; then
                    echo "Error: File '$item' does not follow SnakeCase naming convention."
                    error=1
                fi
            else
                # Check kebab-case naming for other files
                if ! is_kebab_case "$(basename "$item")"; then
                    echo "Error: File '$item' does not follow kebab-case naming convention."
                    error=1
                fi
            fi
        fi
    fi
done

exit $error