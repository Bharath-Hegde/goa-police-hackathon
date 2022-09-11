import "./CyberAwareness.css";
import { Timeline } from 'react-twitter-widgets'
export default function CyberAwareness(){
    return (
        <div className="cyberawareness">
            <div className="twitter-embed">
                
            <UrlBasic />
            </div>
            
            <ContactDetails />
        </div>
    )
}

export const UrlBasic = () => (
    <Timeline
      dataSource={{ sourceType: "url", url: "https://twitter.com/Goapolice1091" }}
    />
  );

export const ContactDetails = () => {
    return (
        <div className="contact-details">
            Contact No: 0832-2313101 
            <br />
            Mobile No: 7875756036
            <br/>
            Email: piponda@goapolice.gov.in
            <br />
            <a src="https://citizen.goapolice.gov.in/web/guest/ponda-police-station" href="abc" > Go to website</a>
        </div>
    )
}