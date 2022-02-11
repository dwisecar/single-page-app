import idtoken from "../../images/icon-id-token.svg";
import accessToken from "../../images/icon-access-token.svg"

const Tokens = {
    allowAccess: async () => window.auth0Client.isAuthenticated(),
    render: async () => {
      const token = await window.auth0Client.getTokenSilently();
      const claims = await window.auth0Client.getIdTokenClaims();
      console.log(claims);
      const view = /*html*/ `
      <h1>
        Tokens
      </h1>
      <p id="user-greet">Hello, ${window.user.name}. Here's some tokens.</p>
      
      <p>ID token:
        <a href=https://jwt.io?token=${claims.__raw}><img src=${idtoken} /></a>
      </p>
      <p>Access token:
        <a href=https://jwt.io?token=${token}><img src=${accessToken} /></a>
      </p>
      `;
      return view;
    },
    postRender: async () => {},
  };
  
  export default Tokens;