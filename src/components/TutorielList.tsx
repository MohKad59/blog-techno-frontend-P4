import React, { useState, useEffect } from "react";
import axios from "axios";
import TutorielForm from "./TutorielForm";

interface Tutoriel {
	id: number;
	titre: string;
	contenu: string;
	produit_nom: string;
	produit_id: number;
}

interface Produit {
	id: number;
	nom: string;
}

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
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/tutoriels`,
			);
			setTutoriels(response.data);
			console.log("Tutoriels chargés :", response.data);
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
				{tutoriels.map((tutoriel) => (
					<div key={tutoriel.id} className="card">
						<h3>{tutoriel.titre}</h3>
						<p>{tutoriel.contenu}</p>
						<p>Produit: {tutoriel.produit_nom}</p>
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
				))}
			</div>
		</div>
	);
};

export default TutorielList;
