import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../Firebase";
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Dashboard = () => {
    const [themes, setThemes] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [search, setSearch] = useState("");
    const [newTheme, setNewTheme] = useState("");
    const [newTask, setNewTask] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchThemes();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });
    }, []);

    const fetchThemes = async () => {
        const querySnapshot = await getDocs(collection(db, "themes"));
        const themesList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setThemes(themesList);
    };

    const fetchTasks = async (themeId) => {
        const querySnapshot = await getDocs(collection(db, `themes/${themeId}/tasks`));
        const tasksList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTasks(tasksList);
    };

    const handleAddTheme = async () => {
        if (newTheme.trim()) {
            const themeRef = await addDoc(collection(db, "themes"), {
                name: newTheme,
            });
            setThemes([...themes, { id: themeRef.id, name: newTheme }]);
            setNewTheme("");
        }
    };

    const handleAddTask = async (status) => {
        if (selectedTheme && newTask.trim() && currentUser) {
            const themeRef = doc(db, "themes", selectedTheme.id);
            const createdAt = new Date().toISOString();

            const taskRef = await addDoc(collection(themeRef, "tasks"), {
                name: newTask,
                status: status,
                createdBy: currentUser.email,
                createdAt: createdAt,
                description: "", // Default empty description
            });

            await updateDoc(taskRef, { uid: taskRef.id });

            setTasks([...tasks, { id: taskRef.id, name: newTask, status, createdBy: currentUser.email, createdAt, description: "" }]);
            setNewTask("");
        }
    };

    const handleThemeClick = (theme) => {
        setSelectedTheme(theme);
        fetchTasks(theme.id);
    };

    const handleTaskClick = (taskId) => {
        navigate(`/task/${taskId}`, { state: { themeId: selectedTheme.id } });
    };

    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                navigate("/");
            })
            .catch((error) => {
                console.error("Erreur lors de la déconnexion : ", error);
            });
    };

    return (
        <div className="columns" style={{ height: "100vh" }}>
            <aside className="column is-2" style={{borderRight: "1px solid #ddd", height: "100%", overflowY: "auto"}}>
                <div className="box">
                    <h2 className="title is-5">Équipes</h2>
                    <ul>
                        {themes.map((theme) => (
                            <li key={theme.id} style={{marginBottom: "10px"}}>
                                <button className="button is-link is-light is-fullwidth"
                                    onClick={() => handleThemeClick(theme)}>
                                    {theme.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <hr/>
                    <input
                        className="input mb-2"
                        type="text"
                        placeholder="Nouveau thème"
                        value={newTheme}
                        onChange={(e) => setNewTheme(e.target.value)}
                    />
                    <button className="button is-primary is-small" onClick={handleAddTheme}>+ Ajouter</button>
                </div>
                <div>
                    <button className="button is-danger is-fullwidth mt-4" onClick={handleLogout}>
                        Déconnexion
                    </button>
                </div>
            </aside>

            <div className="column" style={{height: "100%", overflowY: "auto"}}>
                <div className="box">
                    <div className="columns is-vcentered">
                        <div className="column">
                            <input
                                className="input"
                                type="text"
                                placeholder="Rechercher une tâche"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="column is-narrow">
                            <input
                                className="input"
                                type="text"
                                placeholder="Nouvelle tâche"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                            />
                        </div>
                        <div className="column is-narrow">
                            <button className="button is-primary" onClick={() => handleAddTask("à faire")}>
                                Ajouter
                            </button>
                        </div>
                    </div>
                    <hr />
                    <div>
                        <h2 className="title is-5">Tâches</h2>
                        {tasks
                            .filter((task) => task.status === "à faire" && task.name.toLowerCase().includes(search.toLowerCase()))
                            .map((task) => (
                                <div key={task.id} className="box" onClick={() => handleTaskClick(task.id)} style={{ cursor: "pointer" }}>
                                    <p><strong>Nom:</strong> {task.name}</p>
                                    <p><strong>Créé par:</strong> {task.createdBy}</p>
                                    <p><strong>Date de création:</strong> {new Date(task.createdAt).toLocaleString()}</p>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
