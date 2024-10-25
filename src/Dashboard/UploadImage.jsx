import { useState, useEffect } from "react";
import { storage, db } from "../Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

const UploadImage = ({ themeId, taskId }) => {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedImages, setUploadedImages] = useState([]);

    useEffect(() => {
        fetchUploadedImages();
    }, []);

    const fetchUploadedImages = async () => {
        try {
            const taskRef = doc(db, `themes/${themeId}/tasks`, taskId);
            const taskSnap = await getDoc(taskRef);
            if (taskSnap.exists()) {
                const taskData = taskSnap.data();
                setUploadedImages(taskData.images || []);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des images :", error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (!file) return;

        const storageRef = ref(storage, `images/${taskId}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Erreur lors de l'upload de l'image :", error);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                await saveImageUrl(downloadURL);
                alert("Image téléchargée avec succès !");
                setUploadProgress(0);
                setFile(null);
                fetchUploadedImages();
            }
        );
    };

    const saveImageUrl = async (url) => {
        try {
            const taskRef = doc(db, `themes/${themeId}/tasks`, taskId);
            await updateDoc(taskRef, {
                images: arrayUnion(url),
            });
        } catch (error) {
            console.error("Erreur lors de la sauvegarde de l'URL de l'image :", error);
        }
    };

    return (
        <div className="box">
            <h2 className="title is-5">Ajouter une image</h2>
            <input type="file" onChange={handleFileChange} />
            {file && (
                <>
                    <progress className="progress is-primary" value={uploadProgress} max="100"></progress>
                    <button className="button is-primary mt-2" onClick={handleUpload}>
                        Télécharger
                    </button>
                </>
            )}
            <hr />
            <div className="uploaded-images">
                <h3 className="title is-6">Images téléchargées</h3>
                <div className="columns is-multiline">
                    {uploadedImages.length > 0 ? (
                        uploadedImages.map((url, index) => (
                            <div key={index} className="column is-one-quarter">
                                <figure className="image is-128x128">
                                    <img src={url} alt={`Uploaded ${index + 1}`} />
                                </figure>
                            </div>
                        ))
                    ) : (
                        <p>Aucune image téléchargée pour le moment.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadImage;
