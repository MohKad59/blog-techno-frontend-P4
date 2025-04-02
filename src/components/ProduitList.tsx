import React, { useState, useEffect } from "react";
import axios from "axios";
import ProduitForm from "./ProduitForm";

interface Produit {
	id: number;
	nom: string;
	description: string;
	prix: number;
	photo: string;
}

const ProduitList = () => {
	const [produits, setProduits] = useState<Produit[]>([]);
	const [produitAEditer, setProduitAEditer] = useState<Produit | null>(null);

	useEffect(() => {
		fetchProduits();
	}, []);

	const fetchProduits = async () => {
		const response = await axios.get(
			`${process.env.REACT_APP_API_URL}/produits`,
		);
		setProduits(response.data);
	};

	const supprimerProduit = async (id: number) => {
		await axios.delete(`${process.env.REACT_APP_API_URL}/produits/${id}`);
		fetchProduits();
	};

	return (
		<div className="list">
			<ProduitForm
				produit={produitAEditer || undefined}
				onSave={fetchProduits}
			/>
			<div className="grid">
				{produits.map((produit) => (
					<div key={produit.id} className="card">
						<img src={produit.photo} alt={produit.nom} />
						<h3>{produit.nom}</h3>
						<p>{produit.description}</p>
						<p>{produit.prix} €</p>
						<button type="button" onClick={() => setProduitAEditer(produit)}>
							Modifier
						</button>
						<button type="button" onClick={() => supprimerProduit(produit.id)}>
							Supprimer
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default ProduitList;
