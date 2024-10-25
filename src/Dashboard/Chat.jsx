import { useState, useEffect } from "react";
import { db, auth } from "../Firebase";
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, doc, setDoc } from "firebase/firestore";
import { FaEye } from "react-icons/fa";

const Chat = ({ themeId, taskId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [activeTab, setActiveTab] = useState("chat");
    const [readers, setReaders] = useState([]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
                logReader(user.email);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (taskId) {
            fetchMessages();
            fetchReaders();
        }
    }, [taskId]);

    const fetchMessages = () => {
        const messagesRef = collection(db, `themes/${themeId}/tasks/${taskId}/messages`);
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setMessages(msgs);
        });
    };

    const fetchReaders = () => {
        const readersRef = collection(db, `themes/${themeId}/tasks/${taskId}/readers`);
        const q = query(readersRef);

        onSnapshot(q, (snapshot) => {
            const rdrs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            // Regrouper les lecteurs par email et compter les occurrences
            const groupedReaders = rdrs.reduce((acc, reader) => {
                if (acc[reader.email]) {
                    acc[reader.email].count += 1;
                } else {
                    acc[reader.email] = { email: reader.email, count: 1, timestamp: reader.timestamp };
                }
                return acc;
            }, {});
            setReaders(Object.values(groupedReaders));
        });
    };

    const logReader = async (email) => {
        const readerRef = doc(db, `themes/${themeId}/tasks/${taskId}/readers`, `${email}-${Timestamp.now().toMillis()}`);
        await setDoc(readerRef, {
            email: email,
            timestamp: Timestamp.now(),
        });
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() && currentUser) {
            const messagesRef = collection(db, `themes/${themeId}/tasks/${taskId}/messages`);
            await addDoc(messagesRef, {
                text: newMessage,
                author: currentUser.email,
                timestamp: Timestamp.now(),
            });

            setNewMessage("");
        }
    };

    const formatTimestamp = (timestamp) => {
        if (timestamp && typeof timestamp.toDate === "function") {
            return timestamp.toDate().toLocaleString();
        }
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className="box" style={{ height: "100%", overflowY: "auto" }}>
            <div className="tabs is-toggle">
                <ul>
                    <li className={activeTab === "chat" ? "is-active" : ""}>
                        <a onClick={() => setActiveTab("chat")}>Chat</a>
                    </li>
                    <li className={activeTab === "readers" ? "is-active" : ""}>
                        <a onClick={() => setActiveTab("readers")}>
                            Lecteurs ({readers.length})
                        </a>
                    </li>
                </ul>
            </div>

            {activeTab === "chat" && (
                <>
                    <h2 className="title is-5">Chat d'équipe</h2>
                    <div className="chat-messages" style={{ height: "calc(85% - 100px)", overflowY: "auto", marginBottom: "10px" }}>
                        {messages.map((msg) => (
                            <div key={msg.id} className="box">
                                <p><strong>{msg.author}</strong>: {msg.text}</p>
                                <p className="has-text-grey" style={{ fontSize: "0.8em" }}>
                                    {formatTimestamp(msg.timestamp)}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="field">
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                placeholder="Écrivez un message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            />
                        </div>
                        <button className="button is-primary mt-2" onClick={handleSendMessage}>Envoyer</button>
                    </div>
                </>
            )}

            {activeTab === "readers" && (
                <>
                    <h2 className="title is-5">Lecteurs de la tâche</h2>
                    <div className="reader-list" style={{ height: "calc(85% - 50px)", overflowY: "auto" }}>
                        {readers.length > 0 ? (
                            readers.map((reader) => (
                                <div key={reader.email} className="box">
                                    <p><strong>{reader.email}</strong></p>
                                    <p className="has-text-grey" style={{ fontSize: "0.8em", display: "flex", alignItems: "center" }}>
                                        <FaEye style={{ marginRight: "5px" }} /> {reader.count} fois
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>Aucun lecteur pour cette tâche.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Chat;
