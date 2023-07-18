// CharacterSelect.js
import React from 'react';
import PropTypes from 'prop-types';

const mockCharacters = [
    { id: 1, name: 'Character 1' },
    { id: 2, name: 'Character 2' },
    { id: 3, name: 'Character 3' },
    // ... add more mock characters as needed
];

const CharacterSelect = ({ onCharacterSelect }) => {
    return (
        <div className="character-select-container">
            <h2>Select your character</h2>
            <div className="character-select">
                {mockCharacters.map(character => (
                    <button 
                        key={character.id} 
                        onClick={() => onCharacterSelect(character)}
                        className="character-button"
                    >
                        {character.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

CharacterSelect.propTypes = {
    onCharacterSelect: PropTypes.func.isRequired,
};

export default CharacterSelect;
