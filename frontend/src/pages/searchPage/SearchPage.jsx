import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ToastContainer from '../../utils/toasts/ToastContainer';
import TopCard from '../homepage/components/TopCard/TopCard';
import { useProduct } from '../../modules/ProductContext';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const { isLoading, findProduct } = useProduct();
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            if (query) {
                const r = await findProduct(query);
                setResults(r);
            }
        };
        fetch();
    }, [query]);

    return (
        <div>
            <h2>Search Results for: {query}</h2>
            {results && results.length > 0 ? (
                <TopCard item={results[0]} />
            ) : (
                <p>No results found.</p>
            )}
            <ToastContainer />
        </div>
    );
};

export default SearchPage;
