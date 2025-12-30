import React, { useState } from 'react';
import TarjetaDeslizable from './Components/TarjetaDeslizable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Badge, Button, ButtonGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

// Importar palabras del JSON
import PALABRAS from './Palabras.json';

function App() {
  const [estado, setEstado] = useState('menu');
  const [jugadores, setJugadores] = useState(['', '', '']);
  const [numImpostores, setNumImpostores] = useState(1);
  const [palabras, setPalabras] = useState(PALABRAS);

  const elegirImpostor = () => {
    let idx = [];
    idx.push(Math.floor(Math.random() * jugadores.length));
    for (let i = 1; i < numImpostores; i++) {
      let idxAux = Math.floor(Math.random() * jugadores.length);
      if (!idx.includes(idxAux)) {
        idx.push(idxAux);
      } else {
        i--;
      }
    }
    return idx;
  }
  return (
    <div>
      {estado === 'menu' ? <Menu setEstado={setEstado}
        numImpostores={numImpostores} setNumImpostores={setNumImpostores}
        palabras={palabras} setPalabras={setPalabras}
        jugadores={jugadores} setJugadores={setJugadores} /> :
        <BucleJuego jugadores={jugadores} setEstado={setEstado} 
        listaPalabras={palabras} numImpostores={numImpostores} elegirImpostor={elegirImpostor} />}
    </div>
  );
}

function BucleJuego(props) {
  const { jugadores, setEstado, listaPalabras, numImpostores, elegirImpostor } = props;
  const [palabraActual, setPalabraActual] = useState(listaPalabras[Math.floor(Math.random() * listaPalabras.length)]);
  const [impostorIndex, setImpostorIndex] = useState(elegirImpostor());
  const [palabrasElegidas, setPalabrasElegidas] = useState([palabraActual]);
  const [jugadorActual, setJugadorActual] = useState(0);
  const [estadoJuego, setEstadoJuego] = useState('mostrando');

  const elegirPalabra = () => {
    let palabra = listaPalabras[Math.floor(Math.random() * listaPalabras.length)];
    while (palabrasElegidas.includes(palabra)) {
      palabra = listaPalabras[Math.floor(Math.random() * listaPalabras.length)];
    }
    setPalabrasElegidas([...palabrasElegidas, palabra]);
    return palabra;
  }

  const calcularSiguienteRonda = () => {
    setPalabraActual(elegirPalabra());
    setImpostorIndex(elegirImpostor());
    setJugadorActual(0);
    setEstadoJuego('mostrando');
  }

  const siguienteJugador = () => {
    if (jugadorActual < jugadores.length - 1) {
      setJugadorActual(jugadorActual + 1);
    } else {
      // Aquí puedes ir a la pantalla de juego
      setEstadoJuego('juego');
    }
  };

  // Determinar qué mostrar al jugador actual
  const esImpostor = impostorIndex.includes(jugadorActual);
  const palabraMostrar = esImpostor ? `IMPOSTOR 🕵️\n\nPista: ${palabraActual.pista}` : palabraActual.palabra;

  return (
    <div>
      {estadoJuego === 'mostrando' ? (
        <TarjetaDeslizable
          jugador={jugadores[jugadorActual]}
          palabra={palabraMostrar}
          onSiguiente={siguienteJugador}
          progreso={`${jugadorActual + 1}/${jugadores.length}`}
        />
      ) : (
        <PantallaJuego 
          jugadores={jugadores}
          numImpostores={numImpostores}
          onNuevaRonda={calcularSiguienteRonda}
          onVolverMenu={() => setEstado('menu')}
        />
      )}
    </div>
  );
}

function PantallaJuego(props) {
  const { jugadores, numImpostores, onNuevaRonda, onVolverMenu } = props;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          fontSize: '2.5rem',
          color: '#212529'
        }}>
          🎮 ¡A Jugar! 🎮
        </h1>


        {/* Jugadores */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '25px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ marginBottom: '15px', color: '#495057' }}>Jugadores en esta ronda:</h4>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            {jugadores.map((jugador, i) => (
              <span
                key={i}
                style={{
                  backgroundColor: '#e9ecef',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '1rem',
                  color: '#495057'
                }}
              >
                {jugador}
              </span>
            ))}
          </div>
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
          <Button
            color='success'
            size='lg'
            onClick={onNuevaRonda}
            style={{ fontSize: '1.2rem', padding: '15px' }}
          >
            🔄 Nueva Ronda
          </Button>
          <Button
            color='secondary'
            onClick={onVolverMenu}
            style={{ fontSize: '1rem', padding: '12px' }}
          >
            ← Volver al Menú
          </Button>
        </div>
      </div>
    </div>
  );
}

