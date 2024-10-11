import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="p-2">
      <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
        <Search size={20} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search or start new chat"
          className="bg-transparent ml-2 outline-none flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;