let produits = [
  { nom: "PC portable", prix: 900 },
  { nom: "Souris", prix: 25 },
  { nom: "Clavier", prix: 40 },
  { nom: "Écran", prix: 150 }
];

let liste = document.getElementById("produits");

let produitsFiltres = produits.filter(p => p.prix < 100);

if (produitsFiltres.length === 0) {
  liste.innerHTML = "<li>Aucun produit en promotion.</li>";
} else {
  produitsFiltres.forEach(p => {
    let li = document.createElement("li");
    li.textContent = `${p.nom} – ${p.prix} €`;
    liste.appendChild(li);
  });
}