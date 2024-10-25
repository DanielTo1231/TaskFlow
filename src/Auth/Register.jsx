import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../Firebase";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (email !== confirmEmail) {
            setError("Les emails ne correspondent pas. Veuillez vérifier.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await sendEmailVerification(user);
            alert("Un email de vérification a été envoyé. Veuillez vérifier votre email avant de vous connecter.");

            const creationDate = new Date().toISOString();

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                creationDate: creationDate,
            });

            window.location.href = "/connexion";
        } catch (err) {
            setError("Erreur lors de l'inscription ou de l'envoi de l'email de vérification : " + err.message);
        }
    };

    return (
        <section className="section">
            <div className="container">
                <div className="box">
                    <h1 className="title is-4">S'inscrire</h1>
                    <form onSubmit={handleRegister}>
                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Entrez votre email"
                                    required
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Confirmez l'Email</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="email"
                                    value={confirmEmail}
                                    onChange={(e) => setConfirmEmail(e.target.value)}
                                    placeholder="Confirmez votre email"
                                    required
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Mot de passe</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Entrez votre mot de passe"
                                    required
                                />
                            </div>
                        </div>
                        {error && <p className="help is-danger">{error}</p>}
                        <div className="field">
                            <div className="control">
                                <button type="submit" className="button is-primary is-fullwidth">S'inscrire</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Register;
