


export function getInstrumentBadgeStyle(instrument) {

  const instrumentCategory = {

    "Guitare": "CORDES",
    "Guitare basse": "CORDES",
    "Violon": "CORDES",
    "Violoncelle": "CORDES",
    "Contrebasse": "CORDES",
    "Harpe": "CORDES",
    "Banjo": "CORDES",
    
   
    "Trompette": "VENTS",
    "Saxophone": "VENTS",
    "Flûte traversière": "VENTS",
    "Clarinette": "VENTS",
    "Hautbois": "VENTS",
    "Trombone": "VENTS",
    "Tuba": "VENTS",
    
   
    "Piano": "CLAVIERS",
    "Piano électrique": "CLAVIERS",
    "Clavecin": "CLAVIERS",
    "Synthétiseur": "CLAVIERS",
    "Orgue": "CLAVIERS",
    
   
    "Batterie": "PERCUSSIONS",
    "Cajon": "PERCUSSIONS",
    "Xylophone": "PERCUSSIONS",
    "Marimba": "PERCUSSIONS",
    "Vibraphone": "PERCUSSIONS",
    "Timbales": "PERCUSSIONS",
    
   
    "MAO (Musique Assistée par Ordinateur)": "ELECTRONIQUE",
    "Platines DJ": "ELECTRONIQUE",
    "Sampler": "ELECTRONIQUE",
    "Séquenceur": "ELECTRONIQUE",
    
   
    "Chant": "AUTRES",
    "Beatbox": "AUTRES",
    "Harmonica": "AUTRES",
    "Accordéon": "AUTRES"
  };
  
  
  const category = instrumentCategory[instrument] || "AUTRES";
  

  const categoryStyles = {
    "CORDES": {
      background: "rgba(255, 41, 117, 0.15)",
      color: "#ff2975",
      border: "1px solid #ff2975",

    },
    "VENTS": {
      background: "rgba(41, 121, 255, 0.15)",
      color: "#2979ff",
      border: "1px solid #2979ff",

    },
    "CLAVIERS": {
      background: "rgba(187, 41, 255, 0.15)",
      color: "#bb29ff",
      border: "1px solid #bb29ff",
 
    },
    "PERCUSSIONS": {
      background: "rgba(255, 145, 41, 0.15)",
      color: "#ff9129",
      border: "1px solid #ff9129",
  
    },
    "ELECTRONIQUE": {
      background: "rgba(41, 255, 236, 0.15)",
      color: "#29ffec",
      border: "1px solid #29ffec",

    },
    "AUTRES": {
      background: "rgba(41, 255, 95, 0.15)",
      color: "#29ff5f",
      border: "1px solid #29ff5f",
      
    
    }
  };
  
  // Style commun pour tous les badges
  const commonStyle = {
    padding: "4px 10px",
    fontWeight: "bold",
    fontSize: "0.875rem",
    letterSpacing: "0.5px",
    backdropFilter: "blur(1px)",
    transition: "all 0.3s ease"
  };
  

  return {
    ...commonStyle,
    ...categoryStyles[category]
  };
}
