import "./NumberDetection.css";

export default function NumberDetection({text,num}) {
    return (
        <div className="number-detection-component"> 
            <div className="number-detection-component-number"> 
                {num}
            </div>
            <div className="number-detection-component-text">
                {text}
            </div>

        </div>
    )
}