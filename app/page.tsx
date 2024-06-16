'use client'
import { useState } from 'react';

interface Variant {
  size: string;
  color: string;
  price: number;
  available: number;
}

const variants: Variant[] = [
  { size: 'small', color: 'blue', price: 345.30, available: 20 },
  { size: 'small', color: 'red', price: 345.30, available: 20 },
  { size: 'medium', color: 'blue', price: 23.00, available: 20 },
  { size: 'medium', color: 'red', price: 45.00, available: 20 },
];

const VariantContainer = ({ onSave }: { onSave: (filteredVariants: Variant[]) => void }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [newColor, setNewColor] = useState<string>('');
  const [additionalColors, setAdditionalColors] = useState<string[]>([]);

  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSize(event.target.value);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(event.target.value);
  };

  const handleNewColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewColor(event.target.value);
  };

  const addNewColor = () => {
    if (newColor && !additionalColors.includes(newColor)) {
      setAdditionalColors([...additionalColors, newColor]);
      setNewColor('');
    }
  };

  const filteredVariants = variants.filter((variant) => {
    if (selectedSize && selectedColor) {
      return variant.size === selectedSize && variant.color === selectedColor;
    } else if (selectedSize) {
      return variant.size === selectedSize;
    } else if (selectedColor) {
      return variant.color === selectedColor;
    } else {
      return true;
    }
  });

  const totalSmall = variants
    .filter((variant) => variant.size === 'small')
    .reduce((total, variant) => total + variant.available, 0);

  const totalMedium = variants
    .filter((variant) => variant.size === 'medium')
    .reduce((total, variant) => total + variant.available, 0);

  const handleSave = () => {
    onSave(filteredVariants);
  };

  return (
    <div className="variant-container">
      <h1>Variants</h1>
      <div className="filter-container">
        <div className="color-filter">
          <h2>COLOR</h2>
          <div>
            <input
              type="radio"
              value="blue"
              checked={selectedColor === 'blue'}
              onChange={handleColorChange}
            />
            <label htmlFor="blue">Blue</label>
          </div>
          <div>
            <input
              type="radio"
              value="red"
              checked={selectedColor === 'red'}
              onChange={handleColorChange}
            />
            <label htmlFor="red">Red</label>
          </div>
          {additionalColors.map((color) => (
            <div key={color}>
              <input
                type="radio"
                value={color}
                checked={selectedColor === color}
                onChange={handleColorChange}
              />
              <label htmlFor={color}>{color}</label>
            </div>
          ))}
          <div>
            <input
              type="text"
              value={newColor}
              onChange={handleNewColorChange}
              placeholder="Add new color"
            />
            <button onClick={addNewColor}>Add Color</button>
          </div>
        </div>
        <div className="size-filter">
          <h2>SIZE</h2>
          <select value={selectedSize ?? ""} onChange={handleSizeChange}>
            <option value="">Select size</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
          </select>
        </div>
      </div>
      <table className="variant-table">
        <thead>
          <tr>
            <th>Variants</th>
            <th>Price</th>
            <th>Available</th>
            <th>Total Small</th>
            <th>Total Medium</th>
          </tr>
        </thead>
        <tbody>
          {filteredVariants.map((variant) => (
            <tr key={`${variant.size}-${variant.color}`}>
              <td>{`${variant.size} | ${variant.color}`}</td>
              <td>{`$${variant.price.toFixed(2)}`}</td>
              <td>{variant.available}</td>
              <td>{variant.size === 'small' ? variant.available : ''}</td>
              <td>{variant.size === 'medium' ? variant.available : ''}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={3}>Total</td>
            <td>{totalSmall}</td>
            <td>{totalMedium}</td>
          </tr>
        </tbody>
      </table>
      <button className="save-button" onClick={handleSave}>Save</button>
    </div>
  );
};

const SummaryPage = ({ savedSelections }: { savedSelections: Variant[] }) => {
  const totalSmall = savedSelections
    .filter((variant) => variant.size === 'small')
    .reduce((total, variant) => total + variant.available, 0);

  const totalMedium = savedSelections
    .filter((variant) => variant.size === 'medium')
    .reduce((total, variant) => total + variant.available, 0);

  const totalAvailable = savedSelections.reduce((total, variant) => total + variant.available, 0);

  const priceRange = savedSelections.length > 0
    ? {
        min: Math.min(...savedSelections.map((variant) => variant.price)),
        max: Math.max(...savedSelections.map((variant) => variant.price)),
      }
    : { min: 0, max: 0 };

  return (
    <div className="variant-container">
      <h2>Saved Selections Summary</h2>
      <table className="summary-table">
        <thead>
          <tr>
            <th>Size</th>
            <th>Total Available</th>
            <th>Price Range</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Small</td>
            <td>{totalSmall}</td>
            <td>{`$${priceRange.min.toFixed(2)} - $${priceRange.max.toFixed(2)}`}</td>
          </tr>
          <tr>
            <td>Medium</td>
            <td>{totalMedium}</td>
            <td>{`$${priceRange.min.toFixed(2)} - $${priceRange.max.toFixed(2)}`}</td>
          </tr>
          <tr>
            <td colSpan={2}>Total Available</td>
            <td>{totalAvailable}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  const [view, setView] = useState<'main' | 'summary'>('main');
  const [savedSelections, setSavedSelections] = useState<Variant[]>([]);

  const handleSave = (filteredVariants: Variant[]) => {
    setSavedSelections(filteredVariants);
    setView('summary');
  };

  return (
    <div>
      {view === 'main' ? (
        <VariantContainer onSave={handleSave} />
      ) : (
        <SummaryPage savedSelections={savedSelections} />
      )}
    </div>
  );
};

export default App;
