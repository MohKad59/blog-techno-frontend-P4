import React, { useState, useEffect } from "react";
import axios from "axios";
import AvisForm from "./AvisForm";

interface Avis {
	id: number;
	contenu: string;
	note: number;
	produit_id: number;
	produit_nom: string;
	produit_photo: string;
}

interface Produit {
	id: number;
	nom: string;
}

const API_URL = process.env.REACT_APP_API_URL || "";

const AvisList = () => {
	const [avis, setAvis] = useState<Avis[]>([]);
	const [produits, setProduits] = useState<Produit[]>([]);
	const [avisAEditer, setAvisAEditer] = useState<Avis | null>(null);

	useEffect(() => {
		fetchAvis();
		fetchProduitsPourForm();
	}, []);

	const fetchAvis = async () => {
		try {
			const response = await axios.get<Avis[]>(
				`${process.env.REACT_APP_API_URL}/avis`,
			);
			setAvis(response.data);
			console.log("Avis (avec infos produit) chargés :", response.data);
		} catch (error) {
			console.error("Erreur lors du chargement des avis :", error);
		}
	};

	const fetchProduitsPourForm = async () => {
		try {
			const response = await axios.get<Produit[]>(
				`${process.env.REACT_APP_API_URL}/produits`,
			);
			setProduits(response.data);
			console.log("Produits chargés pour le formulaire Avis :", response.data);
		} catch (error) {
			console.error(
				"Erreur lors du chargement des produits pour le formulaire :",
				error,
			);
		}
	};

	const supprimerAvis = async (id: number) => {
		try {
			await axios.delete(`${process.env.REACT_APP_API_URL}/avis/${id}`);
			console.log(`Avis ${id} supprimé`);
			fetchAvis();
		} catch (error) {
			console.error("Erreur lors de la suppression de l'avis :", error);
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
				{avis.map((unAvis) => {
					const produitImageUrl = unAvis.produit_photo
						? unAvis.produit_photo.startsWith("http")
							? unAvis.produit_photo
							: `${API_URL}/uploads/${unAvis.produit_photo}`
						: "";

					return (
						<div key={unAvis.id} className="card">
							{produitImageUrl && (
								<img
									src={produitImageUrl}
									alt={`Produit: ${unAvis.produit_nom}`}
									style={{ maxWidth: "100px", maxHeight: "100px" }}
								/>
							)}
							<h4>Produit: {unAvis.produit_nom}</h4>
							<p>{unAvis.contenu}</p>
							<p>Note: {unAvis.note}/5</p>
							<button type="button" onClick={() => setAvisAEditer(unAvis)}>
								Modifier
							</button>
							<button type="button" onClick={() => supprimerAvis(unAvis.id)}>
								Supprimer
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default AvisList;
