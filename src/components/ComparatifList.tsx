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
		const response = await axios.get(
			`${process.env.REACT_APP_API_URL}/comparatifs`,
		);
		setComparatifs(response.data);
	};

	const fetchProduits = async () => {
		const response = await axios.get(
			`${process.env.REACT_APP_API_URL}/produits`,
		);
		setProduits(response.data);
	};

	const supprimerComparatif = async (id: number) => {
		await axios.delete(`${process.env.REACT_APP_API_URL}/comparatifs/${id}`);
		fetchComparatifs();
	};

	return (
		<div className="list">
			<ComparatifForm
				comparatif={comparatifAEditer || undefined}
				produits={produits}
				onSave={fetchComparatifs}
			/>
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
