import { connect } from "react-redux";
import Routes from "./router/Routes";

import "./App.css";

import { Template } from "./components/MainComponents";
import { Header } from "./components/partials/Header";
import { Footer } from "./components/partials/Footer";

function App(props) {
  return (
    <Template>
      <Header />
      <Routes />
      <Footer />
    </Template>
  );
}

function mapStateProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateProps, mapDispatchToProps)(App);
