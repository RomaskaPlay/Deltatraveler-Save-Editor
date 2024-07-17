import React, { createRef, useState, useEffect, ChangeEvent } from 'react';
import { createRoot } from 'react-dom/client';
import saveUtils, { Save } from './save';

declare global {
    interface Window {
        loadData: (data: Save) => void;
    }
}

let appRoot = document.createElement("div");
document.body.appendChild(appRoot);
const root = createRoot(appRoot);


function App() {
    let loadFileSelectorRef = createRef<HTMLInputElement>();
    let loadMessageRef = createRef<HTMLSpanElement>();

    function loadWrapper() {
        if (loadFileSelectorRef.current) {
            if (loadMessageRef.current)
                saveUtils.loadSaveFile(loadFileSelectorRef.current, loadMessageRef.current);
            else
                saveUtils.loadSaveFile(loadFileSelectorRef.current);
            console.log(window.save);
        } else
            console.error("loadFileSelector missing");
    }
    function saveWrapper() {
        if (loadMessageRef.current)
            saveUtils.downloadSaveFile(loadMessageRef.current);
        else
            saveUtils.downloadSaveFile();
    }

    function FileUI() {
        return <div>
            <input tabIndex={0} type="file" ref={loadFileSelectorRef} />
            <button tabIndex={0} onClick={loadWrapper}>load</button>
            <button tabIndex={0} onClick={saveWrapper}>save</button><br />
            <span ref={loadMessageRef}>&nbsp;</span>
        </div>
    }

    function EditorUI() {
        const [saveData, setSaveData] = useState<Save>({
            fileName: "Empty",
            version: 2,
            name: "",
            exp: 0,
            items: [],
            players: [
                {
                    weapon: 0,
                    armor: 0
                },
                {
                    weapon: 0,
                    armor: 0
                },
                {
                    weapon: 0,
                    armor: 0
                }
            ],
            susieActive: true,
            noelleActive: false,
            playTime: 0,
            zone: 0,
            gold: 0,
            deaths: 0,
            flags: {
                flags: [],
                types: []
            },
            persistentFlags: {
                flags: [],
                types: []
            }
        });

        useEffect(() => {
            // Automatically load data when the component mounts
            loadData(window.save);
        }, []);

        useEffect(() => {
            window.save = saveData;
        }, [saveData]);

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const { id, value } = e.target;
            if (id === 'version' || id === 'exp' || id === 'playTime' || id === 'zone' || id === 'gold' || id === 'deaths') {
                setSaveData((prevData) => ({
                    ...prevData,
                    [id]: Number(value)
                }));
            } else if (id === "name") {
                setSaveData((prevData) => ({
                    ...prevData,
                    [id]: value
                }));
            }
        };

        let loadData = (data: Save) => {
            setSaveData(data);
        };

        window.loadData = loadData

        return (
            <div className='editorMain'>
                <h1 className='editorFileName'>{saveData.fileName}</h1>
                <details>
                    <summary>Main Stats</summary>
                    <table>
                        <tr>
                            <td><label htmlFor='version'>Version: </label></td>
                            <td><input id='version' type='number' min={0} max={2} value={saveData.version} onChange={handleChange} /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor='name'>Name: </label></td>
                            <td><input id='name' type='text' maxLength={255} value={saveData.name} onChange={handleChange} /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor='exp'>EXP: </label></td>
                            <td><input id='exp' type='number' min={0} max={4294967295} value={saveData.exp} onChange={handleChange} /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor='playTime'>Play time: </label></td>
                            <td><input id='playTime' type='number' min={0} max={4294967295} value={saveData.playTime} onChange={handleChange} /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor='zone'>Zone: </label></td>
                            <td><input id='zone' type='number' min={0} max={65535} value={saveData.zone} onChange={handleChange} /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor='gold'>Gold: </label></td>
                            <td><input id='gold' type='number' min={0} max={4294967295} value={saveData.gold} onChange={handleChange} /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor='deaths'>Deaths: </label></td>
                            <td><input id='deaths' type='number' min={0} max={4294967295} value={saveData.deaths} onChange={handleChange} /></td>
                        </tr>
                    </table>
                </details>
                <details>
                    <summary>Players</summary>
                    <table>
                        <tr>
                            <td aria-label='Player info'></td>
                            <td><label>Player</label></td>
                            <td><label>Susie</label><input aria-label='Susie Enabled' id='susieEnabled' type='checkbox' checked={saveData.susieActive} onChange={handleChange} /></td>
                            <td><label>Noelle</label><input aria-label='Noelle Enabled' id='noelleActive' type='checkbox' checked={saveData.noelleActive} onChange={handleChange} /></td>
                        </tr>
                        <tr>
                            <td><label>Weapon</label></td>
                            <td><input aria-label='Player Weapon' id='player1weapon' type='number' min={0} max={65535} value={saveData.players[0].weapon} onChange={handleChange} /></td>
                            <td><input aria-label='Susie Weapon' id='player2weapon' type='number' min={0} max={65535} value={saveData.players[1].weapon} onChange={handleChange} /></td>
                            <td><input aria-label='Noelle Weapon' id='player3weapon' type='number' min={0} max={65535} value={saveData.players[2].weapon} onChange={handleChange} /></td>
                        </tr>
                        <tr>
                            <td><label>Armor</label></td>
                            <td><input aria-label='Player Armor' id='player1armor' type='number' min={0} max={65535} value={saveData.players[0].armor} onChange={handleChange} /></td>
                            <td><input aria-label='Susie Armor' id='player2armor' type='number' min={0} max={65535} value={saveData.players[1].armor} onChange={handleChange} /></td>
                            <td><input aria-label='Noelle Armor' id='player3armor' type='number' min={0} max={65535} value={saveData.players[2].armor} onChange={handleChange} /></td>
                        </tr>
                    </table>
                </details>
            </div>
        );
    }

    return <>
        <FileUI/>
        <EditorUI/>
    </>
}
root.render(<App />);