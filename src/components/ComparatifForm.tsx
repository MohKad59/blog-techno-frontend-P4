import type React from "react";
import { useState } from "react";
import axios from "axios";

interface ComparatifFormProps {
	comparatif?: {
		id: number;
		titre: string;
		contenu: string;
		produit1_id: number;
		produit2_id: number;
	};
	produits: { id: number; nom: string }[];
	onSave: () => void;
}

const ComparatifForm = ({
	comparatif,
	produits,
	onSave,
}: ComparatifFormProps) => {
	const [titre, setTitre] = useState(comparatif?.titre || "");
	const [contenu, setContenu] = useState(comparatif?.contenu || "");
	const [produit1Id, setProduit1Id] = useState(comparatif?.produit1_id || "");
	const [produit2Id, setProduit2Id] = useState(comparatif?.produit2_id || "");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (comparatif) {
			await axios.put(
				`${process.env.REACT_APP_API_URL}/comparatifs/${comparatif.id}`,
				{ titre, contenu, produit1_id: produit1Id, produit2_id: produit2Id },
			);
		} else {
			await axios.post(`${process.env.REACT_APP_API_URL}/comparatifs`, {
				titre,
				contenu,
				produit1_id: produit1Id,
				produit2_id: produit2Id,
			});
		}
		onSave();
		setTitre("");
		setContenu("");
		setProduit1Id("");
		setProduit2Id("");
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
				value={produit1Id}
				onChange={(e) => setProduit1Id(e.target.value)}
				required
			>
				<option value="">Produit 1</option>
				{produits.map((produit) => (
					<option key={produit.id} value={produit.id}>
						{produit.nom}
					</option>
				))}
			</select>
			<select
				value={produit2Id}
				onChange={(e) => setProduit2Id(e.target.value)}
				required
			>
				<option value="">Produit 2</option>
				{produits.map((produit) => (
					<option key={produit.id} value={produit.id}>
						{produit.nom}
					</option>
				))}
			</select>
			<button type="submit">{comparatif ? "Modifier" : "Ajouter"}</button>
		</form>
	);
};

export default ComparatifForm;
