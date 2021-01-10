# demo-pttbbs
This is the demo of web-based pttbbs using openbbs-middleware.

# Getting Started

## Starting server at localhost

``` sh
npm install
cp config.js.template node_modules/config.js

# develop home page
npm run dev:home
npm start

# develop user info page
npm run dev:user-info
npm start
```

Then you should be able to access the page on localhost:3000.

# Development

## For building multiple html pages

Besides the home-page, we would like to have
several complete-independent pages,
including register, forgot-password, admin, etc.

https://github.com/facebook/create-react-app/issues/1084#issuecomment-626032842
