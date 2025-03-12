import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './view/Home';
import ThreeJSRoom from './view/ThreeJSRoom';
import './App.css'

const App = () => {
    return (
        <Router>
            <nav>
                <Link to="/">Home</Link> | <Link to="/room">Room</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/room" element={<ThreeJSRoom />} />
            </Routes>
        </Router>
    );
};

export default App;