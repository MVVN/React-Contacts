import "./header.css";

export default function Header({ loggedIn }) {


    return (
        <>
            {loggedIn ? (
                <button className="button logout">Logout</button>
            ) : (
                <button className="button login" >Login</button>
            )}
        </>
    );
}
