#!/bin/sh
yarn stdver

yarn build

git remote add github https://$GITHUB_TOKEN@github.com/nemoisme/el-validate-table.git > /dev/null 2>&1
git push github HEAD:master --follow-tags

