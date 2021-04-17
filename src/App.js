import React from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import "./css/App.css";
import Home from "./Home";
import Stats from "./Stats";
function App() {
	return (
		<div className="App">
			<header className="App-header">
				<Router>
					<Switch>
						<Route exact path="/" component={Home} />
						<Route exact path="/stats" component={Stats} />
						{/* <Route path="/" component={<div>404</div>} /> */}
					</Switch>
				</Router>
			</header>
		</div>
	);
}

export default App;
