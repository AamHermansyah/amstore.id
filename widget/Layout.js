import Navigation from "../components/Navigation";
import FooterStore from "../components/Footer";

export default function Layout({children}){
    return (
        <>
            <Navigation />  
            <div className="pt-32">
                {children}
            </div>
            <FooterStore />
        </>
    )
}