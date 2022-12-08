const expensesApi = {
  getTotals: async () => {
    try {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
        },
      };

      const res = await fetch(`${window.env.API_URL}/total`, options);
      const json = await res.json();
      return json;
    } catch (err) {
      console.log("Error getting total", err);
    }
  },
  getReports: async () => {
    try {
      const token = await window.auth0Client.getTokenSilently();
      const options = {
          method: "GET",
          headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
          Authorization: `Bearer ${token}`,
          },
      };
      const res = await fetch(`${window.env.API_URL}/reports`, options);
      const json = await res.json();
      return json;
    } catch (err) {
      console.log("Error getting reports", err);
    }
  }
};

export default expensesApi;
