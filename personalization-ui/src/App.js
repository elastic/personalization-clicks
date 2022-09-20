import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";
import {
  ErrorBoundary,
  SearchProvider,
  SearchBox,
  Results,
  WithSearch
} from "@elastic/react-search-ui";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import LoginForm from "./components/LoginForm"
import Avatar from 'react-avatar';
import users from './user.js';

// Init connector
const connector = new AppSearchAPIConnector({
  searchKey: process.env.REACT_APP_APP_SEARCH_API_KEY,
  engineName: "doctors",
  endpointBase: process.env.REACT_APP_APP_SEARCH_BASE_URL
});

const fetchUserPreference = async (user) => {
  const response = await fetch('/api/user/prefs', {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user)
  })
  const body = await response.json();
  if (response.status !== 200) throw Error(body.message);
  return body;
}

function App() {

  // Connector configuration
const [config, setConfig] = useState({
  alwaysSearchOnInitialLoad: true,
  trackUrlState: true,
  apiConnector: connector,
  hasA11yNotifications: true,
  debug: false,

  searchQuery: {
    result_fields: {
      last_name: { raw: {} },
      first_name: { raw: {} },
      specialty: { raw: {} },
      address: { raw: {} },
      city: { raw: {} },
      country: { raw: {} }
    },
    search_fields: {
      last_name: {},
      first_name: {},
      specialty: {},
      city: {}
    },
    disjunctiveFacets: [""],
    facets: {}

  }
}) 

const [user, setUser] = useState(() => {
  // getting stored value
  const saved = localStorage.getItem("user");
  const initialValue = JSON.parse(saved);
  return initialValue || "";
});

const [isModalVisible, setIsModalVisible] = useState(false);

const closeModal = () => setIsModalVisible(false);

const showModal = () => setIsModalVisible(true);

const login = async (username, password) => {
  const found = users.find(e => e.username === username)
  if (found) {
    localStorage.setItem("user", JSON.stringify(found));
    setUser(found)
  }
}

const handleLogout = async (username, password) => {
  localStorage.removeItem("user")
  setUser("")
}

const [userPreferences, setUserPreferences] = useState()

useEffect(() => {
    const idBoosts = []
    if (userPreferences) {
      for (const fav of userPreferences?.favorites) {
        idBoosts.push({
          "type": "value",
          "value": [fav.document_id],
          "operation": "multiply",
          "factor": fav.clicks
        })
      }
      setConfig({
        ...config, searchQuery: {
          ...config.searchQuery,
          boosts: {
            "ref": idBoosts
          },
          analytics: {
            "tags": [
              user?.id
            ]
          }
        }
      }
      )
    }
  }, [userPreferences]);

  useEffect(() => {
    if (user) {

      fetchUserPreference({ id: user.id }).then(res => {
        if (res.body.results.length > 0) {
          setUserPreferences({ favorites: res.body.results })
        }
      })
        .catch(err => console.log(err));
    }
  }, [user]);

  return (
    <div className="App">
        {isModalVisible && <LoginForm closeModal={closeModal} login={login} />}
  <div className="login">
   {user ? <Avatar onClick={handleLogout} round size={50} style={{ float: 'right', paddingTop: "20px", marginRight: "20px", cursor: "pointer" }} name={user.name} /> : <button className="button-login" role="button" onClick={showModal}>Login</button>}
 </div>
      {config &&
    <SearchProvider config={config}>
      <WithSearch
        mapContextToProps={({ wasSearched }) => ({
          wasSearched
        })}
      >
        {({ wasSearched }) => {
          return (
            <ErrorBoundary>
               <div className="search-box"><SearchBox /></div>
              
              <Results
                resultView={({ result, onClickLink }) => {
                  return (
                    <div className="result" >
                      <div className="result-info-wrapper">
                        <div className="result-info">
                          <h4>{`Dr ${result.first_name.raw} ${result.last_name.raw}`}</h4>
                          <div>{result.specialty.raw}</div>
                        </div>
                        <div className="address-info">
                          <div>{result.address.raw}</div>
                          <div>{result.city.raw}</div>
                        </div>
                      </div>
                      <button className="button-app" role="button" onClick={onClickLink}>Book appointment</button>
                    </div>
                  );
                }}
                shouldTrackClickThrough
                clickThroughTags={[user?.id]}
              />
            </ErrorBoundary>
          );
        }}
      </WithSearch>
    </SearchProvider>}
    </div>
  );
}

export default App;
