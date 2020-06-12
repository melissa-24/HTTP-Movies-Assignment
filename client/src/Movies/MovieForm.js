import React, { useState } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';

const useForm = initialValues => {
    const [values, setValues] = useState(initialValues);

    const handleChanges = (e, index) => {
        setValues({
            ...values,
            [e.target.name]: e.target.name !== "stars" ? 
                e.target.value : values[e.target.name].map((star, i) => {
                    if(i === index) {
                        return e.target.value;
                    }
                    return star;
                })
        });
    }

    const addActor = e => {
        e.preventDefault();
        setValues({
            ...values,
            stars: [...values.stars, ""]
        })
    }

    const deleteActor = (e, index) => {
        e.preventDefault();
        
        setValues({
            ...values,
            stars: values.stars.filter((_, i) => i !== index)
        })
    }

    return [values, handleChanges, addActor, deleteActor];
}

const MovieForm = props => {
    const [movie, handleChanges, addActor, deleteActor] = useForm(() => {
        if(props.movie) {
            return props.movie
        }
        return {
            title: "",
            director: "",
            metascore: "",
            stars: []
        };
    });
    const history = useHistory();

    const saveChanges = e => {
        e.preventDefault();

        Axios.put(`http://localhost:5000/api/movies/${movie.id}`, movie)
            .then(res => {
                console.log(res.data);
                
                props.updateMovieList(movie);
                history.push("/");
            })
            .catch(err => console.log(err.response, err.message));

        if(props.setIsEditing) props.setIsEditing(false);
    }

    const addMovie = e => {
        e.preventDefault();

        if(movie.title) {
            Axios.post("http://localhost:5000/api/movies", movie)
                .then(res => {
                    props.dispatch({type: "SET_MOVIE_LIST", payload: res.data});
                    history.push(`/movies/${res.data[res.data.length - 1].id}`)
                })
                .catch(err => console.log(err.message, err.response));
        }

    }

    return (
        <div className = "movie-card">
            <form onSubmit = {props.movie ? saveChanges : addMovie}>
                <h2><label htmlFor = "title">Title: </label>
                <input id = "title" type = "text" name = "title" value = {movie.title} onChange = {handleChanges} /></h2><br />

                <label htmlFor = "director" className = "movie-director">{"Director: "}
                <input id = "director" type = "text" name = "director" value = {movie.director} onChange = {handleChanges} /></label><br />
                <label htmlFor = "metascore">Metascore: </label>
                <input id = "metascore" type = "text" name = "metascore" value = {movie.metascore} onChange = {handleChanges} /><br /><br />

                <h3><label htmlFor = "actors">
                    {"Actors: "}
                    <button onClick = {addActor}>Add Actor</button>
                </label></h3>
                <div className = "actors-input-group">
                    {movie.stars.map((actor, index) => {
                        return (
                            <span key = {index}>
                                {`${index + 1}) `}
                                <input  id = {index} type = "text" name = "stars" value = {actor} onChange = {e => handleChanges(e, index)} />
                                <button onClick = {e => deleteActor(e, index)}>Delete</button>
                                <br />
                            </span>
                        );
                    })}
                </div>

                <button className = "movie-button right-button" type = "submit">{props.movie ? "Save Changes" : "Add Movie"}</button>
            </form>
        </div>
    );
};

export default MovieForm;