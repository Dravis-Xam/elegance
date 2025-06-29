const ReviewOption = ({ item, onclick, isSelected }) => {
    return (
        <div 
            className={`review-option ${isSelected ? 'selected' : ''}`} 
            onClick={() => onclick(item)}
        >
            <span>{item.name}</span>
        </div>
    );
};

export default ReviewOption;
