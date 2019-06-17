rm -rf .git
mv .git-original .git

git add . && git commit -am "fix" && git push && caprover deploy

mv .git .git-original