import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateTextNotes from './Components/CreateTextNotes';
import UpdateNotes from './Components/UpdateNotes';
import TextNote from './Components/TextNote';
import DetailailsNotes from './Components/DetailailsNotes';
import CreateListNotes from './Components/CreateListNotes';
import Navbar from './Components/Navbar';
import ListNote from './Components/ListNote';
import UpdateListNotes from './Components/UpdateListNote';

function App() {
    

  return (
    <>
      <BrowserRouter>
          <Navbar />
            <Routes>
                <Route path='/' element={<TextNote />} />
                <Route path='textnote/' element={<CreateTextNotes />} />
                <Route path='listnote/' element={<ListNote />} />
                <Route path='notes/:id' element={<DetailailsNotes />} />
                <Route path='update/:id' element={<UpdateNotes />} />
                <Route path='updatelist/:id' element={<UpdateListNotes />} />

            </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;
