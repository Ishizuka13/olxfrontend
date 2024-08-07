import Cookies from "js-cookie";
import qs from "qs";

const BASEAPI = "http://localhost:5000/";

const apiFetchPost = async (endpoint, body) => {
  if (!body.token) {
    let token = Cookies.get("token");
    if (token) {
      body.token = token;
    }
  }

  const res = await fetch(BASEAPI + endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (json.notAllowed) {
    window.location.href = "/signin";
    return;
  }

  return json;
};

const apiFetchPut = async (endpoint, body) => {
  if (!body.token) {
    let token = Cookies.get("token");
    body.append("token", token);
  }

  const res = await fetch(BASEAPI + endpoint, {
    method: "PUT",
    body,
  });

  const json = await res.json();

  if (json.notAllowed) {
    // window.location.href = "/signin";
    return;
  }

  return json;
};

const apiFetchGet = async (endpoint, body = []) => {
  if (!body.token) {
    let token = Cookies.get("token");
    if (token) {
      body.token = token;
    }
  }
  const res = await fetch(`${BASEAPI + endpoint}?${qs.stringify(body)}`);

  const json = await res.json();

  if (json.notAllowed) {
    window.location.href = "/signin";
    return;
  }

  return json;
};

const apiFetchFile = async (endpoint, body) => {
  if (!body.token) {
    let token = Cookies.get("token");
    body.append("token", token);
  }

  const res = await fetch(BASEAPI + endpoint, {
    method: "POST",
    body,
  });

  const json = await res.json();

  if (json.notAllowed) {
    // window.location.href = "/signin";
    return;
  }

  return json;
};

const apiFetchDelete = async (endpoint, body) => {
  let token = Cookies.get("token");

  const res = await fetch(`${BASEAPI + endpoint}?token=${token}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(body),
  });

  console.log(res);

  const json = await res.json();
  return json;
};

const OlxAPI = {
  login: async (email, password) => {
    const json = await apiFetchPost("user/signin", { email, password });

    return json;
  },
  register: async (name, state, email, password) => {
    const json = await apiFetchPost("user/signup", {
      name,
      state,
      email,
      password,
    });

    return json;
  },

  getState: async () => {
    const json = await apiFetchGet("states");
    return json.states;
  },

  getCategorie: async () => {
    const json = await apiFetchGet("categories");
    return json.categories;
  },

  getAds: async (options) => {
    const json = await apiFetchGet("ad/list", options);
    return json;
  },

  getAd: async (id, other = false) => {
    const json = await apiFetchGet("ad/item", { id, other });
    return json;
  },

  addAd: async (fData) => {
    const json = await apiFetchFile("ad/add", fData);
    return json;
  },
  getuser: async () => {
    const json = await apiFetchGet("user/me");
    return json;
  },
  editUser: async (name, stateLoc, email, password) => {
    const json = await apiFetchPut("user/me", {
      name,
      stateLoc,
      email,
      password,
    });
    return json;
  },

  editAd: async (id, bodyEdit) => {
    const json = await apiFetchPut("ad/" + id, bodyEdit);
    return json;
  },

  deleteAd: async (id) => {
    console.log(id);
    const json = await apiFetchDelete("ad/delete", { id });

    return json;
  },
};

export default () => OlxAPI;
