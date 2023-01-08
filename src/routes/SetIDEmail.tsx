import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import SetIDEmailPage from '../components/SetIDEmailPage'

type Props = {

}

export default (props: Props) => {
    return (
        <Router>
            <Routes>
                <Route path="/user/:userid/setidemail" element={<SetIDEmailPage />} />
            </Routes>
        </Router>
    )
}
