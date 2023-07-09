/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { fetchfromApi } from "./utils/api";
import { useDispatch, useSelector } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";
// Import of Files
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import PageNotFound from "./pages/404/PageNotFound";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import { Route, Routes } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const url = useSelector((state) => state.home.url);

  useEffect(() => {
    fetchApiConfiguration();
    genresCall()
  }, []);

  const fetchApiConfiguration = () => {
    fetchfromApi("/configuration").then((res) => {
      console.log(res);

      const url = {
        backdrop : res.images.secure_base_url + "original",
        poster : res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      }

      dispatch(getApiConfiguration(url));
    });
  };

  const genresCall = async () => {
    let promises = []
    let endPoints = ['tv', 'movie']
    let allGenres = {}

    endPoints.forEach((url) => {
      promises.push(fetchfromApi(`/genre/${url}/list`))
    })

    const data = await Promise.all(promises)
    

    data.map(({genres}) => {
      return genres.map((item) => (allGenres[item.id] = item))
      
    })

    dispatch(getGenres(allGenres))
  }

  return (
    <>
      <Header />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/:mediaType/:id' element={<Details />} />
        <Route path='/search/:query' element={<SearchResult />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
