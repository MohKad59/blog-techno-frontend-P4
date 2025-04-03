import React, { useState, useEffect } from "react";
import axios from "axios";
import AvisForm from "./AvisForm";

interface Avis {
	id: number;
	contenu: string;
	note: number;
	produit_id: number;
}

interface Produit {
	id: number;
	nom: string;
}

const AvisList = () => {
	const [avis, setAvis] = useState<Avis[]>([]);
	const [produits, setProduits] = useState<Produit[]>([]);
	const [avisAEditer, setAvisAEditer] = useState<Avis | null>(null);

	useEffect(() => {
		fetchAvis();
		fetchProduits();
	}, []);

	const fetchAvis = async () => {
		try {
			const response = await axios.get(`${process.env.REACT_APP_API_URL}/avis`);
			setAvis(response.data);
			console.log("Avis chargés :", response.data);
		} catch (error) {
			console.error("Erreur lors du chargement des avis :", error);
		}
	};

	const fetchProduits = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/produits`,
			);
			setProduits(response.data);
			console.log("Produits chargés pour avis :", response.data);
		} catch (error) {
			console.error("Erreur lors du chargement des produits :", error);
		}
	};

	const supprimerAvis = async (id: number) => {
		try {
			await axios.delete(`${process.env.REACT_APP_API_URL}/avis/${id}`);
			console.log(`Avis ${id} supprimé`);
			fetchAvis();
		} catch (error) {
			console.error("Erreur lors de la suppression de l’avis :", error);
		}
	};

	const handleSave = () => {
		fetchAvis();
		setAvisAEditer(null);
	};

	const annulerEdition = () => {
		setAvisAEditer(null);
	};

	return (
		<div className="list">
			<AvisForm
				avis={avisAEditer || undefined}
				produits={produits}
				onSave={handleSave}
			/>
			{avisAEditer && (
				<button type="button" onClick={annulerEdition} className="cancel-btn">
					Annuler
				</button>
			)}
			<div className="grid">
				{avis.map((avis) => (
					<div key={avis.id} className="card">
						<p>{avis.contenu}</p>
						<p>Note: {avis.note}/5</p>
						<p>Produit ID: {avis.produit_id}</p>
						<button type="button" onClick={() => setAvisAEditer(avis)}>
							Modifier
						</button>
						<button type="button" onClick={() => supprimerAvis(avis.id)}>
							Supprimer
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default AvisList;
