import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import ChangeEmailPage from '../components/ChangeEmailPage'

type Props = {

}

export default (props: Props) => {
    return (
        <Router>
            <Routes>
                <Route path="/user/:userid/changeemail"><ChangeEmailPage /></Route>
            </Routes>
        </Router>
    )
}