function Menu(props) {

  let [numImpostoresForm, setNumImpostoresForm] = useState(props.numImpostores);
  let [palabrasForm, setPalabrasForm] = useState(props.palabras);
  let [nombres, setNombres] = useState(props.jugadores);
  const [info, setInfo] = useState("");

  const listaUsuarios = () => {
    return nombres.map((v, i) => {
      return <InpUsuario key={i} idx={i} setNombres={setNombres} value={v} nombres={nombres} />
    });
  }

  const setearJuego = () => {
    if (numImpostoresForm * 1.9 > nombres.length) {
      setInfo("Demasiados impostores");
      return;
    }
    props.setNumImpostores(numImpostoresForm < 1 ? 1 : numImpostoresForm);
    props.setPalabras(palabrasForm);

    props.setJugadores(nombres.map((v, i) => { if (v.trim() === "") v = "Amogus " + (i + 1); return v.trim() }));

    if (nombres.length < 3) {
      setInfo("El número de jugadores no puede ser menor que 3");
      return;
    }

    props.setEstado('juego');
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>🕵️ El Impostor</h1>

      {info && <Alert color='danger'>{info}</Alert>}

      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ marginBottom: '15px' }}>Jugadores ({nombres.length})</h4>
        {listaUsuarios()}
      </div>

      <Button
        color='success'
        style={{ width: '100%', marginBottom: '25px' }}
        onClick={() => setNombres([...nombres, ""])}
      >
        + Agregar jugador
      </Button>
      <div className='d-flex'>
        <h4 style={{ marginBottom: '15px', display: 'inline' }}>Impostores</h4>
        <ButtonGroup style={{ width: '30%', marginBottom: '15px', marginLeft: '5%' }}>
          <Button onClick={() => setNumImpostoresForm(numImpostoresForm - 1)}>
            -
          </Button>
          <Button disabled>
            {numImpostoresForm}
          </Button>
          <Button onClick={() => setNumImpostoresForm(numImpostoresForm + 1)}>
            +
          </Button>
        </ButtonGroup>
      </div>
      <Button
        color='primary'
        style={{ width: '100%', fontSize: '18px', padding: '12px', marginBottom: '25px' }}
        onClick={() => setearJuego()}
      >
        Jugar
      </Button>

      <ModalPalabras palabras={palabrasForm} setPalabras={setPalabrasForm} setInfo={setInfo} />
    </div>
  );
}

function InpUsuario(props) {
  const handleChange = (e) => {
    let aux = [...props.nombres];
    aux[props.idx] = e.target.value;
    props.setNombres(aux);
  }
  const handleEliminar = () => {
    let aux = [...props.nombres];
    aux.splice(props.idx, 1);
    props.setNombres(aux);
  }
  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
      <Input
        type='text'
        placeholder='Nombre del jugador'
        value={props.value}
        onChange={handleChange}
        style={{ flex: 1 }}
      />
      <Button
        color='danger'
        onClick={handleEliminar}
        style={{ minWidth: '100px' }}
      >
        Eliminar
      </Button>
    </div>
  );
}

function ModalPalabras(props) {
  const [modal, setModal] = useState(false);
  // ✅ Estado para el contenido del textarea
  const [textoJSON, setTextoJSON] = useState(JSON.stringify(props.palabras, null, 2));

  const toggle = () => {
    setModal(!modal);
    // Resetear el texto al abrir el modal
    setTextoJSON(JSON.stringify(props.palabras, null, 2));
  };

  const handleGuardar = () => {
    try {
      // ✅ Parsear el texto del textarea
      let aux = JSON.parse(textoJSON);
      props.setPalabras(aux);
      props.setInfo("Palabras guardadas correctamente");
      toggle(); // Cerrar el modal
    } catch (error) {
      props.setInfo("Error al guardar las palabras: JSON inválido");
      toggle();
    }
  }

  return (
    <div>
      <Button color="danger" onClick={toggle}>
        Cambiar palabras
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Cambiar palabras</ModalHeader>
        <ModalBody>
          <p>
            Al cambiar las palabras, las palabras por defecto se eliminan hasta que se recargue la página.
            El formato para las palabras es un JSON con la siguiente estructura:
          </p>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
{`[
  { "palabra": "pizza", "pista": "comida italiana" },
  { "palabra": "helado", "pista": "postre" },
  { "palabra": "café", "pista": "bebida" },
  { "palabra": "té", "pista": "bebida" }
]`}
          </pre>
          <p>
            <small>Para cambiar las palabras copia y pega en ChatGPT y pídele el número y tipo que quieras</small>
          </p>

          {/* ✅ Textarea controlado con onChange */}
          <textarea
            rows={10}
            style={{ width: '100%', fontFamily: 'monospace', fontSize: '12px' }}
            value={textoJSON}
            onChange={(e) => setTextoJSON(e.target.value)}
          ></textarea>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleGuardar}>
            Guardar
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;