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
import { useNavigate, useParams } from "react-router-dom";

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

export const AdEditPage = () => {
  const api = useApi();
  const navigate = useNavigate();
  const fileField = useRef();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [price, setPrice] = useState("");
  const [priceNegotiable, setPriceNegotiable] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const getAd = async (id) => {
      const ad = await api.getAd(id, true);
      console.log(ad.category);

      console.log(ad.category.name);
      setTitle(ad.title);
      setDesc(ad.description);
      setCategory(ad.category.name);
      setPrice(ad.price);
      setPriceNegotiable(ad.priceNegotiable);
    };
    getAd(id);
  }, [id]);

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
      // let fData = {};

      // if (title) {
      //   fData.title = title;
      // }
      // if (desc) {
      //   fData.desc = desc;
      // }
      // if (category) {
      //   let categoryId = categories.find((e) => e._id === category);
      //   let categoryN = categories.find((e) => e.name === category);

      //   if (categoryN !== undefined) {
      //     fData.cat = categoryN.slug;
      //   }
      //   if (categoryId !== undefined) {
      //     fData.cat = categoryId.slug;
      //   }
      // }
      // if (price) {
      //   fData.price = price;
      // }
      // if (priceNegotiable) {
      //   fData.priceneg = priceNegotiable;
      // }
      // let imData = new FormData();
      // if (fileField.current.files.length > 0) {
      //   for (let i = 0; i < fileField.current.files.length; i++) {
      //     imData.append("img", fileField.current.files[i]);
      //   }
      // }

      const fData = new FormData();

      fData.append("title", title);
      fData.append("desc", desc);
      if (category) {
        let categoryId = categories.find((e) => e._id === category);
        let categoryN = categories.find((e) => e.name === category);

        if (categoryN !== undefined) {
          fData.append("cat", categoryN.slug);
        }
        if (categoryId !== undefined) {
          fData.append("cat", categoryId.slug);
        }
      }
      fData.append("price", price);
      fData.append("priceneg", priceNegotiable);

      if (fileField.current.files.length > 0) {
        for (let i = 0; i < fileField.current.files.length; i++) {
          fData.append("img", fileField.current.files[i]);
        }
      }

      const json = await api.editAd(id, fData);
      if (!json.error) {
        // navigate(`/ad/${id}`);

        return;
      } else {
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
      <PageTitle>Edite o anúncio</PageTitle>
      <PageArea>
        <FormStyled onSubmit={handleSubmit}>
          <label className="area" htmlFor="">
            <div className="area--title">Titulo</div>
            <div className="area--input">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={disabled}
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
              />
            </div>
          </label>
          <label className="area" htmlFor="">
            <div className="area--title">Images(1 ou mais)</div>
            <div className="area--input">
              <input type="file" ref={fileField} multiple disabled={disabled} />
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
              <button disabled={disabled}>Salvar</button>
            </div>
          </label>
        </FormStyled>
      </PageArea>
    </PageContainer>
  );
};
