#!/bin/sh
# $1 is the function name (migrationRunner)
# $2 is the environment name

# for example: bash .invoke-migration.sh migrationRunner development

if [ "$1" != "migrationRunner" ]; then
  printf "Error: Unknown function name $1\n"
  exit 1
fi

FUNCTION_NAME="prisma-migration-poc-$2-$1";
echo "Running function:"
echo $FUNCTION_NAME

aws lambda invoke --function-name $FUNCTION_NAME --output text \
--invocation-type RequestResponse --log-type Tail --payload '{}' migration-response.text \
| sed -e "s/^\$LATEST\(\t\|\s\)\+//" -e "s/\(\t\|\s\)\+[[:digit:]]\{3\}$//" \
| base64 -d
