
const TCard = (testimonial, f) => {
    if (!testimonial) return;
    return (
        <div className="testimonial-card">
            <p>"This is a fantastic service! Highly recommend to everyone."</p>
            <h4>- John Doe</h4>
        </div>
    );
}

export default TCard;
