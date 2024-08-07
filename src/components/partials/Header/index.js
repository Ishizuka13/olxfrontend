import { Link, useLocation } from "react-router-dom";
import { HeaderArea } from "./styled";
import LogoOlx from "../../../assets/images/olx-logo.png";

import { doLogout, isLogged } from "../../../helpers/AuthHandler.js";
import { useState } from "react";

export const Header = () => {
  const locate = useLocation();

  let logged = isLogged();

  const handleLogout = () => {
    doLogout();
    window.location.href = "/";
  };

  return (
    <HeaderArea>
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src={LogoOlx} height="50px" alt="" />
          </Link>
        </div>
        <nav>
          <ul>
            {logged && (
              <>
                <li>
                  <Link to="/my-account">Minha conta</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Sair</button>
                </li>
                {locate.pathname !== "/post-an-ad" && (
                  <li>
                    <Link to="/post-an-ad" className="button">
                      Poste um anúncio
                    </Link>
                  </li>
                )}
              </>
            )}
            {!logged && (
              <>
                <li>
                  <Link to="/signin">Login</Link>
                </li>
                <li>
                  <Link to="/signup">Cadastrar</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </HeaderArea>
  );
};
