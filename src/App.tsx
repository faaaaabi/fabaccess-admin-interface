import React from 'react';
import './App.css';
import {CssBaseline} from "@material-ui/core";
import Skeleton from "./scenes/Skeleton";
import {SnackbarProvider} from "notistack";

const App: React.FC = () => {
  return (
      <SnackbarProvider maxSnack={3}>
          <React.Fragment>
              <CssBaseline />
              <Skeleton/>
          </React.Fragment>
      </SnackbarProvider>
  );
};

export default App;
