import { clearSearchQuery, searchServers, setSearchQuery } from '@/store/slices/discoverySlice';
import type { AppDispatch, RootState } from '@/store/types';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../ui/button';

const DiscoverSearch = () => {
    const { searchResults } = useSelector((state: RootState) => state.discovery);
    const dispatch = useDispatch<AppDispatch>();
    const [searchQuery, setSearchQuery] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery) {
            dispatch(searchServers(searchQuery));
        }
        setSearchQuery(null);
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                if (inputRef.current) {
                    inputRef.current?.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, []);

    return (
        <form onSubmit={handleSearch} className="relative hidden md:block">
            <input
                ref={inputRef}
                value={searchQuery ?? ""}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search"
                className="bg-[#1e1f22] text-sm text-[#dbdee1] rounded px-2 py-1 w-36 outline-none transition-all duration-300 focus:w-60 focus:bg-[#0b0c0e] focus:ring-2 focus:ring-[#5865f2]/30"
            />
            <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="hover:text-[#dbdee1] transition-all duration-200 hover:scale-110 active:scale-95 absolute right-0 -top-1"
            >
                <Search
                    size={16}
                    className="text-[#949ba4]"
                />
            </Button>
        </form>
    )
}

export default DiscoverSearch;