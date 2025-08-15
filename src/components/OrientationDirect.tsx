import React, {useEffect} from "react";

interface OrientationDetectorProps {
    onOrientationChange: (orientation: 'portrait' | 'landscape') => void;
}

const OrientationDetector: React.FC<OrientationDetectorProps> = ({onOrientationChange}) => {
    
    useEffect(() => {
        const handleResize = () => {
            const newOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
            onOrientationChange(newOrientation);
        }

        window.addEventListener('resize', handleResize)
        return () => {window.removeEventListener('resize', handleResize)}
        
    }, [onOrientationChange])

    return null;
}

export default OrientationDetector