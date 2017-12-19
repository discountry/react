cd ~/project
cp -r public/ ../public
git checkout gh-pages
rm -rf *
cp -r ../public/* ./
git add -A
git commit -m "update docs"
git push
rm -rf ../public

echo "Finished Deployment!"
