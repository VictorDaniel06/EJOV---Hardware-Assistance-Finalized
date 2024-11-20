import React, { useState, useEffect } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../../../Firebase/firebaseConfig';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './assistance-form.css';
import Alert from '../Alert/alert';

const AssistanceForm: React.FC = () => {
  const [formData, setFormData] = useState({
    telefone: '',
    titulo: '',
    descricao: '',
    descricaoComputador: '',
    userId: '',
    dataEnvio: '',
    status: 'pendente', // Valor padrão para o status
  });

  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning'>('success');

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setFormData((prevData) => ({ ...prevData, userId: user.uid }));
      }
    });
  }, []);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.telefone || !formData.titulo || !formData.descricao || !formData.descricaoComputador) {
      setAlertType('warning');
      setAlertMessage("Por favor, preencha todos os campos.");
      return;
    }
    
    if (!formData.userId) {
      setAlertType('error');
      setAlertMessage("Usuário não está autenticado.");
      return;
    }

    try {
      const dataEnvio = new Date().toISOString().split('T')[0];
      const formDataWithSubmissionDate = {
        ...formData,
        telefone: Number(formData.telefone),
        dataEnvio,
      };

      await addDoc(collection(db, "formassistance"), formDataWithSubmissionDate);
      setAlertType('success');
      setAlertMessage('Dados enviados com sucesso!');
      setFormData({
        telefone: '',
        titulo: '',
        descricao: '',
        descricaoComputador: '',
        userId: formData.userId,
        dataEnvio: '',
        status: 'pendente', // Reiniciar o status como pendente
      });
    } catch (error) {
      console.error("Erro ao enviar dados: ", error);
      setAlertType('error');
      setAlertMessage('Erro ao enviar dados. Tente novamente.');
    }
  };

  return (
    <div className="form-container">
      <h1>FORMULÁRIO DE ASSISTÊNCIA</h1>
      {alertMessage && <Alert message={alertMessage} type={alertType} />}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="telefone" className="form-label">TELEFONE:</label>
          <input
            type="text"
            className="form-control"
            id="telefone"
            value={formData.telefone}
            onChange={handleChange}
            placeholder="Digite seu telefone"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="titulo" className="form-label">TÍTULO:</label>
          <input
            type="text"
            className="form-control"
            id="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Digite o título"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="descricao" className="form-label">DESCRIÇÃO DETALHADA:</label>
          <textarea
            className="form-control scrollable-textarea"
            id="descricao"
            rows={4}
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Descreva o problema em detalhes"
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="descricaoComputador" className="form-label">DESCRIÇÃO DO COMPUTADOR:</label>
          <textarea
            className="form-control scrollable-textarea"
            id="descricaoComputador"
            rows={4}
            value={formData.descricaoComputador}
            onChange={handleChange}
            placeholder="Descreva a configuração do seu computador"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">ENVIAR</button>
      </form>
    </div>
  );
};

export default AssistanceForm;
