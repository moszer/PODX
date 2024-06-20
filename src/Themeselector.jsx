// ThemeSelector.js
import React, { useState, useEffect } from 'react';

const ThemeSelector = () => {
    const [theme, setTheme] = useState('cyberpunk'); // Default theme

    useEffect(() => {
      const defaultTheme = localStorage.getItem('Theme');
      if (defaultTheme) {
          setTheme(defaultTheme);
        }
      document.documentElement.setAttribute('data-theme', theme);
    }, [theme]); // This runs every time 'theme' changes
  
    const handleThemeChange = (event) => {
      const selectedTheme = event.target.value;
      setTheme(selectedTheme);
      localStorage.setItem('Theme', selectedTheme); // Save the selected theme to localStorage
    };

  return (
    <div className="p-[30px] relative">
      <label htmlFor="theme-select" className="mr-2">Select Theme:</label>
      <select
        id="theme-select"
        value={theme}
        onChange={handleThemeChange}
        className="select select-bordered absolute right-4 mt-[-10px]"
      >
        <option value="black">Black</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="cupcake">Cupcake</option>
        <option value="bumblebee">Bumblebee</option>
        <option value="emerald">Emerald</option>
        <option value="corporate">Corporate</option>
        <option value="synthwave">Synthwave</option>
        <option value="retro">Retro</option>
        <option value="cyberpunk">Cyberpunk</option>
        <option value="valentine">Valentine</option>
        <option value="halloween">Halloween</option>
        <option value="garden">Garden</option>
        <option value="forest">Forest</option>
        <option value="aqua">Aqua</option>
        <option value="lofi">Lofi</option>
        <option value="pastel">Pastel</option>
        <option value="fantasy">Fantasy</option>
        <option value="wireframe">Wireframe</option>
        <option value="luxury">Luxury</option>
        <option value="dracula">Dracula</option>
        <option value="autumn">Autumn</option>
        <option value="business">Business</option>
        <option value="acid">Acid</option>
        <option value="lemonade">Lemonade</option>
        <option value="night">Night</option>
        <option value="coffee">Coffee</option>
        <option value="winter">Winter</option>
      </select>
    </div>
  );
};

export default ThemeSelector;
