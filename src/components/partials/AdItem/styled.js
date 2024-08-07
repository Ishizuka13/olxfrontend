import styled from "styled-components";

export const Item = styled.div`
  position: static;
  a {
    display: block;
    border: 1px solid #fff;
    margin: 10px;
    margin-top: -20px;
    text-decoration: none;
    padding: 10px;
    border-radius: 5px;
    color: #000;
    background-color: #fff;
    transition: all ease 0.2s;

    &:hover {
      border: 1px solid #ccc;
    }

    .itemImg {
      position: relative;
      z-index: 1;

      width: 100%;
      border-radius: 5px;
    }

    .itemName {
      font-weight: bold;
    }
  }

  .actions {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    top: 20px;
    padding: 0 20px;
  }

  .editItem {
    width: 30px;
  }
  .deleteItem {
    width: 30px;
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    text-align: center;
  }
`;
