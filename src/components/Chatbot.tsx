import React, { useState } from 'react';
import { fetchChat } from '../api/chat';
import type { ChatResponse } from '../types';
import styles from './Chatbot.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  quiz?: ChatResponse['quiz'];
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    try {
      const response = await fetchChat(userMsg.content);
      const assistantMsg: Message = { role: 'assistant', content: response.reply };
      if (response.quiz) assistantMsg.quiz = response.quiz;
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      const errMsg: Message = { role: 'assistant', content: (e as Error).message };
      setMessages((prev) => [...prev, errMsg]);
    }
  };

  const handleQuizSubmit = () => {
    if (!selectedOption) return;
    // For now we just display the selected answer as a user message
    const answerMsg: Message = { role: 'user', content: `답: ${selectedOption}` };
    setMessages((prev) => [...prev, answerMsg]);
    setSelectedOption('');
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
          >
            <p>{msg.content}</p>
            {msg.quiz && (
              <div className={styles.quizOptions}>
                <p>{msg.quiz.question}</p>
                {msg.quiz.options.map((opt, i) => (
                  <label key={i} className={styles.quizOption}>
                    <input
                      type="radio"
                      name="quiz"
                      value={opt}
                      checked={selectedOption === opt}
                      onChange={(e) => setSelectedOption(e.target.value)}
                    />
                    {opt}
                  </label>
                ))}
                <button className={styles.submitQuiz} onClick={handleQuizSubmit}>
                  제출
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={styles.inputArea}>
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
        />
        <button className={styles.sendButton} onClick={handleSend}>
          전송
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
