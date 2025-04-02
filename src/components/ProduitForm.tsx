import type React from "react";
import { useState } from "react";
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (produit) {
			await axios.put(
				`${process.env.REACT_APP_API_URL}/produits/${produit.id}`,
				{ nom, description, prix, photo },
			);
		} else {
			await axios.post(`${process.env.REACT_APP_API_URL}/produits`, {
				nom,
				description,
				prix,
				photo,
			});
		}
		onSave();
		setNom("");
		setDescription("");
		setPrix(0);
		setPhoto("");
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
				onChange={(e) => setPrix(Number.parseFloat(e.target.value))}
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
