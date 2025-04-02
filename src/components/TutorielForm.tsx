import type React from "react";
import { useState } from "react";
import axios from "axios";

interface TutorielFormProps {
	tutoriel?: { id: number; titre: string; contenu: string; produit_id: number };
	produits: { id: number; nom: string }[];
	onSave: () => void;
}

const TutorielForm = ({ tutoriel, produits, onSave }: TutorielFormProps) => {
	const [titre, setTitre] = useState(tutoriel?.titre || "");
	const [contenu, setContenu] = useState(tutoriel?.contenu || "");
	const [produitId, setProduitId] = useState(tutoriel?.produit_id || "");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (tutoriel) {
			await axios.put(
				`${process.env.REACT_APP_API_URL}/tutoriels/${tutoriel.id}`,
				{ titre, contenu, produit_id: produitId },
			);
		} else {
			await axios.post(`${process.env.REACT_APP_API_URL}/tutoriels`, {
				titre,
				contenu,
				produit_id: produitId,
			});
		}
		onSave();
		setTitre("");
		setContenu("");
		setProduitId("");
	};

	return (
		<form onSubmit={handleSubmit} className="form">
			<input
				type="text"
				value={titre}
				onChange={(e) => setTitre(e.target.value)}
				placeholder="Titre"
				required
			/>
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
