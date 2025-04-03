import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<nav className="navbar">
			<h1>Blog Techno</h1>
			<ul>
				<li>
					<Link to="/">Produits</Link>
				</li>
				<li>
					<Link to="/avis">Avis</Link>
				</li>
				<li>
					<Link to="/comparatifs">Comparatifs</Link>
				</li>
				<li>
					<Link to="/tutoriels">Tutoriels</Link>
				</li>
			</ul>
		</nav>
	);
};

export default Navbar;
