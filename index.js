let saveData;
function loadSaveFile() {
    let saveFileReader = new FileReader();
    saveFileReader.onload = (loader => {
        saveData = new Uint8Array(loader.target.result);
        loadMessage.innerText = "Successfully loaded save";
    });
    saveFileReader.readAsArrayBuffer(saveFile.files[0]);
}
submitFile.onclick = loadSaveFile;
