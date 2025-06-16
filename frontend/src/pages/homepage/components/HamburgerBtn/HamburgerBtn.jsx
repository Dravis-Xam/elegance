import './HamburgerBtn.css'
const HamburgerBtn = ({ show }) => {
    return (
        <div className={`hamburger ${show ? 'active' : ''}`}>
            <span></span><span></span><span></span>
        </div>
    );
}

export default HamburgerBtn;
