import React from 'react'
import { createRoot } from 'react-dom/client'
import reportWebVitals from './reportWebVitals'

import Routes from './routes/Login'

import './vendors'

import './index.css'

import config from 'config'

//title
document.getElementsByTagName('title')[0].innerHTML = config.BRAND

//react
const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
    <React.StrictMode>
        <Routes />
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
