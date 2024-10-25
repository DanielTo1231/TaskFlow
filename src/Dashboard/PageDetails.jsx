import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { db, auth } from "../Firebase";
import { doc, getDoc, updateDoc, collection, addDoc, deleteDoc } from "firebase/firestore";
import Chat from "./Chat";
import UploadImage from "./UploadImage";

const PageDetails = () => {
    const { taskId } = useParams();
    const { state } = useLocation();
    const { themeId } = state;
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [description, setDescription] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
                registerReader(user.email);
            }
        });
        fetchTaskDetails();
        return () => unsubscribe();
    }, [taskId]);

    const registerReader = async (email) => {
        try {
            const readersRef = collection(db, `themes/${themeId}/tasks/${taskId}/readers`);
            await addDoc(readersRef, {
                email: email,
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            console.error("Erreur lors de l'enregistrement du lecteur :", error);
        }
    };

    const fetchTaskDetails = async () => {
        try {
            const taskRef = doc(db, `themes/${themeId}/tasks`, taskId);
            const taskSnap = await getDoc(taskRef);

            if (taskSnap.exists()) {
                const taskData = taskSnap.data();
                setTask({ id: taskId, ...taskData });
                setDescription(taskData.description || "");
            } else {
                alert("Tâche non trouvée");
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des détails de la tâche :", error);
        }
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSave = async () => {
        try {
            const taskRef = doc(db, `themes/${themeId}/tasks`, taskId);
            await updateDoc(taskRef, {
                description: description,
            });
            alert("Description mise à jour !");
            setIsEditing(false);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la description :", error);
            alert("Échec de la mise à jour de la description.");
        }
    };

    const handleDelete = async () => {
        try {
            const taskRef = doc(db, `themes/${themeId}/tasks`, taskId);
            await deleteDoc(taskRef);
            alert("Tâche supprimée avec succès !");
            navigate("/dashboard");
        } catch (error) {
            console.error("Erreur lors de la suppression de la tâche :", error);
            alert("Échec de la suppression de la tâche.");
        }
    };

    const handleBack = () => {
        navigate("/dashboard");
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleCancel = () => {
        setIsEditing(false);
        fetchTaskDetails();
    };

    if (!task) return <div>Chargement...</div>;

    return (
        <div className="columns" style={{ height: "100vh" }}>
            <div className="column" style={{ width: "55%", overflowY: "auto" }}>
                <div className="box">
                    <h1 className="title">{task.name}</h1>
                    <div className="field">
                        <label className="label">Description</label>
                        <div className="control">
                            <textarea
                                className="textarea"
                                value={description}
                                onChange={handleDescriptionChange}
                                placeholder="Entrez une description pour cette tâche"
                                readOnly={!isEditing}
                            ></textarea>
                        </div>
                    </div>
                    <div className="buttons mt-3">
                        {!isEditing ? (
                            <button className="button is-info" onClick={handleEditToggle}>Modifier</button>
                        ) : (
                            <>
                                <button className="button is-primary" onClick={handleSave}>Enregistrer</button>
                                <button className="button is-light" onClick={handleCancel}>Annuler</button>
                            </>
                        )}
                        <button className="button is-danger" onClick={handleDelete}>Supprimer la tâche</button>
                        <button className="button is-light" onClick={handleBack}>Retour au Dashboard</button>
                    </div>
                </div>
                <UploadImage themeId={themeId} taskId={taskId} />
            </div>
            <div className="column" style={{ width: "35%", overflowY: "auto", height: "100vh" }}>
                <Chat themeId={themeId} taskId={taskId} />
            </div>
        </div>
    );
};

export default PageDetails;
