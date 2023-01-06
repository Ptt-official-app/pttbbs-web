import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import UserInfoPage from '../components/UserInfoPage'

type Props = {

}

export default (props: Props) => {
    return (
        <Router>
            <Routes>
                <Route path="/user/:userid">
                    <UserInfoPage />
                </Route>
            </Routes>
        </Router>
    )
}
