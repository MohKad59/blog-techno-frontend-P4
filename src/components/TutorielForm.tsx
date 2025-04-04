import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

interface TutorielFormProps {
	tutoriel?: { id: number; titre: string; contenu: string; produit_id: number };
	produits: { id: number; nom: string }[];
	onSave: () => void;
}

const TutorielForm = ({ tutoriel, produits, onSave }: TutorielFormProps) => {
	const [titre, setTitre] = useState(tutoriel?.titre || "");
	const [contenu, setContenu] = useState(tutoriel?.contenu || "");
	const [produitId, setProduitId] = useState(
		tutoriel?.produit_id?.toString() || "",
	);

	useEffect(() => {
		if (tutoriel) {
			setTitre(tutoriel.titre);
			setContenu(tutoriel.contenu);
			setProduitId(tutoriel.produit_id.toString());
		} else {
			setTitre("");
			setContenu("");
			setProduitId("");
		}
	}, [tutoriel]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (tutoriel) {
				await axios.put(
					`${process.env.REACT_APP_API_URL}/tutoriels/${tutoriel.id}`,
					{
						titre,
						contenu,
						produit_id: Number.parseInt(produitId),
					},
				);
				console.log(`Tutoriel ${tutoriel.id} modifié`);
			} else {
				await axios.post(`${process.env.REACT_APP_API_URL}/tutoriels`, {
					titre,
					contenu,
					produit_id: Number.parseInt(produitId),
				});
				console.log("Tutoriel ajouté");
			}
			onSave();
		} catch (error) {
			console.error("Erreur lors de la sauvegarde du tutoriel :", error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="form">
			<h2>{tutoriel ? "Modifier le Tutoriel" : "Ajouter un Tutoriel"}</h2>
			<div className="form-group">
				<label htmlFor="titre">Titre :</label>
				<input
					type="text"
					value={titre}
					onChange={(e) => setTitre(e.target.value)}
					placeholder="Titre"
					required
				/>
			</div>
			<textarea
				value={contenu}
				onChange={(e) => setContenu(e.target.value)}
				placeholder="Contenu"
				required
			/>
			<select
				value={produitId}
				onChange={(e) => setProduitId(e.target.value)}
				required
			>
				<option value="">Sélectionner un produit</option>
				{produits.map((produit) => (
					<option key={produit.id} value={produit.id}>
						{produit.nom}
					</option>
				))}
			</select>
			<button type="submit">{tutoriel ? "Modifier" : "Ajouter"}</button>
		</form>
	);
};

export default TutorielForm;
