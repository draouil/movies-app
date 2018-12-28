import React, { Component } from "react";
import PropTypes from "prop-types";
import Movies from "./Movies";
import Hello from "./Hello";
import Moviesinfo from "./Moviesinfo";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import { Router } from "@reach/router";
import { connect } from "react-redux";
import { setMovies, handelchange_action_comp } from "./actions/moviesActions";
import { isEqual } from "lodash";

const KEY = "9209bb756d7b55053d4c72ffd1f9ecc8";
const API = `https://api.themoviedb.org/3/movie/popular?api_key=${KEY}&language=en-US&page=1%60`;
const PICTURE = `https://image.tmdb.org/t/p/w300_and_h450_bestv2/`;

class App extends Component {
  state = {
    filtred_movies: [],
    code_key: "",
    search_value: ""
  };
  /* return data from api in componentDidMount*/

  async componentDidMount() {
    const response = await fetch(API);
    const movies = await response.json();
    this.props.setMovies(movies.results.slice(0, 10));
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.data_mv, this.props.data_mv)) {
      this.setState({
        filtred_movies: nextProps.data_mv
      });
    }
  }
  /* return movies whene title equal input string  */
  handelchange(e) {
    let { value } = e.target;
    let { data_mv } = this.props;
    let data_mv_res = data_mv.filter(
      obj =>
        obj.title
          .toLowerCase()
          .includes(
            value.toLowerCase()
          ) /*||
        obj.overview.toLowerCase().includes(value.toLowerCase())*/
    );
    /*pass a value to recducer */

    this.props.handelchange_app(value);

    /* search_value : to send id in the props  */

    this.setState({
      filtred_movies: data_mv_res,
      search_value: value
    });
  }
  render() {
    const { search_value, filtred_movies } = this.state;
    // const { data_mv } = this.props;
    return (
      <div className="App">
        <Router>
          {/* id : value of current target from handelchange 
          handelchange : to send handelchange in the props
          */}
          <Movies
            path="/"
            search_value={search_value}
            data_mv={filtred_movies}
            handelchange={e => this.handelchange(e)}
            picture={PICTURE}
          />
          <Hello path="Hello/:id" />

          <Moviesinfo path="Moviesinfo/:id" picture={PICTURE} />
          {/* <Cart /> */}
        </Router>{" "}
      </div>
    );
  }
}

//redux configuration:
const mapStateToProps = state => {
  return {
    data_mv: state.childReducer.data_mv,
    data_mv_res: state.childReducer.data_mv_res
  };
};
//
const mapDispatchToProps = dispatch => {
  return {
    setMovies: data_mv => dispatch(setMovies(data_mv)),
    /*pass a filter movies to recducer */
    handelchange_app(value) {
      dispatch(handelchange_action_comp(value));
    }
  };
};

App.propTypes = {
  data_mv: PropTypes.array,
  data_mv_res: PropTypes.array,
  setMovies: PropTypes.func,
  handelchange: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
