import { PageArea } from "./styled";
import {
  PageContainer,
  PageTitle,
  ErrorMessage,
} from "../../components/MainComponents";
import useApi from "../../helpers/olxAPI";

import { useEffect, useState } from "react";

export const SignUpPage = () => {
  const api = useApi();

  const [name, setName] = useState("");
  const [stateLoc, setStateLoc] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [stateList, setStateList] = useState([]);

  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getStates = async () => {
      const sList = await api.getState();
      setStateList(sList);
    };
    getStates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Senhas diferem");
      return;
    }
    setDisabled(true);

    try {
      const json = await api.register(name, stateLoc, email, password);
      if (json.error) {
        const errorMessage =
          typeof json.error === "object"
            ? Object.values(json.error).join(", ")
            : json.error;
        setError(errorMessage);
      }
    } catch (err) {
      console.log("error: " + err);
    }

    setDisabled(false);
  };

  return (
    <PageContainer>
      <PageTitle>LogOn</PageTitle>
      <PageArea>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <form onSubmit={handleSubmit}>
          <label className="area">
            <div className="area--title">Nome Completo</div>
            <div className="area--input">
              <input
                type="text"
                disabled={disabled}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </label>
          <label className="area">
            <div className="area--title">Estado</div>
            <div className="area--input">
              <select
                type="select"
                value={stateLoc}
                onChange={(e) => {
                  setStateLoc(e.target.value);
                }}
                required
              >
                <option></option>
                {stateList.map((state, index) => {
                  return (
                    <>
                      <option key={index} value={state._id}>
                        {state.name}
                      </option>
                    </>
                  );
                })}
              </select>
            </div>
          </label>
          <label className="area">
            <div className="area--title">E-mail</div>
            <div className="area--input">
              <input
                type="email"
                disabled={disabled}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </label>
          <label className="area">
            <div className="area--title">Senha</div>
            <div className="area--input">
              <input
                type="password"
                disabled={disabled}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </label>
          <label className="area">
            <div className="area--title">Confirmar Senha</div>
            <div className="area--input">
              <input
                type="password"
                disabled={disabled}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </label>
          <label className="area">
            <div className="area--title"></div>
            <div className="area--input">
              <button>Fazer cadastro</button>
            </div>
          </label>
        </form>
      </PageArea>
    </PageContainer>
  );
};
