import React, { useState, useEffect } from "react";
import axios from "axios";
import AvisForm from "./AvisForm";

interface Avis {
	id: number;
	contenu: string;
	note: number;
	produit_id: number;
}

interface Produit {
	id: number;
	nom: string;
}

const AvisList = () => {
	const [avis, setAvis] = useState<Avis[]>([]);
	const [produits, setProduits] = useState<Produit[]>([]);
	const [avisAEditer, setAvisAEditer] = useState<Avis | null>(null);

	useEffect(() => {
		fetchAvis();
		fetchProduits();
	}, []);

	const fetchAvis = async () => {
		const response = await axios.get(`${process.env.REACT_APP_API_URL}/avis`);
		setAvis(response.data);
	};

	const fetchProduits = async () => {
		const response = await axios.get(
			`${process.env.REACT_APP_API_URL}/produits`,
		);
		setProduits(response.data);
	};

	const supprimerAvis = async (id: number) => {
		await axios.delete(`${process.env.REACT_APP_API_URL}/avis/${id}`);
		fetchAvis();
	};

	return (
		<div className="list">
			<AvisForm
				avis={avisAEditer || undefined}
				produits={produits}
				onSave={fetchAvis}
			/>
			<div className="grid">
				{avis.map((avis) => (
					<div key={avis.id} className="card">
						<p>{avis.contenu}</p>
						<p>Note: {avis.note}/5</p>
						<p>Produit ID: {avis.produit_id}</p>
						<button type="button" onClick={() => setAvisAEditer(avis)}>
							Modifier
						</button>
						<button type="button" onClick={() => supprimerAvis(avis.id)}>
							Supprimer
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default AvisList;
