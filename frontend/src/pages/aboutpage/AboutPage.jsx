import MoveToTop from "../homepage/components/movetotop/MoveToTop";
import SocialLinks from "../homepage/components/links/SocialLinks/SocialLink";
import Header from "../homepage/components/header/Header";
import './AboutPage.css';

export default function AboutPage() {
    document.title = "About Us  |  DAOGROW";
    return <section>
        <Header />
        <div className="aboutUsSection">
            <div>
                <small>Who are we?</small>
                <h1 className="titles">Beauty Spa</h1>
                <p>The fastest growing dealer of beauty products.</p>
            </div>
            <div>
                <small>What do we do?</small>
                <h1 className="titles">We Sell Beauty Products</h1>
                <p> - of all types at affordable prices.</p>
            </div>
            <div>
                <small>How do we do it?</small>
                <h1 className="titles">We ensure Quality and Reliable Service.</h1>
                <p>By making sure our clients get Quality devices in Quality time.</p>
            </div>
            <div>
                <small>How to reach us?</small>
                <h1 className="titles">Call us on:</h1>
                <p>0700009555</p>
                <p>0700003555</p>
                <p>Bbeautyspa@gmail.com</p>
            </div>
            <div>
                <small>Where to find us?</small>
                <h1 className="titles">We are at:</h1>
                <p>Harambee, Unit 3, Shop A2</p>
            </div>
            <div>
                <small>For comments, support or queries </small>
                <h1 className="titles">Reach us at:</h1>
                <SocialLinks />
            </div>
        </div>
        <div className="valuesContainer">
            <h1>Our Values</h1>
            <p>
                <span>
                <strong>Excellence</strong><br />
                <small>Provide quality and realiable service.</small><br /><br /></span><span>
                <strong>Time sensitive</strong><br />
                <small>Ensure we deliver on time</small></span><br /><br /><span>
                <strong>Motivated</strong><br /><small>We are highly motivated to serve you.</small></span>
            </p>
        </div>
        <MoveToTop />
    </section>
}