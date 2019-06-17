rm -rf .git
mv .git-original .git

git add . && git commit -am "fix" && git push 

mv .git .git-original