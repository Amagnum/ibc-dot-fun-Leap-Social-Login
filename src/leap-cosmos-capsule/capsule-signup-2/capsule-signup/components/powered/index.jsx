import Image from "next/image";
import LeapSVG from '../Icon/Leap.svg';
import CapsuleSVG from '../Icon/Capsule.svg';

const PoweredBy = () => {
    return <div 
    style={{
        color: "#D6D6D6",
        fontSize: '16px',
        fontWeight: 500,
        lineHeight: '16px',
        display: 'flex'
    }} > Powered by 
    <Image 
        style={{
            marginLeft: '10px',
            marginBottom: '10px',
            marginRight: '10px'
        }} 
        alt="capsule" 
        src={CapsuleSVG} 
    /> 
        <div> X </div> 
        <Image 
            style={{
                marginLeft: '10px',
                marginBottom: '5px'
            }} 
            alt="leap" 
            src={LeapSVG} 
        /> 
    </div>
}

export default PoweredBy;