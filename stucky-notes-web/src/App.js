import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import "./App.css";
import SignIn from "./auth/SignIn";
import SignUp from "./auth/SignUp";
import Notes from "./notes/Notes";
import Admin from "./admin/Admin";
// import { ProtectedRoute } from "./ProtectedRoute";
import { BrowserRouter as Router } from "react-router-dom";
import { Navigation, Route, Link, glide, glueIn, pushPull } from "react-tiger-transition";
import "react-tiger-transition/styles/main.min.css";

const theme = createMuiTheme(
  {
    palette: {
      primary: {
        light: "#6197f5",
        main: "#1d6ac2",
        dark: "#004091",
        contrastText: "#ffffff",
      },
      secondary: {
        light: "#ffffc9",
        main: "#f2d298",
        dark: "#bea169",
        contrastText: "#000",
      },
    },
  },
  "Paper Theme"
);
// inject glide styles
pushPull({
  name: "pushPull-left",
});
pushPull({
  name: "pushPull-right",
  direction: "right",
});

export default function App() {
  return (
    <Router>
      <Navigation>
        <Route exact screen path="/admin">
          <MuiThemeProvider theme={theme}>
            <div className="App">
              <Admin />
            </div>
          </MuiThemeProvider>
        </Route>
        <Route exact screen path="/notes">
          <MuiThemeProvider theme={theme}>
            <div className="App">
              <Notes />
            </div>
          </MuiThemeProvider>
        </Route>
        <Route exact screen path="/signup">
          <MuiThemeProvider theme={theme}>
            <div className="App">
              <SignUp />
            </div>
          </MuiThemeProvider>
        </Route>
        <Route exact screen path="/">
          <MuiThemeProvider theme={theme}>
            <div className="App">
              <SignIn />
            </div>
          </MuiThemeProvider>
        </Route>
      </Navigation>
    </Router>
  );
}
