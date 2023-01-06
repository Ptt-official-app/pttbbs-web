import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from '../components/LoginPage'

type Props = {

}

export default (props: Props) => {
    return (
        <Router>
            <Routes>
                <Route path="/login">
                    <LoginPage />
                </Route>
            </Routes>
        </Router>
    )
}
