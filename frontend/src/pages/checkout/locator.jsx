const LocationPicker = ({handleAllow, handleDeny, manualAddress, setManualAddress, requestLocation, seeLoc}) => {
  return (
    <div className="location-wrapper">
      <h2>Select Your Location</h2>

      {!seeLoc && (
        <p className="see-loc-p"> 
          Detect your location: <br />
          <button className="btn-secondary" onClick={handleAllow}>Allow</button>
          <button className="btn-outline" onClick={handleDeny}>Deny</button>
        </p>
      )}

      {seeLoc && (
        <>
          {location ? (
            <p>Got it! Complete purchase</p>
          ) : (
            <>
              <button className="btn-secondary" onClick={requestLocation}>Try Again</button>
              {error && (
                <div>
                  <p style={{ color: 'red' }}>{error}</p>
                  <input
                    type="text"
                    placeholder="Enter your address manually"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                  />
                  {manualAddress && <p>📍 Address: {manualAddress}</p>}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default LocationPicker;
