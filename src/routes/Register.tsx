import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import RegisterPage from '../components/RegisterPage'

type Props = {

}

export default (props: Props) => {
    return (
        <Router>
            <Routes>
                <Route path="/register">
                    <RegisterPage />
                </Route>
            </Routes>
        </Router>
    )
}
