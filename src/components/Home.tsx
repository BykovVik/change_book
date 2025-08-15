import { useNavigate } from "react-router-dom"
import { useState } from "react"
import OrientationDetector from "./OrientationDirect"

function Home() {

    const navigate = useNavigate()

    const startGame = () => {
        navigate("/game")
    }

    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
        window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
    );
    
    const handleOrientationChange = (newOrientation: 'portrait' | 'landscape') => {
        setOrientation(newOrientation);
    };

    return(
        <>
        <OrientationDetector onOrientationChange={handleOrientationChange} />
        {orientation === 'landscape'&&
            <div className="landscapeDisplay">
                <h3>Приложение работает исключительно в портретном режиме</h3>
            </div>
        }
        {orientation === 'portrait'&&
        <div>
            <img src="./assets/injan.png" className="logo"/>
            <h1>Книга перемен</h1>
            <p>Откройте мудрость древности. <br/>Задайте вопрос и получите совет И Цзин</p>
            <button onClick={startGame}>НАЧАТЬ ГАДАНИЕ</button>
        </div>
        }
        </>
    )
}
 export default Home