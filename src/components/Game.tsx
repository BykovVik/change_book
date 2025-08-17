import { useState, useRef } from "react";
import data from "../data/data.json";
import { useNavigate } from "react-router-dom";
import OrientationDetector from "./OrientationDirect"

export type ResultData = {
    [key: string]: string; 
};

function Game() {
    const [lines, setLines] = useState<string[]>(Array(6).fill('white')); 
    const [currentResults, setCurrentResults] = useState<string[]>(['coin_p', 'coin_p', 'coin_p']); 
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [isGameFinished, setIsGameFinished] = useState<boolean>(false); 
    const [resultMessage, setResultMessage] = useState<string | null>(null); 
    const navigate = useNavigate()
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
        window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
    );
    
    const handleOrientationChange = (newOrientation: 'portrait' | 'landscape') => {
        setOrientation(newOrientation);
    };

    const throwCoins = () => {
        if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(error => {
                    console.log("Ошибка воспроизведения звука: 2 ", error);
            });
        }
        setIsAnimating(true);
        setCurrentResults(['coin_p', 'coin_p', 'coin_p']); 

        setTimeout(() => {

            const results = Array.from({ length: 3 }, () => Math.random() < 0.5 ? 'coin_o' : 'coin_p');
            const headsCount = results.filter(result => result === 'coin_o').length;
            const tailsCount = results.filter(result => result === 'coin_p').length;

            setCurrentResults(results);

            const newLineType = tailsCount > headsCount ? 'solid' : 'dashed';
            
            setLines(prevLines => {
                const updatedLines = [...prevLines];
                const lastWhiteIndex = updatedLines.lastIndexOf('white'); 
                if (lastWhiteIndex !== -1) {
                    updatedLines[lastWhiteIndex] = newLineType; 
                }
                
                if (updatedLines.every(line => line !== 'white')) {
                    setIsGameFinished(true);
                    const resultKey = updatedLines.join(", ");
                    const result = (data as ResultData)[resultKey] || "Результат не найден."; 
                    setResultMessage(result);
                }
                return updatedLines;
            });

            setIsAnimating(false); 
        }, 1000); 
    };
    
    const getStart = () => {
        navigate("/")
    }

    const getResult = () => {
        if (window.Telegram?.WebApp) {
            if (resultMessage) {
                window.Telegram.WebApp.sendData(resultMessage);
                window.Telegram.WebApp.close()
            }
        } else {
            console.log("Telegram Web App SDK не доступен");
            navigate("/")
        }
    };

    return (
        <>
        <OrientationDetector onOrientationChange={handleOrientationChange} />
        <audio ref={audioRef}>
            <source src="./audio/moneta.mp3" type="audio/mpeg" />
            Ваш браузер не поддерживает аудио.
        </audio>
        {orientation === 'landscape'&&
            <div className="landscapeDisplay">
                <h3>Приложение работает исключительно в портретном режиме</h3>
            </div>
        }
        {orientation === 'portrait'&&
        <div className="game-container">
            <div className="lines-container block-margin-bottom">
                {lines.map((lineType, index) => (
                    <img key={index} src={`./assets/${lineType}.png`} alt="Линия" className="line" />
                ))}
            </div>
            {!isGameFinished ? (
            <div className="coin-container block-margin-bottom">
                {isAnimating ? (
                    <>
                        <img src="./assets/coin_p.png" alt="Монета" className="coin animate" />
                        <img src="./assets/coin_p.png" alt="Монета" className="coin animate" />
                        <img src="./assets/coin_p.png" alt="Монета" className="coin animate" />
                    </>
                ) : (
                    currentResults.map((result, index) => (
                        <img key={index} src={`./assets/${result}.png`} alt="Монета" className="coin" />
                    ))
                )}
            </div>
            ) : (
                <div><p className="result">{resultMessage}</p></div> // Отображаем результат
            )}
            {isGameFinished ? (
                <>
                    <button className="save" onClick={getResult}>СОХРАНИТЬ</button>
                    <button onClick={getStart}>ЗАНОВО</button>
                </>
            ) : (
                <>
                {isAnimating ? (
                    <button className="deactivate">БРОСИТЬ МОНЕТЫ</button>
                ) : (
                    <button onClick={throwCoins}>БРОСИТЬ МОНЕТЫ</button>
                )}
                </>
            )}
        </div>
        }
        </>
    );
}

export default Game;