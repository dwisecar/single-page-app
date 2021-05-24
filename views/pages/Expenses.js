import expensesApi from "../../services/expensesApi.js";
import Table from "../components/Table.js";

const Expenses = {
  allowAccess: async () => window.auth0Client.isAuthenticated(),
  render: async () => {
    const expenses = await expensesApi.getReports();
    const dollars = await expensesApi.getDollars();
    const cents = await expensesApi.getCents();
    const view = /*html*/ `
    <h1>Expense Report</h1>
    <p id="user-greet">Hello, ${window.user.name}</p>
    <p>These are your expenses:</p>
    ${await Table.render(expenses)}
    `;
    <p>These are your dollars:</p>
    ${await Table.render(dollars)}
    `;
    <p>These are your cents:</p>
    ${await Table.render(cents)}
    `;
    return view;
  },
  postRender: async () => {},
};

export default Expenses;
