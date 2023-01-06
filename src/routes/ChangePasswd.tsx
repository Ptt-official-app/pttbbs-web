import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import ChangePasswdPage from '../components/ChangePasswdPage'

type Props = {

}

export default (props: Props) => {
    return (
        <Router>
            <Routes>
                <Route path="/user/:userid/resetpassword" element={<ChangePasswdPage />} />
            </Routes>
        </Router>
    )
}
