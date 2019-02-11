npm ci
npm run generate
rm -rf node_modules
npm i --production
up --format=plain deploy production
