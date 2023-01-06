import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AttemptSetIDEmailPage from '../components/AttemptSetIDEmailPage'

type Props = {

}

export default (props: Props) => {
    return (
        <Router>
            <Routes>
                <Route path="/user/:userid/attemptsetidemail">
                    <AttemptSetIDEmailPage />
                </Route>
            </Routes>
        </Router>
    )
}
