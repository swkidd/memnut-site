yarn build
aws s3 sync ./dist s3://memnut.com/ --include "*.png *.js *.html" --exclude "*.py *.sh" --acl public-read
aws cloudfront create-invalidation --distribution-id E1J3TW5G7FMCF --paths "/*"