import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

import Photo from "../Photo/Photo";

const clientID = `?client_id=${import.meta.env.VITE_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const fetchImages = async () => {
    setLoading(true);
    let url;
    if (query) {
      url = `${searchUrl}${clientID}&page=${page}&query=${query}`;
    } else {
      url = `${mainUrl}${clientID}&page=${page}`;
    }
    try {
      const response = await fetch(url);
      const newData = await response.json();
      setPhotos((prevData) => {
        if (query && page === 1) {
          return newData.results;
        } else if (query) {
          return [...prevData, ...newData.results];
        } else {
          return [...prevData, ...newData];
        }
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query) return;
    if (page === 1) {
      fetchImages();
    }
    setPage(1);
  };

  return (
    <main>
      <section className='search'>
        <form className='search-form' onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Search photos'
            className='form-input'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type='submit' className='submit-btn'>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className='photos'>
        <div className='photos-center'>
          {photos.map((image, index) => (
            <Photo key={index} {...image} />
          ))}
        </div>
        {loading && <h2 className='loading'>loading...</h2>}
      </section>
    </main>
  );
}

export default App;
