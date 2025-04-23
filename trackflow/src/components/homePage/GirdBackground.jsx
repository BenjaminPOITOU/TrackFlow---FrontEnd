

export function GridBackground() {
  return (
    <div className="relative w-full h-full">
      {/* Grille horizontale */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div 
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px bg-gray-100"
          style={{ 
            top: `${i * 5}%`,
            animation: `scrollGrid ${10 + i % 5}s linear infinite`,
          }}
        />
      ))}
      
      {/* Grille verticale */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={`v-${i}`}
          className="absolute top-0 bottom-0 w-px bg-gray-100"
          style={{ 
            left: `${i * 5}%`,
            animation: `scrollGridVertical ${15 + i % 5}s linear infinite`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes scrollGrid {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes scrollGridVertical {
          0% { transform: translateX(0); }
          100% { transform: translateX(100vw); }
        }
      `}</style>
    </div>
  )}