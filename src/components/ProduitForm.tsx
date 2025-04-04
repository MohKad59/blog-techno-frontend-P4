import type React from "react";
import { useState, useEffect } from "react";
import axios, { type AxiosResponse } from "axios";

interface ProduitFormProps {
	produit?: {
		id: number;
		nom: string;
		description: string;
		prix: number;
		photo: string; // Contient maintenant le nom du fichier ou une ancienne URL
	};
	onSave: () => void;
}

const API_URL = process.env.REACT_APP_API_URL || "";

const ProduitForm = ({ produit, onSave }: ProduitFormProps) => {
	const [nom, setNom] = useState("");
	const [description, setDescription] = useState("");
	const [prix, setPrix] = useState<number | string>("");

	// Nouveaux états pour gérer les deux types d'entrée photo
	const [inputType, setInputType] = useState<"url" | "file">("file"); // Par défaut : fichier
	const [photoUrl, setPhotoUrl] = useState("");
	const [photoFile, setPhotoFile] = useState<File | null>(null);
	const [photoPreview, setPhotoPreview] = useState<string | null>(null);

	useEffect(() => {
		const getInitialPreviewUrl = (
			photoValue: string | undefined,
		): string | null => {
			if (!photoValue) return null;
			return photoValue.startsWith("http")
				? photoValue
				: `${API_URL}/uploads/${photoValue}`;
		};

		if (produit) {
			setNom(produit.nom);
			setDescription(produit.description);
			setPrix(produit.prix);
			// Déterminer le type d'input et la valeur initiale
			if (produit.photo?.startsWith("http")) {
				setInputType("url");
				setPhotoUrl(produit.photo);
				setPhotoFile(null);
			} else {
				setInputType("file");
				setPhotoUrl("");
				setPhotoFile(null);
			}
			setPhotoPreview(getInitialPreviewUrl(produit.photo));
		} else {
			// Réinitialisation pour ajout
			setNom("");
			setDescription("");
			setPrix("");
			setInputType("file"); // Proposer fichier par défaut pour ajout
			setPhotoUrl("");
			setPhotoFile(null);
			setPhotoPreview(null);
		}
	}, [produit]);

	const handleInputTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const getPreview = (photoValue: string | undefined): string | null => {
			if (!photoValue) return null;
			return photoValue.startsWith("http")
				? photoValue
				: `${API_URL}/uploads/${photoValue}`;
		};
		setInputType(e.target.value as "url" | "file");
		setPhotoUrl("");
		setPhotoFile(null);
		setPhotoPreview(getPreview(produit?.photo));
	};

	const handlePhotoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPhotoUrl(e.target.value);
		setPhotoPreview(e.target.value); // Mettre à jour la prévisualisation avec l'URL
	};

	const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const getPreview = (photoValue: string | undefined): string | null => {
			if (!photoValue) return null;
			return photoValue.startsWith("http")
				? photoValue
				: `${API_URL}/uploads/${photoValue}`;
		};
		if (e.target.files?.[0]) {
			const file = e.target.files[0];
			setPhotoFile(file);
			setPhotoUrl("");
			setPhotoPreview(URL.createObjectURL(file));
		} else {
			setPhotoFile(null);
			setPhotoPreview(getPreview(produit?.photo));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			let response: AxiosResponse<unknown> | undefined;
			// === Envoi avec Fichier ===
			if (inputType === "file" && photoFile) {
				const formData = new FormData();
				formData.append("nom", nom);
				formData.append("description", description);
				formData.append("prix", String(prix));
				formData.append("photo", photoFile);

				if (produit) {
					response = await axios.put(
						`${API_URL}/produits/${produit.id}`,
						formData,
					);
				} else {
					response = await axios.post(`${API_URL}/produits`, formData);
				}
				// === Envoi avec URL ===
			} else if (inputType === "url" && photoUrl) {
				const payload = {
					nom,
					description,
					prix: Number(prix),
					photo: photoUrl, // Envoyer l'URL dans le champ photo
				};
				if (produit) {
					response = await axios.put(
						`${API_URL}/produits/${produit.id}`,
						payload,
					);
				} else {
					response = await axios.post(`${API_URL}/produits`, payload);
				}
				// === Modification sans changer la photo (ni fichier ni URL fournis) ===
			} else if (produit && inputType === "file" && !photoFile && !photoUrl) {
				// Ne pas envoyer le champ photo du tout si on modifie sans nouvelle image
				const payload = { nom, description, prix: Number(prix) };
				response = await axios.put(
					`${API_URL}/produits/${produit.id}`,
					payload,
				);
			} else {
				// Cas d'erreur : Ajout sans photo ou type d'entrée invalide
				alert("Veuillez fournir une URL ou sélectionner un fichier image.");
				return;
			}

			console.log("Réponse serveur:", response?.data);
			onSave();
			// Réinitialiser le formulaire
			setNom("");
			setDescription("");
			setPrix("");
			setInputType("file");
			setPhotoUrl("");
			setPhotoFile(null);
			setPhotoPreview(null);
		} catch (error) {
			console.error("Erreur lors de la soumission :", error);
			alert("Erreur lors de la sauvegarde du produit.");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="form">
			<h2>{produit ? "Modifier le Produit" : "Ajouter un Produit"}</h2>

			{/* Groupes standard pour nom, description, prix */}
			<div className="form-group">
				<label htmlFor="nom">Nom :</label>
				<input
					id="nom"
					type="text"
					value={nom}
					onChange={(e) => setNom(e.target.value)}
					placeholder="Nom"
					required
				/>
			</div>

			<div className="form-group">
				<label htmlFor="description">Description :</label>
				<textarea
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="Description"
					required
				/>
			</div>

			<div className="form-group">
				<label htmlFor="prix">Prix (€) :</label>
				<input
					id="prix"
					type="number"
					value={prix}
					onChange={(e) => setPrix(e.target.value)}
					placeholder="Prix"
					step="0.01"
					required
				/>
			</div>

			{/* Revenir à la structure simple pour le choix photo */}
			<div style={{ marginBottom: "1.5rem" }}> {/* Espacement équivalent à form-group */} 
				<span style={{ display: 'block', marginBottom: '0.5rem', color: '#a8b2c1', fontWeight: 'bold' }}>
					Source de l'image :
				</span>
				<div> 
					<label className="radio-label" htmlFor="inputTypeFile">
						<input
							id="inputTypeFile"
							type="radio"
							value="file"
							checked={inputType === "file"}
							onChange={handleInputTypeChange}
						/>
						Fichier local
					</label>
					<label className="radio-label" htmlFor="inputTypeUrl">
						<input
							id="inputTypeUrl"
							type="radio"
							value="url"
							checked={inputType === "url"}
							onChange={handleInputTypeChange}
						/>
						URL
					</label>
				</div>
			</div>

			{/* Inputs conditionnels sans .form-group */}
			{inputType === "file" && (
				<div style={{ marginBottom: "1.5rem" }}>
					<label htmlFor="photoFileInput" style={{ display: 'block', marginBottom: '0.5rem', color: '#a8b2c1', fontWeight: 'bold' }}>
						Photo (Fichier) :
					</label>
					<input
						id="photoFileInput" 
						type="file"
						accept="image/*"
						onChange={handlePhotoFileChange}
					/>
				</div>
			)}
			{inputType === "url" && (
				<div style={{ marginBottom: "1.5rem" }}>
					<label htmlFor="photoUrlInput" style={{ display: 'block', marginBottom: '0.5rem', color: '#a8b2c1', fontWeight: 'bold' }}>
						Photo (URL) :
					</label>
					<input
						id="photoUrlInput" 
						type="url"
						value={photoUrl}
						onChange={handlePhotoUrlChange}
						placeholder="https://example.com/image.jpg"
					/>
				</div>
			)}

			{/* Prévisualisation (peut rester dans un form-group pour l'espacement) */}
			<div className="form-group">
				{photoPreview && (
					<div>
						<span style={{ display: "block", marginBottom: "0.5rem", color: "#a8b2c1", fontWeight: "bold" }}>
							Prévisualisation :
						</span>
						<img
							src={photoPreview}
							alt="Prévisualisation"
							style={{
								maxWidth: "150px", // Un peu plus grand ?
								maxHeight: "150px",
								display: "block",
								marginTop: "5px",
								border: "1px solid #eee",
							}}
						/>
					</div>
				)}
			</div>

			<button type="submit">
				{produit ? "Enregistrer Modifications" : "Ajouter Produit"}
			</button>
		</form>
	);
};

export default ProduitForm;
