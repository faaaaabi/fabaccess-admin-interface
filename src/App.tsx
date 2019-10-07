import React from 'react';
import './App.css';
import {CssBaseline} from "@material-ui/core";
import Skeleton from "./scenes/Skeleton";

const App: React.FC = () => {
  return (
      <React.Fragment>
        <CssBaseline />
        <Skeleton/>
      </React.Fragment>
  );
};

export default App;
