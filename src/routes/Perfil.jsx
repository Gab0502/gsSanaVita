import { useState, useEffect } from 'react';
import '../styles/perfil.style.css';

function Perfil() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [userIcon, setUserIcon] = useState(null);
  const [mostrarVisitas, setMostrarVisitas] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [pacienteInfo, setPacienteInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userFromStorage = JSON.parse(sessionStorage.getItem('usuarioLogado'));

        if (userFromStorage) {
          setUsuarioLogado(userFromStorage);
          setUserIcon(userFromStorage.foto);

          // Verifica se o usuário logado é um doutor e tem pacientes associados
          if (userFromStorage.status === 'd' && userFromStorage.pacientes) {
            const pacienteEmail = userFromStorage.pacientes[Object.keys(userFromStorage.pacientes)[0]];

            const response = await fetch("http://localhost:3000/user");
            if (response.ok) {
              const users = await response.json();

              // Corrigindo para verificar se pacienteEmail existe em users
              if (users[pacienteEmail]) {
                const paciente = users[pacienteEmail];
                setPacienteInfo(paciente);
              }
            }
          }
        }
      } catch (error) {
        console.log('Erro ao carregar informações do paciente', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <main className='bg-cinza'>
        {usuarioLogado ? (
          <section className='profile'>
            <section className='perfilInfos bg-verde'>
              <img src={`/assets/${userIcon}`} alt="User Profile" className='ProfilePicture' />
              <h2 className='perfilNome texto-laranjaEscuro'>{usuarioLogado?.nome}</h2>
            </section>
            <h3 className='subtittle'>Informações de usuário</h3>
            <div className='personalInfos bg-branco'>
              <h3>Email: {usuarioLogado.email}</h3>
              <h3>Data de Nascimento: {usuarioLogado.dataNascimento}</h3>
              <h3>Gênero: {usuarioLogado.genero}</h3>
            </div>

            {usuarioLogado.status === 'p' ? (
              <section>
                <h3 className='subtittle'>Resultados</h3>
                <div>
                  <section className="box">
                    <button onClick={() => setMostrarVisitas(!mostrarVisitas)} className='btn bg-branco'>
                      {mostrarVisitas ? 'Ocultar Visitas' : 'Mostrar Visitas'}
                    </button>
                    <div className={mostrarVisitas ? 'visible' : 'hidden'} id='inside'>
                      {mostrarVisitas && Object.keys(usuarioLogado.visitas).length > 0 ? (
                        <div>
                          <ul>
                            {Object.entries(usuarioLogado.visitas).map(([data, visita]) => (
                              <li key={data}>
                                {`${data}: ${visita.local}, ${visita.descricao}`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </section>

                  <button onClick={() => setMostrarResultados(!mostrarResultados)} className='btn bg-branco'>
                    {mostrarResultados ? 'Ocultar Resultados' : 'Mostrar Resultados'}
                  </button>
                  <div className={mostrarResultados ? 'visible' : 'hidden'} id='inside'>
                    {mostrarResultados && Object.keys(usuarioLogado.resultados).length > 0 ? (
                      <div>
                        <ul>
                          {Object.entries(usuarioLogado.resultados).map(([data, resultado]) => (
                            <li key={data}>
                              {`${data}: ${resultado.nome}, `}
                              {resultado.link ? (
                                <a href={`src/assets/pdfs/${resultado.link}`} target="_blank" rel="noopener noreferrer" className='pdf'>
                                  Ver Resultado (PDF)
                                </a>
                              ) : (
                                <span>Sem link disponível</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>
              </section>
            ) : usuarioLogado.status === 'd' ? (
              
                <section>
                  {pacienteInfo ? (
                    <div>
                      <h3 className='subtittle'>Informações do proximo Paciente</h3>
                      <div className='historico' id="inside">
                      <ul>
                        <li>
                          <h2>{pacienteInfo.nome}</h2>
                          <p>Email: {pacienteInfo.email}</p>
                          <p>Data de Nascimento: {pacienteInfo.dataNascimento}</p>
                          <h2>Ultimas consultas</h2>
                          <ul>
                            {pacienteInfo.visitas && Object.keys(pacienteInfo.visitas).length > 0 ? (
                              Object.entries(pacienteInfo.visitas).map(([data, visita]) => (
                                <li key={data}>
                                  {`${data}: ${visita.local}, ${visita.descricao}`}
                                </li>
                              ))
                            ) : (
                              <li>Sem histórico de visitas</li>
                            )}
                          </ul>
                          <h2>Histórico de Resultados</h2>
                          <ul>
                            {pacienteInfo.resultados && Object.keys(pacienteInfo.resultados).length > 0 ? (
                              Object.entries(pacienteInfo.resultados).map(([data, resultado]) => (
                                <li key={data}>
                                  {`${data}: ${resultado.nome}, `}
                                  {resultado.link ? (
                                    <a href={`/assets/pdfs/${resultado.link}`} target="_blank" rel="noopener noreferrer" className='pdf'>
                                      Ver Resultado (PDF)
                                    </a>
                                  ) : (
                                    <span>Sem link disponível</span>
                                  )}
                                </li>
                              ))
                            ) : (
                              <li>Sem histórico de resultados</li>
                            )}
                          </ul>
                        </li>
                      </ul>
                      </div>
                    </div>
                  ) : null}
                </section>
            ) : (
              <div>
                <h3>Status: Desconhecido</h3>
              </div>
            )}
          </section>
        ) : (
          <p>Usuário não autenticado. Redirecionando para a página de login...</p>
        )}
      </main>
    </>
  );
}

export default Perfil;
