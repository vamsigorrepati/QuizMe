import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home'
import Subjects from './Subjects';
import Library from './Library';
import Navbar from './Navbar/Navbar';
import CreateSet from './CreateSet';
import PrivacyPolicy from './PrivacyPolicy'
import SetPage from './SetPage';
import Settings from './Settings';
import Login from './Login';
import SignUp from './SignUp';
import Verification from './Verification';
import SearchPage from './SearchPage';
import Profile from './Profile';


export default function RoutesController() {
    return (
        <BrowserRouter>
        <Navbar />
            <Routes>
                <Route path='/' element={<Home />}/>
                <Route path='/library' element={<Library />}/>
                <Route path='/subjects' element={<Subjects />}/>
                <Route path='/create-set' element={<CreateSet />}/>
                <Route path='/privacy-policy' element={<PrivacyPolicy />} />
                <Route path="/decks/:setId" element={<SetPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </BrowserRouter>
    )
}
