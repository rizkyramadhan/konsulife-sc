mv .git .git-original
git init && git add . && git commit -am "fix" && caprover deploy && rm -rf .git
