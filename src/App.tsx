import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Produits from "./pages/Produits";
import Avis from "./pages/Avis";
import Comparatifs from "./pages/Comparatifs";
import Tutoriels from "./pages/Tutoriels";
import "./App.css";

const App = () => {
	return (
		<Router>
			<div className="app">
				<Navbar />
				<Routes>
					<Route path="/" element={<Produits />} />
					<Route path="/avis" element={<Avis />} />
					<Route path="/comparatifs" element={<Comparatifs />} />
					<Route path="/tutoriels" element={<Tutoriels />} />
				</Routes>
			</div>
		</Router>
	);
};

export default App;
