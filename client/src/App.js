import React, { useEffect, useReducer } from "react";
import { Route } from "react-router-dom";
import SavedList from "./Movies/SavedList";
import MovieList from "./Movies/MovieList";
import MovieForm from "./Movies/MovieForm";
import Movie from "./Movies/Movie";
import axios from 'axios';

const initialState = {
  savedList: [],
  movieList: []
}

function reducer(state, action) {
  switch(action.type) {
    case "SET_MOVIE_LIST":
      return {
        ...state,
        movieList: action.payload
      };
    case "SET_SAVED_LIST":
      return {
        ...state,
        savedList: action.payload
      };
    case "UPDATE_SAVED_LIST":
      return {
        ...state,
        savedList: state.savedList.filter(saved => state.movieList.find(movie => saved.id === movie.id))
      }
    default: 
      return state;
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  /* const [savedList, setSavedList] = useState([]);
  const [movieList, setMovieList] = useState([]); */

  const getMovieList = () => {
    axios
      .get("http://localhost:5000/api/movies")
      .then(res => dispatch({type: "SET_MOVIE_LIST", payload: res.data}))
      .catch(err => console.log(err.response));
  };

  const addToSavedList = movie => {
    dispatch({type: "SET_SAVED_LIST", payload: [...state.savedList, movie]});
  };

  const updateMovieList = movie => {
    dispatch({
      type: "SET_MOVIE_LIST", 
      payload: state.movieList.map(movieState => {
        if(movieState.id === movie.id) {
          return movie;
        }
        return movieState;
      })
    });

    dispatch({
      type: "SET_SAVED_LIST", 
      payload: state.savedList.map(saved => {
        if(saved.id === movie.id) {
          return movie;
        }
        return saved;
      })
    });
  }

  useEffect(() => {
    getMovieList();
    dispatch({
      type: "UPDATE_SAVED_LIST",
    });
  }, [state.movieList.length]); 

  return (
    <>
      <SavedList list={state.savedList} />

      <Route exact path="/">
        <MovieList movies={state.movieList} />
      </Route>

      <Route path="/movies/:id">
        <Movie getMovieList = {getMovieList} addToSavedList={addToSavedList} updateMovieList = {updateMovieList} />
      </Route>

      <Route path = "/add-movie" render = {props => <MovieForm {...props} dispatch = {dispatch} />} />
    </>
  );
};

export default App;