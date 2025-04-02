import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

interface AvisFormProps {
	avis?: { id: number; contenu: string; note: number; produit_id: number };
	produits: { id: number; nom: string }[];
	onSave: () => void;
}

const AvisForm = ({ avis, produits, onSave }: AvisFormProps) => {
	const [contenu, setContenu] = useState(avis?.contenu || "");
	const [note, setNote] = useState(avis?.note || 1);
	const [produitId, setProduitId] = useState(avis?.produit_id || "");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (avis) {
			await axios.put(`${process.env.REACT_APP_API_URL}/avis/${avis.id}`, {
				contenu,
				note,
			});
		} else {
			await axios.post(`${process.env.REACT_APP_API_URL}/avis`, {
				contenu,
				note,
				produit_id: produitId,
			});
		}
		onSave();
		setContenu("");
		setNote(1);
		setProduitId("");
	};

	return (
		<form onSubmit={handleSubmit} className="form">
			<textarea
				value={contenu}
				onChange={(e) => setContenu(e.target.value)}
				placeholder="Contenu"
				required
			/>
			<input
				type="number"
				min="1"
				max="5"
				value={note}
				onChange={(e) => setNote(Number.parseInt(e.target.value))}
				required
			/>
			{!avis && (
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
			)}
			<button type="submit">{avis ? "Modifier" : "Ajouter"}</button>
		</form>
	);
};

export default AvisForm;
