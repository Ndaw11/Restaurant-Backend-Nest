export type StockDto = {
  id: number; // id du LotStock
  produitId: number;
  nomProduit: string;
  quantité: number;         // quantité dans ce lot
  seuilMinimum: number;     // toujours lié au produit global
  datePeremption: string;   // date propre au lot
  coûtUnitaire: number;     // prix moyen ou dernier prix (voir calcul)
  alerteNiveauBas: boolean; // true si quantité <= seuilMinimum
};

export type MouvementStockDto = {
  id: number;
  lotStockId: number;       // maintenant lié à un lot précis
  produitId: number;
  nomProduit: string;
  quantité: number;
  typeMouvement: 'Entrer' | 'Sortie';
  date: string;
  createdAt: string;
};
