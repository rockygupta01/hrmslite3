import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Employees />} />
                    <Route path="/attendance" element={<Attendance />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
