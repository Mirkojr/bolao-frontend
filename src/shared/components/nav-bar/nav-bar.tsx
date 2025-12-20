

function NavBar() {
    const navStyle = {
        backgroundColor: '#999',
        width: '100%',
        padding: '1rem',

        fontWeight: 'bold',
        fontFamily: 'Poppins, sans-serif',
    };
    return (
    <nav style={navStyle}>
        <ul className="">
            <li className="inline mr-6"><a href="/">Home</a></li>
        </ul>
    </nav>
    )
}

export default NavBar;