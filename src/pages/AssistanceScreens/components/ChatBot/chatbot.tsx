import React, { useState } from 'react';
import { AiOutlineSend, AiOutlineClose } from 'react-icons/ai';
import './Chatbot.css';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (message: string) => {
    if (message.trim() === '') return;

    setMessages((prevMessages) => [...prevMessages, `Você: ${message}`]);

    try {
      setTimeout(async () => {
        const response = await fetch('http://localhost:3001/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }), 
        });

        const data = await response.json();
        setMessages((prevMessages) => [...prevMessages, `Bot: ${data.reply || 'Resposta indisponível no momento.'}`]); // Adiciona a resposta do bot
      }, 2000); 

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages((prevMessages) => [...prevMessages, 'Bot: Desculpe, ocorreu um erro ao tentar responder.']);
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setMessages([]); 
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <img
          src="src/assets/bot.png"
          alt="Chatbot"
          className="chatbot-icon"
          onClick={toggleChat}
        />
      )}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <img
              src="src/assets/bot.png"
              alt="Chatbot"
              className="chatbot-header-icon"
            />
            <span className="chatbot-title">CHATBOT</span>
            <AiOutlineClose className="chatbot-close-icon" onClick={handleCloseChat} />
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chatbot-message ${msg.startsWith('Você:') ? 'user' : 'bot'}`}>{msg}</div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = ''; 
                }
              }}
            />
            <AiOutlineSend className="chatbot-send-icon" onClick={() => {
              const input = document.querySelector('.chatbot-input input') as HTMLInputElement;
              handleSendMessage(input.value);
              input.value = ''; // Limpa o campo de entrada
            }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
