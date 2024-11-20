import { Fragment, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';

const Formulario = ({ crearCita }) => {

  const [cita, setCita] = useState({
    mascota: "",
    propietario: "",
    fecha: "",
    hora: "",
    sintomas: "",
  })

  const [error, setError] = useState(false);

  const handleChange = e => {
    setCita({
      ...cita,
      [e.target.name]: e.target.value
    })
  }

  const { mascota, propietario, fecha, hora, sintomas } = cita;

  const handleSubmit = e => {
    e.preventDefault();

    //Validación mínima
    if (mascota.trim() === "" || propietario.trim() === "" || fecha.trim() === "" || hora.trim() === "" || sintomas.trim() === "") {
      setError(true);
      return;
    }

    //Eliminar el mensaje previo
    setError(false);

    //Asignar un Id
    cita.id = uuidv4();

    //Crear cita
    crearCita(cita);

    //Reiniciar el formulario
    setCita({
      mascota: "",
      propietario: "",
      fecha: "",
      hora: "",
      sintomas: "",
    })


  }

  return (
    <Fragment>
      <h2>Crear Cita</h2>
      <form
        onSubmit={handleSubmit}
      >
        {error ? <span className="alerta-error">Debes completar todos los campos.</span> : null}
        <label>Nombre de la Mascota</label>
        <input
          type="text"
          name="mascota"
          className="u-full-width"
          placeholder="Nombre de la Mascota"
          onChange={handleChange}
          value={mascota}
        />
        <label>Nombre del Dueño</label>
        <input
          type="text"
          name="propietario"
          className="u-full-width"
          placeholder="Nombre del Dueño"
          onChange={handleChange}
          value={propietario}
        />
        <label>Fecha</label>
        <input
          type="date"
          name="fecha"
          className="u-full-width"
          onChange={handleChange}
          value={fecha}
        />
        <label>Hora</label>
        <input
          type="time"
          name="hora"
          className="u-full-width"
          step="60"
          onChange={handleChange}
          value={hora}
        />
        <label>Síntomas</label>
        <textarea
          className="u-full-width"
          name="sintomas"
          onChange={handleChange}
          value={sintomas}
        ></textarea>

        <button
          type="submit"
          className="u-full-width"
        >Agregar Cita</button>
      </form>
    </Fragment>
  )
}

Formulario.propTypes = {
  crearCita: PropTypes.func.isRequired,
}


export default Formulario