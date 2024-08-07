import { PageArea, SearchArea } from "./styled";
import { PageContainer } from "../../components/MainComponents";
import useApi from "../../helpers/olxAPI";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { click } from "@testing-library/user-event/dist/click";
import { AdItem } from "../../components/partials/AdItem";
import QueryString from "qs";

let timer;
export const AdsPage = () => {
  const api = useApi();
  const navigate = useNavigate();

  const useQueryString = () => {
    return new URLSearchParams(navigate.search);
  };

  const query = useQueryString();

  const [q, setQ] = useState(query.get("q") != null ? query.get("q") : "");
  const [cat, setCat] = useState(
    query.get("cat") != null ? query.get("cat") : ""
  );
  const [state, setState] = useState(
    query.get("state") != null ? query.get("state") : ""
  );

  const [adsTotal, setAdsTotal] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentState, setCurrentState] = useState(1);

  const [stateList, setStateList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [adList, setAdList] = useState([]);

  const [resultOpacity, setResultOpacity] = useState(1);
  const [loading, setLoading] = useState(true);

  const getAdsList = async () => {
    setLoading(true);
    let offset = (currentState - 1) * 2;
    const json = await api.getAds({
      sort: "desc",
      limit: 3,
      q,
      cat,
      state,
      offset,
    });
    setAdList(json.ads);
    console.log(json);
    setAdsTotal(json.total);
    setResultOpacity(1);
    setLoading(false);
  };

  useEffect(() => {
    if (adList.length > 0) {
      setPageCount(Math.ceil(adsTotal / adList.length));
    } else {
      setPageCount(0);
    }
  }, [adsTotal]);

  useEffect(() => {
    setResultOpacity(0.3);
    getAdsList();
  }, [currentState]);

  useEffect(() => {
    let queryString = [];
    if (q) {
      queryString.push(`q=${q}`);
    }
    if (cat) {
      queryString.push(`cat=${cat}`);
    }
    if (state) {
      queryString.push(`state=${state}`);
    }
    navigate(`?${queryString.join("&")}`, { replace: true });

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(getAdsList, 2000);
    setResultOpacity(0.3);
    setCurrentState(1);
  }, [q, cat, state]);

  useEffect(() => {
    const getStates = async () => {
      const sList = await api.getState();
      setStateList(sList);
    };
    getStates();
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      const cList = await api.getCategorie();
      setCategories(cList);
    };
    getCategories();
  }, []);

  let pagination = [];

  for (let i = 1; i <= pageCount; i++) {
    pagination.push(i);
  }

  return (
    <PageContainer>
      <PageArea>
        <div className="leftSide">
          <form method="GET">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              name="q"
              placeholder="O que você procura?"
            />
            <div className="filterName">Estado:</div>
            <select
              name="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option></option>
              {stateList.map((e, i) => (
                <option key={i} value={e.name}>
                  {e.name}
                </option>
              ))}
            </select>
            <div className="filterName">Categoria:</div>
            <ul>
              {categories.map((e, i) => (
                <li
                  key={i}
                  onClick={() => setCat(e.slug)}
                  className={
                    cat === e.slug ? "categoryItem active" : "categoryItem"
                  }
                >
                  <img src={e.img} alt="" />
                  <span>{e.name}</span>
                </li>
              ))}
            </ul>
          </form>
        </div>
        <div className="rightSide">
          <h2>Resultados</h2>
          {loading && adList.length === 0 && (
            <div className="listWarning">Carregando...</div>
          )}
          {!loading && adList.length === 0 && (
            <div className="listWarning">Não encontramos resultados.</div>
          )}
          <div className="list" style={{ opacity: resultOpacity }}>
            {adList.map((e, i) => (
              <AdItem key={i} data={e} />
            ))}
          </div>

          <div className="pagination">
            {pagination.map((e, i) => (
              <div
                key={i}
                onClick={() => {
                  console.log(e);
                  setCurrentState(e);
                }}
                className={e === currentState ? "pageItem active" : "pageItem"}
              >
                {e}
              </div>
            ))}
          </div>
        </div>
      </PageArea>
    </PageContainer>
  );
};
