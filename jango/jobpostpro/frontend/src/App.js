import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import JobPostForm from './components/JobPostForm';
import AuthProvider from './contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/" exact component={JobPostForm} />
          {/* Add more routes here as needed */}
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;