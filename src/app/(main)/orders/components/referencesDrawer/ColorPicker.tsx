import React from 'react'
const COLORS = [
    "#2d7a5f", "#3dae8c", "#8bc34a", "#c9b458",
    "#ffd54f", "#ffb74d", "#ff7043", "#f48fb1",
    "#f06292", "#e91e63", "#9c2757", 
    "#ce93d8", "#ba68c8", "#9c27b0", "#673ab7",
    "#5e4c8a", "#3f51b5", "#2196f3", "#4dd0e1",
    "#81d4fa", "#90a4ae", "#9e9e9e", "#757575",
    "#5d4037", "#bcaaa4", "#b3e5fc",
    "#d7ccc8", "#5c6bc0", "#455a64", "#b39ddb",
    "#b3c5e5", "#4e342e"
]

interface ColorPickerProps {
  selectedColor: string
  onSelect: (color: string) => void
  onClose: () => void
}

export default function ColorPicker({
  selectedColor,
  onSelect,
  onClose,
}: ColorPickerProps) {
  return (

    <div className="absolute z-50 mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-200 w-48">
      <div className="grid grid-cols-4 gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => {
              onSelect(color)
              onClose()
            }}
            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 ${selectedColor === color ? 'border-gray-900' : 'border-transparent'}`}
            style={{
              backgroundColor: color,
            }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  )
}
