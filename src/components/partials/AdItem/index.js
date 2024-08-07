import { Link, useNavigate } from "react-router-dom";
import { Item } from "./styled";

export const AdItem = (props) => {
  let price = "";
  let image = "";
  let id = "";

  if (props.data.priceNegotiable) {
    price = "Preco Negociável";
  } else {
    price = `R$ ${props.data.price}`;
  }

  if (props.data.image) {
    image = props.data.image;
  }

  if (props.image) {
    image = props.image;
  }

  if (props.data.id) {
    id = props.data.id;
  }

  if (props.data._id) {
    id = props.data._id;
  }

  return (
    <Item className="aditem">
      <div>
        <div className="actions">
          <div className="editItem" onClick={props.editAction}>
            <img
              src="https://www.imagensempng.com.br/wp-content/uploads/2021/09/Icone-lapis-Png.png"
              alt=""
            />
          </div>
          <div className="deleteItem" onClick={props.deleteAction}>
            X
          </div>
        </div>
        <Link to={`/ad/${id}`}>
          <div className="itemImg">
            <img src={image} alt="" />
          </div>
          <div className="itemName">{props.data.title}</div>
          <div className="itemPrice">{price}</div>
        </Link>
      </div>
    </Item>
  );
};
