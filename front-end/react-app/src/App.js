import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Login from './Login/Login';
import Logout from './Logout/Logout';
import NotSettled from './NotSettled/NotSettled';
import NotVerified from './NotVerified/NotVerified';
import Homepage from './Homepage/Homepage';
import SelectDiagram from './SelectDiagram/SelectDiagram';
import TrafficVariationForRoadChart from './TrafficVariationForRoadChart/TrafficVariationForRoadChart';
import TrafficDistributionAcrossRoads from './TrafficDistributionAcrossRoads/TrafficDistributionAcrossRoads';
import TrafficVariationChart from './TrafficVariationChart/TrafficVariationChart';
import DebtHistoryChart from './DebtHistoryChart/DebtHistoryChart';
import RevenueDistributionAcrossRoads from './RevenueDistributionAcrossRoads/RevenueDistributionAcrossRoads';
import MostPopularTollBooths from './MostPopularTollBooths/MostPopularTollBooths';
import OwedAmountsChart from './OwedAmountsChart/OwedAmountsChart';
import HomeButton from './HomeButton/HomeButton';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);  // Add a loading state to wait for token check

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log("Token from localStorage:", token); // Debugging: Check the token value

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken); // Debugging: Check the decoded token

        // Check if the token has expired
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
        } else {
          handleLogout(); // Logout if token is expired
        }
      } catch (error) {
        console.error('Invalid token:', error);
        handleLogout(); // Logout if decoding fails
      }
    } else {
      setIsAuthenticated(false); // Ensure the user is logged out if no token exists
    }

    setLoading(false);  // Set loading state to false once the token validation is done
  }, []);

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate('/', { replace: true });
  //   }
  // }, [isAuthenticated, navigate]);
  

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userDetails');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Loading...</div>;  // Show a loading screen while checking authentication
  }

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/homepage"
            element={
              isAuthenticated ? (
                <>
                  <div className="logout-container">
                    <Logout />
                  </div>
                  <Homepage />
                </>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/managedebts"
            element={
              isAuthenticated ? (
                <>
                  <div className="logout-container">
                    <HomeButton />
                  </div>
                  <div className="main-container">
                    <NotSettled onLogout={handleLogout} />
                    <NotVerified onLogout={handleLogout} />
                  </div>
                </>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />


          <Route path="*" element={<Navigate to="/" />} />


          <Route 
          path="/selectdiagram" 
          element={isAuthenticated ? <SelectDiagram />: <Navigate to="/" replace />} 
          />

          <Route 
          path="/traffic-variation-for-road" 
          element={isAuthenticated ? <TrafficVariationForRoadChart />: <Navigate to="/" replace />} 
          />
          <Route 
          path="/traffic-distribution-over-time" 
          element={isAuthenticated ? <TrafficDistributionAcrossRoads/> : <Navigate to="/" replace />} 
          />
          <Route 
          path="/traffic-variation-over-time" 
          element={isAuthenticated ? <TrafficVariationChart/> : <Navigate to="/" replace />} 
          />
          <Route 
          path="/most-popular-toll-booths" 
          element={isAuthenticated ? < MostPopularTollBooths/> : <Navigate to="/" replace />} 
          />
          <Route 
          path="/debt-history-over-time" 
          element={isAuthenticated ? <DebtHistoryChart/> : <Navigate to="/" replace />} 
          />
          <Route 
          path="/amounts-owed-by-other-companies-over-time" 
          element={isAuthenticated ? <OwedAmountsChart/> : <Navigate to="/" replace />} 
          />
          <Route 
          path="/revenue-distribution-over-time" 
          element={isAuthenticated ? <RevenueDistributionAcrossRoads/> : <Navigate to="/" replace />} 
          />
           
          </Routes>
      </div>
    </Router>
  );
}

export default App;
