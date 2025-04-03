import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

interface ProduitFormProps {
	produit?: {
		id: number;
		nom: string;
		description: string;
		prix: number;
		photo: string;
	};
	onSave: () => void;
}

const ProduitForm = ({ produit, onSave }: ProduitFormProps) => {
	const [nom, setNom] = useState(produit?.nom || "");
	const [description, setDescription] = useState(produit?.description || "");
	const [prix, setPrix] = useState(produit?.prix || 0);
	const [photo, setPhoto] = useState(produit?.photo || "");

	useEffect(() => {
		if (produit) {
			setNom(produit.nom);
			setDescription(produit.description);
			setPrix(produit.prix);
			setPhoto(produit.photo);
			console.log("Formulaire chargé pour édition :", produit);
		} else {
			setNom("");
			setDescription("");
			setPrix(0);
			setPhoto("");
			console.log("Formulaire réinitialisé pour ajout");
		}
	}, [produit]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Soumission du formulaire avec :", {
			nom,
			description,
			prix,
			photo,
		});
		try {
			if (produit) {
				const response = await axios.put(
					`${process.env.REACT_APP_API_URL}/produits/${produit.id}`,
					{
						nom,
						description,
						prix,
						photo,
					},
				);
				console.log("Réponse PUT :", response.data);
			} else {
				const response = await axios.post(
					`${process.env.REACT_APP_API_URL}/produits`,
					{
						nom,
						description,
						prix,
						photo,
					},
				);
				console.log("Réponse POST :", response.data);
			}
			onSave();
		} catch (error) {
			console.error("Erreur lors de la soumission :", error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="form">
			<input
				type="text"
				value={nom}
				onChange={(e) => setNom(e.target.value)}
				placeholder="Nom"
				required
			/>
			<textarea
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				placeholder="Description"
				required
			/>
			<input
				type="number"
				value={prix}
				onChange={(e) =>
					setPrix(e.target.value ? Number.parseFloat(e.target.value) : 0)
				}
				placeholder="Prix"
				required
			/>
			<input
				type="text"
				value={photo}
				onChange={(e) => setPhoto(e.target.value)}
				placeholder="URL de la photo"
				required
			/>
			<button type="submit">{produit ? "Modifier" : "Ajouter"}</button>
		</form>
	);
};

export default ProduitForm;
