import { PageArea } from "./styled";
import {
  PageContainer,
  PageTitle,
  ErrorMessage,
} from "../../components/MainComponents";
import styled from "styled-components";
import MaskedInput from "react-text-mask";
import { createNumberMask } from "text-mask-addons";
import { useEffect, useRef, useState } from "react";
import useApi from "../../helpers/olxAPI";
import { useNavigate } from "react-router-dom";

const FormStyled = styled.form`
  background-color: #fff;
  border-radius: 3px;
  padding: 10px;
  box-shadow: 0px 0px 3px #999;
  .area {
    display: flex;
    align-items: center;
    padding: 10px;
    max-width: 500px;
    .area--title {
      width: 200px;
      text-align: right;
      justify-content: center;
      padding-right: 20px;
      font-size: 14px;
      font-weight: bold;
    }
    .area--input {
      flex: 1;
      input,
      textarea,
      select {
        width: 100%;
        font-size: 14px;
        padding: 5px;
        border: 1px solid #ddd;
        border-radius: 3px;
        outline: 0;
        transition: all ease 0.4s;
        &:focus {
          border: 1px solid #333;
          color: #333;
        }
      }
      textarea {
        height: 150px;
        resize: none;
      }
    }
  }
  button {
    background-color: #0089ff;
    border: 0;
    outline: 0;
    padding: 5px 10px;
    border-radius: 4px;
    color: #fff;
    font-size: 15px;
    cursor: pointer;
  }
`;

export const AddAdPage = () => {
  const api = useApi();
  const navigate = useNavigate();
  const fileField = useRef();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [price, setPrice] = useState("");
  const [priceNegotiable, setPriceNegotiable] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getCategories = async () => {
      const cats = await api.getCategorie();
      setCategories(cats);
    };
    getCategories();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setDisabled(true);
    setError("");
    let errors = [];
    if (!title.trim()) {
      errors.push("Sem título");
    }
    if (!category) {
      errors.push("Sem categoria");
    }
    if (errors.length === 0) {
      const fData = new FormData();

      fData.append("title", title);
      fData.append("desc", desc);
      fData.append("cat", category);
      fData.append("price", price);
      fData.append("priceneg", priceNegotiable);

      if (fileField.current.files.length > 0) {
        for (let i = 0; i < fileField.current.files.length; i++) {
          fData.append("img", fileField.current.files[i]);
          console.log({ image: fileField.current.files[i] });
        }
      }

      const json = await api.addAd(fData);
      if (!json.error) {
        console.log(json);
        // navigate(`/ad/${json.id}`);

        return;
      } else {
        console.log(json);
        setError(json.error);
      }
    } else {
      setError(error.json("\n"));
    }
    setDisabled(false);
  }

  const priceMask = createNumberMask({
    prefix: "R$ ",
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ".",
    allowDecimal: true,
    decimalSymbol: ",",
  });

  return (
    <PageContainer>
      <PageTitle>Cadastre um anúncio</PageTitle>
      <PageArea>
        <FormStyled onSubmit={handleSubmit}>
          {error && <div>{error}</div>}
          <label className="area" htmlFor="">
            <div className="area--title">Titulo</div>
            <div className="area--input">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={disabled}
                required
              />
            </div>
          </label>

          <label className="area" htmlFor="">
            <div className="area--title">Categoria</div>
            <div className="area--input">
              <select
                type="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={disabled}
                required
              >
                <option></option>
                {categories.map((item, index) => {
                  return (
                    <>
                      <option key={index} value={item._id}>
                        {item.name}
                      </option>
                    </>
                  );
                })}
              </select>
            </div>
          </label>
          <label className="area" htmlFor="">
            <div className="area--title">Descrição</div>
            <div className="area--input">
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                disabled={disabled}
                //required
              />
            </div>
          </label>
          <label className="area" htmlFor="">
            <div className="area--title">Images(1 ou mais)</div>
            <div className="area--input">
              <input
                type="file"
                ref={fileField}
                multiple
                disabled={disabled}
                //required
              />
            </div>
          </label>

          <label className="area" htmlFor="">
            <div className="area--title">Preço</div>
            <div className="area--input">
              <MaskedInput
                mask={priceMask}
                placeholder="R$ "
                disabled={disabled || priceNegotiable}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </label>
          <label className="area" htmlFor="">
            <div className="area--title">Preço Negociável</div>
            <div className="area--input" style={{ paddingRight: "260px" }}>
              <input
                type="checkbox"
                checked={priceNegotiable}
                onChange={() => setPriceNegotiable(!priceNegotiable)}
                disabled={disabled}
              />
            </div>
          </label>
          <label className="area" htmlFor="">
            <div className="area--title"></div>
            <div className="area--input">
              <button disabled={disabled}>Adicionar Anúncio</button>
            </div>
          </label>
        </FormStyled>
      </PageArea>
    </PageContainer>
  );
};
