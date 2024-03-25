import axios from "axios";

const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const addPerson = (personObject) => {
  return axios.post(baseUrl, personObject).then((response) => response.data);
};

const updatePerson = (id, personObject) => {
  return axios
    .put(`${baseUrl}/${id}`, personObject)
    .then((response) => response.data);
};

const deletePerson = (id) => {
  return axios
    .delete(`${baseUrl}/${id}`)
    .then(() => {
      // No necesitas actualizar el estado aquí, ya que se manejará en el componente App
    })
    .catch((error) => {
      console.error("Error deleting person:", error);
      // Devuelve una promesa rechazada con el error para que se pueda manejar en el componente App
      return Promise.reject(error);
    });
};

export default { getAll, addPerson, updatePerson, deletePerson };
