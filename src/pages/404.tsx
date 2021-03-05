import React from "react"
import { Link } from "react-router-dom";

const NotFoundPage = () => (
    <>
    <h1>Not Found</h1>
    <p>This route doesn't exist. <Link to="/">Click to go home.</Link></p>
    </>
)

export default NotFoundPage
