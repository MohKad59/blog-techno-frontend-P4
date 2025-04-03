import React, { useState, useEffect } from "react";
import axios from "axios";
import ComparatifForm from "./ComparatifForm";

interface Comparatif {
	id: number;
	titre: string;
	contenu: string;
	produit1_nom: string;
	produit2_nom: string;
	produit1_id: number;
	produit2_id: number;
}

interface Produit {
	id: number;
	nom: string;
}

const ComparatifList = () => {
	const [comparatifs, setComparatifs] = useState<Comparatif[]>([]);
	const [produits, setProduits] = useState<Produit[]>([]);
	const [comparatifAEditer, setComparatifAEditer] = useState<Comparatif | null>(
		null,
	);

	useEffect(() => {
		fetchComparatifs();
		fetchProduits();
	}, []);

	const fetchComparatifs = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/comparatifs`,
			);
			setComparatifs(response.data);
			console.log("Comparatifs chargés :", response.data);
		} catch (error) {
			console.error("Erreur lors du chargement des comparatifs :", error);
		}
	};

	const fetchProduits = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/produits`,
			);
			setProduits(response.data);
			console.log("Produits chargés pour comparatifs :", response.data);
		} catch (error) {
			console.error("Erreur lors du chargement des produits :", error);
		}
	};

	const supprimerComparatif = async (id: number) => {
		try {
			await axios.delete(`${process.env.REACT_APP_API_URL}/comparatifs/${id}`);
			console.log(`Comparatif ${id} supprimé`);
			fetchComparatifs();
		} catch (error) {
			console.error("Erreur lors de la suppression du comparatif :", error);
		}
	};

	const handleSave = () => {
		fetchComparatifs();
		setComparatifAEditer(null);
	};

	const annulerEdition = () => {
		setComparatifAEditer(null);
	};

	return (
		<div className="list">
			<ComparatifForm
				comparatif={comparatifAEditer || undefined}
				produits={produits}
				onSave={handleSave}
			/>
			{comparatifAEditer && (
				<button type="button" onClick={annulerEdition} className="cancel-btn">
					Annuler
				</button>
			)}
			<div className="grid">
				{comparatifs.map((comparatif) => (
					<div key={comparatif.id} className="card">
						<h3>{comparatif.titre}</h3>
						<p>{comparatif.contenu}</p>
						<p>
							{comparatif.produit1_nom} vs {comparatif.produit2_nom}
						</p>
						<button
							type="button"
							onClick={() => setComparatifAEditer(comparatif)}
						>
							Modifier
						</button>
						<button
							type="button"
							onClick={() => supprimerComparatif(comparatif.id)}
						>
							Supprimer
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default ComparatifList;
