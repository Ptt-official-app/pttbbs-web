# demo-pttbbs
This is the demo of web-based pttbbs using openbbs-middleware.

# Getting Started

You can get started by visiting the following website:

[https://www.devptt.dev](https://www.devptt.dev)

The corresponding backend repository of this website is:
* [go-openbbsmiddleware](https://github.com/Ptt-official-app/go-openbbsmiddleware)
* [go-pttbbs](https://github.com/Ptt-official-app/go-pttbbs)

The architecture is based on [中台架構-站台部屬規劃(20210126版本for測試計畫)](https://hackmd.io/@twbbs/Root#%E6%9E%B6%E6%A7%8B%E5%9C%96).

## Starting server at localhost

``` sh
npm start
```

Then you should be able to access the page on localhost:3000.

# Development

## For building multiple html pages

Besides the home-page, we would like to have
several complete-independent pages,
including register, forgot-password, admin, etc.

https://github.com/facebook/create-react-app/issues/1084#issuecomment-626032842
