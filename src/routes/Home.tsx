import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from '../components/HomePage'
import RegisterPage from '../components/RegisterPage'

type Props = {

}

export default (props: Props) => {
    return (
        <Router>
            <Routes>
                <Route path="/">
                    <HomePage />
                </Route>
            </Routes>
        </Router>
    )
}
