import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AttemptChangeEmailPage from '../components/AttemptChangeEmailPage'

type Props = {

}

export default (props: Props) => {
    return (
        <Router>
            <Routes>
                <Route path="/user/:userid/attemptchangeemail" element={<AttemptChangeEmailPage />} />
            </Routes>
        </Router>
    )
}
