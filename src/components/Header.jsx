import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.style.css';

function Header() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [userIcon, setUserIcon] = useState(null);

  useEffect(() => {
    try {
      const userFromStorage = JSON.parse(sessionStorage.getItem('usuarioLogado'));

      if (userFromStorage) {
        setUsuarioLogado(userFromStorage);
        setUserIcon(userFromStorage.foto);
      }
    } catch (error) {
      console.log('no login');
    }
  }, []);

  const logout =()=>{
    sessionStorage.removeItem("usuarioLogado");
    console.log("saindo")
    window.location="/login"
  }

  return (
    <>
      <header className="navbar">
        <Link to="/">
          <img src="\assets\SANA.png" alt="" className="brand" />
        </Link>

        
        {usuarioLogado ? (
          <div style={{ display: 'flex' , alignItems:'center' }}>
            <p className='texto-laranjaEscuro'>Bem vindo {usuarioLogado.nome}</p>
            <div className="sec-center">
              <input className="dropdown" type="checkbox" id="dropdown" name="dropdown" />
              <label className="for-dropdown" htmlFor="dropdown">
                <img src={`/assets/${userIcon}`} className="icon" alt="" />
                <i className="uil uil-arrow-down"></i>
              </label>
              <div className="section-dropdown">
                <a href="#"><Link to="/perfil">Perfil</Link> </a>
                <a href='#' onClick={logout}>Log Out</a>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <Link to="/login">Login</Link>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
