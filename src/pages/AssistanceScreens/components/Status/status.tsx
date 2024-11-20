import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from '../../../../Firebase/firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './status.css';
import Alert from '../Alert/alert';

interface StatusItem {
  id: string;
  userId: string;
  telefone: string;
  titulo: string;
  descricao: string;
  descricaoComputador: string;
  status: string;
  dataEnvio: string;
}

const Status: React.FC = () => {
  const [statusList, setStatusList] = useState<StatusItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<StatusItem | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const showAlert = (message: string, type: 'success' | 'error' | 'warning') => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const fetchUserType = async (uid: string) => {
    try {
      const userDocRef = doc(db, "usuários", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        return data?.userType || "user";
      } else {
        console.warn("Usuário não encontrado no Firestore");
        return "user";
      }
    } catch (error) {
      console.error("Erro ao buscar o tipo do usuário:", error);
      return "user";
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserType(user.uid).then(setUserType);
      } else {
        setUserId(null);
        setUserType(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!userId || !userType) return;

      try {
        let q;
        if (userType === "tec" || userType === "admin") {
          q = query(collection(db, "formassistance"));
        } else {
          q = query(
            collection(db, "formassistance"),
            where("userId", "==", userId)
          );
        }

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => {
          const docData = doc.data();
          return {
            id: doc.id,
            userId: docData.userId,
            telefone: docData.telefone, // Certifique-se de que o telefone seja uma string
            titulo: docData.titulo,
            descricao: docData.descricao,
            descricaoComputador: docData.descricaoComputador,
            status: docData.status || "Pendente",
            dataEnvio: docData.dataEnvio || new Date().toISOString().split('T')[0],
          } as StatusItem;
        });

        setStatusList(data);
      } catch (error) {
        console.error("Erro ao buscar dados do Firestore:", error);
        showAlert("Erro ao buscar os dados.", "error");
      }
    };

    fetchStatus();
  }, [userId, userType]);

  const handleVisualizar = (ticket: StatusItem) => {
    setSelectedTicket(ticket); // Set ticket data
    setShowPopup(true);
    setIsEditing(false);
  };

  const handleEditar = () => {
    setIsEditing(true);
  };

  const handleSalvar = async () => {
    if (!selectedTicket) return;

    try {
      const updatedFields: Partial<StatusItem> = {
        telefone: selectedTicket.telefone,
        descricao: selectedTicket.descricao,
        descricaoComputador: selectedTicket.descricaoComputador,
        status: selectedTicket.status,
        titulo: selectedTicket.titulo,
        dataEnvio: selectedTicket.dataEnvio,
      };

      await updateDoc(doc(db, "formassistance", selectedTicket.id), updatedFields);

      setStatusList((prevList) =>
        prevList.map((item) =>
          item.id === selectedTicket.id ? { ...item, ...updatedFields } : item
        )
      );

      setIsEditing(false);
      showAlert("Dados atualizados com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      showAlert("Erro ao salvar alterações.", "error");
    }
  };

  const handleExcluir = async () => {
    if (!selectedTicket) return;

    try {
      await deleteDoc(doc(db, "formassistance", selectedTicket.id));
      setStatusList((prevList) => prevList.filter((item) => item.id !== selectedTicket.id));
      setShowPopup(false);
      setShowConfirmPopup(false);
      showAlert("Ticket excluído com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao excluir o ticket:", error);
      showAlert("Erro ao excluir o ticket.", "error");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = statusList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(statusList.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="status-container">
      {alertMessage && <Alert message={alertMessage} type={alertType!} />}

      <h2>STATUS DO SERVIÇO</h2>
      <table className="status-table">
        <thead>
          <tr>
            <th>ID do Usuário</th>
            <th>Título</th>
            <th>Status</th>
            <th>Data de Envio</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>{item.userId}</td>
              <td>{item.titulo}</td>
              <td className={`status-${item.status.replace(/\s+/g, '-').toLowerCase()}`}>{item.status}</td>
              <td>{item.dataEnvio}</td>
              <td>
                <button onClick={() => handleVisualizar(item)} className="btn-visualizar">
                  Visualizar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Anterior
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Próximo
        </button>
      </div>

      {showPopup && selectedTicket && (
        <div className="popup">
          <div className="popup-content">
            <h3>Detalhes do Ticket</h3>
            <div>
              <p><strong>ID do Usuário:</strong> {selectedTicket.userId}</p> {/* ID fixo e não editável */}
              <label>Telefone:</label>
              <input
                type="text"
                value={selectedTicket.telefone}
                disabled={!isEditing || userType === "tec"}
                onChange={(e) => setSelectedTicket({ ...selectedTicket, telefone: e.target.value })}
              />
              <label>Título:</label>
              <input
                type="text"
                value={selectedTicket.titulo}
                disabled={!isEditing || userType === "user" || userType === "tec"}
                onChange={(e) => setSelectedTicket({ ...selectedTicket, titulo: e.target.value })}
              />
              <label>Descrição:</label>
              <textarea
                value={selectedTicket.descricao}
                disabled={!isEditing || userType === "tec"}
                onChange={(e) => setSelectedTicket({ ...selectedTicket, descricao: e.target.value })}
              ></textarea>
              <label>Descrição do Computador:</label>
              <textarea
                value={selectedTicket.descricaoComputador}
                disabled={!isEditing || userType === "tec"}
                onChange={(e) => setSelectedTicket({ ...selectedTicket, descricaoComputador: e.target.value })}
              ></textarea>
              <label>Status:</label>
              <select
                value={selectedTicket.status}
                disabled={!isEditing || userType === "user"}
                onChange={(e) => setSelectedTicket({ ...selectedTicket, status: e.target.value })}
              >
                <option value="pendente">Pendente</option>
                <option value="em andamento">Em Andamento</option>
                <option value="concluído">Concluído</option>
              </select>
            </div>
            <div className="popup-actions">
              {!isEditing ? (
                <button onClick={handleEditar} className="btn-editar">Editar</button>
              ) : (
                <button onClick={handleSalvar} className="btn-salvar">Salvar</button>
              )}
              {(userType === "tec" || userType === "admin") && (
                <button onClick={() => setShowConfirmPopup(true)} className="btn-excluir">Excluir</button>
              )}
              <button onClick={() => setShowPopup(false)} className="btn-fechar">Fechar</button>
            </div>
          </div>
        </div>
      )}

      {showConfirmPopup && (
        <div className="confirm-popup">
          <div className="confirm-popup-content">
            <h3>Tem certeza?</h3>
            <p>Você deseja excluir o ticket "{selectedTicket?.titulo}"?</p>
            <div className="confirm-popup-actions">
              <button onClick={handleExcluir} className="btn-confirmar">Sim</button>
              <button onClick={() => setShowConfirmPopup(false)} className="btn-cancelar">Não</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Status;
