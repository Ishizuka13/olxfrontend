import { PageArea } from "./styled";
import {
  PageContainer,
  PageTitle,
  ErrorMessage,
} from "../../components/MainComponents";
import useApi from "../../helpers/olxAPI";

import { useEffect, useState } from "react";
import { AdItem } from "../../components/partials/AdItem";
import { useNavigate } from "react-router-dom";

export const MyAccountPage = () => {
  const api = useApi();

  const [name, setName] = useState("");
  const [stateLoc, setStateLoc] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adList, setAdList] = useState([]);

  const [stateList, setStateList] = useState([]);

  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const sList = await api.getState();
      const uList = await api.getuser();
      const userState = sList.find((e) => e._id === uList.state);
      setName(uList.name);
      setEmail(uList.email);
      setStateLoc(userState.name);
      setAdList(uList.ads);
      setStateList(sList);
    };
    getUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Senhas diferem");
      return;
    }
    setDisabled(true);

    const stateId = stateList.find((e) => e.name === stateLoc);
    console.log(stateId);

    try {
      const json = await api.editUser(name, stateId, email, password);
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

  const deleteAd = async (id) => {
    const json = await api.deleteAd(id);
    if (json.error) {
      setError(json.error);
    }
  };

  const editAd = async (id) => {
    console.log();
    navigate(`/ad/edit/${id}`, { id: { key: id } });
  };

  return (
    <PageContainer>
      <PageTitle>Sua conta</PageTitle>
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
              />
            </div>
          </label>
          <label className="area">
            <div className="area--title">Estado</div>
            <div className="area--input">
              <select
                value={stateLoc}
                onChange={(e) => {
                  setStateLoc(e.target.value);
                }}
              >
                <option></option>
                {stateList.map((state, index) => {
                  return (
                    <>
                      <option key={index}>{state.name}</option>
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
              />
            </div>
          </label>
          <label className="area">
            <div className="area--title"></div>
            <div className="area--input">
              <button>Salvar</button>
            </div>
          </label>
        </form>
      </PageArea>
      <PageArea>
        <h2>Anúncios Recentes</h2>
        <div className="list">
          {adList.map((e, i) => {
            const image = `http://localhost:5000/media/${e.images[0].url}`;
            return (
              <AdItem
                key={i}
                data={e}
                image={image}
                editAction={() => editAd(e._id)}
                deleteAction={() => deleteAd(e._id)}
              />
            );
          })}
        </div>
      </PageArea>
    </PageContainer>
  );
};
