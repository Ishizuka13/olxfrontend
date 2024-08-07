import { PageArea, SearchArea } from "./styled";
import { PageContainer } from "../../components/MainComponents";
import useApi from "../../helpers/olxAPI";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { click } from "@testing-library/user-event/dist/click";
import { AdItem } from "../../components/partials/AdItem";

export const HomePage = () => {
  const api = useApi();

  const [stateList, setStateList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [adList, setAdList] = useState([]);

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

  useEffect(() => {
    const getRecentAds = async () => {
      const json = await api.getAds({
        sort: "desc",
        limit: 8,
      });
      console.log(json.ads);
      setAdList(json.ads);
    };
    getRecentAds();
  }, []);

  return (
    <>
      <SearchArea>
        <PageContainer>
          <div className="searchBox">
            <form method="GET" action="/ads">
              <input type="text" name="q" placeholder="O que você procura?" />
              <select name="state">
                {stateList.map((e, i) => (
                  <option key={i} value={e.name}>
                    {e.name}
                  </option>
                ))}
              </select>
              <button>Pesquisar</button>
            </form>
          </div>
          <div className="categoryList">
            {categories.map((e, i) => (
              <Link key={i} to={`/ads?cat=${e.slug}`} className="categoryItem">
                <img src={e.img} alt="" />
                <span>{e.name}</span>
              </Link>
            ))}
          </div>
        </PageContainer>
      </SearchArea>
      <PageContainer>
        <PageArea>
          <h2>Anúncios Recentes</h2>
          <div className="list">
            {adList.map((e, i) => (
              <AdItem key={i} data={e} />
            ))}
          </div>
          <Link to="/ads" className="seeAllLink">
            Ver todos
          </Link>
          <hr />
          Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
          consectetur, adipisci velit
        </PageArea>
      </PageContainer>
    </>
  );
};
