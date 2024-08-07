import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <>
      <h3>Página não encontrada</h3>
      <Link to="/">Voltar para home</Link>
    </>
  );
};

export default NotFoundPage;
