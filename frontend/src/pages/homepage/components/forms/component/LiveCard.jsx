import React from 'react';

const LiveCard = ({ item }) => {
  const hasData = item && item.name;
  const stockStatus = item?.amountInStock <= 5 ? 'low' : 'normal';

  return (
    <div className={`live-card ${!hasData ? 'live-card--empty' : ''}`}>
      {hasData ? (
        <>
          <div className="live-card__image-container">
            {item.thumbnail?.length > 0 ? (
              <img 
                src={item.thumbnail[0]} 
                alt={item.name} 
                className="live-card__image" 
              />
            ) : (
              <div className="live-card__image-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
            )}
          </div>
          
          <div className="live-card__content">
            <h3>{item.name}</h3>
            <small>Ksh. {parseFloat(item.price).toLocaleString()}</small>
            
            {item.category && (
              <div className="live-card__meta">
                <span className="live-card__badge live-card__category">
                  {item.category}
                </span>
              </div>
            )}
            
            {item.amountInStock !== undefined && (
              <div className={`live-card__stock ${stockStatus === 'low' ? 'live-card__stock--low' : ''}`}>
                {stockStatus === 'low' ? 'Low stock' : 'In stock'}: {item.amountInStock}
              </div>
            )}
            
            {item.attributes?.length > 0 && (
              <div className="live-card__attributes">
                {item.attributes.map((attr, index) => (
                  <span key={index} className="live-card__attribute">
                    {attr}
                  </span>
                ))}
              </div>
            )}
            
            {item.unitQuantity?.length > 0 && (
              <div className="live-card__units">
                <div className="live-card__units-title">Available Sizes</div>
                <div className="live-card__unit-items">
                  {item.unitQuantity.map((unit, index) => (
                    <span key={index} className="live-card__unit">
                      {unit}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <h3>Product Preview</h3>
          <p>Start filling the form to see a live preview</p>
        </>
      )}
    </div>
  );
};

export default LiveCard;