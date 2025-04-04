import React, { useState, useEffect } from "react";
import axios from "axios";
import ComparatifForm from "./ComparatifForm";

interface Comparatif {
	id: number;
	titre: string;
	contenu: string;
	produit1_nom: string;
	produit1_photo: string;
	produit2_nom: string;
	produit2_photo: string;
	produit1_id: number;
	produit2_id: number;
}

interface Produit {
	id: number;
	nom: string;
}

const API_URL = process.env.REACT_APP_API_URL || "";

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
			const response = await axios.get<Comparatif[]>(
				`${process.env.REACT_APP_API_URL}/comparatifs`,
			);
			setComparatifs(response.data);
			console.log("Comparatifs (avec photos) chargés :", response.data);
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
				{comparatifs.map((comparatif) => {
					const imageUrl1 = comparatif.produit1_photo
						? comparatif.produit1_photo.startsWith("http")
							? comparatif.produit1_photo
							: `${API_URL}/uploads/${comparatif.produit1_photo}`
						: "";
					const imageUrl2 = comparatif.produit2_photo
						? comparatif.produit2_photo.startsWith("http")
							? comparatif.produit2_photo
							: `${API_URL}/uploads/${comparatif.produit2_photo}`
						: "";

					return (
						<div key={comparatif.id} className="card">
							<h3>{comparatif.titre}</h3>
							<div>
								<h4>{comparatif.produit1_nom}</h4>
								{imageUrl1 && (
									<img
										src={imageUrl1}
										alt={comparatif.produit1_nom}
										style={{ maxWidth: "100px", maxHeight: "100px" }}
									/>
								)}
							</div>
							<p>vs</p>
							<div>
								<h4>{comparatif.produit2_nom}</h4>
								{imageUrl2 && (
									<img
										src={imageUrl2}
										alt={comparatif.produit2_nom}
										style={{ maxWidth: "100px", maxHeight: "100px" }}
									/>
								)}
							</div>
							<p>{comparatif.contenu}</p>
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
					);
				})}
			</div>
		</div>
	);
};

export default ComparatifList;
