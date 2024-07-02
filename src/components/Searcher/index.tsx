import React, { useState, KeyboardEvent } from 'react';
import styles from "./styles.module.scss";

interface SearcherProps {
  nameToSearch: string;
  changeNameToSearch: (value: string) => void;
}

export const Searcher = ({ nameToSearch, changeNameToSearch }: SearcherProps) => {
  const [inputValue, setInputValue] = useState(nameToSearch);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      changeNameToSearch(inputValue);
    }
  };

  return (
    <div className={styles.searcherContainer}>
      <div className={styles.searcherContainerRow}>
        <label htmlFor="search">Buscar</label>
        <input
          type="text"
          name="search"
          autoFocus
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
};

export default Searcher;