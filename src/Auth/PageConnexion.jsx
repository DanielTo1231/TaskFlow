import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../Firebase";
import { Link } from "react-router-dom";

const PageConnexion = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [resetPasswordMode, setResetPasswordMode] = useState(false);

    useEffect(() => {
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                window.location.href = "/dashboard";
            })
            .catch((err) => {
                setError("Identifiants incorrects");
                console.error(err);
            });
    };

    const handleGoogleLogin = () => {
        signInWithPopup(auth, googleProvider)
            .then(() => {
                localStorage.setItem("loginTime", new Date().getTime());
                window.location.href = "/dashboard";
            })
            .catch((err) => console.error(err));
    };

    const handleFacebookLogin = () => {
        signInWithPopup(auth, facebookProvider)
            .then(() => {
                localStorage.setItem("loginTime", new Date().getTime());
                window.location.href = "/dashboard";
            })
            .catch((err) => console.error(err));
    };

    const handleResetPassword = () => {
        if (!email) {
            setError("Veuillez entrer votre email avant de réinitialiser votre mot de passe.");
            return;
        }

        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Un email de réinitialisation a été envoyé à votre adresse email.");
                setResetPasswordMode(false);
            })
            .catch((err) => {
                setError("Erreur lors de l'envoi de l'email de réinitialisation.");
                console.error(err);
            });
    };

    return (
        <div className="section">
            <div className="Title">
                <h1 className="title is-1 has-text-centered">Trello Version Daniel To</h1>
            </div>
            <div className="container">
                <div className="box">
                    <h2 className="title is-4">Se Connecter</h2>
                    <form onSubmit={handleLogin}>
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
                        {!resetPasswordMode && (
                            <>
                                <div className="field">
                                    <label className="label">Mot de passe</label>
                                    <div className="control has-icons-right">
                                        <input
                                            className="input"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Entrez votre mot de passe"
                                            required
                                        />
                                        <span
                                            className="icon is-small is-right"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                        </span>
                                    </div>
                                </div>
                                {error && <p className="has-text-danger">{error}</p>}
                                <button className="button is-primary is-fullwidth mb-3">Se connecter</button>
                                <p className="has-text-right">
                                    <button type="button" className="button is-text" onClick={() => setResetPasswordMode(true)}>Mot de passe oublié ?</button>
                                </p>
                            </>
                        )}
                        {resetPasswordMode && (
                            <>
                                <p>Entrez votre email pour réinitialiser votre mot de passe.</p>
                                {error && <p className="has-text-danger">{error}</p>}
                                <button
                                    type="button"
                                    className="button is-primary is-fullwidth mb-3"
                                    onClick={handleResetPassword}
                                >
                                    Envoyer un email de réinitialisation
                                </button>
                                <button
                                    type="button"
                                    className="button is-light is-fullwidth"
                                    onClick={() => setResetPasswordMode(false)}
                                >
                                    Annuler
                                </button>
                            </>
                        )}
                    </form>
                    {!resetPasswordMode && (
                        <>
                            <p className="has-text-centered mt-4">
                                Pas encore inscrit? <Link to="/register">S'inscrire ici</Link>
                            </p>
                            <hr />
                            <div className="buttons is-centered mt-4">
                                <button className="button is-danger" onClick={handleGoogleLogin}>
                                    <i className="fab fa-google mr-2"></i> Login avec Google
                                </button>
                                <button className="button is-link" onClick={handleFacebookLogin}>
                                    <i className="fab fa-facebook mr-2"></i> Login avec Facebook
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PageConnexion;
