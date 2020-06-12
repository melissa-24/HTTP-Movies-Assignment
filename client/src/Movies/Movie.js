import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import MovieCard from "./MovieCard";
import MovieForm from "./MovieForm";

function Movie({ addToSavedList, updateMovieList, getMovieList }) {
  const [movie, setMovie] = useState(null);
  const params = useParams();
  const history = useHistory();
  const [isEditing, setIsEditing] = useState(false);

  const fetchMovie = (id) => {
    axios
      .get(`http://localhost:5000/api/movies/${id}`)
      .then((res) => setMovie(res.data))
      .catch((err) => console.log(err.response));
  };

  const saveMovie = () => {
    addToSavedList(movie);
  };

  const editMovie = () => {
    setIsEditing(true);
  }

  const deleteMovie = () => {
    axios.delete(`http://localhost:5000/api/movies/${params.id}`)
      .then(res => {
        getMovieList();
        history.push("/");
      })
      .catch(err => console.log(err.message, err.response));
  }

  useEffect(() => {
    fetchMovie(params.id);
  }, [params.id]);

  if (!movie) {
    return <div>Loading movie information...</div>;
  }

  return (
    <div className="save-wrapper">
      {!isEditing ? (<>
        <MovieCard movie={movie} />

        <div className="movie-button left-button" onClick={editMovie}>
          Edit
        </div>
        <div className="movie-button middle-button" onClick={saveMovie}>
          Save
        </div>
        <div className="movie-button right-button" onClick={deleteMovie}>
          Delete
        </div>
      </>) : (
        <MovieForm movie = {movie} updateMovieList = {updateMovieList} setIsEditing = {setIsEditing} />
      )}
    </div>
  );
}

export default Movie;