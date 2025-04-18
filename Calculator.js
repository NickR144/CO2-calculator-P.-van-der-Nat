const { useState, useEffect, useRef } = React;
const { Printer } = LucideReact;

const CO2Calculator = () => {
  const [dieselVerbruik, setDieselVerbruik] = useState(2669369);
  const [dieselWTW, setDieselWTW] = useState(3.262);
  const [hvoWTW, setHvoWTW] = useState(0.347);
  const [hvoPercentage, setHvoPercentage] = useState(100);
  const [dieselCO2, setDieselCO2] = useState(0);
  const [hvoCO2, setHvoCO2] = useState(0);
  const [gemengdCO2, setGemengdCO2] = useState(0);
  const [besparing, setBesparing] = useState(0);
  const [besparingPercentage, setBesparingPercentage] = useState(0);
  const printRef = useRef(null);

  useEffect(() => {
    const dieselTotaal = dieselVerbruik * dieselWTW;
    const volledigeHvoTotaal = dieselVerbruik * hvoWTW;
    
    // Berekening van de gemengde uitstoot op basis van de schuifbalk
    const hvoHoeveelheid = dieselVerbruik * (hvoPercentage / 100);
    const dieselHoeveelheid = dieselVerbruik * (1 - hvoPercentage / 100);
    
    const werkelijkeDieselCO2 = dieselHoeveelheid * dieselWTW;
    const werkelijkeHvoCO2 = hvoHoeveelheid * hvoWTW;
    const gemengdeTotaal = werkelijkeDieselCO2 + werkelijkeHvoCO2;
    
    const verschil = dieselTotaal - gemengdeTotaal;
    const percentage = (verschil / dieselTotaal) * 100;
    
    setDieselCO2(dieselTotaal);
    setHvoCO2(volledigeHvoTotaal);
    setGemengdCO2(gemengdeTotaal);
    setBesparing(verschil);
    setBesparingPercentage(percentage);
  }, [dieselVerbruik, dieselWTW, hvoWTW, hvoPercentage]);
  
  const handleExport = () => {
    const printContent = document.createElement('div');
    printContent.innerHTML = printRef.current.innerHTML;
    
    // Styling voor het printbare document
    const style = document.createElement('style');
    style.innerHTML = `
      body { font-family: Arial, sans-serif; color: #333; }
      .print-container { padding: 20px; }
      h1, h2, h3 { margin-top: 20px; }
      table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
      th { background-color: #f2f2f2; }
      .highlight { font-weight: bold; color: #2b6cb0; }
    `;
    
    // Open nieuw venster en schrijf inhoud
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>CO2 Besparingscalculator Rapport</title>');
    printWindow.document.write(style.outerHTML);
    printWindow.document.write('</head><body>');
    printWindow.document.write('<div class="print-container">');
    printWindow.document.write('<h1>CO2 Besparingscalculator Rapport</h1>');
    printWindow.document.write('<p>Datum: ' + new Date().toLocaleDateString() + '</p>');
    
    // Invoergegevens tabel
    printWindow.document.write('<h2>Invoergegevens</h2>');
    printWindow.document.write('<table>');
    printWindow.document.write('<tr><th>Parameter</th><th>Waarde</th></tr>');
    printWindow.document.write(`<tr><td>Totaal brandstofverbruik</td><td>${dieselVerbruik.toLocaleString()} liter</td></tr>`);
    printWindow.document.write(`<tr><td>Diesel WTW CO2-factor</td><td>${dieselWTW} kg CO2/liter</td></tr>`);
    printWindow.document.write(`<tr><td>HVO100 WTW CO2-factor</td><td>${hvoWTW} kg CO2/liter</td></tr>`);
    printWindow.document.write(`<tr><td>Gekozen HVO100 percentage</td><td>${hvoPercentage}%</td></tr>`);
    printWindow.document.write('</table>');
    
    // Brandstofverdeling tabel
    printWindow.document.write('<h2>Brandstofverdeling</h2>');
    printWindow.document.write('<table>');
    printWindow.document.write('<tr><th>Brandstoftype</th><th>Volume (liter)</th><th>Percentage</th></tr>');
    printWindow.document.write(`<tr><td>Diesel</td><td>${Math.round(dieselVerbruik * (1 - hvoPercentage / 100)).toLocaleString()}</td><td>${(100 - hvoPercentage)}%</td></tr>`);
    printWindow.document.write(`<tr><td>HVO100</td><td>${Math.round(dieselVerbruik * (hvoPercentage / 100)).toLocaleString()}</td><td>${hvoPercentage}%</td></tr>`);
    printWindow.document.write(`<tr><td>Totaal</td><td>${dieselVerbruik.toLocaleString()}</td><td>100%</td></tr>`);
    printWindow.document.write('</table>');
    
    // CO2-uitstoot resultaten
    printWindow.document.write('<h2>CO2-uitstoot resultaten</h2>');
    printWindow.document.write('<table>');
    printWindow.document.write('<tr><th>Scenario</th><th>CO2-uitstoot (kg)</th></tr>');
    printWindow.document.write(`<tr><td>100% Diesel (uitgangssituatie)</td><td>${Math.round(dieselCO2).toLocaleString()}</td></tr>`);
    printWindow.document.write(`<tr><td>Huidige mix (${(100 - hvoPercentage)}% diesel, ${hvoPercentage}% HVO100)</td><td>${Math.round(gemengdCO2).toLocaleString()}</td></tr>`);
    printWindow.document.write(`<tr><td>100% HVO100</td><td>${Math.round(hvoCO2).toLocaleString()}</td></tr>`);
    printWindow.document.write('</table>');
    
    // CO2-besparing resultaten
    printWindow.document.write('<h2>CO2-besparing met huidige mix</h2>');
    printWindow.document.write('<table>');
    printWindow.document.write('<tr><th>Type besparing</th><th>Waarde</th></tr>');
    printWindow.document.write(`<tr><td>Absolute CO2-besparing</td><td class="highlight">${Math.round(besparing).toLocaleString()} kg CO2</td></tr>`);
    printWindow.document.write(`<tr><td>Relatieve CO2-besparing</td><td class="highlight">${besparingPercentage.toFixed(1)}%</td></tr>`);
    printWindow.document.write('</table>');
    
    printWindow.document.write('<p style="margin-top: 30px; font-style: italic;">Deze calculator vergelijkt de CO2-uitstoot van conventionele diesel met HVO100 (Hydrotreated Vegetable Oil). WTW staat voor "Well-to-Wheel" en berekent de totale CO2-uitstoot in de gehele keten, van productie tot verbruik.</p>');
    
    printWindow.document.write('</div></body></html>');
    printWindow.document.close();
    printWindow.focus();
    
    // Print het document automatisch
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md" ref={printRef}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800">CO2 Besparingscalculator: Diesel vs. HVO100</h1>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <Printer size={18} />
          <span>Exporteren</span>
        </button>
      </div>
      
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3 text-blue-700">Invoergegevens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dieselverbruik (liters per jaar)
            </label>
            <input
              type="number"
              value={dieselVerbruik}
              onChange={(e) => setDieselVerbruik(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diesel WTW (kg CO2 per liter)
            </label>
            <input
              type="number"
              step="0.001"
              value={dieselWTW}
              onChange={(e) => setDieselWTW(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HVO100 WTW (kg CO2 per liter)
            </label>
            <input
              type="number"
              step="0.001"
              value={hvoWTW}
              onChange={(e) => setHvoWTW(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3 text-blue-700">HVO100 Mengverhouding</h2>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-medium">100% Diesel</span>
          <input
            type="range"
            min="0"
            max="100"
            value={hvoPercentage}
            onChange={(e) => setHvoPercentage(Number(e.target.value))}
            className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm font-medium">100% HVO100</span>
        </div>
        <div className="text-center mb-3">
          <span className="text-lg font-semibold text-blue-600">{hvoPercentage}% HVO100</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 p-3 bg-white rounded-lg shadow-sm">
          <div className="text-center p-2 bg-red-50 rounded">
            <h3 className="text-sm font-medium text-gray-700">Dieselverbruik</h3>
            <p className="text-xl font-bold text-red-600">
              {Math.round(dieselVerbruik * (1 - hvoPercentage / 100)).toLocaleString()} liter
            </p>
            <p className="text-xs text-gray-500">({(100 - hvoPercentage)}% van totaal)</p>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <h3 className="text-sm font-medium text-gray-700">HVO100 verbruik</h3>
            <p className="text-xl font-bold text-green-600">
              {Math.round(dieselVerbruik * (hvoPercentage / 100)).toLocaleString()} liter
            </p>
            <p className="text-xs text-gray-500">({hvoPercentage}% van totaal)</p>
          </div>
        </div>
      </div>

      <div className="mb-8 p-4 bg-green-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-green-700">Resultaten</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2 text-gray-800">Uitstoot met 100% Diesel</h3>
            <p className="text-3xl font-bold text-red-600">{Math.round(dieselCO2).toLocaleString()} kg CO2</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2 text-gray-800">Uitstoot met huidige mix</h3>
            <p className="text-3xl font-bold text-orange-500">{Math.round(gemengdCO2).toLocaleString()} kg CO2</p>
            <p className="text-lg font-medium mt-2">({(100 - hvoPercentage)}% diesel, {hvoPercentage}% HVO100)</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2 text-gray-800">Uitstoot met 100% HVO100</h3>
            <p className="text-3xl font-bold text-green-600">{Math.round(hvoCO2).toLocaleString()} kg CO2</p>
          </div>
        </div>
        
        <div className="mt-6 p-5 bg-blue-100 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-blue-800">CO2 Besparing met huidige mix</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-lg font-medium mb-1">Absolute besparing:</p>
              <p className="text-3xl font-bold text-green-700">{Math.round(besparing).toLocaleString()} kg CO2</p>
            </div>
            <div>
              <p className="text-lg font-medium mb-1">Relatieve besparing:</p>
              <p className="text-3xl font-bold text-green-700">{besparingPercentage.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">Toelichting</h2>
        <p className="text-sm text-gray-600">
          Deze calculator vergelijkt de CO2-uitstoot van conventionele diesel met HVO100 (Hydrotreated Vegetable Oil).
          WTW staat voor "Well-to-Wheel" en berekent de totale CO2-uitstoot in de gehele keten, van productie tot verbruik.
          HVO100 is een hernieuwbare diesel die gemaakt wordt van plantaardige oliën en vetten en kan een significante CO2-reductie opleveren.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Met de schuifbalk kunt u simuleren wat de CO2-uitstoot zou zijn bij verschillende mengverhoudingen van reguliere diesel en HVO100. 
          Bij 0% is er alleen dieselgebruik, bij 100% wordt alle diesel vervangen door HVO100.
        </p>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">Visualisatie van CO2-reductie</h2>
        <div className="w-full bg-gray-200 rounded-full h-6 mb-4">
          <div 
            className="bg-green-600 h-6 rounded-full" 
            style={{ width: `${besparingPercentage > 100 ? 100 : besparingPercentage}%` }}
          >
            <div className="px-2 text-xs text-white text-center leading-6 font-medium">
              {besparingPercentage.toFixed(1)}% reductie
            </div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>0% reductie</span>
          <span>50% reductie</span>
          <span>100% reductie</span>
        </div>
      </div>
    </div>
  );
};

// Render de React-component naar de DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CO2Calculator />);
