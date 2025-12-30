import React, { useState } from 'react';
import { Button, Card, CardBody } from 'reactstrap';

function TarjetaDeslizable(props) {
  const { jugador, palabra, onSiguiente, progreso } = props;
  const [revelada, setRevelada] = useState(false);

  const esImpostor = palabra.includes('IMPOSTOR');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Progreso */}
      {progreso && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: '#6c757d',
          padding: '8px 16px',
          borderRadius: '20px',
          color: 'white',
          fontSize: '1rem',
          fontWeight: 'bold'
        }}>
          {progreso}
        </div>
      )}

      {/* Contenedor principal */}
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          fontSize: '2rem',
          color: '#495057'
        }}>
          Le toca a:
        </h2>

        {/* Tarjeta del jugador */}
        <Card style={{ 
          marginBottom: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: 'none'
        }}>
          <CardBody style={{ padding: '40px', textAlign: 'center' }}>
            <h1 style={{ 
              fontSize: '3rem', 
              marginBottom: '20px',
              color: '#212529'
            }}>
              {jugador}
            </h1>
            
            {!revelada ? (
              <div>
                <p style={{ 
                  fontSize: '1.1rem', 
                  color: '#6c757d',
                  marginBottom: '30px'
                }}>
                  Haz clic para ver tu palabra
                </p>
                <Button 
                  color="primary" 
                  size="lg"
                  onClick={() => setRevelada(true)}
                  style={{ fontSize: '1.2rem', padding: '12px 30px' }}
                >
                  Ver Palabra 👁️
                </Button>
              </div>
            ) : (
              <div>
                <h4 style={{ 
                  color: esImpostor ? '#dc3545' : '#28a745',
                  marginBottom: '20px'
                }}>
                  {esImpostor ? '' : '🎯 Tu palabra es:'}
                </h4>
                <h2 style={{ 
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: esImpostor ? '#dc3545' : '#007bff',
                  marginBottom: '20px',
                  whiteSpace: 'pre-line'
                }}>
                  {palabra}
                </h2>
                <Button 
                  color="secondary" 
                  onClick={() => setRevelada(false)}
                  style={{ marginTop: '10px' }}
                >
                  Ocultar
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Botón siguiente jugador */}
        {!revelada && (
          <Button 
            color="success" 
            size="lg"
            onClick={onSiguiente}
            style={{ 
              width: '100%',
              fontSize: '1.3rem',
              padding: '15px'
            }}
          >
            Siguiente Jugador →
          </Button>
        )}
      </div>
    </div>
  );
}

export default TarjetaDeslizable;