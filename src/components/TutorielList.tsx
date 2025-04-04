import React, { useState, useEffect } from "react";
import axios from "axios";
import TutorielForm from "./TutorielForm";

interface Tutoriel {
	id: number;
	titre: string;
	contenu: string;
	produit_nom: string;
	produit_photo: string;
	produit_id: number;
}

interface Produit {
	id: number;
	nom: string;
}

const API_URL = process.env.REACT_APP_API_URL || "";

const TutorielList = () => {
	const [tutoriels, setTutoriels] = useState<Tutoriel[]>([]);
	const [produits, setProduits] = useState<Produit[]>([]);
	const [tutorielAEditer, setTutorielAEditer] = useState<Tutoriel | null>(null);

	useEffect(() => {
		fetchTutoriels();
		fetchProduits();
	}, []);

	const fetchTutoriels = async () => {
		try {
			const response = await axios.get<Tutoriel[]>(
				`${process.env.REACT_APP_API_URL}/tutoriels`,
			);
			setTutoriels(response.data);
			console.log("Tutoriels (avec photos) chargés :", response.data);
		} catch (error) {
			console.error("Erreur lors du chargement des tutoriels :", error);
		}
	};

	const fetchProduits = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/produits`,
			);
			setProduits(response.data);
			console.log("Produits chargés pour tutoriels :", response.data);
		} catch (error) {
			console.error("Erreur lors du chargement des produits :", error);
		}
	};

	const supprimerTutoriel = async (id: number) => {
		try {
			await axios.delete(`${process.env.REACT_APP_API_URL}/tutoriels/${id}`);
			console.log(`Tutoriel ${id} supprimé`);
			fetchTutoriels();
		} catch (error) {
			console.error("Erreur lors de la suppression du tutoriel :", error);
		}
	};

	const handleSave = () => {
		fetchTutoriels();
		setTutorielAEditer(null);
	};

	const annulerEdition = () => {
		setTutorielAEditer(null);
	};

	return (
		<div className="list">
			<TutorielForm
				tutoriel={tutorielAEditer || undefined}
				produits={produits}
				onSave={handleSave}
			/>
			{tutorielAEditer && (
				<button type="button" onClick={annulerEdition} className="cancel-btn">
					Annuler
				</button>
			)}
			<div className="grid">
				{tutoriels.map((tutoriel) => {
					const produitImageUrl = tutoriel.produit_photo
						? tutoriel.produit_photo.startsWith("http")
							? tutoriel.produit_photo
							: `${API_URL}/uploads/${tutoriel.produit_photo}`
						: "";

					return (
						<div key={tutoriel.id} className="card">
							<h3>{tutoriel.titre}</h3>
							<h4>Produit: {tutoriel.produit_nom}</h4>
							{produitImageUrl && (
								<img
									src={produitImageUrl}
									alt={tutoriel.produit_nom}
									style={{ maxWidth: "100px", maxHeight: "100px" }}
								/>
							)}
							<p>{tutoriel.contenu}</p>
							<button type="button" onClick={() => setTutorielAEditer(tutoriel)}>
								Modifier
							</button>
							<button
								type="button"
								onClick={() => supprimerTutoriel(tutoriel.id)}
							>
								Supprimer
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default TutorielList;
