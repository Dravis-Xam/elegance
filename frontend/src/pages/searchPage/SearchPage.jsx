import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ToastContainer from '../../utils/toasts/ToastContainer';
import { useProduct } from '../../modules/ProductContext';
import Listing from '../shop/components/listing/Listing';
import Header from '../homepage/components/header/Header';
import Footer from '../homepage/components/footer/Footer';
import './SearchPage.css';


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
            <Header></Header>
            <div className="search-content">
                <h2>Search Results for: {query}</h2>
                {results && results.length > 0 ? (
                    <Listing products={results}/>
                ) : (
                    <p>No results found.</p>
                )}
            </div>
            <ToastContainer />
            <Footer />
        </div>
    );
};

export default SearchPage;
