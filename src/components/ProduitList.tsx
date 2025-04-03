import React, { useState, useEffect } from "react";
import axios, { type AxiosError } from "axios"; // Import AxiosError
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
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/produits`,
			);
			console.log("Produits chargés :", response.data);
			setProduits(response.data);
		} catch (error) {
			console.error("Erreur lors du chargement des produits :", error);
		}
	};

	const supprimerProduit = async (id: number) => {
		console.log("Fonction supprimerProduit appelée avec ID :", id);
		try {
			const response = await axios.delete(
				`${process.env.REACT_APP_API_URL}/produits/${id}`,
			);
			console.log("Réponse DELETE :", response.data);
			fetchProduits();
		} catch (error) {
			// Typage explicite avec AxiosError
			const axiosError = error as AxiosError<{ message?: string }>;
			console.error(
				"Erreur détaillée lors de la suppression :",
				axiosError.response?.data?.message || axiosError.message,
			);
		}
	};

	const handleSave = () => {
		console.log("Sauvegarde terminée");
		fetchProduits();
		setProduitAEditer(null);
	};

	const annulerEdition = () => {
		console.log("Annulation de l’édition");
		setProduitAEditer(null);
	};

	return (
		<div className="list">
			<ProduitForm produit={produitAEditer || undefined} onSave={handleSave} />
			{produitAEditer && (
				<button
					type="button"
					onClick={() => {
						console.log("Bouton Annuler cliqué");
						annulerEdition();
					}}
					className="cancel-btn"
				>
					Annuler
				</button>
			)}
			<div className="grid">
				{produits.map((produit) => (
					<div key={produit.id} className="card">
						<img src={produit.photo} alt={produit.nom} />
						<h3>{produit.nom}</h3>
						<p>{produit.description}</p>
						<p>{produit.prix} €</p>
						<button
							type="button"
							onClick={() => {
								console.log("Bouton Modifier cliqué pour produit :", produit);
								setProduitAEditer(produit);
							}}
						>
							Modifier
						</button>
						<button
							type="button"
							onClick={() => {
								console.log("Bouton Supprimer cliqué pour ID :", produit.id);
								supprimerProduit(produit.id);
							}}
						>
							Supprimer
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default ProduitList;
